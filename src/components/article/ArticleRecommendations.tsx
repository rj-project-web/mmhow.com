import Link from 'next/link'
import Image from 'next/image'

import type { ArticleSummary } from '@/lib/articles'
import { formatDate, getMediaUrl } from '@/lib/payload'

type ArticleSidebarProps = {
  articles: ArticleSummary[]
  title?: string
  className?: string
}

export function ArticleSidebar({
  articles,
  title = 'More to Read',
  className = '',
}: ArticleSidebarProps) {
  if (articles.length === 0) return null

  return (
    <aside className={`sticky top-28 ${className}`}>
      <div className="card-fintech p-6">
        <h2 className="mb-4 border-b border-outline pb-3 font-headline-md text-headline-md text-on-surface">
          {title}
        </h2>
        <ul className="flex flex-col gap-4">
          {articles.map((article) => {
            const imageUrl = getMediaUrl(article.imageUrl)

            return (
              <li key={article.id}>
                <Link
                  className="group flex gap-3 transition-opacity hover:opacity-90"
                  href={`/articles/${article.slug}`}
                >
                  {imageUrl && (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        alt=""
                        className="object-cover"
                        fill
                        sizes="64px"
                        src={imageUrl}
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    {article.categoryName && (
                      <span className="mb-0.5 block font-label-md text-[11px] uppercase tracking-wide text-primary">
                        {article.categoryName}
                      </span>
                    )}
                    <h3 className="line-clamp-2 font-headline-md text-sm font-semibold leading-snug text-on-surface transition-colors group-hover:text-primary">
                      {article.title}
                    </h3>
                    {article.publishedAt && (
                      <time className="mt-1 block font-body-md text-xs text-on-surface-variant">
                        {formatDate(article.publishedAt)}
                      </time>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}

type ArticlePickStripProps = {
  articles: ArticleSummary[]
  title: string
}

export function ArticlePickStrip({ articles, title }: ArticlePickStripProps) {
  if (articles.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-headline-md text-headline-md text-on-surface">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          const imageUrl = getMediaUrl(article.imageUrl)

          return (
            <Link
              key={article.id}
              className="card-fintech group flex gap-4 p-4 transition-shadow"
              href={`/articles/${article.slug}`}
            >
              {imageUrl && (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  <Image alt="" className="object-cover" fill sizes="80px" src={imageUrl} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {article.categoryName && (
                  <span className="mb-1 block font-label-md text-[11px] uppercase tracking-wide text-primary">
                    {article.categoryName}
                  </span>
                )}
                <h3 className="line-clamp-2 font-headline-md text-sm font-semibold text-on-surface group-hover:text-primary">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="mt-1 line-clamp-2 font-body-md text-xs text-on-surface-variant">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

type ContinueReadingProps = {
  articles: ArticleSummary[]
}

export function ContinueReading({ articles }: ContinueReadingProps) {
  if (articles.length === 0) return null

  return (
    <section className="card-fintech my-8 border-l-4 border-l-emerald-500 p-6">
      <h2 className="mb-4 font-headline-md text-headline-md text-on-surface">Continue Reading</h2>
      <ul className="flex flex-col gap-3">
        {articles.map((article) => (
          <li key={article.id}>
            <Link
              className="group flex items-start justify-between gap-4 border-b border-outline pb-3 last:border-0 last:pb-0"
              href={`/articles/${article.slug}`}
            >
              <div>
                {article.categoryName && (
                  <span className="mb-0.5 block font-label-md text-[11px] uppercase tracking-wide text-primary">
                    {article.categoryName}
                  </span>
                )}
                <h3 className="font-headline-md text-body-md font-semibold text-on-surface group-hover:text-primary">
                  {article.title}
                </h3>
              </div>
              <span className="shrink-0 font-label-md text-sm text-primary">Read →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
