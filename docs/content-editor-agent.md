# 内容编辑 Agent 工作说明

面向负责 MMHow 文章撰写、发布与维护的 Cursor / OpenClaw Agent。

## 核心规则（必读）

**源站对照信息只维护在 Payload 管理后台，不要再改 Excel。**

| 以前（已废弃） | 现在（唯一数据源） |
|----------------|-------------------|
| `docs/source-mapping.xlsx` | https://www.mmhow.com/admin → **Articles** |
| `docs/source-mapping.csv` | 每篇文章侧栏：**源平台 / 原网址 / 原标题** |

`docs/source-mapping.xlsx` 仅作**备份导出**，由 `npm run source-mapping:sync` 从后台生成，**不要手改**。

---

## 发布新文章

### 方式 A：Agent API（推荐）

```http
POST https://www.mmhow.com/api/agent/articles
Authorization: users API-Key YOUR_KEY
Content-Type: application/json
```

必填：`title`、`description`（Markdown 正文）

建议同时传源站字段（会自动写入 CMS，并参与排重）：

```json
{
  "title": "Article title in English",
  "description": "## Section\n\nMarkdown body...",
  "category": "ai-powered-side-hustles",
  "status": "published",
  "sourceUrl": "https://zhuanlan.zhihu.com/p/xxxxx",
  "sourceTitle": "原中文标题",
  "sourcePlatform": "知乎"
}
```

- `sourcePlatform` 可省略，系统会按 URL 自动识别
- 发布前自动排重：原网址 / 原标题 / 内容指纹 重复 → `409 Conflict`

完整 API 说明见 [agent-api.md](./agent-api.md)。

### 方式 B：管理后台手填

1. 登录 https://www.mmhow.com/admin  
2. **Articles** → 新建或编辑文章  
3. 填写标题、摘要、正文、分类  
4. 右侧栏填写 **源平台 / 原网址 / 原标题**  
5. **内容指纹** 保存时自动根据摘要计算，无需填写  

---

## 更新已有文章

只更新 **Admin 后台** 或 **Agent API**（带相同 `slug` 会 upsert）：

- 改标题、正文、分类 → Articles 里编辑  
- 改源站信息 → 同篇文章侧栏的源站字段  
- **不要** 打开或提交 `source-mapping.xlsx` 的变更  

---

## 排重逻辑

系统对照**已发布文章**在 CMS 中的字段：

1. **原网址** (`sourceUrl`) 相同  
2. **原标题** (`sourceTitle`) 相同  
3. **内容指纹** (`contentFingerprint`) 相同  
4. MMHow 英文标题相同  

---

## 分类 slug 查询

```bash
curl https://www.mmhow.com/api/agent/categories \
  -H "Authorization: users API-Key YOUR_KEY"
```

---

## OpenClaw / Cursor 提示词（可复制）

```
你是 MMHow 内容编辑 Agent。

发布或更新文章时：
1. 只维护 Payload 管理后台（https://www.mmhow.com/admin → Articles）
2. 禁止修改 docs/source-mapping.xlsx 或 source-mapping.csv
3. 每篇改编文章必须填写 sourceUrl、sourceTitle（有来源时）
4. 使用 POST https://www.mmhow.com/api/agent/articles，category 传 slug
5. 发前先 GET /api/agent/categories 确认分类
6. 遇 409 表示源站重复，换选题或检查是否已发布

源站字段保存在文章侧栏：源平台、原网址、原标题、内容指纹（自动）。
```
