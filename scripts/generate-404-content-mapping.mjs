#!/usr/bin/env node
/**
 * @deprecated 原用于为 404 URL 生成「新文」映射；已废止。
 * 404 修复请维护 scripts/lib/404-redirect-overrides.mjs 并运行 npm run redirects:404-map
 *
 * Generate topic/category/keyword mapping for 404 URLs (legacy).
 */

import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const URLS_PATH = path.join(ROOT, 'docs/unique-404-urls.txt')
const KEYWORDS_PATH = path.join(ROOT, 'docs/keyword-search-sheet.csv')
const OUTPUT_PATH = path.join(ROOT, 'docs/404-url-content-mapping.csv')

function parseCsvLine(line) {
  // Simple CSV parser; keyword-search-sheet has no quoted commas in first columns
  const parts = line.split(',')
  return {
    keyword: parts[0]?.trim(),
    chineseSearchQuery: parts[1]?.trim(),
    primaryCategory: parts[2]?.trim(),
    categorySlug: parts[3]?.trim(),
    status: parts[4]?.trim(),
    usedInArticles: parts[5]?.trim(),
    avgMonthlySearches: parts[6]?.trim(),
    competition: parts[7]?.trim(),
    zhihuSearch: parts[8]?.trim(),
    xhsSearch: parts[9]?.trim(),
  }
}

function slugifyTokens(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

function classifyUrl(slug) {
  const s = slug.toLowerCase()
  // E-commerce & Dropshipping
  if (/\b(1688|dropship|dropshipping|shopee|pdd|ecommerce|e-commerce|listing|supplier|margin|shop|store|arbitrage|sku|product|export)\b/.test(s)) {
    return {
      category: 'e-commerce--dropshipping',
      categoryName: 'E-commerce & Dropshipping',
      topics: ['e-commerce'],
    }
  }
  // AI-Powered Side Hustles
  if (/\b(ai|coze|agent|workflow|automation|gpt|llm|template|comic|fiction|writing|avatar)\b/.test(s)) {
    return {
      category: 'ai-powered-side-hustles',
      categoryName: 'AI-Powered Side Hustles',
      topics: ['ai-side-hustles'],
    }
  }
  // Social Media Monetization (RED & Douyin/TikTok)
  if (/\b(red|xiaohongshu|douyin|tiktok|social|media|content|creator|note|clip|posting|relay|matrix|promo|kols|buyer)\b/.test(s)) {
    return {
      category: 'social-media-monetization-red--douyin',
      categoryName: 'Social Media Monetization (RED & Douyin)',
      topics: ['social-media', 'content-creation'],
    }
  }
  // Freelancing & Remote Work
  if (/\b(freelance|freelancing|upwork|fiverr|escrow|gig|platform|milestone|remote|dev|developer|coding|coder)\b/.test(s)) {
    return {
      category: 'freelancing--remote-work',
      categoryName: 'Freelancing & Remote Work',
      topics: ['freelancing', 'work-from-home'],
    }
  }
  // Investment & Passive Income
  if (/\b(index|fund|funds|etf|sip|passive|income|yield|invest|quality|expense|allocation|shield|dca|roadmap)\b/.test(s)) {
    return {
      category: 'investment--passive-income',
      categoryName: 'Investment & Passive Income',
      topics: ['investing', 'passive-income'],
    }
  }
  // Knowledge Monetization & Online Courses
  if (/\b(course|courses|knowledge|community|funnel|opc|teach|coach|mentor|ladder|lite|packaging|bridge)\b/.test(s)) {
    return {
      category: 'knowledge-monetization--online-courses',
      categoryName: 'Knowledge Monetization & Online Courses',
      topics: ['online-courses', 'make-money-online'],
    }
  }
  // Side Hustles for Students & Beginners
  if (/\b(student|students|campus|beginner|beginners|no-?investment|capital|proof|caps|ways-to-start|start-earning)\b/.test(s)) {
    return {
      category: 'side-hustles-for-students--beginners',
      categoryName: 'Side Hustles for Students & Beginners',
      topics: ['student-income', 'side-hustles'],
    }
  }
  // Information Arbitrage & Digital Products
  if (/\b(virtual|info|information|digital|product|sku|template|factory|ebook|notion|toolkit|printable)\b/.test(s)) {
    return {
      category: 'information-arbitrage--digital-products',
      categoryName: 'Information Arbitrage & Digital Products',
      topics: ['digital-products', 'make-money-online'],
    }
  }
  // Work-from-Home & Micro-Business (default fallback for earn/make money/work from home)
  return {
    category: 'work-from-home--micro-business',
    categoryName: 'Work-from-Home & Micro-Business',
    topics: ['work-from-home', 'make-money-online', 'side-hustles'],
  }
}

function scoreKeyword(keyword, slug, topic) {
  const kwTokens = slugifyTokens(keyword.keyword)
  const slugTokens = slugifyTokens(slug)
  let score = 0
  for (const t of kwTokens) {
    if (t.length < 3) continue
    for (const s of slugTokens) {
      if (s.includes(t) || t.includes(s)) {
        score += 1
      }
    }
  }
  // Prefer keywords with the same primary category
  if (topic && topic.category && keyword.categorySlug === topic.category) {
    score += 2
  }
  return score
}

async function main() {
  const urlsText = await fs.readFile(URLS_PATH, 'utf-8')
  const urls = urlsText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((url) => {
      const slug = url.replace(/^https:\/\/www\.mmhow\.com\/articles\//, '')
      return { url, slug }
    })

  const keywordsText = await fs.readFile(KEYWORDS_PATH, 'utf-8')
  const keywords = keywordsText
    .split('\n')
    .slice(1)
    .filter(Boolean)
    .map(parseCsvLine)
    .filter((k) => k.keyword && k.keyword !== 'Keyword')

  const rows = []
  for (const { url, slug } of urls) {
    const topic = classifyUrl(slug)
    const scored = keywords
      .map((k) => ({ k, score: scoreKeyword(k, slug, topic) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)

    const primary = scored[0]?.k || keywords[0]
    const secondary = scored.slice(1, 4).map((x) => x.k.keyword)

    rows.push({
      url,
      slug,
      title_prefix: '',
      category_slug: topic.category,
      category_name: topic.categoryName,
      topic_slugs: topic.topics.join('|'),
      primary_keyword: primary.keyword,
      primary_keyword_status: primary.status,
      primary_keyword_competition: primary.competition,
      secondary_keywords: secondary.join('|'),
      chinese_search_query: primary.chineseSearchQuery || '',
    })
  }

  const header = [
    'url',
    'slug',
    'title_prefix',
    'category_slug',
    'category_name',
    'topic_slugs',
    'primary_keyword',
    'primary_keyword_status',
    'primary_keyword_competition',
    'secondary_keywords',
    'chinese_search_query',
  ]

  const csv = [
    header.join(','),
    ...rows.map((r) =>
      header
        .map((h) => {
          const v = String(r[h] || '').replace(/"/g, '""')
          return v.includes(',') ? `"${v}"` : v
        })
        .join(','),
    ),
  ].join('\n')

  await fs.writeFile(OUTPUT_PATH, csv, 'utf-8')
  console.log(`Wrote ${rows.length} rows to ${OUTPUT_PATH}`)
  console.log(`\nCategory distribution:`)
  const dist = {}
  for (const r of rows) {
    dist[r.category_name] = (dist[r.category_name] || 0) + 1
  }
  for (const [k, v] of Object.entries(dist).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
