# 内容编辑 Agent 工作说明

面向负责 MMHow 文章撰写、发布与维护的 Cursor / OpenClaw Agent。

## 核心规则（必读）

**源站对照信息只维护在 Payload 管理后台，不要再改 Excel。**

| 以前（已废弃） | 现在（唯一数据源） |
|----------------|-------------------|
| `docs/source-mapping.xlsx` | https://www.mmhow.com/admin → **Articles** |
| `docs/source-mapping.csv` | 每篇文章侧栏：**源平台 / 原网址 / 原标题** |

`docs/source-mapping.xlsx` 仅作**备份导出**，由 `npm run source-mapping:sync` 从后台生成，**不要手改**。

### SEO 关键词（选题 → 搜源 → 改编 → 标题）

广告关键词表 **`docs/AdsKeyword20260610.xlsx`**（438 条 Keyword Stats，**只读**）是选题与标题的**唯一词表来源**。有新版本时由运营替换文件并运行 `npm run keywords:export` 重新生成搜索表。

#### 标准工作流（新发布 / 搜源必读）

**顺序固定：Excel 选词 → 译成中文 → 中文平台搜源 → 英文改编发布。**

| 步骤 | 做什么 | 工具 / 产出 |
|------|--------|-------------|
| 1. 选词 | 按目标**分类**，从 Excel 或导出的 **`docs/keyword-search-sheet.csv`** 中选 `Status=available`、与分类匹配的 Keyword；优先 Competition 低、月均搜索量合理的词 | `npm run keywords:export` |
| 2. 译中文 | 用 CSV 的 **ChineseSearchQuery** 列；若需微调，在英文 Keyword 基础上写出**知乎/小红书会搜的自然中文**（如「副业 电商 跨境电商 2026」） | 列 `ChineseSearchQuery`、`ZhihuSearch`、`XhsSearch` |
| 3. 搜源 | 用中文在 **知乎专栏**、**人人都是产品经理**、**小红书** 等找高质量长文；确认未在 CMS 发布过（`sourceUrl` / `sourceTitle` 排重） | Google：`site:zhuanlan.zhihu.com {中文词}`；站内搜 `{中文词} 小红书 副业` |
| 4. 改编 | 中文源 → 英文 Markdown；正文自然融入所选 Keyword 及长尾 | Agent API |
| 5. 标题 | 见下方「英文标题规则」；slug 发布后尽量不改 | `PATCH /api/articles/:id` 仅改标题时可用 |

**禁止**：跳过 Excel 直接凭感觉搜中文、或先搜到文章再硬凑关键词——会导致标题同质化与词表浪费。

#### 英文标题规则

1. **冒号前**：具体可检索主题（平台 / 方法 / 场景），如 `TikTok Shop`、`1688 Supplier Guide`、`Index Fund SIP`。
2. **冒号后或句末**：自然嵌入 **1 个** Excel Keyword（或其常见变体），不要整段复制粘贴当标题前半。
3. **同分类内**：**禁止**多篇共用相同「冒号前」模板（例如曾出现的 `Side Hustle Ecommerce:` 前缀重复——已优化，后续勿再出现）。
4. **Meta Title**：系统自动为 `{title} | MMHow`，无需单独字段。
5. **年份（2026）**：
   - **默认不在**标题末尾或 slug 末尾加 `(2026)` / `-2026`。
   - **仅当**文章核心依赖时效（平台政策、税率、认证规则、算法大改）时，可在**标题或正文小标题**中写一次年份；slug 仍优先无年份（如 `ozon-eac-compliance` 而非 `…-2026`）。
   - 中文搜源词里的「副业 2026」只用于找源，**不要**机械照抄进英文标题/slug。
   - **已发布** slug 不因去年份而批量修改；若必须改 slug，须在 `next.config.ts` 加 301 并重跑 sitemap。

分类专属词不够时（如 AI 类仅 2 条强相关词、11 篇文章）：可复用表中**通用长尾**（side hustle / make money online 变体），但仍须保证**同分类标题前缀不撞车**。

#### 正文 SEO

1. 导语、首段、1–2 个小标题中适度出现核心 Keyword。
2. 全文自然长尾即可，避免 keyword stuffing。
3. 无合适词时：选最接近的长尾，勿为凑词偏离源文主旨。
4. **站内内链**：正文末或相关段落链到 **2–3 篇**同站已发布文章（锚文本含自然长尾词）。
5. **篇幅（硬性）**：竞争型主题 **1200–1800 英文词**；至少 **6 个** `##` 小节 + **`## FAQ`（3–5 问）**；禁止只发提纲式短稿（表格 + bullet 凑数）。
6. 改编须展开中文源文中的案例、步骤、数据区间与避坑，不可只保留目录骨架。
7. `investment--passive-income` 分类：正文已自动展示投资免责声明组件，无需重复大段免责。

#### 发布字段 SEO（每篇必填/强烈建议）

| 字段 | 规则 |
|------|------|
| `excerpt` | **手写**，120–155 字符；含 1 次主 Keyword + 一句读者利益；勿依赖自动截取 |
| `keyTakeaways` | **每篇必填** 3–5 条顶部要点（英文）；显示在文章顶部，利于 SEO 与 Google AI Overviews 抽取。见下方「Key Takeaways 规范」 |
| `topics` | 传 **1–2 个** topic slug（须已在 CMS **Topics** 存在） |
| `slug` | 可选自定义；短、可读、含核心词；**默认不含年份**；发布后尽量不改 |
| 发布后 | 跑 `npm run sitemap:check`（或部署 `generate:sitemap`）确保新 URL 进 sitemap |

站点已为文章页输出 **canonical、Open Graph、Twitter Card、Article JSON-LD、FAQPage、BreadcrumbList**；`excerpt` 即 meta description。

#### Key Takeaways 规范（每篇必填）

发文时用 `keyTakeaways` 字段传入，可为字符串数组或 `[{ "point": "..." }]`：

```json
{
  "keyTakeaways": [
    "Register the LLC in your home state unless you have a clear reason not to.",
    "Open a dedicated business bank account before taking on clients.",
    "Track expenses from day one to simplify quarterly taxes."
  ]
}
```

- **3–5 条**，每条 8–18 个英文单词，一句话。
- **答案先行、信息密度高**：直接给结论 / 数字 / 方法，动词开头更佳（`Use…` / `Start with…` / `Avoid…`）。
- 严格基于正文，不编造数据；YMYL（理财/赚钱）措辞稳健、不做收益保证。
- 不要写 “This article… / In this guide…” 之类元描述。
- 留空也能发，但**强烈建议每篇都填**——这是 Google AI Overviews 最易抽取的格式。

**批量补写 excerpt + topics**（已发布文章）：在 `scripts/lib/article-seo-excerpts.mjs` 为新 ID 增加条目后运行：

```bash
npm run articles:seo-batch
```

### 配图（贴近正文）

改编或发布时，配图按**文章主题**选，不要按分类套固定图库。

| 位置 | 作用 | 选图原则 |
|------|------|----------|
| `featuredImage` | 封面 / 列表缩略图 | 场景感：谁在什么环境做这件事 |
| `images[]` | 正文插图 | 信息感：工具、流程、数据、平台操作 |
| Markdown `![alt](url)` | 正文内联图 | 写在需要插图的段落旁，API 会下载并插入该位置 |

**`images[]` 推荐写法**（插图落在对应小节末尾，而非全文底部）：

```json
{
  "featuredImage": "https://images.unsplash.com/photo-xxx?w=1200&q=80",
  "images": [
    {
      "url": "https://images.unsplash.com/photo-yyy?w=1200&q=80",
      "alt": "Seller recording a TikTok Shop product clip on a phone",
      "caption": "Short video and live clips remain the core GMV engines.",
      "afterHeading": "Four revenue engines"
    }
  ]
}
```

- `afterHeading` 填 markdown 标题文字（不含 `#`），须与正文 `## …` 一致  
- `alt` 写清画面 + 与本节关系；`caption` 可写一句本节论点  
- 发布前验证图片 URL：`curl -sI "URL" | head -1` 须为 `200`  
- 批量脚本：`scripts/lib/article-images-data.mjs`（每 slug 的 `afterHeading` / `alt` / `caption`）→ 运行 `node scripts/build-image-registry.mjs` 分配**全局唯一**封面 + 正文图（Pexels CDN）  
- 读取接口：`scripts/lib/article-images.mjs` 的 `getImagesForSlug(slug)`；发布前调用 `assertUniqueImages()` 校验无重复 URL  
- 新 batch 前若图库不足：`NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/expand-photo-pool.mjs --target 250`

**工作流：** 列出 3–5 个 `##` 小标题 → 为封面 + 1–2 个关键小节写 `alt` / `caption` → 在 `article-images-data.mjs` 加一行 → `node scripts/build-image-registry.mjs` → 发布。

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
  "excerpt": "Hand-written meta description (120–155 chars) with primary keyword.",
  "keyTakeaways": [
    "First concise, answer-first takeaway in English.",
    "Second takeaway with a concrete number or step.",
    "Third takeaway readers can act on immediately."
  ],
  "description": "## Section\n\nMarkdown body...",
  "category": "ai-powered-side-hustles",
  "topics": ["side-hustles"],
  "status": "published",
  "sourceUrl": "https://zhuanlan.zhihu.com/p/xxxxx",
  "sourceTitle": "原中文标题",
  "sourcePlatform": "知乎"
}
```

- `sourcePlatform` 可省略，系统会按 URL 自动识别
- 发布前自动排重：原网址 / 原标题 / 内容指纹 重复 → `409 Conflict`

完整 API 说明见 [agent-api.md](./agent-api.md)。

**批量发布间隔**：所有 `scripts/publish-category-batch*.mjs` 在**每篇成功发布之后**随机等待 **10–20 分钟**再发下一篇（`publishedAt` 随 POST 时间写入 CMS）。本地调试可设 `MMHOW_BATCH_SKIP_DELAY=1` 跳过等待。10 篇整批约 **1.5–3 小时**。

**定时自动发布**：见 [auto-publish-automation.md](./auto-publish-automation.md)（Cursor Automation + 复制 prompt 模板）。

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

### 定期刷新（URL 不变）

已发布文章需**滚动更新正文**时，遵循 **[content-refresh-plan.md](./content-refresh-plan.md)**：

- **禁止改 `slug`** — URL 永久不变  
- 用 `PATCH /api/articles/:id` 更新 `description`、`excerpt`、`keyTakeaways`  
- 正文末可加 `## Last reviewed` 段说明核实日期  
- 导出队列：`npm run content:refresh-queue` → `scripts/content-refresh-queue.json`  
- 建议节奏：**10 篇/周**（8×L1 + 2×L2），约 29 周覆盖 284 篇一轮  

---

## 404 幽灵 URL（蜘蛛已发现，必读）

内容 Agent 曾在正文中生成指向**从未发布** slug 的内链（见 `docs/unique-404-urls.txt`，共 101 条）。Google 等蜘蛛可能已抓取这些 URL。

### 规则（硬性）

| 场景 | 正确做法 | 禁止 |
|------|----------|------|
| 修复 `docs/unique-404-urls.txt` 中的 404 | 在 `scripts/lib/404-redirect-overrides.mjs` 映射到**已发布**文章 slug → `npm run redirects:404-map` → 部署 | 在 404 slug 上 `POST /api/agent/articles` 新建页面 |
| 正文站内内链 | 只链到 **sitemap.xml 中已存在** 的 `/articles/{slug}` | 链到未发布、臆造的 slug |
| 新选题发文 | 正常创建**新** slug（见上方标准工作流） | 把 404 清单里的 slug 当作新文目标 |

### 工作流

1. 查映射：`docs/404-url-redirect-mapping.csv`（`ghost_slug` → `canonical_slug`）
2. 改映射：编辑 `scripts/lib/404-redirect-overrides.mjs`（101 条，目标须在 sitemap 存在）
3. 重新生成：`npm run redirects:404-map` → 更新 `scripts/404-redirects.generated.mjs`
4. 部署：`npm run deploy`（`next.config.ts` 读取 `scripts/404-redirects.mjs` 输出 301）

完整说明：[docs/404-url-redirect-plan.md](./404-url-redirect-plan.md)

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
3. 新选题流程：docs/AdsKeyword20260610.xlsx（或 docs/keyword-search-sheet.csv）选 Keyword → 译成中文 → 知乎/小红书/ woshipm 搜源 → 再英文改编
4. 每篇改编文章必须填写 sourceUrl、sourceTitle（有来源时）
5. 英文 title：冒号前写具体主题，冒号后/句末自然嵌入 1 个 Excel Keyword；同分类勿重复冒号前模板
6. 每篇手写 excerpt（120–155 字，含 Keyword）、传 keyTakeaways[]（3–5 条英文要点）并传 topics[]（1–2 个 slug）
7. 正文含 2–3 条站内内链；配图按文章主题选图
8. 使用 POST https://www.mmhow.com/api/agent/articles，category 传 slug
9. 站内内链只指向 sitemap 已存在的 slug；禁止链向 docs/unique-404-urls.txt 中的幽灵 URL
10. 修复蜘蛛已发现的 404：用 301 重定向到已发布文章，禁止在 404 slug 上新建文章（见 docs/404-url-redirect-plan.md）
11. 发前先 GET /api/agent/categories 确认分类
12. 整批完成后 npm run sitemap:check
13. 遇 409 表示源站重复，换选题或检查是否已发布

源站字段保存在文章侧栏：源平台、原网址、原标题、内容指纹（自动）。
```
