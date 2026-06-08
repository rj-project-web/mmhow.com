#!/usr/bin/env bash
# Daily check: regenerate sitemap.xml only when CMS has new/changed published articles.
set -euo pipefail

APP_DIR="${MMHOW_APP_DIR:-/var/www/mmhow/app}"
LOG_DIR="${MMHOW_LOG_DIR:-${APP_DIR}/logs}"

mkdir -p "$LOG_DIR"
cd "$APP_DIR"

export NODE_ENV=production

npm run sitemap:check >> "$LOG_DIR/sitemap.log" 2>&1
echo "[$(date -Iseconds)] sitemap check finished ($(grep -c '<url>' public/sitemap.xml 2>/dev/null || echo 0) URLs)" >> "$LOG_DIR/sitemap.log"
