import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const memoryDir = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(memoryDir, '../..');
const entriesDir = path.join(memoryDir, 'entries');

const allowedTiers = new Set(['episodic', 'internalized', 'growth', 'core_identity']);
const allowedTypes = new Set([
  'task_handoff',
  'project_context',
  'decision',
  'user_preference',
  'working_rule',
  'artifact_index',
  'lesson',
  'workflow',
  'prompt',
  'risk',
  'idea',
  'reference',
]);
const allowedStatuses = new Set([
  'draft',
  'active',
  'validated',
  'superseded',
  'deprecated',
  'archived',
]);
const requiredFields = ['id', 'title', 'memory_type', 'tier', 'status', 'created_at', 'updated_at'];

function listMarkdownFiles(dir) {
  if (!existsSync(dir)) return [];
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
  if (!match) return null;

  const data = {};
  let section = null;
  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.trimEnd();
    if (!line.trim()) continue;

    const nested = line.match(/^ {2}([A-Za-z0-9_-]+):\s*(.*)$/);
    if (nested && section) {
      data[section] = data[section] || {};
      data[section][nested[1]] = cleanValue(nested[2]);
      continue;
    }

    const arrayItem = line.match(/^ {2}-\s*(.*)$/);
    if (arrayItem && section) {
      data[section] = Array.isArray(data[section]) ? data[section] : [];
      data[section].push(cleanValue(arrayItem[1]));
      continue;
    }

    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (field) {
      section = field[1];
      if (field[2] === '') {
        data[section] = undefined;
      } else {
        data[section] = cleanValue(field[2]);
        section = null;
      }
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

function isExternalPath(value) {
  return /^https?:\/\//.test(value);
}

function validatePathExists(value, label, file, errors) {
  if (!value || isExternalPath(value)) return;
  const absolute = path.isAbsolute(value) ? value : path.join(repoRoot, value);
  if (!existsSync(absolute)) {
    errors.push(`${file}: ${label} does not exist: ${value}`);
  }
}

const errors = [];
const files = listMarkdownFiles(entriesDir);

for (const filePath of files) {
  const relative = path.relative(repoRoot, filePath);
  const content = readFileSync(filePath, 'utf8');
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter) {
    errors.push(`${relative}: missing YAML frontmatter`);
    continue;
  }

  for (const field of requiredFields) {
    if (!frontmatter[field]) {
      errors.push(`${relative}: missing required field "${field}"`);
    }
  }

  if (frontmatter.tier && !allowedTiers.has(frontmatter.tier)) {
    errors.push(`${relative}: invalid tier "${frontmatter.tier}"`);
  }
  if (frontmatter.status && !allowedStatuses.has(frontmatter.status)) {
    errors.push(`${relative}: invalid status "${frontmatter.status}"`);
  }
  if (frontmatter.memory_type && !allowedTypes.has(frontmatter.memory_type)) {
    errors.push(`${relative}: invalid memory_type "${frontmatter.memory_type}"`);
  }

  if (frontmatter.source?.path) {
    validatePathExists(frontmatter.source.path, 'source.path', relative, errors);
  }
  if (Array.isArray(frontmatter.related)) {
    for (const related of frontmatter.related) {
      validatePathExists(related, 'related path', relative, errors);
    }
  }
}

if (errors.length > 0) {
  console.error(`Memory validation failed with ${errors.length} error(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Memory validation passed: ${files.length} entr${files.length === 1 ? 'y' : 'ies'} checked.`);
