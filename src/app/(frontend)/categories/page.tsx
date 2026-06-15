import type { Metadata } from 'next'

import { ArticlePickStrip } from '@/components/article/ArticleRecommendations'
import { CategoriesGrid } from '@/components/category/CategoriesGrid'
import { SectionHeading } from '@/components/article/ArticleCard'
import { fetchPublishedArticles } from '@/lib/articles'
import { getAllCategories } from '@/lib/categories'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse ways to make money — side hustles, freelancing, e-commerce, investing, and more.',
  alternates: {
    canonical: '/categories',
  },
}

export default async function CategoriesIndexPage() {
  const payload = await getPayloadClient()
  const [categories, latestArticles] = await Promise.all([
    getAllCategories(),
    fetchPublishedArticles(payload, { limit: 3 }),
  ])

  return (
    <main className="mx-auto flex w-full max-w-container-max flex-grow flex-col gap-ad-clearance px-margin-mobile py-ad-clearance md:px-margin-desktop">
      <section className="card-fintech p-10">
        <span className="mb-3 block font-label-md text-label-md uppercase tracking-widest text-primary">
          Browse
        </span>
        <h1 className="mb-4 font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface">
          All Categories
        </h1>
        <p className="max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
          {categories.length} proven paths to earn — pick a category and learn how to make money in
          that niche.
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
