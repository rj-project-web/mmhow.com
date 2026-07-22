# MMHow — Agent 指引

## 内容编辑 Agent

维护或发布文章前，请阅读 **[docs/content-editor-agent.md](docs/content-editor-agent.md)**。

**要点：**

- 源站对照（原网址、原标题、源平台）保存在 **Payload Admin → Articles**，不要改 `docs/source-mapping.xlsx`
- **选题搜源**：从 **`docs/AdsKeyword20260610.xlsx`**（或 `npm run keywords:export` 生成的 **`docs/keyword-search-sheet.csv`**）选词 → **译中文** → 知乎/小红书搜源 → 再英文改编发布
- **标题**：冒号前具体主题，冒号后/句末嵌入 1 个 Excel Keyword；**默认不加 `(2026)` / slug 不加 `-2026`**（仅时效类主题可在正文写年份）；同分类勿重复冒号前模板（详见 content-editor-agent.md）
- **正文**：1200–1800 英文词，含 FAQ；禁止提纲式短稿
- 配图按文章主题选图；每篇封面+正文图全局唯一（`article-images-data.mjs` → `build-image-registry.mjs` → `getImagesForSlug`）
- 发文 API：`POST /api/agent/articles`（见 [docs/agent-api.md](docs/agent-api.md)）
- **内容刷新（URL 不变）**：见 [docs/content-refresh-plan.md](docs/content-refresh-plan.md)；队列 `npm run content:refresh-queue`
- **404 幽灵 URL（蜘蛛已发现）**：**禁止**在 404 slug 上新建文章；须 **301 重定向**到已发布同主题文章。见 [docs/404-url-redirect-plan.md](docs/404-url-redirect-plan.md)；映射表 `docs/404-url-redirect-mapping.csv`；生成 `npm run redirects:404-map`
- **定时自动发布**：Cursor Automation 配置见 [docs/auto-publish-automation.md](docs/auto-publish-automation.md)
- 本地开发端口：`3001`；生产：`https://www.mmhow.com`
