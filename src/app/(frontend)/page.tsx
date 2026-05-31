import Image from 'next/image'
import Link from 'next/link'
import { Lightbulb, TrendingUp } from 'lucide-react'

import {
  ArticlePickStrip,
  ArticleSidebar,
} from '@/components/article/ArticleRecommendations'
import { ArticleCard, SectionHeading } from '@/components/article/ArticleCard'
import { CategoriesGrid } from '@/components/category/CategoriesGrid'
import { toArticleSummary } from '@/lib/articles'
import { getAllCategories } from '@/lib/categories'
import { getPayloadClient } from '@/lib/payload'

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

  return (
    <main className="mx-auto flex w-full max-w-container-max flex-grow flex-col gap-ad-clearance px-margin-mobile py-ad-clearance md:px-margin-desktop">
      <section className="relative grid min-h-[560px] grid-cols-1 items-center gap-gutter overflow-hidden rounded-2xl bg-hero-subtle p-8 md:p-12 lg:grid-cols-12">
        <div className="relative z-10 flex flex-col gap-6 lg:col-span-7">
          <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-4 py-1.5 font-label-md text-label-md text-blue-600">
            How to Make Money
          </span>
          <h1 className="font-display-lg text-display-lg text-on-surface">
            Real Ways to Earn More — Side Hustles, Online Income & Investing
          </h1>
          <p className="max-w-2xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
            Step-by-step playbooks to start earning today: freelancing, content monetization,
            e-commerce, digital products, and building passive income streams that actually work.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link className="btn-cta" href="/categories">
              Start Making Money
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
            secondary.map((article, index) => (
              <ArticleCard
                key={article.id}
                categoryName={
                  article.category && typeof article.category === 'object'
                    ? article.category.name
                    : index === 0
                      ? 'Investment'
                      : 'Side Hustles'
                }
                slug={article.slug}
                title={article.title}
                variant="compact"
              />
            ))
          ) : (
            <>
              <div className="card-fintech flex flex-col justify-between p-6">
                <TrendingUp className="mb-4 h-8 w-8 text-primary" />
                <div>
                  <span className="mb-1 block font-label-md text-label-md text-on-surface-variant">
                    Investment
                  </span>
                  <h4 className="font-headline-md text-body-lg font-semibold text-on-surface">
                    Index Funds vs. Real Estate in 2024
                  </h4>
                </div>
              </div>
              <div className="card-fintech flex flex-col justify-between p-6">
                <Lightbulb className="mb-4 h-8 w-8 text-emerald-500" />
                <div>
                  <span className="mb-1 block font-label-md text-label-md text-on-surface-variant">
                    Side Hustles
                  </span>
                  <h4 className="font-headline-md text-body-lg font-semibold text-on-surface">
                    High-Yield Digital Products
                  </h4>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <div className="card-fintech flex flex-col items-center gap-8 p-10 md:flex-row">
            <div className="flex-1">
              <h3 className="mb-4 font-headline-md text-headline-md text-on-surface">
                Money Moves Newsletter
              </h3>
              <p className="mb-6 font-body-md text-body-md text-on-surface-variant">
                Weekly income ideas, side hustle breakdowns, and investing tips — straight to your
                inbox.
              </p>
              <form className="flex w-full max-w-md gap-2">
                <input
                  className="flex-1 rounded-xl border border-outline bg-white px-4 py-3 font-body-md text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your email"
                  type="email"
                />
                <button className="btn-cta-sm shrink-0" type="button">
                  Subscribe
                </button>
              </form>
            </div>
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
