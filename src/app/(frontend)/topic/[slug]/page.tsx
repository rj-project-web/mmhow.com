import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { ArticleCard, SectionHeading } from '@/components/article/ArticleCard'
import { AdPlaceholder } from '@/components/ui/AdPlaceholder'
import { getMediaUrl, getPayloadClient } from '@/lib/payload'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'topics',
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug } },
  })

  const topic = docs[0]
  if (!topic) return { title: 'Topic Not Found' }

  return {
    title: topic.name,
    description: topic.description || `Curated articles about ${topic.name}`,
  }
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const { docs: topics } = await payload.find({
    collection: 'topics',
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug } },
  })

  const topic = topics[0]
  if (!topic) notFound()

  const { docs: articles } = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 20,
    sort: '-publishedAt',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { topics: { contains: topic.id } },
      ],
    },
  })

  const heroImage =
    topic.featuredImage && typeof topic.featuredImage === 'object'
      ? getMediaUrl(topic.featuredImage.url)
      : null

  return (
    <main className="mx-auto flex w-full max-w-container-max flex-grow flex-col gap-ad-clearance px-margin-mobile py-ad-clearance md:px-margin-desktop">
      <section className="card-fintech relative overflow-hidden">
        {heroImage && (
          <Image
            alt={topic.name}
            className="absolute inset-0 h-full w-full object-cover opacity-15"
            fill
            sizes="100vw"
            src={heroImage}
          />
        )}
        <div className="relative z-10 p-10 md:p-14">
          <span className="mb-3 block font-label-md text-label-md uppercase tracking-widest text-primary">
            Topic
          </span>
          <h1 className="mb-4 font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface">
            {topic.name}
          </h1>
          {topic.description && (
            <p className="max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
              {topic.description}
            </p>
          )}
        </div>
      </section>

      <AdPlaceholder className="h-[90px] w-full" label="Topic Leaderboard Ad" />

      <section className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <SectionHeading title="Curated Articles" />
          {articles.length > 0 ? (
            articles.map((article) => (
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
              No published articles in this topic yet.
            </p>
          )}
        </div>
        <aside className="lg:col-span-4">
          <AdPlaceholder className="sticky top-28 h-[600px] w-full" label="Sidebar Ad Space" />
        </aside>
      </section>
    </main>
  )
}
