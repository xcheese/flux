#!/usr/bin/env bash
set -euo pipefail

PLIST_DEST="$HOME/Library/LaunchAgents/com.flux.dmit-stock-monitor.plist"
LABEL="com.flux.dmit-stock-monitor"
GUI_DOMAIN="gui/$(id -u)"

launchctl bootout "$GUI_DOMAIN" "$PLIST_DEST" >/dev/null 2>&1 || true
rm -f "$PLIST_DEST"

echo "Uninstalled LaunchAgent: $LABEL"
echo "Runtime files are preserved under: $HOME/Library/Application Support/FluxDmitStockMonitor"
