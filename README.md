# MMHow.com

Content site built with **Payload CMS 3 + Next.js 15**, styled from the Stitch design system.

## Production deploy

See **[docs/deploy-production.md](./docs/deploy-production.md)** for VPS, PostgreSQL, Nginx, and post-launch workflow.

## Quick Start

**Important:** Run these in your Mac **Terminal** (or iTerm), not only inside Cursor Agent — long `npm install` often appears stuck in the agent sandbox.

```bash
cd /Users/jianglanbo/Cursor/mmhow.com

# If a previous install hung:
pkill -f "npm install" 2>/dev/null || true
rm -rf node_modules package-lock.json .next

# One-shot setup script:
bash scripts/setup.sh

# Or step by step:
npm install --registry=https://registry.npmjs.org --no-audit --no-fund
npm run generate:importmap
npm run generate:types
npm run dev
```

### Install seems stuck?

1. **Kill stuck processes:** `pkill -f "npm install"`
2. **Use npmjs registry** (your global mirror may 403 some packages): project `.npmrc` already sets `registry=https://registry.npmjs.org`
3. **First install can take 5–15 min** (Payload + sharp native binaries). Watch progress: `tail -f install.log` if you used the script with logging.
4. **Still stuck?** Try: `npm install --ignore-scripts` then `npm rebuild sharp`
5. **Alternative:** `corepack enable && pnpm install` (often faster)

Open:

- Site: http://localhost:3001
- Admin: http://localhost:3001/admin

Dev server is fixed to port **3001** (`npm run dev`). If something else still listens on 3000, it is not this project — you can ignore it or kill it: `lsof -ti :3000 | xargs kill -9`.

## Collections

| Collection | Purpose |
|---|---|
| `articles` | Main content with Lexical rich text + inline images |
| `categories` | Category pages at `/category/[slug]` |
| `topics` | Topic pages at `/topic/[slug]` |
| `comments` | User comments (public submit, admin approve) |
| `media` | Uploaded images |
| `users` | Admin users + API keys |

## Create Admin User

After first `npm run dev`, open `/admin` and create your first admin account.

## Agent API (recommended for OpenClaw)

See **[docs/agent-api.md](./docs/agent-api.md)** for `POST /api/agent/articles` (title, description, images).

Quick test:

```bash
curl http://localhost:3001/api/agent/articles
curl http://localhost:3001/api/agent/categories -H "Authorization: users API-Key YOUR_KEY"
```

## API Key (for OpenClaw / external publishing)

1. Log in to `/admin`
2. Open **Users** → your user
3. Enable **API Key** and copy the key

### Publish an article via REST API

```bash
curl -X POST http://localhost:3001/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: users API-Key YOUR_API_KEY_HERE" \
  -d '{
    "title": "My First Article",
    "slug": "my-first-article",
    "excerpt": "Short summary for list pages.",
    "content": {
      "root": {
        "type": "root",
        "format": "",
        "indent": 0,
        "version": 1,
        "children": [
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "type": "text",
                "format": 0,
                "mode": "normal",
                "style": "",
                "detail": 0,
                "text": "Hello from API",
                "version": 1
              }
            ],
            "direction": "ltr"
          }
        ],
        "direction": "ltr"
      }
    },
    "_status": "published"
  }'
```

### Upload an image

```bash
curl -X POST http://localhost:3001/api/media \
  -H "Authorization: users API-Key YOUR_API_KEY_HERE" \
  -F "file=@./photo.jpg" \
  -F "alt=Description"
```

## Pages

- `/` — Home
- `/category/[slug]` — Category listing
- `/topic/[slug]` — Topic listing
- `/articles/[slug]` — Article detail + comments

## Database

Local dev uses **SQLite** (`mmhow.db`).

For production PostgreSQL:

```bash
docker compose up -d
```

Then switch `src/payload.config.ts` to `@payloadcms/db-postgres` and set:

```env
DATABASE_URI=postgres://mmhow:mmhow@localhost:5432/mmhow
```

## Design Source

Stitch exports live in `_design/` and are used as the visual reference.
