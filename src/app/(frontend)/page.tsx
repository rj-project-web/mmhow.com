import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Lightbulb, ShieldCheck, TrendingUp } from 'lucide-react'

import {
  ArticlePickStrip,
  ArticleSidebar,
} from '@/components/article/ArticleRecommendations'
import { ArticleCard, SectionHeading } from '@/components/article/ArticleCard'
import { CategoriesGrid } from '@/components/category/CategoriesGrid'
import { toArticleSummary } from '@/lib/articles'
import { getAllCategories } from '@/lib/categories'
import { getPayloadClient } from '@/lib/payload'
import { buildWebPageJsonLd } from '@/lib/seo/structured-data'
import { absoluteUrl } from '@/lib/site-url'

const PAGE_DESCRIPTION =
  'Research-backed guides on side hustles, freelancing, e-commerce, content monetization, and index investing — practical playbooks with clear steps, realistic economics, and no get-rich-quick hype.'

export const metadata: Metadata = {
  title: 'How to Make Money — Side Hustles, Online Income & Investing',
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'MMHow — Real Ways to Earn More',
    description: PAGE_DESCRIPTION,
    url: '/',
    type: 'website',
  },
}

export default async function HomePage() {
  const payload = await getPayloadClient()
  const categories = await getAllCategories()

  const { docs: articles } = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 12,
    sort: '-publishedAt',
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  const summaries = articles.map(toArticleSummary)
  const featured = articles[0]
  const secondary = articles.slice(1, 3)
  const latest = articles.slice(0, 4)
  const editorPicks = summaries.slice(3, 6)
  const sidebarArticles = summaries.slice(0, 6)

  const webPageJsonLd = buildWebPageJsonLd({
    name: 'MMHow — How to Make Money',
    url: absoluteUrl('/'),
    description: PAGE_DESCRIPTION,
    dateModified: '2026-07-14',
  })

  return (
    <main className="mx-auto flex w-full max-w-container-max flex-grow flex-col gap-ad-clearance px-margin-mobile py-ad-clearance md:px-margin-desktop">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
        type="application/ld+json"
      />
      <section className="relative grid min-h-[560px] grid-cols-1 items-center gap-gutter overflow-hidden rounded-2xl bg-hero-subtle p-8 md:p-12 lg:grid-cols-12">
        <div className="relative z-10 flex flex-col gap-6 lg:col-span-7">
          <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-4 py-1.5 font-label-md text-label-md text-blue-600">
            Practical Money Guides
          </span>
          <h1 className="font-display-lg text-display-lg text-on-surface">
            Real Ways to Earn More — Side Hustles, Online Income &amp; Investing
          </h1>
          <p className="max-w-2xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
            Step-by-step playbooks backed by research and platform docs: freelancing, content
            monetization, e-commerce, digital products, and disciplined index investing. We publish
            for education — not hype.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link className="btn-cta" href="/categories">
              Browse Categories
            </Link>
            <Link
              className="btn-cta-secondary"
              href={latest[0] ? `/articles/${latest[0].slug}` : '/categories'}
            >
              Latest Guides
            </Link>
          </div>
        </div>
        <div className="relative z-10 min-h-[280px] lg:col-span-5 lg:min-h-[400px]">
          <div className="card-fintech absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/50 p-4">
            <Image
              alt="Illustration of online income growth — charts, side hustles, and earnings dashboard"
              className="h-full w-full object-contain object-center"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              src="/hero-illustration.svg"
              unoptimized
            />
          </div>
        </div>
      </section>

      <section className="card-fintech grid gap-6 p-8 md:grid-cols-3 md:p-10">
        <div className="flex flex-col gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" aria-hidden />
          <h2 className="font-headline-md text-headline-md text-on-surface">Editorial standards</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Every guide includes actionable steps, realistic economics, and clear limits. We avoid
            guaranteed-income claims and label illustrative figures.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <TrendingUp className="h-8 w-8 text-primary" aria-hidden />
          <h2 className="font-headline-md text-headline-md text-on-surface">Regularly reviewed</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Articles are refreshed on a rolling schedule — platform rules, fees, and internal links
            stay current while URLs remain stable.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Lightbulb className="h-8 w-8 text-primary" aria-hidden />
          <h2 className="font-headline-md text-headline-md text-on-surface">Not financial advice</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            MMHow is educational content only. Consult licensed professionals for tax, legal, or
            investment decisions. See our{' '}
            <Link className="text-primary underline" href="/about">
              About
            </Link>{' '}
            page.
          </p>
        </div>
      </section>

      <ArticlePickStrip articles={editorPicks} title="Editor's Picks" />

      <section className="flex flex-col gap-8">
        <SectionHeading href="/categories" title="Explore Categories" />
        <CategoriesGrid categories={categories} />
      </section>

      <section className="flex flex-col gap-8">
        <SectionHeading title="Featured Insights" />
        <div className="grid auto-rows-[250px] grid-cols-1 gap-6 md:grid-cols-3">
          {featured ? (
            <ArticleCard
              categoryName={
                featured.category && typeof featured.category === 'object'
                  ? featured.category.name
                  : null
              }
              excerpt={featured.excerpt}
              imageUrl={
                featured.featuredImage && typeof featured.featuredImage === 'object'
                  ? featured.featuredImage.url
                  : null
              }
              slug={featured.slug}
              title={featured.title}
              variant="featured"
            />
          ) : (
            <div className="col-span-2 row-span-2 flex items-center justify-center card-fintech p-8 font-body-md text-body-md text-on-surface-variant">
              Publish your first article in the admin panel to populate featured content.
            </div>
          )}

          {secondary.length > 0 ? (
            secondary.map((article) => (
              <ArticleCard
                key={article.id}
                categoryName={
                  article.category && typeof article.category === 'object'
                    ? article.category.name
                    : null
                }
                slug={article.slug}
                title={article.title}
                variant="compact"
              />
            ))
          ) : null}
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <div className="card-fintech flex flex-col gap-4 p-10">
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Start with a category that fits your skills
            </h3>
            <p className="max-w-2xl font-body-md text-body-md text-on-surface-variant">
              Pick one lane for 30–60 days — freelancing, content, e-commerce, or investing basics —
              then follow the playbooks inside. Depth beats chasing every trend.
            </p>
            <Link className="btn-cta-sm w-fit" href="/categories">
              View all categories
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="mb-2 border-b border-outline pb-4 font-headline-md text-headline-md text-on-surface">
              Latest Money Guides
            </h3>
            {latest.length > 0 ? (
              latest.map((article) => (
                <ArticleCard
                  key={article.id}
                  excerpt={article.excerpt}
                  publishedAt={article.publishedAt}
                  slug={article.slug}
                  title={article.title}
                />
              ))
            ) : (
              <p className="font-body-md text-body-md text-on-surface-variant">
                No published articles yet. Create one via the admin panel or API.
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <ArticleSidebar articles={sidebarArticles} title="Trending Guides" />
        </div>
      </section>
    </main>
  )
}
