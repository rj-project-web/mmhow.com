import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

import type { Payload } from 'payload'

import type { Article } from '@/payload-types'
import { formatDateTime } from '@/lib/datetime'

export const SOURCE_MAPPING_HEADERS = [
  '分类',
  '分类（English）',
  '源平台',
  '原网址',
  '原标题',
  'MMHow 网址',
  'MMHow 标题',
  'MMHow ID',
  '内容指纹',
  '发布时间',
] as const

export type SourceMappingRow = Record<(typeof SOURCE_MAPPING_HEADERS)[number], string>

const CATEGORY_ZH: Record<string, string> = {
  'ai-powered-side-hustles': 'AI 智能副业',
  'e-commerce--dropshipping': '电商与一件代发',
  'freelancing--remote-work': '自由职业与远程工作',
  'information-arbitrage--digital-products': '信息差与数字产品',
  'investment--passive-income': '投资与被动收入',
  'knowledge-monetization--online-courses': '知识变现与在线课程',
  'self-media--content-creator-economy': '自媒体与创作者经济',
  'side-hustles-for-students--beginners': '学生与新手副业',
  'social-media-monetization-red--douyin': '社媒变现（小红书 & 抖音）',
  'work-from-home--micro-business': '居家办公与微创业',
}

function formatPublishDate(iso?: string | null): string {
  return formatDateTime(iso)
}

function mappingPaths() {
  const root = process.cwd()
  return {
    csv: join(root, 'docs/source-mapping.csv'),
    xlsx: join(root, 'docs/source-mapping.xlsx'),
  }
}

export function normalizeSourceUrl(url?: string | null): string {
  if (!url?.trim()) return ''
  try {
    const parsed = new URL(url.trim())
    parsed.hash = ''
    ;['utm_source', 'utm_medium', 'utm_campaign', 'spm', 'from'].forEach((key) => {
      parsed.searchParams.delete(key)
    })
    let pathname = parsed.pathname.replace(/\/+$/, '') || '/'
    return `${parsed.protocol}//${parsed.host.toLowerCase()}${pathname}${parsed.search}`
  } catch {
    return url.trim().toLowerCase()
  }
}

export function normalizeText(text?: string | null): string {
  if (!text?.trim()) return ''
  return text
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[#>*_`~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function contentFingerprint(text?: string | null): string {
  const plain = normalizeText(text)
  if (!plain) return ''
  const sample = plain.slice(0, 2000)
  let hash = 0
  for (let i = 0; i < sample.length; i++) {
    hash = ((hash << 5) - hash + sample.charCodeAt(i)) | 0
  }
  return `${sample.length}:${Math.abs(hash).toString(16)}`
}

export function detectSourcePlatform(url?: string | null): string {
  if (!url?.trim()) return ''
  try {
    const host = new URL(url).hostname.toLowerCase()
    if (host.includes('zhihu.com')) return '知乎'
    if (host.includes('xiaohongshu.com')) return '小红书'
    if (host.includes('sohu.com')) return '搜狐'
    if (host.includes('qq.com')) return '腾讯新闻'
    if (host.includes('baijiahao.baidu.com')) return '百家号'
    if (host.includes('cnblogs.com')) return '博客园'
    if (host.includes('axiaoxin.com')) return '爱小新博客'
    if (host.includes('python4office.cn')) return 'Python4Office'
    if (host.includes('woshipm.com')) return '人人都是产品经理'
    return host
  } catch {
    return ''
  }
}

export function buildArticleSourceFields(input: {
  sourceUrl?: string
  sourceTitle?: string
  sourcePlatform?: string
  description: string
}) {
  return {
    sourceUrl: input.sourceUrl?.trim() || '',
    sourceTitle: input.sourceTitle?.trim() || '',
    sourcePlatform: input.sourcePlatform?.trim() || detectSourcePlatform(input.sourceUrl),
    contentFingerprint: contentFingerprint(input.description),
  }
}

function articleToMappingRow(article: Article, serverUrl: string): SourceMappingRow {
  const category =
    article.category && typeof article.category === 'object' ? article.category : null
  const catSlug = category?.slug || ''
  const catEn = category?.name || ''

  return {
    分类: CATEGORY_ZH[catSlug] || catEn,
    '分类（English）': catEn,
    源平台: article.sourcePlatform || '',
    原网址: article.sourceUrl || '',
    原标题: article.sourceTitle || '',
    'MMHow 网址': `${serverUrl}/articles/${article.slug}`,
    'MMHow 标题': article.title,
    'MMHow ID': String(article.id),
    内容指纹: article.contentFingerprint || '',
    发布时间: formatPublishDate(article.publishedAt),
  }
}

export type DuplicateCheckInput = {
  sourceUrl?: string
  sourceTitle?: string
  description: string
  title?: string
  slug?: string
}

export type DuplicateCheckResult = {
  duplicate: boolean
  reason?: string
  existing?: Partial<SourceMappingRow>
}

function mappingFromArticle(article: Article): Partial<SourceMappingRow> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.mmhow.com'
  return {
    'MMHow ID': String(article.id),
    'MMHow 网址': `${serverUrl}/articles/${article.slug}`,
    'MMHow 标题': article.title,
    原网址: article.sourceUrl || '',
    原标题: article.sourceTitle || '',
    内容指纹: article.contentFingerprint || '',
  }
}

export async function findSourceDuplicate(
  payload: Payload,
  input: DuplicateCheckInput,
): Promise<DuplicateCheckResult> {
  const normalizedUrl = normalizeSourceUrl(input.sourceUrl)
  const fingerprint = contentFingerprint(input.description)
  const normalizedSourceTitle = normalizeText(input.sourceTitle)
  const normalizedTitle = normalizeText(input.title)

  const { docs } = await payload.find({
    collection: 'articles',
    limit: 500,
    depth: 0,
    where: { _status: { equals: 'published' } },
  })

  for (const article of docs) {
    if (input.slug && article.slug === input.slug) continue

    if (normalizedUrl && normalizeSourceUrl(article.sourceUrl) === normalizedUrl) {
      return {
        duplicate: true,
        reason: `Source URL already mapped to MMHow article #${article.id}`,
        existing: mappingFromArticle(article),
      }
    }

    if (
      fingerprint &&
      article.contentFingerprint &&
      article.contentFingerprint === fingerprint
    ) {
      return {
        duplicate: true,
        reason: `Article body matches existing article #${article.id} (content fingerprint)`,
        existing: mappingFromArticle(article),
      }
    }

    if (
      normalizedSourceTitle &&
      normalizeText(article.sourceTitle) === normalizedSourceTitle
    ) {
      return {
        duplicate: true,
        reason: `Source title already mapped to MMHow article #${article.id}`,
        existing: mappingFromArticle(article),
      }
    }

    const articleFingerprint = contentFingerprint(article.excerpt || article.title)
    if (fingerprint && articleFingerprint === fingerprint) {
      return {
        duplicate: true,
        reason: `Article body is too similar to published article #${article.id} (${article.slug})`,
        existing: mappingFromArticle(article),
      }
    }

    if (normalizedTitle && normalizeText(article.title) === normalizedTitle) {
      return {
        duplicate: true,
        reason: `MMHow title already used by article #${article.id}`,
        existing: mappingFromArticle(article),
      }
    }
  }

  return { duplicate: false }
}

/** @deprecated Legacy CSV read — use CMS Articles fields instead. */
function parseCsvLine(line: string): string[] {
  const cols: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }
    if (ch === ',' && !inQuotes) {
      cols.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  cols.push(cur)
  return cols
}

/** @deprecated Legacy CSV read — use CMS Articles fields instead. */
export function readSourceMappingRows(): SourceMappingRow[] {
  const { csv } = mappingPaths()
  if (!existsSync(csv)) return []

  const text = readFileSync(csv, 'utf8').replace(/^\uFEFF/, '')
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []

  const header = parseCsvLine(lines[0])
  return lines.slice(1).filter(Boolean).map((line) => {
    const cols = parseCsvLine(line)
    const row = {} as SourceMappingRow
    SOURCE_MAPPING_HEADERS.forEach((key, index) => {
      row[key] = cols[header.indexOf(key)] ?? cols[index] ?? ''
    })
    return row
  })
}

function escapeCsv(value: string): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

/** Export CMS articles to CSV/XLSX for backup only — not the source of truth. */
export async function exportSourceMappingFiles(payload: Payload) {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.mmhow.com'
  const { docs } = await payload.find({
    collection: 'articles',
    limit: 500,
    depth: 1,
    sort: 'id',
    where: { _status: { equals: 'published' } },
  })

  const rows = docs.map((article) => articleToMappingRow(article, serverUrl))
  const { csv, xlsx } = mappingPaths()

  const csvBody = [
    SOURCE_MAPPING_HEADERS.join(','),
    ...rows.map((row) => SOURCE_MAPPING_HEADERS.map((h) => escapeCsv(row[h] ?? '')).join(',')),
  ].join('\n')
  writeFileSync(csv, `\uFEFF${csvBody}`, 'utf8')

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const XLSX = require('xlsx') as typeof import('xlsx')
    const sheet = XLSX.utils.json_to_sheet(
      rows.map((row) => Object.fromEntries(SOURCE_MAPPING_HEADERS.map((h) => [h, row[h] ?? '']))),
      { header: [...SOURCE_MAPPING_HEADERS] },
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheet, '源站-MMHow对照')
    XLSX.writeFile(wb, xlsx)
  } catch {
    // CSV export is enough when xlsx is unavailable.
  }

  return rows.length
}
