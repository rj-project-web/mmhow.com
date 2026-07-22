#!/usr/bin/env node
/**
 * @deprecated 已废止。404 幽灵 URL 须 301 到已发布文章，禁止在 ghost slug 上新建内容。
 * @see docs/404-url-redirect-plan.md  — 使用 npm run redirects:404-map
 */
import { writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { BATCH_404_INFO_ARBITRAGE, wordCount } from './lib/batch-404-expanded.mjs'
import { assertUniqueImages, getImagesForSlug } from './lib/article-images.mjs'

const API_KEY = process.env.MMHOW_API_KEY
const BASE = process.env.MMHOW_API_BASE || 'https://www.mmhow.com'
const DRY_RUN = process.env.DRY_RUN !== 'false'
const STATUS = process.env.STATUS || 'draft'
const MIN_WORDS = 1200
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

async function publish(article) {
  const res = await fetch(`${BASE}/api/agent/articles`, {
    method: 'POST',
    headers: {
      Authorization: `users API-Key ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: article.title,
      slug: article.slug,
      description: article.description,
      descriptionFormat: 'markdown',
      excerpt: article.excerpt,
      keyTakeaways: article.keyTakeaways,
      category: article.category,
      topics: article.topics,
      sourceUrl: article.sourceUrl,
      sourceTitle: article.sourceTitle,
      sourcePlatform: article.sourcePlatform,
      ...getImagesForSlug(article.slug),
      status: STATUS,
    }),
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = { raw: text }
  }
  return { ok: res.ok, status: res.status, json }
}

const isMain = process.argv[1] && resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1])

if (isMain) {
  assertUniqueImages()
  const results = []

  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : `LIVE (${STATUS})`}`)
  console.log(`Articles: ${BATCH_404_INFO_ARBITRAGE.length}\n`)

  for (const article of BATCH_404_INFO_ARBITRAGE) {
    const words = wordCount(article.description)
    const preview = {
      slug: article.slug,
      title: article.title,
      category: article.category,
      topics: article.topics,
      words,
      excerpt: article.excerpt,
      keyTakeaways: article.keyTakeaways,
      sourceUrl: article.sourceUrl,
      url: `https://www.mmhow.com/articles/${article.slug}`,
    }

    if (words < MIN_WORDS) {
      console.log(`SKIP ${article.slug}: ${words}w (need ${MIN_WORDS}+)`)
      results.push({ ...preview, success: false, error: 'under min words' })
      continue
    }

    if (DRY_RUN) {
      console.log(`[dry-run] ${article.slug} (${words}w)`)
      console.log(`  title: ${article.title}`)
      console.log(`  excerpt: ${article.excerpt}`)
      console.log(`  takeaways: ${article.keyTakeaways.length}`)
      results.push({ ...preview, success: true, dryRun: true })
      continue
    }

    if (!API_KEY) {
      console.error('MMHOW_API_KEY required when DRY_RUN=false')
      process.exit(1)
    }

    process.stdout.write(`Publishing ${article.slug} (${words}w) as ${STATUS}… `)
    try {
      const { ok, status, json } = await publish(article)
      if (!ok) {
        console.log(`FAIL ${status}`, json.error || json)
        results.push({ ...preview, success: false, status, error: json })
        continue
      }
      console.log(`OK #${json.article?.id}`)
      results.push({
        ...preview,
        success: true,
        id: json.article?.id,
        adminUrl: json.article?.url,
      })
    } catch (err) {
      console.log(`ERROR ${err.message}`)
      results.push({ ...preview, success: false, error: err.message })
    }
  }

  const out = join(root, 'scripts/publish-404-batch-info-arbitrage-results.json')
  writeFileSync(out, JSON.stringify(results, null, 2))
  console.log(`\nWrote ${out}`)
}
