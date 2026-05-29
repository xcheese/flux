#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
PLIST_SRC="$ROOT_DIR/scripts/com.flux.dmit-stock-monitor.plist"
PLIST_DEST="$HOME/Library/LaunchAgents/com.flux.dmit-stock-monitor.plist"
APP_SUPPORT="$HOME/Library/Application Support/FluxDmitStockMonitor"
LOG_DIR="$HOME/Library/Logs/FluxDmitStockMonitor"
LABEL="com.flux.dmit-stock-monitor"
GUI_DOMAIN="gui/$(id -u)"

mkdir -p "$HOME/Library/LaunchAgents" "$APP_SUPPORT" "$APP_SUPPORT/chrome-profile" "$LOG_DIR"
cp "$PLIST_SRC" "$PLIST_DEST"

launchctl bootout "$GUI_DOMAIN" "$PLIST_DEST" >/dev/null 2>&1 || true
launchctl bootstrap "$GUI_DOMAIN" "$PLIST_DEST"
launchctl kickstart -k "$GUI_DOMAIN/$LABEL"

echo "Installed LaunchAgent: $PLIST_DEST"
echo "Logs: $LOG_DIR"
