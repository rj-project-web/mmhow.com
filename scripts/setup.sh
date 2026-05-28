#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> 1. Kill stuck npm/node processes (if any)"
pkill -f "npm install" 2>/dev/null || true
pkill -f "node-gyp" 2>/dev/null || true

echo "==> 2. Clean partial install"
rm -rf node_modules package-lock.json .next

echo "==> 3. Install dependencies (use npmjs registry)"
npm install \
  --registry=https://registry.npmjs.org \
  --no-audit \
  --no-fund \
  --loglevel=info

echo "==> 4. Generate Payload files"
npm run generate:importmap
npm run generate:types

echo "==> 5. Done. Start dev server with: npm run dev"
echo "    Site:  http://localhost:3000"
echo "    Admin: http://localhost:3000/admin"
