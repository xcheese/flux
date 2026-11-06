#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# The login shell and a child bash can resolve different Python versions.
# Select an existing interpreter; never install software or change shell setup.
supports_tomllib() {
    "$1" -c 'import sys, tomllib; sys.exit(sys.version_info < (3, 11))' >/dev/null 2>&1
}

if [[ -n "${CODEX_SYNC_PYTHON:-}" ]]; then
    if supports_tomllib "$CODEX_SYNC_PYTHON"; then
        exec "$CODEX_SYNC_PYTHON" -B "$script_dir/sync.py" "$@"
    fi
    echo 'CODEX_SYNC_PYTHON must name an existing Python 3.11+ interpreter with tomllib.' >&2
    exit 1
fi

for candidate in python3 /opt/homebrew/bin/python3 /usr/local/bin/python3 \
    /opt/homebrew/opt/python@3.*/bin/python3 /usr/local/opt/python@3.*/bin/python3; do
    if supports_tomllib "$candidate"; then
        exec "$candidate" -B "$script_dir/sync.py" "$@"
    fi
done
echo 'Python 3.11+ with tomllib is required. Set CODEX_SYNC_PYTHON to an existing compatible interpreter.' >&2
exit 1
