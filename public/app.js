const state = {
  notes: [],
  selectedId: null,
  query: "",
  bucket: "",
  type: ""
};

const elements = {
  search: document.querySelector("#searchInput"),
  reset: document.querySelector("#resetButton"),
  bucketFilters: document.querySelector("#bucketFilters"),
  typeFilters: document.querySelector("#tagFilters"),
  stats: document.querySelector("#stats"),
  tableBody: document.querySelector("#documentTableBody"),
  tableScroll: document.querySelector(".table-scroll"),
  tableCount: document.querySelector("#tableCount"),
  reader: document.querySelector("#reader"),
  readerOverlay: document.querySelector("#readerOverlay"),
  readerDialogTitle: document.querySelector("#readerDialogTitle"),
  closeReader: document.querySelector("#closeReaderButton"),
  focus: document.querySelector("#focusButton")
};

async function init() {
  const payload = await fetch("/api/notes").then((response) => response.json());
  state.notes = payload.notes;

  renderStats(payload.stats);
  renderFilters(payload.stats);
  renderTable();
  bindEvents();
}

function bindEvents() {
  elements.search.addEventListener("input", () => {
    state.query = elements.search.value.trim().toLowerCase();
    renderTable();
  });

  elements.reset.addEventListener("click", () => {
    state.query = "";
    state.bucket = "";
    state.type = "";
    elements.search.value = "";
    renderFiltersFromState();
    renderTable();
  });

  elements.focus.addEventListener("click", () => {
    if (state.selectedId) openNote(state.selectedId);
  });

  elements.closeReader.addEventListener("click", closeReader);
  elements.readerOverlay.querySelectorAll("[data-close-reader]").forEach((element) => {
    element.addEventListener("click", closeReader);
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeReader();
  });
}

function renderStats(stats) {
  const rows = [
    ["文档", stats.notes],
    ["双链", stats.edges],
    ["孤岛", stats.isolated],
    ["类型", collectTypeCounts().length]
  ];
  elements.stats.innerHTML = rows
    .map(([label, value]) => `<div class="stat-card"><strong>${value}</strong><span>${label}</span></div>`)
    .join("");
}

function renderFilters(stats) {
  elements.bucketFilters.innerHTML = Object.entries(stats.byBucket)
    .sort((a, b) => a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([bucket, count]) => chipHtml(displayBucket(bucket), count, "bucket", bucket))
    .join("");

  elements.typeFilters.innerHTML = collectTypeCounts()
    .map(([type, count]) => chipHtml(type, count, "type"))
    .join("");

  elements.bucketFilters.addEventListener("click", (event) => handleChipClick(event));
  elements.typeFilters.addEventListener("click", (event) => handleChipClick(event));
  renderFiltersFromState();
}

function collectTypeCounts() {
  const counts = new Map();
  for (const note of state.notes) {
    for (const type of note.analysis?.typeLabels || []) {
      counts.set(type, (counts.get(type) || 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-Hans-CN"));
}

function displayBucket(bucket) {
  return bucket
    .replace(/^90_system\//, "system/")
    .replace(/^40_outputs\//, "outputs/")
    .replace(/^20_wiki\//, "wiki/")
    .replace(/^10_raw\//, "raw/")
    .replace(/^00_inbox\//, "inbox/");
}

function chipHtml(label, count, kind, value = label) {
  return `<button class="chip" type="button" data-kind="${kind}" data-value="${escapeHtml(value)}">${escapeHtml(label)} · ${count}</button>`;
}

function handleChipClick(event) {
  const button = event.target.closest("button[data-kind]");
  if (!button) return;
  const key = button.dataset.kind;
  const value = button.dataset.value;
  state[key] = state[key] === value ? "" : value;
  renderFiltersFromState();
  renderTable();
}

function renderFiltersFromState() {
  document.querySelectorAll(".chip").forEach((button) => {
    const key = button.dataset.kind;
    button.classList.toggle("active", Boolean(key && state[key] === button.dataset.value));
  });
}

function filteredNotes() {
  return state.notes.filter((note) => {
    const analysis = note.analysis || {};
    const queryText = [
      note.title,
      note.path,
      note.tags.join(" "),
      note.excerpt,
      note.searchText || "",
      analysis.documentTime,
      analysis.typeLabels?.join(" "),
      analysis.topic,
      analysis.summary,
      analysis.important,
      analysis.inspiration
    ].join(" ").toLowerCase();
    const matchesQuery = !state.query || queryText.includes(state.query);
    const matchesBucket = !state.bucket || note.bucket === state.bucket;
    const matchesType = !state.type || (analysis.typeLabels || []).includes(state.type);
    return matchesQuery && matchesBucket && matchesType;
  });
}

function renderTable() {
  const notes = filteredNotes();
  elements.tableCount.textContent = `${notes.length} 篇文档 · 按时间倒序`;
  elements.tableBody.innerHTML = notes.map((note, index) => tableRow(note, index)).join("") || emptyRow();
  elements.tableScroll.scrollLeft = 0;

  elements.tableBody.querySelectorAll("tr[data-id]").forEach((row) => {
    row.addEventListener("click", () => openNote(row.dataset.id));
  });
  elements.tableBody.querySelectorAll("button[data-open-note]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openNote(button.dataset.openNote);
    });
  });
}

function tableRow(note, index) {
  const analysis = note.analysis || {};
  const typeLabels = analysis.typeLabels || [];
  const typeTags = typeLabels.slice(0, 3)
    .map((type) => `<span class="type-pill">${escapeHtml(type)}</span>`)
    .join("");
  const moreTypes = typeLabels.length > 3 ? `<span class="type-more">+${typeLabels.length - 3}</span>` : "";
  return `
    <tr class="${note.id === state.selectedId ? "active" : ""}" data-id="${escapeHtml(note.id)}">
      <td class="col-index">${index + 1}</td>
      <td class="col-date">${escapeHtml(analysis.documentTime || note.date || "")}</td>
      <td class="col-types"><div class="type-list">${typeTags}${moreTypes}</div></td>
      <td class="col-topic"><strong>${escapeHtml(analysis.topic || note.title)}</strong></td>
      <td><div class="cell-clamp clamp-3">${escapeHtml(analysis.summary || note.excerpt)}</div></td>
      <td><div class="cell-clamp clamp-3">${escapeHtml(analysis.important || "")}</div></td>
      <td><div class="cell-clamp clamp-3">${escapeHtml(analysis.inspiration || "")}</div></td>
    </tr>
  `;
}

function emptyRow() {
  return `<tr><td colspan="7" class="empty-cell">没有匹配的文档。</td></tr>`;
}

async function openNote(id) {
  state.selectedId = id;
  renderTable();
  const note = await fetch(`/api/note?id=${encodeURIComponent(id)}`).then((response) => response.json());
  elements.readerDialogTitle.textContent = note.title;
  elements.reader.innerHTML = renderReader(note);
  elements.reader.querySelectorAll("[data-open-note]").forEach((button) => {
    button.addEventListener("click", () => openNote(button.dataset.openNote));
  });
  elements.reader.scrollTop = 0;
  openReader();
}

function openReader() {
  elements.readerOverlay.classList.add("open");
  elements.readerOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("reader-open");
}

function closeReader() {
  elements.readerOverlay.classList.remove("open");
  elements.readerOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("reader-open");
}

function renderReader(note) {
  const analysis = note.analysis || {};
  const tags = (analysis.typeLabels || []).map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join("");
  const meta = [analysis.documentTime, note.bucket, `${note.wordCount} 字`].filter(Boolean);

  return `
    <div class="reader-content">
      <h1 class="reader-title">${escapeHtml(note.title)}</h1>
      <p class="reader-subtitle">${escapeHtml(note.path)}</p>
      <div class="metadata">
        ${meta.map((item) => `<span class="meta-pill">${escapeHtml(item)}</span>`).join("")}
        ${tags}
      </div>
      <section class="analysis-card">
        <h2>分析摘要</h2>
        <dl>
          <div><dt>一句话总结</dt><dd>${escapeHtml(analysis.summary || note.excerpt)}</dd></div>
          <div><dt>重要点</dt><dd>${escapeHtml(analysis.important || "待补充")}</dd></div>
          <div><dt>启发性</dt><dd>${escapeHtml(analysis.inspiration || "待进一步沉淀")}</dd></div>
        </dl>
      </section>
      <div class="relation-grid">
        ${relationBox("指向", note.outlinks)}
        ${relationBox("被引用", note.backlinks)}
      </div>
      <div class="markdown">${renderMarkdown(note.body, note.outlinks, note.path)}</div>
    </div>
  `;
}

function relationBox(title, links) {
  const content = links.length
    ? links
        .map((link) => {
          if (!link.id) return `<span class="relation-link">${escapeHtml(link.title)}</span>`;
          return `<button class="relation-link" type="button" data-open-note="${escapeHtml(link.id)}">${escapeHtml(link.title)}</button>`;
        })
        .join("")
    : `<span class="note-path">暂无</span>`;
  return `<section class="relation-box"><h3>${title}</h3>${content}</section>`;
}

function renderMarkdown(raw, outlinks, notePath) {
  const linkLookup = new Map(outlinks.filter((link) => link.id).map((link) => [link.title, link.id]));
  const withoutFrontmatter = raw.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const blocks = withoutFrontmatter.split(/(```[\s\S]*?```)/g);
  return blocks
    .map((block) => {
      if (block.startsWith("```")) {
        const code = block.replace(/^```[a-zA-Z0-9_-]*\n?/, "").replace(/```$/, "");
        return `<pre><code>${escapeHtml(code)}</code></pre>`;
      }
      return renderMarkdownText(block, linkLookup, notePath);
    })
    .join("");
}

function renderMarkdownText(text, linkLookup, notePath) {
  const lines = text.split(/\r?\n/);
  const html = [];
  let list = null;

  const closeList = () => {
    if (list) {
      html.push(`</${list}>`);
      list = null;
    }
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) {
      closeList();
      continue;
    }

    if (isMarkdownTableRow(line) && isMarkdownTableDivider(lines[index + 1] || "")) {
      const bodyLines = [];
      let nextIndex = index + 2;
      while (nextIndex < lines.length && isMarkdownTableRow(lines[nextIndex])) {
        bodyLines.push(lines[nextIndex]);
        nextIndex += 1;
      }

      closeList();
      html.push(renderMarkdownTable(line, lines[index + 1], bodyLines, linkLookup, notePath));
      index = nextIndex - 1;
      continue;
    }

    const imageOnly = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageOnly) {
      closeList();
      html.push(renderMarkdownImage(imageOnly[1], imageOnly[2], notePath));
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMarkdown(heading[2], linkLookup, notePath)}</h${level}>`);
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      if (list !== "ol") {
        closeList();
        list = "ol";
        html.push("<ol>");
      }
      html.push(`<li>${inlineMarkdown(ordered[1], linkLookup, notePath)}</li>`);
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    if (unordered) {
      if (list !== "ul") {
        closeList();
        list = "ul";
        html.push("<ul>");
      }
      html.push(`<li>${inlineMarkdown(unordered[1], linkLookup, notePath)}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${inlineMarkdown(line, linkLookup, notePath)}</p>`);
  }

  closeList();
  return html.join("");
}

function isMarkdownTableRow(line) {
  return splitMarkdownTableRow(line).length >= 2;
}

function isMarkdownTableDivider(line) {
  const cells = splitMarkdownTableRow(line);
  return cells.length >= 2 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.trim()));
}

function splitMarkdownTableRow(line) {
  const trimmed = String(line || "").trim();
  if (!trimmed.includes("|")) return [];

  let content = trimmed;
  if (content.startsWith("|")) content = content.slice(1);
  if (content.endsWith("|")) content = content.slice(0, -1);

  const cells = [];
  let current = "";
  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];
    if (char === "\\" && next === "|") {
      current += "|";
      index += 1;
      continue;
    }
    if (char === "|") {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current.trim());

  return cells;
}

function renderMarkdownTable(headerLine, dividerLine, bodyLines, linkLookup, notePath) {
  const headers = splitMarkdownTableRow(headerLine);
  const alignments = splitMarkdownTableRow(dividerLine).map(tableAlignment);
  const rows = bodyLines.map(splitMarkdownTableRow);
  const columnCount = Math.max(headers.length, alignments.length, ...rows.map((row) => row.length));
  const normalizedHeaders = normalizeTableRow(headers, columnCount);
  const normalizedRows = rows.map((row) => normalizeTableRow(row, columnCount));

  const head = normalizedHeaders
    .map((cell, index) => `<th${tableAlignAttribute(alignments[index])}>${inlineMarkdown(cell, linkLookup, notePath)}</th>`)
    .join("");
  const body = normalizedRows
    .map((row) => `<tr>${row.map((cell, index) => `<td${tableAlignAttribute(alignments[index])}>${inlineMarkdown(cell, linkLookup, notePath)}</td>`).join("")}</tr>`)
    .join("");

  return `
    <div class="markdown-table-wrap">
      <table class="markdown-table">
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
}

function normalizeTableRow(row, columnCount) {
  return Array.from({ length: columnCount }, (_, index) => row[index] || "");
}

function tableAlignment(cell) {
  const trimmed = String(cell || "").trim();
  if (trimmed.startsWith(":") && trimmed.endsWith(":")) return "center";
  if (trimmed.endsWith(":")) return "right";
  if (trimmed.startsWith(":")) return "left";
  return "";
}

function tableAlignAttribute(alignment) {
  return alignment ? ` class="align-${alignment}"` : "";
}

function inlineMarkdown(text, linkLookup, notePath) {
  let value = escapeHtml(text);
  value = value.replace(/`([^`]+)`/g, "<code>$1</code>");
  value = value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  value = value.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => renderMarkdownImage(alt, src, notePath));
  value = value.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noreferrer">$1</a>`);
  value = value.replace(/\[\[([^\]]+)\]\]/g, (_, rawTarget) => {
    const [target, label] = rawTarget.split("|").map((item) => item.trim());
    const id = linkLookup.get(target);
    const text = label || target;
    if (!id) return `<span class="wiki-link missing">${escapeHtml(text)}</span>`;
    return `<button class="relation-link wiki-link" type="button" data-open-note="${escapeHtml(id)}">${escapeHtml(text)}</button>`;
  });
  return value;
}

function renderMarkdownImage(alt, src, notePath) {
  const imageSrc = resolveImageSrc(src, notePath);
  const caption = alt ? `<figcaption>${escapeHtml(alt)}</figcaption>` : "";
  return `
    <figure class="markdown-image">
      <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(alt)}" decoding="async" />
      ${caption}
    </figure>
  `;
}

function resolveImageSrc(src, notePath) {
  const trimmed = String(src || "").trim();
  if (/^(https?:|data:|\/)/i.test(trimmed)) {
    return trimmed;
  }

  const parts = String(notePath || "").split("/").slice(0, -1);
  for (const part of trimmed.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") {
      parts.pop();
    } else {
      parts.push(part);
    }
  }

  return `/asset?path=${encodeURIComponent(parts.join("/"))}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

init().catch((error) => {
  elements.reader.innerHTML = `<div class="empty-reader"><h2>加载失败</h2><p>${escapeHtml(error.message)}</p></div>`;
});
