import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

import type { Payload } from 'payload'

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
  if (!iso?.trim()) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso.trim()
  return d.toISOString().slice(0, 10)
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

function escapeCsv(value: string): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

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

export function writeSourceMappingRows(rows: SourceMappingRow[]) {
  const { csv, xlsx } = mappingPaths()
  const sorted = [...rows].sort((a, b) => Number(a['MMHow ID'] || 0) - Number(b['MMHow ID'] || 0))
  const csvBody = [
    SOURCE_MAPPING_HEADERS.join(','),
    ...sorted.map((row) => SOURCE_MAPPING_HEADERS.map((h) => escapeCsv(row[h] ?? '')).join(',')),
  ].join('\n')
  writeFileSync(csv, `\uFEFF${csvBody}`, 'utf8')

  try {
    // Optional runtime dependency for xlsx sync.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const XLSX = require('xlsx') as typeof import('xlsx')
    const sheet = XLSX.utils.json_to_sheet(
      sorted.map((row) => Object.fromEntries(SOURCE_MAPPING_HEADERS.map((h) => [h, row[h] ?? '']))),
      { header: [...SOURCE_MAPPING_HEADERS] },
    )
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheet, '源站-MMHow对照')
    XLSX.writeFile(wb, xlsx)
  } catch {
    // CSV remains source of truth when xlsx package is unavailable.
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

export async function findSourceDuplicate(
  payload: Payload,
  input: DuplicateCheckInput,
): Promise<DuplicateCheckResult> {
  const rows = readSourceMappingRows()
  const normalizedUrl = normalizeSourceUrl(input.sourceUrl)
  const fingerprint = contentFingerprint(input.description)
  const normalizedSourceTitle = normalizeText(input.sourceTitle)
  const normalizedTitle = normalizeText(input.title)

  const sameSlug = (row: SourceMappingRow) =>
    Boolean(input.slug && row['MMHow 网址'].endsWith(`/articles/${input.slug}`))

  if (normalizedUrl) {
    const hit = rows.find(
      (row) => normalizeSourceUrl(row['原网址']) === normalizedUrl && !sameSlug(row),
    )
    if (hit) {
      return {
        duplicate: true,
        reason: `Source URL already mapped to MMHow article #${hit['MMHow ID']}`,
        existing: hit,
      }
    }
  }

  if (fingerprint) {
    const hit = rows.find(
      (row) => row['内容指纹'] && row['内容指纹'] === fingerprint && !sameSlug(row),
    )
    if (hit) {
      return {
        duplicate: true,
        reason: `Article body matches existing mapping #${hit['MMHow ID']} (content fingerprint)`,
        existing: hit,
      }
    }
  }

  if (normalizedSourceTitle) {
    const hit = rows.find(
      (row) => normalizeText(row['原标题']) === normalizedSourceTitle && !sameSlug(row),
    )
    if (hit) {
      return {
        duplicate: true,
        reason: `Source title already mapped to MMHow article #${hit['MMHow ID']}`,
        existing: hit,
      }
    }
  }

  const { docs } = await payload.find({
    collection: 'articles',
    limit: 200,
    depth: 0,
    where: { _status: { equals: 'published' } },
  })

  for (const article of docs) {
    if (input.slug && article.slug === input.slug) continue
    const articleFingerprint = contentFingerprint(article.excerpt || article.title)
    if (fingerprint && articleFingerprint === fingerprint) {
      return {
        duplicate: true,
        reason: `Article body is too similar to published article #${article.id} (${article.slug})`,
        existing: {
          'MMHow ID': String(article.id),
          'MMHow 网址': `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.mmhow.com'}/articles/${article.slug}`,
          'MMHow 标题': article.title,
        },
      }
    }
    if (normalizedTitle && normalizeText(article.title) === normalizedTitle) {
      return {
        duplicate: true,
        reason: `MMHow title already used by article #${article.id}`,
        existing: {
          'MMHow ID': String(article.id),
          'MMHow 网址': `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.mmhow.com'}/articles/${article.slug}`,
          'MMHow 标题': article.title,
        },
      }
    }
  }

  return { duplicate: false }
}

export function appendSourceMappingRow(input: {
  articleId: number | string
  title: string
  slug: string
  categorySlug?: string
  categoryName?: string
  sourceUrl?: string
  sourceTitle?: string
  sourcePlatform?: string
  description: string
  publishedAt?: string
}) {
  const rows = readSourceMappingRows()
  const id = String(input.articleId)
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.mmhow.com'
  const mmhowUrl = `${serverUrl}/articles/${input.slug}`
  const categoryEn = input.categoryName || ''
  const categoryZh = (input.categorySlug && CATEGORY_ZH[input.categorySlug]) || categoryEn

  const nextRow: SourceMappingRow = {
    分类: categoryZh,
    '分类（English）': categoryEn,
    源平台: input.sourcePlatform || detectSourcePlatform(input.sourceUrl),
    原网址: input.sourceUrl?.trim() || '',
    原标题: input.sourceTitle?.trim() || '',
    'MMHow 网址': mmhowUrl,
    'MMHow 标题': input.title,
    'MMHow ID': id,
    内容指纹: contentFingerprint(input.description),
    发布时间: formatPublishDate(input.publishedAt),
  }

  const index = rows.findIndex((row) => row['MMHow ID'] === id || row['MMHow 网址'] === mmhowUrl)
  if (index >= 0) {
    rows[index] = { ...rows[index], ...nextRow }
  } else {
    rows.push(nextRow)
  }

  writeSourceMappingRows(rows)
  return nextRow
}
