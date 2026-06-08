# 源站对照表说明

## 数据源（唯一真相）

**Payload 管理后台 → Articles** 每篇文章侧栏：

- 源平台 (`sourcePlatform`)
- 原网址 (`sourceUrl`)
- 原标题 (`sourceTitle`)
- 内容指纹 (`contentFingerprint`，自动计算)

线上地址：https://www.mmhow.com/admin/collections/articles

## 本目录文件

| 文件 | 用途 |
|------|------|
| `source-mapping.csv` / `source-mapping.xlsx` | **备份导出**，勿手改 |
| `content-editor-agent.md` | 内容编辑 Agent 操作说明 |

### 导出备份（从 CMS → 文件）

```bash
npm run source-mapping:sync
```

### 一次性迁移（从旧 CSV → CMS）

```bash
npm run source-mapping:import
```

内容编辑 Agent 更新文章时**只改管理后台**，不要再提交 Excel 变更。
