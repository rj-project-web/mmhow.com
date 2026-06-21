import type { Metadata } from 'next'

import { absoluteUrl, getSiteUrl } from '@/lib/site-url'
import { getMediaUrl } from '@/lib/payload'
import { publisherJsonLd } from '@/lib/seo/structured-data'

type ArticleSeoInput = {
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  featuredImageUrl?: string | null
  categoryName?: string | null
}

export function buildArticleMetadata(article: ArticleSeoInput): Metadata {
  const url = absoluteUrl(`/articles/${article.slug}`)
  const description = article.excerpt?.trim() || undefined
  const image = article.featuredImageUrl ? absoluteUrl(article.featuredImageUrl) : undefined

  return {
    title: article.title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title: article.title,
      description,
      siteName: 'MMHow',
      locale: 'en_US',
      ...(image
        ? {
            images: [
              {
                url: image,
                width: 1200,
                height: 630,
                alt: article.title,
              },
            ],
          }
        : {}),
      ...(article.publishedAt ? { publishedTime: article.publishedAt } : {}),
      ...(article.updatedAt ? { modifiedTime: article.updatedAt } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: article.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

export function buildArticleJsonLd(article: ArticleSeoInput) {
  const url = absoluteUrl(`/articles/${article.slug}`)
  const image = article.featuredImageUrl ? absoluteUrl(article.featuredImageUrl) : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || undefined,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(image ? { image: [image] } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    author: {
      '@type': 'Organization',
      name: 'MMHow',
      url: getSiteUrl(),
    },
    publisher: publisherJsonLd(),
    ...(article.categoryName
      ? {
          articleSection: article.categoryName,
        }
      : {}),
  }
}

export function featuredImageAlt(title: string, categoryName?: string | null) {
  const base = title.replace(/\s+/g, ' ').trim()
  if (categoryName) return `${base} — ${categoryName} guide cover`
  return `${base} — cover image`
}

export function resolveFeaturedImageUrl(
  featuredImage: unknown,
): string | null {
  if (!featuredImage || typeof featuredImage !== 'object') return null
  const url = 'url' in featuredImage ? (featuredImage as { url?: string | null }).url : null
  return getMediaUrl(url)
}
