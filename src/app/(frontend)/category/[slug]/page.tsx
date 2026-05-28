import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArticleCard, SectionHeading } from '@/components/article/ArticleCard'
import { AdPlaceholder } from '@/components/ui/AdPlaceholder'
import { getPayloadClient } from '@/lib/payload'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    limit: 1,
    where: { slug: { equals: slug } },
  })

  const category = docs[0]
  if (!category) return { title: 'Category Not Found' }

  return {
    title: category.name,
    description: category.description || `Articles in ${category.name}`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 1,
    where: { slug: { equals: slug } },
  })

  const category = categories[0]
  if (!category) notFound()

  const { docs: articles } = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 20,
    sort: '-publishedAt',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { category: { equals: category.id } },
      ],
    },
  })

  return (
    <main className="mx-auto flex w-full max-w-container-max flex-grow flex-col gap-ad-clearance px-margin-mobile py-ad-clearance md:px-margin-desktop">
      <section className="rounded-xl border border-tertiary bg-surface-container-low p-10">
        <span className="mb-3 block font-label-md text-label-md uppercase tracking-widest text-primary">
          Category
        </span>
        <h1 className="mb-4 font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface">
          {category.name}
        </h1>
        {category.description && (
          <p className="max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
            {category.description}
          </p>
        )}
      </section>

      <AdPlaceholder className="h-[90px] w-full" label="Category Leaderboard Ad" />

      <section className="flex flex-col gap-8">
        <SectionHeading title={`Articles in ${category.name}`} />
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                excerpt={article.excerpt}
                imageUrl={
                  article.featuredImage && typeof article.featuredImage === 'object'
                    ? article.featuredImage.url
                    : null
                }
                publishedAt={article.publishedAt}
                slug={article.slug}
                title={article.title}
                variant="compact"
              />
            ))}
          </div>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant">
            No published articles in this category yet.
          </p>
        )}
      </section>
    </main>
  )
}
