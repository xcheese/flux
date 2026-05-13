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
const TEXT_EXTENSIONS = new Set([".md", ".markdown", ".txt"]);

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
      files.push(fullPath);
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
    const stats = await stat(file);
    const title = getTitle(body, attrs.title || slugFromPath(file));
    const tags = getTags(attrs);
    const words = body.replace(/\s+/g, "").length;

    notes.push({
      id,
      path: id,
      title,
      slug: slugFromPath(file),
      bucket: bucketFromId(id),
      type: attrs.type || inferType(id),
      area: attrs.area || inferArea(id),
      status: attrs.status || "",
      date: attrs.date || attrs.created || "",
      updated: attrs.updated || "",
      tags,
      excerpt: getExcerpt(body),
      searchText: getSearchText(body),
      links: getWikiLinks(body),
      markdownLinks: getMarkdownLinks(body),
      wordCount: words,
      modifiedAt: stats.mtime.toISOString(),
      attrs,
      body
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
    .sort((a, b) => a.path.localeCompare(b.path, "zh-Hans-CN"));

  return {
    generatedAt: new Date().toISOString(),
    notes: enriched,
    edges,
    stats: summarize(enriched, edges)
  };
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
