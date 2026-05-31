#!/usr/bin/env bash
# Install weekly sitemap regeneration (Sunday 03:00 server local time).
set -euo pipefail

APP_DIR="${1:-/var/www/mmhow/app}"
CRON_CMD="0 3 * * 0 ${APP_DIR}/scripts/generate-sitemap-cron.sh"

chmod +x "${APP_DIR}/scripts/generate-sitemap-cron.sh"

if crontab -l 2>/dev/null | grep -Fq 'generate-sitemap-cron.sh'; then
  echo "Sitemap cron already installed."
else
  (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
  echo "Installed weekly cron: $CRON_CMD"
fi

echo "Test run:"
MMHOW_APP_DIR="$APP_DIR" bash "${APP_DIR}/scripts/generate-sitemap-cron.sh"
echo "Done. Log: ${APP_DIR}/logs/sitemap.log"
