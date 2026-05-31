#!/usr/bin/env bash
# Regenerate sitemap.xml on the server (used by weekly cron).
set -euo pipefail

APP_DIR="${MMHOW_APP_DIR:-/var/www/mmhow/app}"
LOG_DIR="${MMHOW_LOG_DIR:-/var/log/mmhow}"

mkdir -p "$LOG_DIR"
cd "$APP_DIR"

export NODE_ENV=production

npm run generate:sitemap >> "$LOG_DIR/sitemap.log" 2>&1
echo "[$(date -Iseconds)] sitemap regenerated ($(grep -c '<url>' public/sitemap.xml) URLs)" >> "$LOG_DIR/sitemap.log"
