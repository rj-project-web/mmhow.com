#!/usr/bin/env node
/**
 * Sync docs/source-mapping.csv with all published CMS articles.
 * Preserves existing source URL/title/platform; fills blanks for new articles.
 *
 * Usage: NODE_TLS_REJECT_UNAUTHORIZED=0 node --env-file=.env scripts/sync-source-mapping.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CSV_PATH = join(ROOT, 'docs/source-mapping.csv')
const XLSX_PATH = join(ROOT, 'docs/source-mapping.xlsx')

const HEADERS = [
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
]

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? String(iso) : d.toISOString().slice(0, 10)
}

const ZH = {
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

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, '').trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const header = parseLine(lines[0])
  return lines.slice(1).map((line) => {
    const cols = parseLine(line)
    const row = {}
    HEADERS.forEach((h) => {
      row[h] = cols[header.indexOf(h)] ?? ''
    })
    return row
  })
}

function parseLine(line) {
  const cols = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"'
        i++
      } else inQ = !inQ
      continue
    }
    if (ch === ',' && !inQ) {
      cols.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  cols.push(cur)
  return cols
}

function esc(v) {
  return `"${String(v ?? '').replace(/"/g, '""')}"`
}

const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.mmhow.com'
const res = await fetch(`${base}/api/articles?limit=200&depth=1&where[_status][equals]=published&sort=id`)
const { docs } = await res.json()

const existing = existsSync(CSV_PATH)
  ? parseCsv(readFileSync(CSV_PATH, 'utf8'))
  : []
const bySlug = new Map(existing.map((row) => [row['MMHow 网址'].split('/articles/')[1], row]))

const rows = docs.map((article) => {
  const cat = article.category
  const catSlug = typeof cat === 'object' && cat ? cat.slug : ''
  const catEn = typeof cat === 'object' && cat ? cat.name : ''
  const slug = article.slug
  const mmhowUrl = `${base}/articles/${slug}`
  const prev = bySlug.get(slug) || {}
  return {
    分类: prev['分类'] || ZH[catSlug] || catEn,
    '分类（English）': prev['分类（English）'] || catEn,
    源平台: prev['源平台'] || '',
    原网址: prev['原网址'] || '',
    原标题: prev['原标题'] || '',
    'MMHow 网址': mmhowUrl,
    'MMHow 标题': article.title,
    'MMHow ID': String(article.id),
    内容指纹: prev['内容指纹'] || '',
    发布时间: prev['发布时间'] || formatDate(article.publishedAt),
  }
})

const csv = [HEADERS.join(','), ...rows.map((r) => HEADERS.map((h) => esc(r[h])).join(','))].join('\n')
writeFileSync(CSV_PATH, `\uFEFF${csv}`, 'utf8')

try {
  const XLSX = await import('xlsx')
  const sheet = XLSX.utils.json_to_sheet(rows, { header: HEADERS })
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, sheet, '源站-MMHow对照')
  XLSX.writeFile(wb, XLSX_PATH)
} catch {
  console.warn('xlsx not installed; wrote CSV only. Run: npm install -D xlsx')
}

console.log(`Synced ${rows.length} articles → ${CSV_PATH}`)
