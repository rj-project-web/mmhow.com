# 404 幽灵 URL → 已发布文章（301 重定向）

**生效日期：2026-07-22**  
**状态：已固化** — 所有 Agent 须遵守，见 [content-editor-agent.md](./content-editor-agent.md) 与 [AGENTS.md](../AGENTS.md)。

## 背景

内容 Agent 在正文中生成了指向**从未发布** slug 的内链。Google 等蜘蛛可能已抓取这些 URL（`docs/unique-404-urls.txt`，**101 条**）。线上曾短暂误发重复页面，已删除；正确做法是 **301 到已存在文章**，不新建同 slug 页面。

## 核心规则

1. **禁止**在 `docs/unique-404-urls.txt` 任一 slug 上调用 `POST /api/agent/articles` 新建文章。
2. **必须**将每个幽灵 slug 映射到 **sitemap.xml 中已存在** 的同主题文章。
3. **必须**通过 `next.config.ts` → `scripts/404-redirects.mjs` 配置 **`permanent: true`（301）** 重定向。
4. **正文内链**只允许指向已发布 slug；写稿前可用 sitemap 或 CMS 核对。

## 文件一览

| 文件 | 作用 |
|------|------|
| `docs/unique-404-urls.txt` | 101 个幽灵 URL 清单（只读参考） |
| `scripts/lib/404-redirect-overrides.mjs` | **主数据源**：ghost → canonical 映射（101 条） |
| `docs/404-url-redirect-mapping.csv` | 生成物：映射表 + 方法/置信度 |
| `scripts/404-redirects.generated.mjs` | 生成物：Next.js redirect 数组 |
| `scripts/404-redirects.mjs` | 合并 legacy + ghost 重定向，供 `next.config.ts` 引用 |
| `scripts/generate-404-redirect-mapping.mjs` | 生成脚本 |

## 命令

```bash
# 重新生成 CSV + 404-redirects.generated.mjs（改 overrides 后执行）
npm run redirects:404-map

# 部署（含 next build，重定向生效）
npm run deploy
```

## 新增或修改映射

1. 在 `scripts/lib/404-redirect-overrides.mjs` 增加或修改一行：`'ghost-slug': 'canonical-published-slug'`
2. 确认 canonical 在 https://www.mmhow.com/sitemap.xml 中存在
3. 运行 `npm run redirects:404-map`
4. 提交并部署

## 与「正常新发」的区别

| | 404 幽灵 URL 修复 | 正常内容运营 |
|--|-------------------|--------------|
| 目标 | 蜘蛛已抓的无效 slug | 新选题、新关键词 |
| 动作 | 301 → 已有文章 | `POST /api/agent/articles` 新建 |
| slug | 固定为清单中的 ghost（仅作 source） | 新建可读 slug |

## 示例

| ghost_slug（404） | canonical_slug（已发布） |
|-------------------|--------------------------|
| `work-from-home-money-earning-virtual-triad` | `online-work-from-home-side-hustles-virtual-triad` |
| `earn-money-online-micro-offer-validation-ladder` | `ideas-of-side-hustles-student-platform-sprint` |

## 已废弃（勿用）

- `scripts/publish-404-batch-info-arbitrage.mjs` — 在 404 slug 上新建文章（已废止）
- `scripts/lib/batch-404-expanded/` — 同上，仅作历史草稿
- `docs/404-url-content-mapping.csv` — 原「补写 101 篇」方案，已废止

## 检查清单

- [x] 101 条映射写入 `404-redirect-overrides.mjs`
- [x] `npm run redirects:404-map` 生成 101 条 redirect
- [x] `AGENTS.md` / `content-editor-agent.md` 已更新
- [ ] 部署线上使 301 生效
- [ ] Google Search Console 观察 404 下降（部署后数周）
