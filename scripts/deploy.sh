#!/usr/bin/env bash
#
# Safe production deploy for MMHow (run ON the VPS).
#
# Flow: pull -> (conditional) install deps -> STOP app -> build -> start app.
# Stopping the app before building frees memory so `next build` never has to
# compete with the running Node process (which previously caused an OOM freeze).
#
# Usage (on the server):
#   cd /var/www/mmhow/app && bash scripts/deploy.sh
#
# Override defaults with env vars:
#   APP_DIR=/var/www/mmhow/app PM2_NAME=mmhow BRANCH=main bash scripts/deploy.sh

set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/mmhow/app}"
PM2_NAME="${PM2_NAME:-mmhow}"
BRANCH="${BRANCH:-main}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000/}"
# Cap build heap as a safety net even though the app is stopped during build.
BUILD_NODE_OPTIONS="${BUILD_NODE_OPTIONS:---no-deprecation --max-old-space-size=4096}"

log() { printf '\n\033[1;34m[deploy]\033[0m %s\n' "$*"; }

cd "$APP_DIR"

log "Pulling latest from origin/$BRANCH ..."
PREV_HEAD="$(git rev-parse --short HEAD)"
git pull --ff-only origin "$BRANCH"
NEW_HEAD="$(git rev-parse --short HEAD)"
log "HEAD: $PREV_HEAD -> $NEW_HEAD"

# Install dependencies only when the lockfile changed (saves time and memory).
if ! git diff --quiet "$PREV_HEAD" "$NEW_HEAD" -- package-lock.json 2>/dev/null; then
  log "package-lock.json changed — running npm ci ..."
  npm ci
else
  log "Dependencies unchanged — skipping npm ci."
fi

# Stop the running app so the build has the whole box to itself.
log "Stopping PM2 process '$PM2_NAME' to free memory for the build ..."
pm2 stop "$PM2_NAME" 2>/dev/null || log "(process not running yet — continuing)"

log "Building (NODE_OPTIONS=$BUILD_NODE_OPTIONS) ..."
NODE_OPTIONS="$BUILD_NODE_OPTIONS" npm run build

# Start (or restart) the app.
if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  log "Restarting PM2 process '$PM2_NAME' ..."
  pm2 restart "$PM2_NAME" --update-env
else
  log "Starting PM2 process '$PM2_NAME' ..."
  pm2 start npm --name "$PM2_NAME" -- start
fi
pm2 save

# Simple health check.
log "Health check: $HEALTH_URL"
for i in $(seq 1 10); do
  code="$(curl -s --max-time 8 -o /dev/null -w '%{http_code}' "$HEALTH_URL" || echo 000)"
  if [ "$code" = "200" ]; then
    log "Healthy (HTTP 200). Deploy of $NEW_HEAD complete."
    exit 0
  fi
  sleep 3
done

log "WARNING: health check did not return 200 after retries. Check 'pm2 logs $PM2_NAME'."
exit 1
