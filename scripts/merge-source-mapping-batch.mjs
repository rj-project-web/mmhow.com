#!/usr/bin/env node
/** Merge newly published batch articles into docs/source-mapping.csv + xlsx */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CSV_PATH = join(ROOT, 'docs/source-mapping.csv')
const XLSX_PATH = join(ROOT, 'docs/source-mapping.xlsx')
const BASE = 'https://www.mmhow.com'

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

const NEW_ROWS = [
  ['自媒体与创作者经济', 'Self-Media & Content Creator Economy', '腾讯新闻', 'https://news.qq.com/rain/a/20251220A06I8B00', '从"流量焦虑"到"财富复利"：普通人做自媒体，到底该怎么赚钱？', `${BASE}/articles/four-pillars-profitable-creator-business`, 'From Traffic Anxiety to Wealth Compounding: 4 Pillars of a Profitable Creator Business', '15', '', '2026-06-07'],
  ['AI 智能副业', 'AI-Powered Side Hustles', '知乎', 'https://zhuanlan.zhihu.com/p/1986819573580838225', '早高峰的地铁里，我的 AI 已经帮我接了 2 个单', `${BASE}/articles/ai-client-intake-system-for-freelancers`, 'How I Built an AI System That Takes Client Orders While I Commute', '16', '', '2026-06-07'],
  ['社媒变现（小红书 & 抖音）', 'Social Media Monetization (RED & Douyin)', '腾讯新闻', 'https://news.qq.com/rain/a/20250508A09B7A00', '虽然"红猫"上线了，但小红书的赚钱逻辑还在继续打磨', `${BASE}/articles/xiaohongshu-buyer-commerce-small-creator-advantage`, 'Xiaohongshu Buyer Commerce: Why Smaller Creators Can Outearn Mega-Influencers', '17', '', '2026-06-07'],
  ['电商与一件代发', 'E-commerce & Dropshipping', '知乎', 'https://zhuanlan.zhihu.com/p/1911457243104261878', '15年电商人说点大实话：2025年想做一件代发，这30个货源网站和避坑指南收好不谢', `${BASE}/articles/1688-dropshipping-2025-supplier-guide`, '1688 Dropshipping in 2025: Supplier Sites and Traps Every Beginner Should Know', '18', '', '2026-06-07'],
  ['信息差与数字产品', 'Information Arbitrage & Digital Products', '人人都是产品经理', 'https://www.woshipm.com/ai/6296599.html', '一个普通人也能复制的 AI 数字生意：5 分钟生产、全球销售、可无限扩展', `${BASE}/articles/ai-digital-product-business-zero-inventory`, 'Building an AI Digital Product Business: Zero Inventory, Infinite Scale', '19', '', '2026-06-07'],
  ['自由职业与远程工作', 'Freelancing & Remote Work', '博客园', 'https://www.cnblogs.com/itech/p/20036295', 'AI 时代，我辞掉了大厂工作去做独立开发者——血泪换来的 7 条生存法则', `${BASE}/articles/seven-rules-quitting-big-tech-going-solo`, '7 Survival Rules I Learned Quitting Big Tech to Go Solo', '23', '', '2026-06-07'],
  ['居家办公与微创业', 'Work-from-Home & Micro-Business', '搜狐', 'https://www.sohu.com/a/940982924_122449176', '2025 普通人副业指南：8 个零门槛方向，在家也能高效创收', `${BASE}/articles/eight-zero-barrier-side-hustles-from-home-2025`, '8 Zero-Barrier Side Hustles You Can Run From Home in 2025', '20', '', '2026-06-07'],
  ['学生与新手副业', 'Side Hustles for Students & Beginners', '知乎', 'https://zhuanlan.zhihu.com/p/1936471029699540252', '大学生亲测靠谱兼职推荐！', `${BASE}/articles/three-student-side-hustles-build-skills-not-burn-time`, '3 Student Side Hustles That Build Skills Instead of Burning Time', '24', '', '2026-06-07'],
  ['投资与被动收入', 'Investment & Passive Income', '腾讯新闻', 'https://news.qq.com/rain/a/20251207A05SFI00', '财务自由最笨的方法：每月雷打不动3000块，买入"这两个"东西', `${BASE}/articles/boring-path-passive-income-index-funds-reits`, 'The "Boring" Path to Passive Income: Index Funds + REITs', '21', '', '2026-06-07'],
  ['知识变现与在线课程', 'Knowledge Monetization & Online Courses', '腾讯新闻', 'https://news.qq.com/rain/a/20250806A06W2Y00', '平台抛弃你时，连通知都没有！知识付费的下一站：把自己活成一家"一人公司"', `${BASE}/articles/knowledge-monetization-one-person-company-2025`, 'Knowledge Monetization in 2025: From Selling Courses to Running a One-Person Company', '22', '', '2026-06-07'],
]

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

const text = existsSync(CSV_PATH) ? readFileSync(CSV_PATH, 'utf8').replace(/^\uFEFF/, '') : ''
const lines = text.trim() ? text.trim().split(/\r?\n/) : []
const header = lines.length ? parseLine(lines[0]) : HEADERS
const existing = lines.slice(1).map((line) => {
  const cols = parseLine(line)
  const row = {}
  HEADERS.forEach((h) => {
    row[h] = cols[header.indexOf(h)] ?? cols[HEADERS.indexOf(h)] ?? ''
  })
  return row
})

const byId = new Map(existing.map((r) => [r['MMHow ID'], r]))
for (const vals of NEW_ROWS) {
  const row = Object.fromEntries(HEADERS.map((h, i) => [h, vals[i] ?? '']))
  byId.set(row['MMHow ID'], { ...byId.get(row['MMHow ID']), ...row })
}

const merged = [...byId.values()].sort((a, b) => Number(a['MMHow ID']) - Number(b['MMHow ID']))
const csv = [HEADERS.join(','), ...merged.map((r) => HEADERS.map((h) => esc(r[h])).join(','))].join('\n')
writeFileSync(CSV_PATH, `\uFEFF${csv}`, 'utf8')

const XLSX = await import('xlsx')
const sheet = XLSX.utils.json_to_sheet(merged, { header: HEADERS })
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, sheet, '源站-MMHow对照')
XLSX.writeFile(wb, XLSX_PATH)

console.log(`Merged ${merged.length} rows → ${CSV_PATH}`)
