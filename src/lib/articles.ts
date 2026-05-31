import type { Payload } from 'payload'

export type ArticleSummary = {
  id: string | number
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  categoryName?: string | null
  imageUrl?: string | null
}

export function toArticleSummary(article: {
  id: string | number
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  category?: unknown
  featuredImage?: unknown
}): ArticleSummary {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    publishedAt: article.publishedAt,
    categoryName:
      article.category && typeof article.category === 'object' && 'name' in article.category
        ? (article.category.name as string)
        : null,
    imageUrl:
      article.featuredImage &&
      typeof article.featuredImage === 'object' &&
      article.featuredImage !== null &&
      'url' in article.featuredImage
        ? (article.featuredImage.url as string)
        : null,
  }
}

type FetchArticlesOptions = {
  limit?: number
  excludeId?: string | number
  categoryId?: string | number
  topicId?: string | number
}

export async function fetchPublishedArticles(
  payload: Payload,
  { limit = 6, excludeId, categoryId, topicId }: FetchArticlesOptions = {},
): Promise<ArticleSummary[]> {
  const and: Record<string, unknown>[] = [{ _status: { equals: 'published' } }]

  if (excludeId != null) {
    and.push({ id: { not_equals: excludeId } })
  }

  if (categoryId != null) {
    and.push({ category: { equals: categoryId } })
  }

  if (topicId != null) {
    and.push({ topics: { contains: topicId } })
  }

  const { docs } = await payload.find({
    collection: 'articles',
    depth: 1,
    limit,
    sort: '-publishedAt',
    where: { and },
  })

  return docs.map(toArticleSummary)
}
