const state = {
  notes: [],
  graph: { nodes: [], edges: [] },
  selectedId: null,
  query: "",
  bucket: "",
  tag: "",
  positions: new Map(),
  drag: null,
  offset: { x: 0, y: 0 },
  scale: 1
};

const elements = {
  search: document.querySelector("#searchInput"),
  reset: document.querySelector("#resetButton"),
  bucketFilters: document.querySelector("#bucketFilters"),
  tagFilters: document.querySelector("#tagFilters"),
  noteList: document.querySelector("#noteList"),
  stats: document.querySelector("#stats"),
  reader: document.querySelector("#reader"),
  canvas: document.querySelector("#graphCanvas"),
  focus: document.querySelector("#focusButton")
};

const ctx = elements.canvas.getContext("2d");
const palette = {
  concept: "#0f8c6f",
  wiki: "#13a37f",
  raw: "#b1483f",
  output: "#1769aa",
  daily: "#bd8b16",
  template: "#7b8b83",
  note: "#17221f"
};

async function init() {
  const [notesPayload, graphPayload] = await Promise.all([
    fetch("/api/notes").then((response) => response.json()),
    fetch("/api/graph").then((response) => response.json())
  ]);
  state.notes = notesPayload.notes;
  state.graph = graphPayload;
  state.selectedId = state.notes[0]?.id || null;

  renderStats(notesPayload.stats);
  renderFilters(notesPayload.stats);
  renderNoteList();
  setupGraph();
  bindEvents();
  if (state.selectedId) await openNote(state.selectedId);
}

function bindEvents() {
  elements.search.addEventListener("input", () => {
    state.query = elements.search.value.trim().toLowerCase();
    renderNoteList();
    drawGraph();
  });

  elements.reset.addEventListener("click", () => {
    state.query = "";
    state.bucket = "";
    state.tag = "";
    elements.search.value = "";
    renderFiltersFromState();
    renderNoteList();
    drawGraph();
  });

  elements.focus.addEventListener("click", () => {
    document.body.classList.toggle("focus-mode");
    elements.focus.textContent = document.body.classList.contains("focus-mode") ? "×" : "⛶";
  });

  window.addEventListener("resize", () => {
    resizeCanvas();
    drawGraph();
  });

  elements.canvas.addEventListener("click", async (event) => {
    const node = hitNode(event);
    if (node) await openNote(node.id);
  });

  elements.canvas.addEventListener("pointerdown", (event) => {
    const node = hitNode(event);
    state.drag = node ? { type: "node", node } : { type: "canvas", startX: event.clientX, startY: event.clientY, ...state.offset };
    elements.canvas.setPointerCapture(event.pointerId);
  });

  elements.canvas.addEventListener("pointermove", (event) => {
    if (!state.drag) return;
    if (state.drag.type === "node") {
      const point = canvasPoint(event);
      const pos = state.positions.get(state.drag.node.id);
      pos.x = point.x;
      pos.y = point.y;
      pos.vx = 0;
      pos.vy = 0;
    } else {
      state.offset.x = state.drag.x + event.clientX - state.drag.startX;
      state.offset.y = state.drag.y + event.clientY - state.drag.startY;
    }
    drawGraph();
  });

  elements.canvas.addEventListener("pointerup", (event) => {
    state.drag = null;
    elements.canvas.releasePointerCapture(event.pointerId);
  });
}

function renderStats(stats) {
  const cards = [
    ["笔记", stats.notes],
    ["双链", stats.edges],
    ["孤岛", stats.isolated],
    ["标签", stats.topTags.length]
  ];
  elements.stats.innerHTML = cards
    .map(([label, value]) => `<div class="stat-card"><strong>${value}</strong><span>${label}</span></div>`)
    .join("");
}

function renderFilters(stats) {
  elements.bucketFilters.innerHTML = Object.entries(stats.byBucket)
    .sort((a, b) => a[0].localeCompare(b[0], "zh-Hans-CN"))
    .map(([bucket, count]) => chipHtml(bucket, count, "bucket"))
    .join("");

  elements.tagFilters.innerHTML = stats.topTags
    .map(({ tag, count }) => chipHtml(tag, count, "tag"))
    .join("");

  elements.bucketFilters.addEventListener("click", (event) => handleChipClick(event, "bucket"));
  elements.tagFilters.addEventListener("click", (event) => handleChipClick(event, "tag"));
  renderFiltersFromState();
}

function chipHtml(value, count, kind) {
  return `<button class="chip" type="button" data-kind="${kind}" data-value="${escapeHtml(value)}">${escapeHtml(value)} · ${count}</button>`;
}

function handleChipClick(event, kind) {
  const button = event.target.closest("button[data-kind]");
  if (!button) return;
  const value = button.dataset.value;
  state[kind] = state[kind] === value ? "" : value;
  renderFiltersFromState();
  renderNoteList();
  drawGraph();
}

function renderFiltersFromState() {
  document.querySelectorAll(".chip").forEach((button) => {
    const kind = button.dataset.kind;
    button.classList.toggle("active", Boolean(kind && state[kind] === button.dataset.value));
  });
}

function filteredNotes() {
  return state.notes.filter((note) => {
    const queryText = `${note.title} ${note.path} ${note.tags.join(" ")} ${note.excerpt} ${note.searchText || ""}`.toLowerCase();
    const matchesQuery = !state.query || queryText.includes(state.query);
    const matchesBucket = !state.bucket || note.bucket === state.bucket;
    const matchesTag = !state.tag || note.tags.includes(state.tag);
    return matchesQuery && matchesBucket && matchesTag;
  });
}

function renderNoteList() {
  const notes = filteredNotes();
  elements.noteList.innerHTML = notes.map(noteListItem).join("") || `<p class="note-path">没有匹配的笔记。</p>`;
  elements.noteList.querySelectorAll(".note-item").forEach((button) => {
    button.addEventListener("click", () => openNote(button.dataset.id));
  });
}

function noteListItem(note) {
  const tags = note.tags.slice(0, 3).map((tag) => `<span>#${escapeHtml(tag)}</span>`).join("");
  return `
    <button class="note-item ${note.id === state.selectedId ? "active" : ""}" type="button" data-id="${escapeHtml(note.id)}">
      <span class="note-title">${escapeHtml(note.title)}</span>
      <span class="note-path">${escapeHtml(note.path)}</span>
      <span class="note-meta"><span>${escapeHtml(note.type)}</span><span>${note.wordCount} 字</span>${tags}</span>
    </button>
  `;
}

async function openNote(id) {
  state.selectedId = id;
  renderNoteList();
  drawGraph();
  const note = await fetch(`/api/note?id=${encodeURIComponent(id)}`).then((response) => response.json());
  elements.reader.innerHTML = renderReader(note);
  elements.reader.querySelectorAll("[data-open-note]").forEach((button) => {
    button.addEventListener("click", () => openNote(button.dataset.openNote));
  });
  elements.reader.scrollTop = 0;
}

function renderReader(note) {
  const tags = note.tags.map((tag) => `<span class="meta-pill">#${escapeHtml(tag)}</span>`).join("");
  const meta = [
    note.type,
    note.area,
    note.status,
    note.date || note.updated
  ].filter(Boolean);

  return `
    <div class="reader-content">
      <h1 class="reader-title">${escapeHtml(note.title)}</h1>
      <p class="reader-subtitle">${escapeHtml(note.path)}</p>
      <div class="metadata">
        ${meta.map((item) => `<span class="meta-pill">${escapeHtml(item)}</span>`).join("")}
        ${tags}
      </div>
      <div class="relation-grid">
        ${relationBox("指向", note.outlinks)}
        ${relationBox("被引用", note.backlinks)}
      </div>
      <div class="markdown">${renderMarkdown(note.body, note.outlinks)}</div>
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

function renderMarkdown(raw, outlinks) {
  const linkLookup = new Map(outlinks.filter((link) => link.id).map((link) => [link.title, link.id]));
  const withoutFrontmatter = raw.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const blocks = withoutFrontmatter.split(/(```[\s\S]*?```)/g);
  return blocks
    .map((block) => {
      if (block.startsWith("```")) {
        const code = block.replace(/^```[a-zA-Z0-9_-]*\n?/, "").replace(/```$/, "");
        return `<pre><code>${escapeHtml(code)}</code></pre>`;
      }
      return renderMarkdownText(block, linkLookup);
    })
    .join("");
}

function renderMarkdownText(text, linkLookup) {
  const lines = text.split(/\r?\n/);
  const html = [];
  let list = null;

  const closeList = () => {
    if (list) {
      html.push(`</${list}>`);
      list = null;
    }
  };

  for (const line of lines) {
    if (!line.trim()) {
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineMarkdown(heading[2], linkLookup)}</h${level}>`);
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      if (list !== "ol") {
        closeList();
        list = "ol";
        html.push("<ol>");
      }
      html.push(`<li>${inlineMarkdown(ordered[1], linkLookup)}</li>`);
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    if (unordered) {
      if (list !== "ul") {
        closeList();
        list = "ul";
        html.push("<ul>");
      }
      html.push(`<li>${inlineMarkdown(unordered[1], linkLookup)}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${inlineMarkdown(line, linkLookup)}</p>`);
  }

  closeList();
  return html.join("");
}

function inlineMarkdown(text, linkLookup) {
  let value = escapeHtml(text);
  value = value.replace(/`([^`]+)`/g, "<code>$1</code>");
  value = value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
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

function setupGraph() {
  resizeCanvas();
  const width = elements.canvas.width;
  const height = elements.canvas.height;
  state.graph.nodes.forEach((node, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(1, state.graph.nodes.length);
    state.positions.set(node.id, {
      x: width / 2 + Math.cos(angle) * width * 0.24,
      y: height / 2 + Math.sin(angle) * height * 0.24,
      vx: 0,
      vy: 0
    });
  });
  for (let index = 0; index < 90; index += 1) tickGraph();
  drawGraph();
  setInterval(() => {
    if (!state.drag) {
      tickGraph();
      drawGraph();
    }
  }, 40);
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = elements.canvas.getBoundingClientRect();
  elements.canvas.width = Math.max(320, Math.floor(rect.width * ratio));
  elements.canvas.height = Math.max(280, Math.floor(rect.height * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function visibleNodeIds() {
  return new Set(filteredNotes().map((note) => note.id));
}

function tickGraph() {
  const visible = visibleNodeIds();
  const nodes = state.graph.nodes.filter((node) => visible.has(node.id));
  const rect = elements.canvas.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = state.positions.get(nodes[i].id);
      const b = state.positions.get(nodes[j].id);
      const dx = a.x - b.x || 0.1;
      const dy = a.y - b.y || 0.1;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const force = Math.min(24, 1500 / (distance * distance));
      a.vx += (dx / distance) * force;
      a.vy += (dy / distance) * force;
      b.vx -= (dx / distance) * force;
      b.vy -= (dy / distance) * force;
    }
  }

  for (const edge of state.graph.edges) {
    if (!visible.has(edge.source) || !visible.has(edge.target)) continue;
    const a = state.positions.get(edge.source);
    const b = state.positions.get(edge.target);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
    const force = (distance - 130) * 0.012;
    a.vx += (dx / distance) * force;
    a.vy += (dy / distance) * force;
    b.vx -= (dx / distance) * force;
    b.vy -= (dy / distance) * force;
  }

  for (const node of nodes) {
    const pos = state.positions.get(node.id);
    pos.vx += (centerX - pos.x) * 0.004;
    pos.vy += (centerY - pos.y) * 0.004;
    pos.vx *= 0.82;
    pos.vy *= 0.82;
    pos.x += pos.vx;
    pos.y += pos.vy;
    pos.x = Math.max(28, Math.min(rect.width - 28, pos.x));
    pos.y = Math.max(28, Math.min(rect.height - 28, pos.y));
  }
}

function drawGraph() {
  const rect = elements.canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.save();
  ctx.translate(state.offset.x, state.offset.y);
  const visible = visibleNodeIds();
  const selectedNeighbors = new Set([state.selectedId]);

  ctx.lineWidth = 1.2;
  for (const edge of state.graph.edges) {
    if (!visible.has(edge.source) || !visible.has(edge.target)) continue;
    const a = state.positions.get(edge.source);
    const b = state.positions.get(edge.target);
    if (edge.source === state.selectedId) selectedNeighbors.add(edge.target);
    if (edge.target === state.selectedId) selectedNeighbors.add(edge.source);
    ctx.strokeStyle = edge.source === state.selectedId || edge.target === state.selectedId ? "rgba(15, 140, 111, 0.68)" : "rgba(99, 113, 107, 0.2)";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  for (const node of state.graph.nodes) {
    if (!visible.has(node.id)) continue;
    const pos = state.positions.get(node.id);
    const radius = node.id === state.selectedId ? 13 : Math.max(7, Math.min(11, 6 + node.degree));
    ctx.fillStyle = palette[node.type] || palette.note;
    ctx.strokeStyle = node.id === state.selectedId ? "#0b1512" : "rgba(255, 255, 252, 0.95)";
    ctx.lineWidth = node.id === state.selectedId ? 3 : 2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (selectedNeighbors.has(node.id) || visible.size < 10) {
      ctx.fillStyle = "#1b2622";
      ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.textAlign = "center";
      ctx.fillText(node.title.slice(0, 18), pos.x, pos.y + radius + 15);
    }
  }

  ctx.restore();
}

function canvasPoint(event) {
  const rect = elements.canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left - state.offset.x,
    y: event.clientY - rect.top - state.offset.y
  };
}

function hitNode(event) {
  const point = canvasPoint(event);
  const visible = visibleNodeIds();
  for (const node of state.graph.nodes) {
    if (!visible.has(node.id)) continue;
    const pos = state.positions.get(node.id);
    const radius = node.id === state.selectedId ? 15 : 13;
    const dx = point.x - pos.x;
    const dy = point.y - pos.y;
    if (Math.sqrt(dx * dx + dy * dy) <= radius) return node;
  }
  return null;
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
