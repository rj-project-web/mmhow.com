/**
 * @deprecated 已废止 — 404 幽灵 URL 使用 301 重定向，见 docs/404-url-redirect-plan.md
 *
 * Batch 404 — Information Arbitrage & Digital Products (pilot: 1 article).
 * Slug fixed to match broken internal link targets in docs/unique-404-urls.txt.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { CATEGORY_TOPIC_SLUGS } from './article-seo-excerpts.mjs'

const dir = dirname(fileURLToPath(import.meta.url))

function body(name) {
  return readFileSync(join(dir, 'batch-404-expanded', `${name}.md`), 'utf8').trim()
}

function topicsFor(category) {
  return CATEGORY_TOPIC_SLUGS[category] || ['side-hustles', 'make-money-online']
}

export function wordCount(text) {
  return text.replace(/[#*_\[\]()|>-]/g, ' ').split(/\s+/).filter(Boolean).length
}

export const BATCH_404_INFO_ARBITRAGE = [
  {
    title: 'Virtual Shop Triad at Home: Work From Home Money Earning Without Inventory',
    slug: 'work-from-home-money-earning-virtual-triad',
    category: 'information-arbitrage--digital-products',
    topics: topicsFor('information-arbitrage--digital-products'),
    excerpt:
      'Work from home money earning via a virtual shop triad—one SKU vault, three discovery lanes, and a 90-minute evening shift without warehouse inventory.',
    keyTakeaways: [
      'Run three virtual lanes—search, social notes, and owned checkout—from one digital SKU vault instead of three unrelated side projects.',
      'Prove Lane A for 30 days with auto-delivery and honest previews before opening social and private checkout pipes.',
      'Protect a fixed 90-minute evening clock-in; triad income compounds through attendance, not random midnight listing sprees.',
      'Kill underperforming listing tests weekly; never scale paid ads until net margin on the SKU is documented.',
      'Reinvest first profits into preview quality and delivery QA—not physical inventory or guru SKU copies.',
    ],
    sourceUrl: 'https://zhuanlan.zhihu.com/p/1931032090624886765',
    sourceTitle: '25年拒绝躺平！下班后深耕这2个副业，新手日入200+',
    sourcePlatform: '知乎',
    description: body('work-from-home-money-earning-virtual-triad'),
  },
]
