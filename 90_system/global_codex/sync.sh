#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"

mkdir -p "$CODEX_HOME/skills/coding-guardrails"

cp "$REPO_ROOT/90_system/global_codex/AGENTS.md" "$CODEX_HOME/AGENTS.md"
cp "$REPO_ROOT/90_system/global_codex/skills/coding-guardrails/SKILL.md" \
  "$CODEX_HOME/skills/coding-guardrails/SKILL.md"

echo "Synced global Codex AGENTS.md to: $CODEX_HOME/AGENTS.md"
echo "Synced global Codex skill to: $CODEX_HOME/skills/coding-guardrails/SKILL.md"
