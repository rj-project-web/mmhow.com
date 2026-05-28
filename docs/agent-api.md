# Agent API — 文章发布

面向 OpenClaw / Cursor Agent 等自动化工具，用 **API Key** 提交文章。

## 鉴权

在 Payload 后台创建 API Key：

1. 登录 http://localhost:3001/admin  
2. **Users** → 你的账号 → 勾选 **Enable API Key** → 保存 → 复制 Key  

请求头：

```http
Authorization: users API-Key YOUR_API_KEY_HERE
Content-Type: application/json
```

## 分类（你手动维护）

分类在后台 **Categories** 里维护，或由你发给我录入。Agent 发文章时用 `category` 字段传 **slug**。

查询已有分类：

```bash
curl http://localhost:3001/api/agent/categories \
  -H "Authorization: users API-Key YOUR_KEY"
```

## 发布文章

**POST** `/api/agent/articles`

### 请求体

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 标题 |
| `description` | ✅ | 正文（推荐 Markdown） |
| `descriptionFormat` | | `markdown`（默认） / `html` / `plain` |
| `excerpt` | | 列表摘要，不传则自动截取正文 |
| `featuredImage` | | 封面图 URL |
| `images` | | 正文插图 `[{ "url", "alt?", "caption?" }]`，会下载并写入富文本 |
| `category` | | 分类 slug，如 `investment` |
| `topics` | | 专题 slug 数组 |
| `slug` | | 自定义 URL slug |
| `status` | | `published`（默认）或 `draft` |

### 示例

```bash
curl -X POST http://localhost:3001/api/agent/articles \
  -H "Authorization: users API-Key YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Structuring Your LLC for Remote Consulting",
    "description": "## Overview\n\nA practical guide to LLC setup.\n\n![workspace](https://example.com/desk.jpg)\n\n## Next steps\n\n1. Register\n2. Open bank account",
    "descriptionFormat": "markdown",
    "featuredImage": "https://example.com/cover.jpg",
    "images": [
      { "url": "https://example.com/chart.png", "alt": "Revenue chart" }
    ],
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
    "url": "http://localhost:3001/articles/...",
    "adminUrl": "http://localhost:3001/admin/collections/articles/1"
  }
}
```

## 查看接口说明

```bash
curl http://localhost:3001/api/agent/articles
```

## OpenClaw 提示词片段（可复制）

```
发布文章到 MMHow：
- POST {BASE_URL}/api/agent/articles
- Header: Authorization: users API-Key {API_KEY}
- Body JSON: title, description (markdown), optional featuredImage, images[], category (slug)
- 发前先 GET /api/agent/categories 确认分类 slug
```
