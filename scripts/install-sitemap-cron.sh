#!/usr/bin/env bash
# Install daily sitemap check (03:00 server local time).
set -euo pipefail

APP_DIR="${1:-/var/www/mmhow/app}"
CRON_CMD="0 3 * * * ${APP_DIR}/scripts/generate-sitemap-cron.sh"

chmod +x "${APP_DIR}/scripts/generate-sitemap-cron.sh"

# Remove old weekly entry if present, then ensure daily entry exists.
TMP="$(mktemp)"
crontab -l 2>/dev/null | grep -Fv 'generate-sitemap-cron.sh' > "$TMP" || true
echo "$CRON_CMD" >> "$TMP"
crontab "$TMP"
rm -f "$TMP"

echo "Installed daily cron: $CRON_CMD"

echo "Test run:"
MMHOW_APP_DIR="$APP_DIR" bash "${APP_DIR}/scripts/generate-sitemap-cron.sh"
echo "Done. Log: ${APP_DIR}/logs/sitemap.log"
