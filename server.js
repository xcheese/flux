import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const PORT = Number(process.env.PORT || 4321);

const IGNORED_DIRS = new Set([".git", "node_modules", "public"]);
const IGNORED_FILES = new Set(["AGENTS.md"]);
const TEXT_EXTENSIONS = new Set([".md", ".markdown", ".txt"]);
const CONTENT_EXCLUDED_PREFIXES = ["90_templates/"];
const VIDEO_DISPLAY_FILES = new Set(["analysis.md"]);

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function normalizeId(filePath) {
  return toPosix(path.relative(ROOT, filePath));
}

function safeDecode(value = "") {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function slugFromPath(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---\n")) {
    return { attrs: {}, body: raw };
  }

  const end = raw.indexOf("\n---", 4);
  if (end === -1) {
    return { attrs: {}, body: raw };
  }

  const block = raw.slice(4, end).trim();
  const body = raw.slice(raw.indexOf("\n", end + 1) + 1);
  const attrs = {};
  let currentKey = null;

  for (const line of block.split(/\r?\n/)) {
    if (!line.trim()) continue;

    const listMatch = line.match(/^\s*-\s+(.+)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(attrs[currentKey])) attrs[currentKey] = [];
      attrs[currentKey].push(cleanYamlValue(listMatch[1]));
      continue;
    }

    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;

    currentKey = pair[1];
    const value = pair[2].trim();
    if (!value) {
      attrs[currentKey] = "";
    } else if (value.startsWith("[") && value.endsWith("]")) {
      attrs[currentKey] = value
        .slice(1, -1)
        .split(",")
        .map((item) => cleanYamlValue(item))
        .filter(Boolean);
    } else {
      attrs[currentKey] = cleanYamlValue(value);
    }
  }

  return { attrs, body };
}

function cleanYamlValue(value) {
  return String(value).trim().replace(/^["']|["']$/g, "");
}

function getTitle(body, fallback) {
  const h1 = body.match(/^#\s+(.+)$/m);
  return h1 ? h1[1].trim() : fallback;
}

function getExcerpt(body) {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#+\s+/gm, "")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[-*_>`#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, 180);
}

function plainText(body) {
  return body
    .replace(/^---\n[\s\S]*?\n---\n?/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#+\s+/gm, "")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[-*_>`#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSearchText(body) {
  return body
    .replace(/^---\n[\s\S]*?\n---\n?/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripCode(body) {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ");
}

function getTags(attrs) {
  const raw = attrs.tags;
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === "string") return raw.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function getWikiLinks(body) {
  const links = new Set();
  const pattern = /\[\[([^\]]+)\]\]/g;
  let match;
  const searchable = stripCode(body);
  while ((match = pattern.exec(searchable))) {
    const target = match[1].split("|")[0].trim();
    if (target) links.add(target);
  }
  return [...links];
}

function getMarkdownLinks(body) {
  const links = new Set();
  const pattern = /\[[^\]]+\]\(([^)]+)\)/g;
  let match;
  const searchable = stripCode(body);
  while ((match = pattern.exec(searchable))) {
    const target = match[1].trim();
    if (target && !target.startsWith("#")) links.add(target);
  }
  return [...links];
}

function getDocumentDate(id, attrs, body, modifiedAt) {
  const candidates = [
    attrs.date,
    attrs.created,
    attrs.updated,
    id.match(/(20\d{2}-\d{2}-\d{2})/)?.[1],
    body.match(/(20\d{2}-\d{2}-\d{2})/)?.[1],
    modifiedAt.slice(0, 10)
  ].filter(Boolean);
  return String(candidates[0]).slice(0, 10);
}

function getHeadingSection(body, headingNames) {
  const names = headingNames.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`^#{2,4}\\s*(?:${names.join("|")})\\s*$`, "im");
  const match = body.match(pattern);
  if (!match || match.index === undefined) return "";
  const start = match.index + match[0].length;
  const next = body.slice(start).search(/\n#{1,4}\s+/);
  return body.slice(start, next === -1 ? undefined : start + next).trim();
}

function cleanLine(value) {
  return value
    .replace(/^\s*[-*]\s+/, "")
    .replace(/^\s*\d+\.\s+/, "")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sectionItems(body, headingNames, limit = 3) {
  const section = getHeadingSection(body, headingNames);
  if (!section) return [];
  const lines = section
    .split(/\r?\n/)
    .map(cleanLine)
    .filter((line) => line.length > 4 && !/^https?:\/\//.test(line));
  return lines.slice(0, limit);
}

function firstMeaningfulSentence(body, fallback) {
  const text = plainText(body);
  const sentence = text.split(/[。！？!?]\s*/).find((item) => item.trim().length > 12);
  return (sentence || fallback || "").trim().slice(0, 88);
}

function inferDashboardTypes(noteBase, body, markdownLinks) {
  const text = `${noteBase.title} ${noteBase.path} ${noteBase.tags.join(" ")} ${plainText(body)}`;
  const titleAndTags = `${noteBase.title} ${noteBase.tags.join(" ")}`;
  const labels = [];
  const add = (label) => {
    if (label && !labels.includes(label)) labels.push(label);
  };
  const isSystem = noteBase.path.startsWith("90_system");
  const isDailyAi = noteBase.type === "daily_ai" || noteBase.path.startsWith("40_outputs/daily_ai");
  const isVideo = noteBase.type === "video_analysis";
  const isReadableKnowledge =
    isDailyAi ||
    isVideo ||
    noteBase.type === "concept" ||
    noteBase.type === "link_note" ||
    noteBase.path.startsWith("20_wiki");

  if (noteBase.path.startsWith("90_templates")) {
    add("模板");
    return labels;
  }

  if (noteBase.type === "video_analysis") add("视频分析");
  else if (noteBase.type === "daily_ai" || noteBase.path.startsWith("40_outputs/daily_ai")) add("AI情报");
  else if (noteBase.type === "concept" || noteBase.path.startsWith("20_wiki/concepts")) add("概念");
  else if (noteBase.type === "link_note") add("原始线索");
  else if (noteBase.type === "shared_memory") add("共享记忆");
  else if (noteBase.path.startsWith("90_system/skills")) add("Skill");
  else if (noteBase.path.startsWith("90_system")) add("系统");
  else if (noteBase.path.startsWith("20_wiki")) add("知识笔记");
  else if (noteBase.path.startsWith("40_outputs")) add("输出产物");
  else if (noteBase.path.startsWith("10_raw")) add("原始资料");

  if (isReadableKnowledge && /(^|[^A-Za-z])(Codex|Claude Code|ChatGPT|OpenAI|Agent|MCP|Skills?)([^A-Za-z]|$)|AI工具|人工智能/i.test(text)) add("AI工具");
  if (isReadableKnowledge && /工作流|流程|SOP|复盘|行动|计划模式|自动化|Computer Use|worktree|shared memory|AGENTS\.md/i.test(text)) add("工作流");
  if (!isSystem && (isDailyAi || /release notes?|发布|上线|版本|模型更新|API|SDK|产品/i.test(titleAndTags))) add("产品更新");
  if (!isSystem && /论文|paper|arXiv|research|研究报告|实验/i.test(titleAndTags)) add("研究");
  if ((isVideo || noteBase.type === "link_note" || noteBase.type === "concept") && /郭宇|Karpathy|Munger|Musk|Jobs|Naval|人物|访谈|演讲/i.test(text)) add("人物观点");

  if (!labels.length) add(noteBase.type === "raw" ? "原始资料" : "笔记");
  return labels.slice(0, 4);
}

function analyzeNote(noteBase, body, markdownLinks) {
  const summary =
    sectionItems(body, ["一句话总结", "一句话结论", "一句话解释"], 1)[0] ||
    firstMeaningfulSentence(body, noteBase.excerpt);
  const important =
    sectionItems(body, ["关键观点", "高价值点", "为什么重要", "核心机制", "当前结论"], 3).join("；") ||
    noteBase.excerpt;
  const inspiration =
    sectionItems(body, ["对我的启发", "我自己的理解", "可行动作", "下周行动"], 3).join("；") ||
    sectionItems(body, ["典型场景", "适合解决什么问题"], 2).join("；") ||
    "待进一步沉淀";

  return {
    documentTime: noteBase.date,
    typeLabels: inferDashboardTypes(noteBase, body, markdownLinks),
    topic: noteBase.title,
    summary: summary.slice(0, 110),
    important: important.slice(0, 180),
    inspiration: inspiration.slice(0, 160),
    documentLink: noteBase.path
  };
}

function bucketFromId(id) {
  const [top, second] = id.split("/");
  if (!second) return top;
  if (top === "90_templates" || top === "README.md") return top;
  if (/^\d+_/.test(top)) return `${top}/${second}`;
  return top;
}

async function walk(dir, files = []) {
  const entries = await import("node:fs/promises").then((fs) => fs.readdir(dir, { withFileTypes: true }));
  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".") {
      if (entry.name === ".git") continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) await walk(fullPath, files);
    } else if (TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      if (!IGNORED_FILES.has(entry.name)) files.push(fullPath);
    }
  }
  return files;
}

async function buildIndex() {
  const files = await walk(ROOT);
  const notes = [];

  for (const file of files) {
    const raw = await readFile(file, "utf8");
    const { attrs, body } = parseFrontmatter(raw);
    const id = normalizeId(file);
    if (isExcludedFromContent(id)) continue;
    const stats = await stat(file);
    const title = getTitle(body, attrs.title || slugFromPath(file));
    const tags = getTags(attrs);
    const words = body.replace(/\s+/g, "").length;
    const modifiedAt = stats.mtime.toISOString();
    const markdownLinks = getMarkdownLinks(body);

    const noteBase = {
      id,
      path: id,
      title,
      slug: slugFromPath(file),
      bucket: bucketFromId(id),
      type: attrs.type || inferType(id),
      area: attrs.area || inferArea(id),
      status: attrs.status || "",
      date: getDocumentDate(id, attrs, body, modifiedAt),
      updated: attrs.updated || "",
      tags,
      excerpt: getExcerpt(body),
      searchText: getSearchText(body),
      links: getWikiLinks(body),
      markdownLinks,
      wordCount: words,
      modifiedAt,
      attrs,
      body
    };

    notes.push({
      ...noteBase,
      analysis: analyzeNote(noteBase, body, markdownLinks)
    });
  }

  const lookup = buildLookup(notes);
  const edges = [];
  const backlinks = new Map(notes.map((note) => [note.id, []]));

  for (const note of notes) {
    for (const link of note.links) {
      const target = resolveLink(link, lookup);
      if (!target) continue;
      edges.push({ source: note.id, target: target.id, label: link });
      backlinks.get(target.id).push({ id: note.id, title: note.title });
    }
  }

  const enriched = notes
    .map((note) => ({
      ...note,
      backlinks: backlinks.get(note.id) || [],
      outlinks: note.links
        .map((link) => {
          const target = resolveLink(link, lookup);
          return target ? { id: target.id, title: target.title } : { id: null, title: link };
        })
        .filter((item, index, array) => array.findIndex((candidate) => candidate.title === item.title) === index)
    }))
    .sort((a, b) => {
      const byDate = b.analysis.documentTime.localeCompare(a.analysis.documentTime);
      if (byDate) return byDate;
      return a.path.localeCompare(b.path, "zh-Hans-CN");
    });

  return {
    generatedAt: new Date().toISOString(),
    notes: enriched,
    edges,
    stats: summarize(enriched, edges)
  };
}

function isExcludedFromContent(id) {
  if (CONTENT_EXCLUDED_PREFIXES.some((prefix) => id.startsWith(prefix))) return true;
  if (isVideoEvidenceArtifact(id)) return true;
  return false;
}

function isVideoEvidenceArtifact(id) {
  if (!id.startsWith("10_raw/videos/")) return false;
  const parts = id.split("/");
  if (parts.length < 4) return false;
  const filename = parts.at(-1);
  if (VIDEO_DISPLAY_FILES.has(filename) || /_analysis\.md$/i.test(filename)) return false;
  return true;
}

function inferType(id) {
  if (id.includes("/daily_")) return "daily";
  if (id.startsWith("90_templates/")) return "template";
  if (id.startsWith("10_raw/")) return "raw";
  if (id.startsWith("20_wiki/")) return "wiki";
  if (id.startsWith("40_outputs/")) return "output";
  return "note";
}

function inferArea(id) {
  const parts = id.split("/");
  if (parts[0] === "20_wiki" && parts[1]) return parts[1];
  if (parts[0] === "40_outputs" && parts[1]) return parts[1];
  return parts[0] || "root";
}

function buildLookup(notes) {
  const lookup = new Map();
  for (const note of notes) {
    for (const key of [note.id, note.title, note.slug, note.path.replace(/\.md$/i, "")]) {
      const normalized = key.toLowerCase();
      if (!lookup.has(normalized)) lookup.set(normalized, note);
    }
  }
  return lookup;
}

function resolveLink(link, lookup) {
  const normalized = link.replace(/\.md$/i, "").toLowerCase();
  return lookup.get(normalized) || lookup.get(`${normalized}.md`) || null;
}

function summarize(notes, edges) {
  const byType = {};
  const byBucket = {};
  const tagCount = {};
  for (const note of notes) {
    byType[note.type] = (byType[note.type] || 0) + 1;
    byBucket[note.bucket] = (byBucket[note.bucket] || 0) + 1;
    for (const tag of note.tags) tagCount[tag] = (tagCount[tag] || 0) + 1;
  }
  const isolated = notes.filter((note) => !note.links.length && !note.backlinks.length).length;
  return {
    notes: notes.length,
    edges: edges.length,
    isolated,
    byType,
    byBucket,
    topTags: Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"))
      .slice(0, 16)
      .map(([tag, count]) => ({ tag, count }))
  };
}

function withoutBody(note) {
  const { body, attrs, ...rest } = note;
  return rest;
}

async function sendJson(response, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(body);
}

async function sendStatic(request, response, pathname) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, requested));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    await stat(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const type = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".svg": "image/svg+xml"
    }[ext] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": type });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const index = await buildIndex();

    if (url.pathname === "/api/notes") {
      await sendJson(response, {
        generatedAt: index.generatedAt,
        stats: index.stats,
        notes: index.notes.map(withoutBody)
      });
      return;
    }

    if (url.pathname === "/api/graph") {
      await sendJson(response, {
        nodes: index.notes.map((note) => ({
          id: note.id,
          title: note.title,
          type: note.type,
          bucket: note.bucket,
          tags: note.tags,
          wordCount: note.wordCount,
          degree: note.outlinks.filter((item) => item.id).length + note.backlinks.length
        })),
        edges: index.edges,
        stats: index.stats
      });
      return;
    }

    if (url.pathname === "/api/note") {
      const id = safeDecode(url.searchParams.get("id") || "");
      const note = index.notes.find((item) => item.id === id);
      if (!note) {
        response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({ error: "Note not found" }));
        return;
      }
      await sendJson(response, note);
      return;
    }

    await sendStatic(request, response, url.pathname);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Knowledge web service running at http://127.0.0.1:${PORT}`);
});
