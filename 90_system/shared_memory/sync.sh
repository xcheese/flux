#!/usr/bin/env bash
set -euo pipefail

# Sync shared memory to remote.
# Only stages/commits the shared memory file to avoid pulling unrelated workspace changes.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MEM_FILE="90_system/shared_memory/memory.md"

cd "$ROOT_DIR"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repo: $ROOT_DIR" >&2
  exit 1
fi

git add "$MEM_FILE"

if git diff --cached --quiet; then
  echo "No changes to commit: $MEM_FILE"
  exit 0
fi

ts="$(date '+%Y-%m-%d %H:%M:%S %z')"
git commit -m "chore(shared-memory): sync (${ts})" -- "$MEM_FILE"
git push

