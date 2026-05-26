import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const memoryDir = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(memoryDir, '../..');
const entriesDir = path.join(memoryDir, 'entries');
const indexesDir = path.join(memoryDir, 'indexes');

function listMarkdownFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
      results.push(fullPath);
    }
  }
  return results.sort();
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return {};
  const data = {};
  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.trimEnd();
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (field && field[2] !== '') {
      data[field[1]] = cleanValue(field[2]);
    }
  }
  return data;
}

function cleanValue(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function groupBy(entries, field) {
  const groups = new Map();
  for (const entry of entries) {
    const key = entry[field] || '(unset)';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function renderGroupedIndex(title, field, entries) {
  const lines = [
    `# ${title}`,
    '',
    `Generated from \`90_system/shared_memory/entries/\` by \`scripts/build_indexes.mjs\`.`,
    '',
  ];

  for (const [key, items] of groupBy(entries, field)) {
    lines.push(`## ${key}`, '');
    for (const item of items) {
      lines.push(
        `- [${item.title || item.id}](${path.relative(indexesDir, item.filePath)}) — ` +
          `\`${item.id}\` / \`${item.status || 'unknown'}\` / ${item.updated_at || item.created_at || 'no-date'}`
      );
    }
    lines.push('');
  }

  return `${lines.join('\n').trim()}\n`;
}

function renderDeprecated(entries) {
  const items = entries.filter((entry) => ['deprecated', 'superseded'].includes(entry.status));
  const lines = [
    '# Deprecated / Superseded Memories',
    '',
    'Generated from `90_system/shared_memory/entries/` by `scripts/build_indexes.mjs`.',
    '',
  ];

  if (items.length === 0) {
    lines.push('No deprecated or superseded structured memories.');
  } else {
    for (const item of items) {
      lines.push(`- [${item.title || item.id}](${path.relative(indexesDir, item.filePath)}) — \`${item.status}\``);
    }
  }

  return `${lines.join('\n').trim()}\n`;
}

const entries = listMarkdownFiles(entriesDir).map((filePath) => ({
  ...parseFrontmatter(readFileSync(filePath, 'utf8')),
  filePath,
}));

mkdirSync(indexesDir, { recursive: true });
writeFileSync(path.join(indexesDir, 'by_project.md'), renderGroupedIndex('Memories by Project', 'project', entries));
writeFileSync(path.join(indexesDir, 'by_type.md'), renderGroupedIndex('Memories by Type', 'memory_type', entries));
writeFileSync(path.join(indexesDir, 'by_tier.md'), renderGroupedIndex('Memories by Tier', 'tier', entries));
writeFileSync(path.join(indexesDir, 'deprecated.md'), renderDeprecated(entries));

console.log(`Built memory indexes for ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}.`);
