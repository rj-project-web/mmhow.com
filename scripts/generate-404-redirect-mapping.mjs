#!/usr/bin/env node
/**
 * Generate 404 ghost slug → canonical published slug mapping.
 *
 * Reads docs/unique-404-urls.txt, fetches published slugs from CMS API,
 * applies scripts/lib/404-redirect-overrides.mjs, then token-similarity fallback.
 *
 * Usage:
 *   npm run redirects:404-map
 *   node --env-file=.env scripts/generate-404-redirect-mapping.mjs
 *
 * Outputs:
 *   docs/404-url-redirect-mapping.csv
 *   scripts/404-redirects.generated.mjs  (imported by scripts/404-redirects.mjs)
 */

import fs from 'node:fs/promises'
import path from 'node:path'

import { REDIRECT_OVERRIDES } from './lib/404-redirect-overrides.mjs'

const ROOT = process.cwd()
const URLS_PATH = path.join(ROOT, 'docs/unique-404-urls.txt')
const CSV_PATH = path.join(ROOT, 'docs/404-url-redirect-mapping.csv')
const GENERATED_PATH = path.join(ROOT, 'scripts/404-redirects.generated.mjs')
const BASE = process.env.MMHOW_API_BASE || 'https://www.mmhow.com'
const API_KEY = process.env.MMHOW_API_KEY

const STOP_TOKENS = new Set([
  'the', 'and', 'for', 'from', 'with', 'that', 'this', 'your', 'into', 'over', 'under',
  'spine', 'gates', 'gate', 'ladder', 'loop', 'cell', 'map', 'sleeve', 'stack', 'blocks',
  'relay', 'scorecard', 'fences', 'lanes', 'caps', 'honest', 'lite', 'starter', 'operator',
  'ledger', 'core', 'shield', 'timing', 'factory', 'comparison', 'delivery', 'workflow',
  'workflows', 'filter', 'pyramid', 'trust', 'first', 'export', 'bridge', 'packaging',
  'attack', 'defend', 'domain', 'private', 'evening', 'service', 'steady', 'posting',
  'weighted', 'notes', 'bounded', 'scoped', 'assisted', 'routine', 'rails', 'matrix',
  'monetization', 'commerce', 'conversion', 'validation', 'allocation', 'expense',
  'quality', 'funds', 'fund', 'funds', 'sip', 'roadmap', 'dca', 'yield', 'not',
  'alliance', 'save', 'plays', 'listing', 'two', 'three', 'four', 'five', 'six',
  'seven', 'eight', 'gigs', 'fences', 'survival', 'playbook', 'arbitrage', 'info',
  'virtual', 'stores', 'store', 'skill', 'agent', 'layer', 'app', 'paths', 'path',
  'ideas', 'ways', 'profit', 'make', 'money', 'earn', 'earning', 'income', 'online',
  'home', 'work', 'from', 'wfh', 'side', 'hustle', 'hustles', 'passive', 'digital',
  'product', 'products', 'course', 'courses', 'knowledge', 'funnel', 'community',
  'paid', 'freelance', 'freelancing', 'platform', 'platforms', 'student', 'students',
  'campus', 'beginners', 'capital', 'proof', 'micro', 'offer', 'fiction', 'novel',
  'clip', 'promo', 'red', 'note', 'buyer', 'tiktok', 'shop', 'shopee', 'pdd',
  'dropship', 'dropshipping', '1688', 'ecommerce', 'commerce', 'compliance', 'margin',
  'supplier', 'blue', 'ocean', 'toolkit', 'selection', 'pool', 'additional',
  'operator', 'fiction', 'skills', 'labeling', 'writing', 'practice', 'proven',
  'methods', 'template', 'scarcity', 'triple', 'export', 'lane', 'social', 'media',
  'omnichannel', 'opc', 'creator', 'economy', 'pillars', 'content', 'batch', 'wfh',
  'remote', 'evening', 'caps', 'blocks', 'stack', 'triad', 'sleeve', 'map', 'spine',
  'gates', 'gate', 'cell', 'loop', 'ladder', 'fence', 'fences', 'scorecard', 'gigs',
  'coze', 'doing', 'multi', 'platform', 'income', 'ways', 'automation', 'bounded',
  'skill', 'store', 'without', 'heavy', 'lms', 'audience', 'waitlist', 'wave',
  'overseas', 'packaging', 'defend', 'attack', 'pyramid', 'trust', 'first', 'honest',
  'work', 'actually', 'index', 'sip', 'starter', 'operator', 'ledger', 'roadmap',
  'passive', 'hustles', 'yield', 'shield', 'timing', 'cash', 'honest', 'caps',
  'alliance', 'relay', 'save', 'profit', 'light', 'export', 'xiaohongshu', 'weighted',
  'shop', 'buyer', 'conversion', 'mine', 'dig', 'shovel', 'ecommerce', 'listing',
  'weight', 'novel', 'steady', 'posting', 'schedule', 'time', 'lanes', 'comparison',
  'upwork', 'fiverr', 'coding', 'human', 'coupling', 'escrow', 'scope', 'dev',
  'assisted', 'survival', 'milestone', 'fences', 'gigs', 'platform', 'to', 'do',
  'ways', 'make', 'freelancing', 'virtual', 'ways', 'three', 'sleeve', 'info',
  'arbitrage', 'sku', 'short', 'ai', 'comic', 'lane', 'without', 'investment',
])

function tokens(slug) {
  return slug
    .split('-')
    .filter((t) => t.length > 2 && !STOP_TOKENS.has(t))
}

function scoreMatch(ghost, published) {
  const g = tokens(ghost)
  const p = tokens(published)
  if (!g.length || !p.length) return 0

  const gSet = new Set(g)
  const pSet = new Set(p)
  let inter = 0
  for (const t of gSet) if (pSet.has(t)) inter += 1
  const union = new Set([...gSet, ...pSet]).size
  let score = inter / union

  // Ordered prefix bonus (first 3 meaningful tokens)
  const prefixLen = Math.min(3, g.length, p.length)
  for (let i = 0; i < prefixLen; i++) {
    if (g[i] === p[i]) score += 0.08
  }

  // Published slug is subset of ghost tokens in order
  let pi = 0
  for (const gt of g) {
    if (gt === p[pi]) pi += 1
  }
  if (pi >= Math.min(4, p.length)) score += 0.15

  // Length similarity
  const lenRatio = Math.min(g.length, p.length) / Math.max(g.length, p.length)
  score += lenRatio * 0.05

  return score
}

async function fetchPublishedSlugs() {
  const res = await fetch(`${BASE}/sitemap.xml`)
  if (!res.ok) throw new Error(`sitemap ${res.status}`)
  const xml = await res.text()
  const slugs = [...xml.matchAll(/<loc>https:\/\/www\.mmhow\.com\/articles\/([^<]+)<\/loc>/g)].map((m) => m[1])
  return [...new Set(slugs)]
}

async function main() {
  const urlsText = await fs.readFile(URLS_PATH, 'utf-8')
  const ghostSlugs = urlsText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((url) => url.replace(/^https:\/\/www\.mmhow\.com\/articles\//, ''))

  console.log(`Ghost 404 slugs: ${ghostSlugs.length}`)
  const published = await fetchPublishedSlugs()
  const publishedSet = new Set(published)
  console.log(`Published slugs: ${published.length}`)

  const rows = []
  const missingTargets = []
  const lowConfidence = []

  for (const ghost of ghostSlugs) {
    let canonical = REDIRECT_OVERRIDES[ghost]
    let method = 'override'
    let confidence = 1

    if (!canonical) {
      // If ghost accidentally matches a live slug, skip redirect
      if (publishedSet.has(ghost)) {
        rows.push({ ghost, canonical: ghost, method: 'already-live', confidence: 1 })
        continue
      }

      const scored = published
        .filter((p) => p !== ghost)
        .map((p) => ({ slug: p, score: scoreMatch(ghost, p) }))
        .sort((a, b) => b.score - a.score)

      const best = scored[0]
      canonical = best?.slug || ''
      method = 'auto'
      confidence = best?.score ?? 0
      if (confidence < 0.12) lowConfidence.push({ ghost, canonical, confidence })
    }

    if (!canonical) {
      missingTargets.push(ghost)
      continue
    }

    if (!publishedSet.has(canonical)) {
      missingTargets.push(`${ghost} → ${canonical} (target missing)`)
      continue
    }

    if (ghost === canonical) {
      rows.push({ ghost, canonical, method: 'identity-skip', confidence })
      continue
    }

    rows.push({ ghost, canonical, method, confidence: confidence.toFixed(3) })
  }

  const csvHeader = 'ghost_slug,canonical_slug,method,confidence'
  const csv = [
    csvHeader,
    ...rows
      .filter((r) => r.method !== 'identity-skip' && r.method !== 'already-live')
      .map((r) => `${r.ghost},${r.canonical},${r.method},${r.confidence}`),
  ].join('\n')

  await fs.writeFile(CSV_PATH, csv, 'utf-8')

  const redirects = rows
    .filter((r) => r.method !== 'identity-skip' && r.method !== 'already-live' && r.ghost !== r.canonical)
    .map((r) => ({
      source: `/articles/${r.ghost}`,
      destination: `/articles/${r.canonical}`,
      permanent: true,
    }))

  const generated = `/** Auto-generated by scripts/generate-404-redirect-mapping.mjs — do not edit by hand */\nexport const GHOST_404_REDIRECTS = ${JSON.stringify(redirects, null, 2)}\n`
  await fs.writeFile(GENERATED_PATH, generated, 'utf-8')

  console.log(`\nWrote ${rows.filter((r) => r.method !== 'identity-skip' && r.method !== 'already-live').length} redirects → ${CSV_PATH}`)
  console.log(`Generated ${GENERATED_PATH}`)

  if (missingTargets.length) {
    console.warn(`\n⚠ Missing/invalid targets (${missingTargets.length}):`)
    for (const m of missingTargets) console.warn(`  - ${m}`)
  }
  if (lowConfidence.length) {
    console.warn(`\n⚠ Low-confidence auto matches (${lowConfidence.length}) — add to 404-redirect-overrides.mjs:`)
    for (const l of lowConfidence.slice(0, 20)) {
      console.warn(`  ${l.ghost} → ${l.canonical} (${l.confidence.toFixed(3)})`)
    }
    if (lowConfidence.length > 20) console.warn(`  ... and ${lowConfidence.length - 20} more`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
