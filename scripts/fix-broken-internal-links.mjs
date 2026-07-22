#!/usr/bin/env node
/**
 * Fix broken internal article links in Payload CMS.
 *
 * Reads docs/broken-internal-links.csv (source_slug,target_slug,anchor_text),
 * fetches each affected article via the Payload REST API, removes the hyperlink
 * around every broken target slug (keeps the anchor text), and PATCHes the
 * article back.
 *
 * Usage:
 *   DRY_RUN=false MMHOW_API_KEY=your-key node scripts/fix-broken-internal-links.mjs
 *
 * Default is dry-run: it will only report what it would change.
 */

import fs from 'node:fs/promises'

const BASE_URL = process.env.MMHOW_BASE_URL || 'https://www.mmhow.com'
const API_KEY = process.env.MMHOW_API_KEY
const DRY_RUN = process.env.DRY_RUN !== 'false'
const CSV_PATH = process.env.CSV_PATH || 'docs/broken-internal-links.csv'

if (!API_KEY) {
  console.error('Error: MMHOW_API_KEY is required.')
  console.error('Usage: DRY_RUN=false MMHOW_API_KEY=your-key node scripts/fix-broken-internal-links.mjs')
  process.exit(1)
}

const headers = {
  Authorization: `users API-Key ${API_KEY}`,
  'Content-Type': 'application/json',
}

async function fetchJson(url) {
  let res
  try {
    res = await fetch(url, { headers })
  } catch (err) {
    throw new Error(`GET network error: ${err.message}`)
  }
  if (!res.ok) throw new Error(`GET ${res.status} ${res.statusText}: ${url}`)
  return res.json()
}

async function patchJson(url, body) {
  const res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`PATCH ${res.status} ${res.statusText}: ${url}\n${text.slice(0, 500)}`)
  }
  return res.json()
}

function getNodeText(node) {
  if (!node || typeof node !== 'object') return ''
  if (node.type === 'text' && typeof node.text === 'string') return node.text
  if (Array.isArray(node.children)) return node.children.map(getNodeText).join('')
  return ''
}

function isBrokenLink(node, brokenSlugs) {
  if (node?.type !== 'link') return false
  const url = node.fields?.url
  if (typeof url !== 'string') return false
  const match = url.match(/^\/articles\/([a-zA-Z0-9_-]+)$/)
  if (!match) return false
  return brokenSlugs.has(match[1])
}

function stripBrokenLinks(node, brokenSlugs) {
  if (!node || typeof node !== 'object') return node

  if (isBrokenLink(node, brokenSlugs)) {
    // Replace the link node with its children (preserves text formatting).
    return node.children || []
  }

  if (Array.isArray(node.children)) {
    const newChildren = []
    for (const child of node.children) {
      const result = stripBrokenLinks(child, brokenSlugs)
      if (Array.isArray(result)) {
        newChildren.push(...result)
      } else if (result !== null && result !== undefined) {
        newChildren.push(result)
      }
    }
    node.children = newChildren
  }

  return node
}

function countBrokenLinks(node, brokenSlugs, count = { total: 0 }) {
  if (!node || typeof node !== 'object') return count
  if (isBrokenLink(node, brokenSlugs)) {
    count.total += 1
    return count
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) countBrokenLinks(child, brokenSlugs, count)
  }
  return count
}

async function main() {
  const csvText = await fs.readFile(CSV_PATH, 'utf-8')
  const lines = csvText.trim().split('\n')
  const header = lines.shift().split(',')
  const rows = lines.map((line) => {
    const parts = line.split(',')
    const row = {}
    header.forEach((col, i) => {
      row[col.trim()] = (parts[i] || '').trim()
    })
    return row
  })

  // Group by source slug and collect broken targets.
  const bySource = new Map()
  for (const row of rows) {
    const source = row.source_slug?.trim()
    const target = row.target_slug?.trim()
    if (!source || !target) continue
    if (!bySource.has(source)) bySource.set(source, new Set())
    bySource.get(source).add(target)
  }

  console.log(`Found ${rows.length} broken link occurrences across ${bySource.size} source articles.\n`)
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes will be made)' : 'LIVE (articles will be updated)'}`)
  console.log(`API:  ${BASE_URL}\n`)

  let updated = 0
  let skipped = 0
  let errors = 0
  let totalRemoved = 0

  for (const [sourceSlug, brokenSlugs] of bySource) {
    try {
      const query = new URLSearchParams({
        'where[slug][equals]': sourceSlug,
        limit: '1',
        depth: '0',
      })
      const list = await fetchJson(`${BASE_URL}/api/articles?${query}`)
      const doc = list.docs?.[0]
      if (!doc) {
        console.warn(`SKIP source not found: ${sourceSlug}`)
        skipped += 1
        continue
      }

      const root = doc.content?.root
      if (!root) {
        console.warn(`SKIP article has no content.root: ${sourceSlug}`)
        skipped += 1
        continue
      }

      const originalCount = countBrokenLinks(root, brokenSlugs).total
      if (originalCount === 0) {
        console.warn(`SKIP no broken links found in API content: ${sourceSlug}`)
        skipped += 1
        continue
      }

      const cleanedRoot = stripBrokenLinks(structuredClone(root), brokenSlugs)
      const afterCount = countBrokenLinks(cleanedRoot, brokenSlugs).total
      totalRemoved += originalCount - afterCount

      console.log(
        `${DRY_RUN ? '[dry-run]' : '[update]'} ${sourceSlug} (id=${doc.id}) — removed ${originalCount - afterCount} broken link(s)`,
      )

      if (!DRY_RUN) {
        await patchJson(`${BASE_URL}/api/articles/${doc.id}`, { content: { root: cleanedRoot } })
      }
      updated += 1
    } catch (err) {
      console.error(`ERROR ${sourceSlug}: ${err.message}`)
      errors += 1
    }
  }

  console.log(`\nDone. Articles checked: ${bySource.size}, updated: ${updated}, skipped: ${skipped}, errors: ${errors}`)
  console.log(`Broken links removed: ${totalRemoved}`)
  if (DRY_RUN) {
    console.log(`\nThis was a dry run. To apply changes, run with DRY_RUN=false.`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
