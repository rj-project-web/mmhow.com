import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import type { Payload, PayloadRequest } from 'payload'

import { authenticateAgentRequest, AgentAuthError, AgentValidationError } from '@/lib/agent/auth'
import { uploadImageFromUrl } from '@/lib/agent/media'
import { buildArticleContent, excerptFromDescription } from '@/lib/agent/richtext'
import { buildArticleSourceFields, findSourceDuplicate } from '@/lib/agent/source-mapping'

type ArticleBody = {
  title?: string
  description?: string
  descriptionFormat?: 'markdown' | 'html' | 'plain'
  excerpt?: string
  keyTakeaways?: Array<string | { point?: string }>
  featuredImage?: string
  images?: Array<{ url: string; alt?: string; caption?: string; afterHeading?: string }>
  category?: string
  slug?: string
  status?: 'published' | 'draft'
  topics?: string[]
  sourceUrl?: string
  sourceTitle?: string
  sourcePlatform?: string
  skipSourceDedup?: boolean
  publishedAt?: string
}

function normalizeKeyTakeaways(
  input: ArticleBody['keyTakeaways'],
): Array<{ point: string }> | undefined {
  if (!Array.isArray(input)) return undefined

  const points = input
    .map((item) => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object' && typeof item.point === 'string') return item.point
      return ''
    })
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .map((point) => ({ point }))

  return points.length > 0 ? points : undefined
}

async function upsertArticle(
  payload: Payload,
  req: PayloadRequest,
  articleData: Record<string, unknown>,
  status: 'draft' | 'published',
) {
  const slug = typeof articleData.slug === 'string' ? articleData.slug : undefined

  if (slug) {
    const { docs } = await payload.find({
      collection: 'articles',
      limit: 1,
      where: { slug: { equals: slug } },
    })

    if (docs.length > 0) {
      if (status === 'draft') {
        return payload.update({
          collection: 'articles',
          id: docs[0].id,
          draft: true,
          data: articleData,
          req,
        })
      }

      return payload.update({
        collection: 'articles',
        id: docs[0].id,
        data: articleData,
        req,
      })
    }
  }

  if (status === 'draft') {
    return payload.create({
      collection: 'articles',
      draft: true,
      data: articleData,
      req,
    })
  }

  return payload.create({
    collection: 'articles',
    data: articleData,
    req,
  })
}

export async function POST(request: Request) {
  try {
    const { payload, req } = await authenticateAgentRequest(request.headers)
    const config = await configPromise
    const body = (await request.json()) as ArticleBody

    if (!body.title?.trim()) {
      throw new AgentValidationError('Field "title" is required.')
    }

    if (!body.description?.trim()) {
      throw new AgentValidationError('Field "description" is required (article body, markdown supported).')
    }

    const status = body.status === 'draft' ? 'draft' : 'published'
    const images = body.images ?? []

    if (!body.skipSourceDedup) {
      const duplicate = await findSourceDuplicate(payload, {
        sourceUrl: body.sourceUrl,
        sourceTitle: body.sourceTitle,
        description: body.description,
        title: body.title,
        slug: body.slug,
      })

      if (duplicate.duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: duplicate.reason,
            duplicateOf: duplicate.existing,
          },
          { status: 409 },
        )
      }
    }

    const { content, uploadedMediaIds } = await buildArticleContent({
      config,
      description: body.description,
      descriptionFormat: body.descriptionFormat ?? 'markdown',
      images,
      payload,
      req,
    })

    let featuredImageId: number | string | undefined

    if (body.featuredImage) {
      featuredImageId = await uploadImageFromUrl(payload, req, {
        url: body.featuredImage,
        alt: body.title,
      })
    } else if (uploadedMediaIds.length > 0) {
      featuredImageId = uploadedMediaIds[0]
    }

    let categoryId: number | string | undefined

    if (body.category) {
      const { docs } = await payload.find({
        collection: 'categories',
        limit: 1,
        where: {
          slug: { equals: body.category },
        },
      })

      if (docs.length === 0) {
        throw new AgentValidationError(`Category not found for slug: ${body.category}`)
      }

      categoryId = docs[0].id
    }

    let topicIds: Array<number | string> | undefined

    if (body.topics?.length) {
      const { docs } = await payload.find({
        collection: 'topics',
        limit: 100,
        where: {
          slug: { in: body.topics },
        },
      })

      if (docs.length !== body.topics.length) {
        const found = new Set(docs.map((t) => t.slug))
        const missing = body.topics.filter((slug) => !found.has(slug))
        throw new AgentValidationError(`Topics not found: ${missing.join(', ')}`)
      }

      topicIds = docs.map((t) => t.id)
    }

    const toId = (id: number | string | undefined) =>
      id == null ? undefined : typeof id === 'number' ? id : Number(id)

    const sourceFields = buildArticleSourceFields({
      sourceUrl: body.sourceUrl,
      sourceTitle: body.sourceTitle,
      sourcePlatform: body.sourcePlatform,
      description: body.description,
    })

    let existingPublishedAt: string | undefined
    const slugTrimmed = body.slug?.trim()
    if (slugTrimmed) {
      const { docs: existingDocs } = await payload.find({
        collection: 'articles',
        limit: 1,
        where: { slug: { equals: slugTrimmed } },
      })
      const raw = existingDocs[0]?.publishedAt
      if (raw) {
        existingPublishedAt = new Date(raw).toISOString()
      }
    }

    let publishedAt: string | undefined
    if (status === 'published') {
      if (body.publishedAt?.trim()) {
        const parsed = new Date(body.publishedAt)
        if (Number.isNaN(parsed.getTime())) {
          throw new AgentValidationError('Field "publishedAt" must be a valid ISO date string.')
        }
        publishedAt = parsed.toISOString()
      } else if (existingPublishedAt) {
        publishedAt = existingPublishedAt
      } else {
        publishedAt = new Date().toISOString()
      }
    }

    const articleData = {
      title: body.title.trim(),
      slug: slugTrimmed || undefined,
      excerpt: body.excerpt?.trim() || excerptFromDescription(body.description),
      keyTakeaways: normalizeKeyTakeaways(body.keyTakeaways),
      content,
      featuredImage: toId(featuredImageId),
      category: toId(categoryId),
      topics: topicIds?.map((id) => toId(id) as number),
      _status: status as 'draft' | 'published',
      publishedAt,
      ...sourceFields,
    }

    const article =
      status === 'draft'
        ? await upsertArticle(payload, req, articleData, 'draft')
        : await upsertArticle(payload, req, articleData, 'published')

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'

    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        status: article._status,
        url: `${serverUrl}/articles/${article.slug}`,
        adminUrl: `${serverUrl}/admin/collections/articles/${article.id}`,
        sourceUrl: article.sourceUrl || sourceFields.sourceUrl,
        sourcePlatform: article.sourcePlatform || sourceFields.sourcePlatform,
      },
    })
  } catch (error) {
    if (error instanceof AgentAuthError || error instanceof AgentValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status })
    }

    console.error('[agent/articles]', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/agent/articles',
    method: 'POST',
    auth: 'Authorization: users API-Key <key>',
    fields: {
      title: 'string (required)',
      description: 'string (required) — article body, markdown/html/plain',
      descriptionFormat: 'markdown | html | plain (default: markdown)',
      excerpt: 'string (optional) — list summary',
      keyTakeaways:
        'string[] or {point}[] (optional) — 3–5 concise top-of-article takeaways for SEO/AI Overviews',
      featuredImage: 'string (optional) — cover image URL',
      images:
        'array (optional) — [{ url, alt?, caption?, afterHeading? }]; afterHeading inserts at end of that markdown section; omit to append at bottom',
      markdownImages:
        'inline ![alt](url) in markdown description is downloaded and placed at that position',
      category: 'string (optional) — category slug',
      topics: 'string[] (optional) — topic slugs',
      slug: 'string (optional)',
      status: 'published | draft (default: published)',
      sourceUrl: 'string (optional) — original article URL (saved to CMS, used for dedup)',
      sourceTitle: 'string (optional) — original article title',
      sourcePlatform: 'string (optional) — e.g. 知乎 / 小红书 / 搜狐',
      skipSourceDedup: 'boolean (optional) — bypass duplicate check (admin only use)',
      publishedAt: 'string (optional) — ISO datetime for publishedAt; batch scripts pass staggered times',
    },
    sourceMapping:
      'Stored in Payload Admin → Articles (sourceUrl, sourceTitle, sourcePlatform). Do NOT edit docs/source-mapping.xlsx.',
    categories: 'GET /api/agent/categories',
  })
}
