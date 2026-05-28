import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

import { authenticateAgentRequest, AgentAuthError, AgentValidationError } from '@/lib/agent/auth'
import { uploadImageFromUrl } from '@/lib/agent/media'
import { buildArticleContent, excerptFromDescription } from '@/lib/agent/richtext'

type ArticleBody = {
  title?: string
  description?: string
  descriptionFormat?: 'markdown' | 'html' | 'plain'
  excerpt?: string
  featuredImage?: string
  images?: Array<{ url: string; alt?: string; caption?: string }>
  category?: string
  slug?: string
  status?: 'published' | 'draft'
  topics?: string[]
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

    const article = await payload.create({
      collection: 'articles',
      data: {
        title: body.title.trim(),
        slug: body.slug?.trim() || undefined,
        excerpt: body.excerpt?.trim() || excerptFromDescription(body.description),
        content,
        featuredImage: featuredImageId,
        category: categoryId,
        topics: topicIds,
        _status: status,
        publishedAt: status === 'published' ? new Date().toISOString() : undefined,
      },
      req,
    })

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
      featuredImage: 'string (optional) — cover image URL',
      images: 'array (optional) — [{ url, alt?, caption? }] appended to body',
      category: 'string (optional) — category slug',
      topics: 'string[] (optional) — topic slugs',
      slug: 'string (optional)',
      status: 'published | draft (default: published)',
    },
    categories: 'GET /api/agent/categories',
  })
}
