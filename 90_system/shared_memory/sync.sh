#!/usr/bin/env bash
set -euo pipefail

# Sync shared memory to remote.
# Only stages/commits the shared memory directory to avoid pulling unrelated workspace changes.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MEM_DIR="90_system/shared_memory"

cd "$ROOT_DIR"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repo: $ROOT_DIR" >&2
  exit 1
fi

git add "$MEM_DIR"

if git diff --cached --quiet; then
  echo "No changes to commit: $MEM_DIR"
  exit 0
fi

ts="$(date '+%Y-%m-%d %H:%M:%S %z')"
git commit -m "chore(shared-memory): sync (${ts})" -- "$MEM_DIR"
git push
