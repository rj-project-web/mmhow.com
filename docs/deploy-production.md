# MMHow 上线与后续工作指南

## 当前项目状态

| 项目 | 本地 | 线上建议 |
|------|------|----------|
| 数据库 | SQLite (`mmhow.db`) | **PostgreSQL** |
| 端口 | `3001` | Nginx 反代 → `3000` 或 `3001` |
| 媒体文件 | `media/` 目录 | VPS 磁盘或对象存储 |
| 后台 | `/admin` | `https://mmhow.com/admin` |
| Agent 发文 | `/api/agent/articles` | 同上，需 HTTPS + API Key |

---

## 第一阶段：推代码（今天可做）

### 1. 初始化 Git（若还没有）

```bash
cd /Users/jianglanbo/Cursor/mmhow.com
git init
git add .
git commit -m "Initial MMHow site with Payload CMS and agent API"
```

**不要提交：** `.env`、`mmhow.db`、`node_modules/`、`media/`（已在 `.gitignore`）

### 2. 推送到 GitHub / GitLab

```bash
git remote add origin git@github.com:YOUR_USER/mmhow.com.git
git branch -M main
git push -u origin main
```

### 3. 本地先验证能构建

```bash
npm run generate:importmap
npm run generate:types
npm run build
```

构建成功再部署，避免线上第一次就失败。

---

## 第二阶段：VPS 环境（一次性）

### 0. SSH 密钥登录 + 环境检查

见 **[docs/vps-ssh-setup.md](./vps-ssh-setup.md)**。服务器上一键安装依赖：

```bash
bash server-bootstrap.sh
```

（从本仓库 `scripts/server-bootstrap.sh` 复制到服务器，或 `git clone` 后执行。）

### 1. 服务器准备

- Ubuntu 24.04，2核 4G 起
- 域名 `mmhow.com` DNS → VPS IP
- 安装：Docker、Docker Compose、 Nginx、Certbot

### 2. 启动 PostgreSQL

项目根目录已有 `docker-compose.yml`（仅 Postgres）：

```bash
mkdir -p /var/www/mmhow
cd /var/www/mmhow
# 上传 docker-compose.yml 后：
docker compose up -d
```

生产环境请改掉默认密码 `mmhow`，并不要对公网暴露 `5432`。

### 3. 生产环境变量

在服务器创建 `/var/www/mmhow/app/.env.production`：

```env
NODE_ENV=production
DATABASE_URI=postgres://mmhow:强密码@127.0.0.1:5432/mmhow
PAYLOAD_SECRET=用 openssl rand -base64 48 生成
NEXT_PUBLIC_SERVER_URL=https://mmhow.com
```

> **重要：** 线上需把 `payload.config.ts` 从 SQLite 改为 PostgreSQL（见下方「数据库切换」）。

### 4. 云厂商安全组（必做，否则 HTTPS 打不开）

服务器上 `ufw allow 443` **不够**。腾讯云 / 其他 VPS 还需在控制台为实例放行：

| 协议 | 端口 | 来源 |
|------|------|------|
| TCP | 80 | 0.0.0.0/0 |
| TCP | 443 | 0.0.0.0/0 |

**现象：** `http://www.mmhow.com` 返回 301 到 HTTPS，但浏览器一直转圈——多半是 **443 在安全组未开放**（本机 `curl -k https://127.0.0.1` 正常，外网 `nc -zv IP 443` 超时）。

### 5. Nginx + SSL

- 使用仓库内 `deploy/nginx-mmhow.conf`（反代 → `127.0.0.1:3000`，`client_max_body_size 50M`）
- 不要用 Certbot 改 `default` 后仍只指向 `/var/www/html` 欢迎页

```bash
sudo cp /var/www/mmhow/app/deploy/nginx-mmhow.conf /etc/nginx/sites-available/mmhow
sudo ln -sf /etc/nginx/sites-available/mmhow /etc/nginx/sites-enabled/mmhow
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d mmhow.com -d www.mmhow.com
```

证书若已申请过，只需 `certbot install` 或手动核对 `ssl_certificate` 路径。

---

## 第三阶段：部署应用

### 方式 A：PM2（简单，推荐先用）

```bash
cd /var/www/mmhow/app
git pull
npm ci
npm run generate:importmap
npm run generate:types
npm run build
pm2 start npm --name mmhow -- start
pm2 save
```

`package.json` 里 `start` 默认端口 3000；Nginx 指向 3000 即可。

### 方式 B：Docker 全栈（后续可升级）

需要补充 `Dockerfile` + 含 app 的 `docker-compose.prod.yml`（当前仓库尚未包含，可第二阶段再加）。

---

## 第四阶段：线上初始化（只做一次）

```bash
# SSH 到服务器，在 app 目录
SEED_ADMIN_EMAIL=admin@mmhow.com SEED_ADMIN_PASSWORD=强密码 npm run seed:admin
```

或打开 `https://mmhow.com/admin` 创建管理员。

### 分类数据

- 本地已有 10 个分类 → 在线上后台 **Categories** 里重新录入，或写迁移脚本从 SQLite 导出
- 文章发布后用 Agent API 时 `category` 传 slug

### API Key（给 Agent / OpenClaw）

1. 登录 `/admin` → **Users** → Enable API Key  
2. 文档：[agent-api.md](./agent-api.md)  
3. 生产 URL：`https://mmhow.com/api/agent/articles`

### Sitemap（SEO，构建时 + 每日检查）

构建时会生成静态文件：

- `public/sitemap.xml` — 首页、分类、专题、已发布文章
- `public/robots.txt` — 指向 sitemap

访问：`https://www.mmhow.com/sitemap.xml`

**手动全量生成：**

```bash
npm run generate:sitemap
```

**仅在有新文章时更新**（对比 CMS 与现有 sitemap 中的文章 slug）：

```bash
npm run sitemap:check
```

**线上每天 03:00 自动检查**；仅当发现新发布/变更文章时才重写 `sitemap.xml`，无需重启应用：

```bash
cd /var/www/mmhow/app
bash scripts/install-sitemap-cron.sh
```

日志：`/var/www/mmhow/app/logs/sitemap.log`

---

## 第五阶段：日常内容编辑（上线后）

| 方式 | 适合 |
|------|------|
| **后台 `/admin`** | 手工写文章、改分类、审评论 |
| **Agent API** | OpenClaw 批量发文、带 Markdown + 图片 URL |
| **Payload REST** | `POST /api/articles` + API Key（更底层） |

建议工作流：

1. 分类、专题在后台维护  
2. 日常文章用 Agent API 提交草稿或已发布  
3. 评论在后台 **Comments** 审核（`pending` → `approved`）

---

## 第六阶段：网站升级（持续开发）

```text
本地改代码 → git push → SSH 到服务器 git pull → npm ci → build → pm2 restart mmhow
```

可选：配置 GitHub Actions 自动部署（push `main` 触发）。

升级前在本地：

```bash
npm run dev          # 端口 3001
npm run build        # 确认无报错
```

---

## 上线前检查清单

- [ ] `npm run build` 本地通过
- [ ] `.env` 未进 Git
- [ ] 生产 `PAYLOAD_SECRET` 已换随机值
- [ ] 数据库改为 PostgreSQL（勿用 SQLite 上生产）
- [ ] `NEXT_PUBLIC_SERVER_URL=https://mmhow.com`
- [ ] SSL 证书有效
- [ ] 管理员账号 + API Key 已创建
- [ ] 10 个分类已在生产后台录入
- [ ] 发一篇测试文章，前台 `/articles/slug` 可访问
- [ ] Agent API 在生产环境 curl 测试通过

---

## 数据库切换（SQLite → PostgreSQL）

上线前需在代码中支持 Postgres（一次性改动）：

1. 安装：`npm install @payloadcms/db-postgres@3.85.0`
2. `payload.config.ts` 根据 `DATABASE_URI` 使用 `postgresAdapter`
3. 本地可用 `docker compose up -d` + `DATABASE_URI` 测试

需要我帮你改好「按环境自动选 SQLite / Postgres」时，说一声即可。

---

## 建议时间线

| 顺序 | 任务 | 耗时 |
|------|------|------|
| 1 | Git 推送 + 本地 build 验证 | 30 分钟 |
| 2 | VPS + 域名 + SSL + Postgres | 1–2 小时 |
| 3 | 改 Postgres + 部署 + 创建管理员 | 1 小时 |
| 4 | 录入分类 + 发 2–3 篇测试文 | 持续 |
| 5 | 配置 Agent API Key，对接 OpenClaw | 30 分钟 |
| 6 | 其余 Stitch 页面、SEO、sitemap | 后续迭代 |
