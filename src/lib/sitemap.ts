import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'

import config from '../payload.config'

export type SitemapEntry = {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export type SitemapGenerateResult = {
  sitemapPath: string
  robotsPath: string
  urlCount: number
  articleCount: number
}

function projectRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toLastmod(value?: string | null) {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString().split('T')[0]
}

function buildSitemapXml(entries: SitemapEntry[]) {
  const urls = entries
    .map((entry) => {
      const lines = [`    <loc>${escapeXml(entry.loc)}</loc>`]
      if (entry.lastmod) lines.push(`    <lastmod>${entry.lastmod}</lastmod>`)
      if (entry.changefreq) lines.push(`    <changefreq>${entry.changefreq}</changefreq>`)
      if (entry.priority != null) lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`)
      return `  <url>\n${lines.join('\n')}\n  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

async function fetchAllPublishedArticles(payload: Awaited<ReturnType<typeof getPayload>>) {
  const articles: Array<{ slug: string; updatedAt?: string | null; publishedAt?: string | null }> = []
  let page = 1
  let hasNextPage = true

  while (hasNextPage) {
    const result = await payload.find({
      collection: 'articles',
      limit: 100,
      page,
      sort: '-updatedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    articles.push(
      ...result.docs.map((doc) => ({
        slug: doc.slug,
        updatedAt: doc.updatedAt,
        publishedAt: doc.publishedAt,
      })),
    )

    hasNextPage = result.hasNextPage
    page += 1
  }

  return articles
}

export async function fetchPublishedArticleSlugs(): Promise<string[]> {
  const payload = await getPayload({ config })
  const articles = await fetchAllPublishedArticles(payload)
  return articles.map((a) => a.slug).sort()
}

export function parseArticleSlugsFromSitemap(sitemapPath: string): string[] {
  if (!existsSync(sitemapPath)) return []

  const xml = readFileSync(sitemapPath, 'utf8')
  const slugs: string[] = []
  const locPattern = /<loc>([^<]+)<\/loc>/g

  for (const match of xml.matchAll(locPattern)) {
    const loc = match[1]
    const articleMatch = loc.match(/\/articles\/([^/?#]+)\/?$/)
    if (articleMatch) slugs.push(decodeURIComponent(articleMatch[1]))
  }

  return slugs.sort()
}

export function articleSlugsChanged(cmsSlugs: string[], sitemapSlugs: string[]): boolean {
  if (cmsSlugs.length !== sitemapSlugs.length) return true
  return cmsSlugs.some((slug, index) => slug !== sitemapSlugs[index])
}

export async function generateSitemap(): Promise<SitemapGenerateResult> {
  const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.mmhow.com').replace(/\/$/, '')
  const payload = await getPayload({ config })
  const entries: SitemapEntry[] = [
    { loc: `${baseUrl}/`, changefreq: 'daily', priority: 1 },
    { loc: `${baseUrl}/categories`, changefreq: 'weekly', priority: 0.8 },
    { loc: `${baseUrl}/about`, changefreq: 'monthly', priority: 0.5 },
    { loc: `${baseUrl}/terms`, changefreq: 'yearly', priority: 0.3 },
    { loc: `${baseUrl}/privacy`, changefreq: 'yearly', priority: 0.3 },
  ]

  const [{ docs: categories }, { docs: topics }, articles] = await Promise.all([
    payload.find({ collection: 'categories', limit: 500, pagination: false, sort: 'name' }),
    payload.find({ collection: 'topics', limit: 500, pagination: false, sort: 'name' }),
    fetchAllPublishedArticles(payload),
  ])

  for (const category of categories) {
    entries.push({
      loc: `${baseUrl}/category/${category.slug}`,
      changefreq: 'weekly',
      priority: 0.7,
    })
  }

  for (const topic of topics) {
    entries.push({
      loc: `${baseUrl}/topic/${topic.slug}`,
      changefreq: 'weekly',
      priority: 0.6,
    })
  }

  for (const article of articles) {
    entries.push({
      loc: `${baseUrl}/articles/${article.slug}`,
      lastmod: toLastmod(article.updatedAt || article.publishedAt),
      changefreq: 'monthly',
      priority: 0.9,
    })
  }

  const rootDir = projectRoot()
  const sitemapPath = path.join(rootDir, 'public/sitemap.xml')
  const robotsPath = path.join(rootDir, 'public/robots.txt')

  writeFileSync(sitemapPath, buildSitemapXml(entries), 'utf8')
  writeFileSync(robotsPath, `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`, 'utf8')

  return {
    sitemapPath,
    robotsPath,
    urlCount: entries.length,
    articleCount: articles.length,
  }
}

export async function checkAndUpdateSitemap(): Promise<{
  updated: boolean
  cmsArticleCount: number
  sitemapArticleCount: number
  result?: SitemapGenerateResult
}> {
  const sitemapPath = path.join(projectRoot(), 'public/sitemap.xml')
  const cmsSlugs = await fetchPublishedArticleSlugs()
  const sitemapSlugs = parseArticleSlugsFromSitemap(sitemapPath)

  if (!articleSlugsChanged(cmsSlugs, sitemapSlugs)) {
    return {
      updated: false,
      cmsArticleCount: cmsSlugs.length,
      sitemapArticleCount: sitemapSlugs.length,
    }
  }

  const result = await generateSitemap()
  return {
    updated: true,
    cmsArticleCount: cmsSlugs.length,
    sitemapArticleCount: sitemapSlugs.length,
    result,
  }
}
