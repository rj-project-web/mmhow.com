import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArticleContent } from '@/components/article/ArticleContent'
import { InvestmentDisclaimer } from '@/components/article/InvestmentDisclaimer'
import { KeyTakeaways } from '@/components/article/KeyTakeaways'
import { ReadingProgress } from '@/components/article/ReadingProgress'
import {
  ArticleSidebar,
  ContinueReading,
} from '@/components/article/ArticleRecommendations'
import { CommentForm } from '@/components/comment/CommentForm'
import { CommentList } from '@/components/comment/CommentList'
import { fetchPublishedArticles } from '@/lib/articles'
import { formatDate, getPayloadClient, isCmsMediaUrl } from '@/lib/payload'
import {
  buildArticleJsonLd,
  buildArticleMetadata,
  featuredImageAlt,
  resolveFeaturedImageUrl,
} from '@/lib/seo/article-metadata'
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  extractFaqEntries,
} from '@/lib/seo/structured-data'
import { absoluteUrl, getSiteUrl } from '@/lib/site-url'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug } },
  })

  const article = docs[0]
  if (!article) return { title: 'Article Not Found' }

  const categoryName =
    article.category && typeof article.category === 'object' ? article.category.name : null

  return buildArticleMetadata({
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    featuredImageUrl: resolveFeaturedImageUrl(article.featuredImage),
    categoryName,
  })
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'articles',
    depth: 2,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
  })

  const article = docs[0]
  if (!article) notFound()

  const { docs: comments } = await payload.find({
    collection: 'comments',
    limit: 50,
    sort: '-createdAt',
    where: {
      and: [
        { article: { equals: article.id } },
        { status: { equals: 'approved' } },
      ],
    },
  })

  const categoryName =
    article.category && typeof article.category === 'object' ? article.category.name : null
  const categorySlug =
    article.category && typeof article.category === 'object' ? article.category.slug : null

  const heroImage = resolveFeaturedImageUrl(article.featuredImage)
  const heroAlt = featuredImageAlt(article.title, categoryName)

  const categoryId =
    article.category && typeof article.category === 'object' ? article.category.id : undefined

  const [relatedInCategory, moreToRead] = await Promise.all([
    fetchPublishedArticles(payload, {
      limit: 2,
      excludeId: article.id,
      categoryId,
    }),
    fetchPublishedArticles(payload, {
      limit: 6,
      excludeId: article.id,
    }),
  ])

  const jsonLd = buildArticleJsonLd({
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    featuredImageUrl: heroImage,
    categoryName,
  })

  const breadcrumbItems = [{ name: 'Home', url: getSiteUrl() }]
  if (categoryName && categorySlug) {
    breadcrumbItems.push({ name: categoryName, url: absoluteUrl(`/category/${categorySlug}`) })
  }
  breadcrumbItems.push({ name: article.title, url: absoluteUrl(`/articles/${article.slug}`) })
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems)

  const faqEntries = extractFaqEntries(article.content)
  const faqJsonLd = faqEntries.length > 0 ? buildFaqJsonLd(faqEntries) : null

  const keyTakeaways = Array.isArray(article.keyTakeaways)
    ? article.keyTakeaways
        .map((item) =>
          item && typeof item === 'object' && typeof item.point === 'string'
            ? item.point.trim()
            : '',
        )
        .filter((point): point is string => point.length > 0)
    : []

  const showInvestmentDisclaimer = categorySlug === 'investment--passive-income'

  const nextArticle = relatedInCategory[0] ?? moreToRead[0]

  return (
    <main className="article-reading mx-auto flex w-full max-w-container-max flex-grow flex-col gap-12 px-5 py-12 md:gap-12 md:px-margin-desktop">
      <ReadingProgress />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        type="application/ld+json"
      />
      {faqJsonLd && (
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          type="application/ld+json"
        />
      )}
      <article className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <div className="flex flex-wrap items-center gap-3 font-label-md text-label-md text-on-surface-variant">
            {article.category && typeof article.category === 'object' && (
              <>
                <Link className="text-primary hover:text-blue-700" href={`/category/${article.category.slug}`}>
                  {article.category.name}
                </Link>
                <span aria-hidden className="h-1 w-1 rounded-full bg-slate-300" />
              </>
            )}
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          <h1 className="font-display-lg font-bold text-[26px] leading-tight tracking-tight text-on-surface md:text-[36px] md:leading-[1.15]">
            {article.title}
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant">{article.excerpt}</p>

          {keyTakeaways.length > 0 && <KeyTakeaways points={keyTakeaways} />}

          {showInvestmentDisclaimer && <InvestmentDisclaimer />}

          {heroImage && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-sm shadow-slate-200/40">
              <Image
                alt={heroAlt}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                src={heroImage}
                unoptimized={isCmsMediaUrl(heroImage)}
              />
            </div>
          )}

          <ArticleContent content={article.content} />

          <ContinueReading articles={relatedInCategory} />

          {Array.isArray(article.topics) && article.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-outline pt-6">
              {article.topics.map((topic) =>
                topic && typeof topic === 'object' ? (
                  <Link
                    key={topic.id}
                    className="rounded-full bg-blue-50 px-4 py-2 font-label-md text-label-md text-primary transition-colors hover:bg-blue-100"
                    href={`/topic/${topic.slug}`}
                  >
                    {topic.name}
                  </Link>
                ) : null,
              )}
            </div>
          )}

          <section className="flex flex-col gap-6 border-t border-outline pt-10">
            <h2 className="font-headline-md text-headline-md text-on-surface">Comments</h2>
            <CommentList
              comments={comments.map((comment) => ({
                id: comment.id,
                authorName: comment.authorName,
                content: comment.content,
                createdAt: comment.createdAt,
              }))}
            />
            <CommentForm articleId={article.id} />
          </section>
        </div>

        <div className="lg:col-span-4">
          <ArticleSidebar articles={moreToRead} title="Related Guides" />
        </div>
      </article>

      {nextArticle && (
        <div className="sticky bottom-0 z-40 mt-2 flex w-full items-center justify-between border-t border-outline bg-white px-5 py-4 md:hidden">
          <div className="flex min-w-0 flex-col">
            <span className="font-label-md text-[10px] text-primary">Next Guide</span>
            <span className="max-w-[200px] truncate text-sm font-semibold text-on-surface">
              {nextArticle.title}
            </span>
          </div>
          <Link
            className="btn-cta-sm px-4 py-2 text-xs"
            href={`/articles/${nextArticle.slug}`}
          >
            Read Now →
          </Link>
        </div>
      )}
    </main>
  )
}
