import { absoluteUrl, getSiteUrl } from '@/lib/site-url'

const ORG_DESCRIPTION =
  'MMHow publishes practical, no-hype guides on side hustles, online income, freelancing, e-commerce, and investing.'

export const ORGANIZATION_ID = `${getSiteUrl()}/#organization`
export const WEBSITE_ID = `${getSiteUrl()}/#website`

function organizationLogo() {
  return {
    '@type': 'ImageObject',
    url: absoluteUrl('/mmhow-logo.png'),
    width: 380,
    height: 141,
  }
}

/** Sitewide publisher entity, referenced by Article/WebSite via @id. */
export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'MMHow',
    url: getSiteUrl(),
    logo: organizationLogo(),
    description: ORG_DESCRIPTION,
  }
}

/** Sitewide website entity for sitelinks and entity understanding. */
export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'MMHow',
    url: getSiteUrl(),
    description: ORG_DESCRIPTION,
    inLanguage: 'en-US',
    publisher: { '@id': ORGANIZATION_ID },
  }
}

/** Compact publisher block for embedding inside Article JSON-LD. */
export function publisherJsonLd() {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'MMHow',
    url: getSiteUrl(),
    logo: organizationLogo(),
  }
}

export type BreadcrumbItem = { name: string; url: string }

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export type FaqEntry = { question: string; answer: string }

function lexicalNodeText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: unknown; children?: unknown }
  if (typeof n.text === 'string') return n.text
  if (Array.isArray(n.children)) return n.children.map(lexicalNodeText).join('')
  return ''
}

/**
 * Extracts FAQ pairs from Lexical rich text. Looks for any heading whose text
 * starts with "FAQ", then reads the following paragraphs (until the next
 * heading) as "Question? Answer" lines, splitting on the first question mark.
 */
export function extractFaqEntries(content: unknown): FaqEntry[] {
  const root =
    content && typeof content === 'object'
      ? (content as { root?: { children?: unknown } }).root
      : undefined
  const children = Array.isArray(root?.children) ? (root!.children as unknown[]) : []

  const entries: FaqEntry[] = []
  const seen = new Set<string>()

  for (let i = 0; i < children.length; i += 1) {
    const node = children[i] as { type?: string } | undefined
    if (node?.type !== 'heading') continue
    if (!/^\s*faq\b/i.test(lexicalNodeText(node))) continue

    for (let j = i + 1; j < children.length; j += 1) {
      const sib = children[j] as { type?: string } | undefined
      if (sib?.type === 'heading') break
      if (sib?.type !== 'paragraph') continue

      const text = lexicalNodeText(sib).replace(/\s+/g, ' ').trim()
      const qIdx = text.indexOf('?')
      if (qIdx <= 0 || qIdx >= text.length - 1) continue

      const question = text.slice(0, qIdx + 1).trim()
      const answer = text.slice(qIdx + 1).trim()
      const key = question.toLowerCase()
      if (!question || !answer || seen.has(key)) continue

      seen.add(key)
      entries.push({ question, answer })
    }
  }

  return entries
}

export function buildFaqJsonLd(entries: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  }
}
