/**
 * Work-from-Home & Micro-Business — 3 canonical articles for 404 ghost URL redirects.
 * Ghost slugs redirect here via 404-redirect-overrides.mjs (not published on ghost slugs).
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { CATEGORY_TOPIC_SLUGS } from './article-seo-excerpts.mjs'

const dir = dirname(fileURLToPath(import.meta.url))

function body(name) {
  return readFileSync(join(dir, 'batch-wfh-404-canonical', name), 'utf8').trim()
}

function topicsFor(category) {
  return CATEGORY_TOPIC_SLUGS[category] || ['work-from-home', 'side-hustles']
}

export function wordCount(text) {
  return text.replace(/[#*_\[\]()|>-]/g, ' ').split(/\s+/).filter(Boolean).length
}

export const BATCH_WFH_404_CANONICAL = [
  {
    title: 'Evening Service Blocks: Good Side Hustles to Make Money From Home',
    slug: 'evening-service-blocks-good-side-hustles-from-home',
    category: 'work-from-home--micro-business',
    topics: topicsFor('work-from-home--micro-business'),
    excerpt:
      'Good side hustles to make money from home use evening service blocks—four 90-minute shifts with one deliverable each, hard clock-out, and Sunday kill logs.',
    keyTakeaways: [
      'Run four named 90-minute evening service blocks weekly instead of open-ended “work on the shop” sessions.',
      'Pick one lane—virtual shop support, micro intake, or content relay—for sixty days before adding another.',
      'Each block must ship one deliverable: listing QA, scoped quote, support queue clear, or metrics row.',
      'Post your shift on a shared family calendar and enforce a hard clock-out to prevent burnout.',
      'Use Sunday ops blocks to kill underperforming SKUs or offers that fail two consecutive weeks.',
    ],
    sourceUrl: 'https://zhuanlan.zhihu.com/p/1940711383219050347',
    sourceTitle: '下班后深耕这7个副业，一天3位数，在家就能做（附加详细教程）',
    sourcePlatform: '知乎',
    description: body('01-evening-service-blocks.md'),
    ghostRedirectFrom: 'eight-wfh-hustles-evening-service-blocks',
  },
  {
    title: 'WFH Evening Hustle Stack: Good Side Hustles That Compound From Home',
    slug: 'wfh-evening-hustle-stack-from-home',
    category: 'work-from-home--micro-business',
    topics: topicsFor('work-from-home--micro-business'),
    excerpt:
      'Good side hustles to make money from home compound with an evening hustle stack—earn, asset, and ops lanes on one calendar, not nightly random gigs.',
    keyTakeaways: [
      'Rotate three lanes—earn, asset, and ops—on a fixed weekly calendar behind one primary offer spine.',
      'Earn nights produce checkout signals; asset nights build listings or FAQs; ops nights log refunds and kills.',
      'Never run earn lane every night without asset and ops lanes or conversion and support will collapse.',
      'Keep one virtual SKU or micro-service spine for sixty days before stacking a second product.',
      'Label each 90-minute session with its lane so family sees bounded work, not endless availability.',
    ],
    sourceUrl: 'https://zhuanlan.zhihu.com/p/2045905272711771942',
    sourceTitle: '说点大实话：2026普通人搞什么兼职副业能真正赚到钱？（亲测30+副业后的总结）',
    sourcePlatform: '知乎',
    description: body('02-evening-hustle-stack.md'),
    ghostRedirectFrom: 'eight-wfh-hustles-evening-stack',
  },
  {
    title: 'Evening Money Blocks: Work From Home Money Earning With Clear Caps',
    slug: 'work-from-home-evening-money-blocks-guide',
    category: 'work-from-home--micro-business',
    topics: topicsFor('work-from-home--micro-business'),
    excerpt:
      'Work from home money earning needs evening money blocks with time, scope, spend, and support caps—plus weekly logs, not unlimited hustle from the couch.',
    keyTakeaways: [
      'Cap evening minutes, active SKUs, ad spend, and open support threads before scaling home income.',
      'Map Mon/Fri revenue and support nights plus Wed asset nights; keep Tue/Thu as rest or light metrics.',
      'Log one spreadsheet row per block: minutes, revenue signal, and any cap breach.',
      'Raise ad spend caps only after two weeks of documented net margin on the same SKU.',
      'Post the block schedule visibly at home so side income does not erode day-job performance.',
    ],
    sourceUrl: 'https://zhuanlan.zhihu.com/p/1932070292978644686',
    sourceTitle: '被割怕了？这俩副业救我狗命！下班3小时，月入6000+真不难（附保姆级攻略）',
    sourcePlatform: '知乎',
    description: body('03-evening-money-blocks.md'),
    ghostRedirectFrom: 'work-from-home-money-earning-evening-blocks',
  },
]
