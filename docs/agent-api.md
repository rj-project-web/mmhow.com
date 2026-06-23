# Agent API — 文章发布

面向 OpenClaw / Cursor Agent 等自动化工具，用 **API Key** 提交文章（标题、正文、封面图、插图），带权限校验。

**线上地址：** `https://www.mmhow.com/api/agent/articles`

## 鉴权（权限控制）

仅持有有效 **API Key** 的用户可调用 `POST` / 受保护的 `GET`。未带 Key 或 Key 无效 → `401 Unauthorized`。

### 1. 创建 API Key（生产环境）

1. 登录 https://www.mmhow.com/admin  
2. **Users** → 你的账号 → 勾选 **Enable API Key** → 保存 → 复制 Key（只显示一次，请妥善保存）

### 2. 请求头

```http
Authorization: users API-Key YOUR_API_KEY_HERE
Content-Type: application/json
```

本地开发把域名换成 `http://localhost:3001` 即可。

## 分类（你手动维护）

分类在后台 **Categories** 里维护。Agent 发文章时用 `category` 字段传 **slug**。

查询已有分类（需 API Key）：

```bash
curl https://www.mmhow.com/api/agent/categories \
  -H "Authorization: users API-Key YOUR_KEY"
```

## 发布文章

**POST** `https://www.mmhow.com/api/agent/articles`

### 请求体

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 标题 |
| `description` | ✅ | 正文（推荐 Markdown） |
| `descriptionFormat` | | `markdown`（默认） / `html` / `plain` |
| `excerpt` | | **强烈建议手写**（120–155 字符，含主 Keyword）→ 用作 meta description / OG；不传则从正文自动截取 |
| `keyTakeaways` | | **建议** 3–5 条顶部要点，显示在文章顶部，利于 SEO 与 Google AI Overviews 抽取。可传字符串数组或 `[{ "point": "..." }]` |
| `featuredImage` | | 封面图 URL（服务端会下载并入库） |
| `images` | | 正文插图 `[{ "url", "alt?", "caption?", "afterHeading?" }]`；`afterHeading` 插入对应 `##` 小节末尾 |
| `category` | | 分类 slug，如 `investment` |
| `topics` | | **建议** 1–2 个专题 slug（须已在 CMS Topics 存在） |
| `slug` | | 自定义 URL slug |
| `status` | | `published`（默认）或 `draft` |
| `sourceUrl` | | 原文章网址（写入 CMS，用于排重） |
| `sourceTitle` | | 原文章标题（可选，参与排重） |
| `sourcePlatform` | | 源平台名称（可选，如 `知乎`；不传则按 URL 自动识别） |
| `skipSourceDedup` | | `true` 时跳过排重（仅特殊情况使用） |

### 源站排重与对照表

**数据源：Payload 管理后台 → Articles**（侧栏：源平台 / 原网址 / 原标题 / 内容指纹）。

内容编辑 Agent **不要**再维护 `docs/source-mapping.xlsx`。详见 [content-editor-agent.md](./content-editor-agent.md)。

发布前会自动对照 CMS 中已发布文章的源站字段：

- **原网址** 重复 → `409 Conflict`
- **原标题** 重复 → `409 Conflict`
- **正文内容指纹** 重复 → `409 Conflict`

发布成功（`status: published`）后，源站字段写入该文章记录。无原网址时可留空。

**SEO 发布后**：在能访问 CMS 的环境运行 `npm run sitemap:check`，或依赖生产 cron / 部署时 `generate:sitemap`，确保新文章 URL 进入 `sitemap.xml`。

从 CMS 导出备份到 Excel/CSV（可选，勿手改导出文件）：

```bash
npm run source-mapping:sync
```

一次性从旧 CSV 导入 CMS（迁移用）：

```bash
npm run source-mapping:import
```

### 生产环境示例

```bash
curl -X POST https://www.mmhow.com/api/agent/articles \
  -H "Authorization: users API-Key YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Structuring Your LLC for Remote Consulting",
    "description": "## Overview\n\nA practical guide to LLC setup.\n\n![workspace](https://example.com/desk.jpg)\n\n## Next steps\n\n1. Register\n2. Open bank account",
    "descriptionFormat": "markdown",
    "excerpt": "How to structure an LLC for remote consulting—registration, banking, and tax basics in one practical guide.",
    "keyTakeaways": [
      "Register the LLC in your home state unless you have a clear reason not to.",
      "Open a dedicated business bank account before taking on clients.",
      "Track expenses from day one to simplify quarterly taxes."
    ],
    "featuredImage": "https://example.com/cover.jpg",
    "images": [
      { "url": "https://example.com/chart.png", "alt": "Revenue chart" }
    ],
    "category": "guides",
    "status": "published"
  }'
```

### 本地示例

```bash
curl -X POST http://localhost:3001/api/agent/articles \
  -H "Authorization: users API-Key YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Structuring Your LLC for Remote Consulting",
    "description": "## Overview\n\nA practical guide to LLC setup.",
    "featuredImage": "https://example.com/cover.jpg",
    "category": "guides",
    "status": "published"
  }'
```

### 成功响应

```json
{
  "success": true,
  "article": {
    "id": 1,
    "title": "...",
    "slug": "...",
    "status": "published",
    "url": "https://www.mmhow.com/articles/...",
    "adminUrl": "https://www.mmhow.com/admin/collections/articles/1"
  }
}
```

### 错误响应

| HTTP | 含义 |
|------|------|
| `401` | 未提供或无效的 API Key |
| `400` | 缺少 `title`/`description`、分类 slug 不存在等 |
| `500` | 图片下载失败、服务器内部错误 |

## 查看接口说明（无需鉴权）

```bash
curl https://www.mmhow.com/api/agent/articles
```

## OpenClaw 提示词片段（可复制）

```
发布文章到 MMHow：
- 选题：docs/AdsKeyword20260610.xlsx 或 npm run keywords:export → docs/keyword-search-sheet.csv
- 流程：选 Keyword → 译中文（ChineseSearchQuery）→ 知乎/小红书搜源 → 英文改编
- POST https://www.mmhow.com/api/agent/articles
- Header: Authorization: users API-Key {API_KEY}
- Body JSON: title, description (markdown), optional featuredImage, images[], category (slug)
- 有来源时必传 sourceUrl、sourceTitle（写入 Admin，不要改 source-mapping.xlsx）
- 英文 title：冒号前具体主题，冒号后/句末嵌入 1 个 Excel Keyword；同分类勿重复冒号前模板
- 配图：featuredImage=场景封面；images[].afterHeading=小节插图；或 markdown 内联 ![alt](url)
- 发前先 GET https://www.mmhow.com/api/agent/categories 确认分类 slug
- 完整说明见仓库 docs/content-editor-agent.md
```

## SEO 关键词导出

从 Excel 生成带中文搜索词的 CSV（含已用词 / 可用词标记）：

```bash
npm run keywords:export
```

产出：`docs/keyword-search-sheet.csv`、`docs/keyword-search-sheet.json`（需 `.env` 中 `MMHOW_API_KEY` 以标记已发布文章用过的词）。
