import type { Metadata } from 'next'

import { ArticlePickStrip } from '@/components/article/ArticleRecommendations'
import { CategoriesGrid } from '@/components/category/CategoriesGrid'
import { SectionHeading } from '@/components/article/ArticleCard'
import { fetchPublishedArticles } from '@/lib/articles'
import { getAllCategories } from '@/lib/categories'
import { getPayloadClient } from '@/lib/payload'
import {
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildWebPageJsonLd,
} from '@/lib/seo/structured-data'
import { absoluteUrl, getSiteUrl } from '@/lib/site-url'

const PAGE_DESCRIPTION =
  'Browse MMHow money-making categories — side hustles, AI gigs, freelancing, e-commerce, digital products, investing, and online courses. Each path includes step-by-step guides with realistic economics.'

export const metadata: Metadata = {
  title: 'Categories — Side Hustles, Freelancing, E-Commerce & More',
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: '/categories',
  },
  openGraph: {
    title: 'All Categories | MMHow',
    description: PAGE_DESCRIPTION,
    url: '/categories',
    type: 'website',
  },
}

export default async function CategoriesIndexPage() {
  const payload = await getPayloadClient()
  const [categories, latestArticles] = await Promise.all([
    getAllCategories(),
    fetchPublishedArticles(payload, { limit: 3 }),
  ])

  const pageUrl = absoluteUrl('/categories')
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: getSiteUrl() },
    { name: 'Categories', url: pageUrl },
  ])
  const collectionJsonLd = buildCollectionPageJsonLd({
    name: 'MMHow Categories',
    url: pageUrl,
    description: PAGE_DESCRIPTION,
    items: categories.map((category) => ({
      name: category.name,
      url: absoluteUrl(`/category/${category.slug}`),
    })),
  })
  const webPageJsonLd = buildWebPageJsonLd({
    name: 'All Categories — MMHow',
    url: pageUrl,
    description: PAGE_DESCRIPTION,
    dateModified: '2026-07-14',
  })

  return (
    <main className="mx-auto flex w-full max-w-container-max flex-grow flex-col gap-ad-clearance px-margin-mobile py-ad-clearance md:px-margin-desktop">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
        type="application/ld+json"
      />
      <section className="card-fintech p-10">
        <span className="mb-3 block font-label-md text-label-md uppercase tracking-widest text-primary">
          Browse
        </span>
        <h1 className="mb-4 font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface">
          All Categories
        </h1>
        <p className="max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
          {categories.length} focused paths to earn online and offline — each category collects
          long-form guides with SOPs, margin math, compliance notes, and FAQs. Pick one lane, run it
          for 30–60 days, then expand.
        </p>
        <p className="mt-4 max-w-3xl font-body-md text-body-md text-on-surface-variant">
          Content is educational only; figures are illustrative unless stated otherwise. Investment
          and tax topics require professional advice for your situation.
        </p>
      </section>

      <ArticlePickStrip articles={latestArticles} title="Latest Guides" />

      <section className="flex flex-col gap-8">
        <SectionHeading title="Categories" />
        <CategoriesGrid categories={categories} />
      </section>
    </main>
  )
}
