#!/usr/bin/env node
/**
 * Publish Work-from-Home & Micro-Business canonical trio (404 redirect targets).
 * Usage: NODE_TLS_REJECT_UNAUTHORIZED=0 node --env-file=.env scripts/publish-wfh-404-canonical.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { BATCH_WFH_404_CANONICAL, wordCount } from './lib/batch-wfh-404-canonical.mjs'
import { assertUniqueImages, getImagesForSlug } from './lib/article-images.mjs'

const API_KEY = process.env.MMHOW_API_KEY
const BASE = process.env.MMHOW_API_BASE || 'https://www.mmhow.com'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const MIN_WORDS = 1200

if (!API_KEY) {
  console.error('MMHOW_API_KEY required in .env')
  process.exit(1)
}

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
      status: 'published',
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

  for (const article of BATCH_WFH_404_CANONICAL) {
    const words = wordCount(article.description)
    if (words < MIN_WORDS) {
      console.log(`SKIP ${article.slug}: ${words}w (need ${MIN_WORDS}+)`)
      results.push({ slug: article.slug, success: false, words, error: 'under min words' })
      continue
    }

    process.stdout.write(`Publishing ${article.slug} (${words}w)… `)
    try {
      const { ok, status, json } = await publish(article)
      if (!ok) {
        console.log(`FAIL ${status}`, json.error || json)
        results.push({ slug: article.slug, success: false, status, error: json, words })
        continue
      }
      const url = `https://www.mmhow.com/articles/${article.slug}`
      console.log(`OK #${json.article?.id} ${url}`)
      results.push({
        slug: article.slug,
        ghostRedirectFrom: article.ghostRedirectFrom,
        success: true,
        id: json.article?.id,
        url,
        words,
      })
    } catch (err) {
      console.log(`ERROR ${err.message}`)
      results.push({ slug: article.slug, success: false, error: err.message })
    }
  }

  const out = join(root, 'scripts/publish-wfh-404-canonical-results.json')
  writeFileSync(out, JSON.stringify(results, null, 2))
  console.log(`\nWrote ${out}`)
}
