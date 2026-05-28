import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import { formatDate, getMediaUrl } from '@/lib/payload'

type ArticleCardProps = {
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  categoryName?: string | null
  imageUrl?: string | null
  variant?: 'default' | 'featured' | 'compact'
}

export function ArticleCard({
  title,
  slug,
  excerpt,
  publishedAt,
  categoryName,
  imageUrl,
  variant = 'default',
}: ArticleCardProps) {
  const href = `/articles/${slug}`
  const mediaUrl = getMediaUrl(imageUrl)

  if (variant === 'featured') {
    return (
      <Link
        className="group relative col-span-2 row-span-2 overflow-hidden rounded-xl border border-tertiary bg-surface-container-lowest transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] md:col-span-2 md:row-span-2"
        href={href}
      >
        {mediaUrl && (
          <Image
            alt={title}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            src={mediaUrl}
          />
        )}
        <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-surface via-surface/80 to-transparent p-8">
          {categoryName && (
            <span className="mb-2 font-label-md text-label-md uppercase tracking-widest text-primary">
              {categoryName}
            </span>
          )}
          <h3 className="mb-3 font-headline-md text-headline-md text-on-surface transition-colors group-hover:text-primary">
            {title}
          </h3>
          {excerpt && (
            <p className="max-w-lg font-body-md text-body-md text-on-surface-variant">{excerpt}</p>
          )}
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link
        className="group flex flex-col justify-between rounded-xl border border-tertiary bg-surface-container-lowest p-6 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
        href={href}
      >
        {categoryName && (
          <span className="mb-1 block font-label-md text-label-md text-tertiary">{categoryName}</span>
        )}
        <h4 className="font-headline-md text-body-lg font-semibold text-on-surface">{title}</h4>
      </Link>
    )
  }

  return (
    <article className="group flex cursor-pointer items-start gap-6 border-b border-[#F1F5F9] py-4">
      <div className="w-24 shrink-0 pt-1 font-label-md text-label-md text-tertiary">
        {formatDate(publishedAt)}
      </div>
      <div>
        <Link className="block" href={href}>
          <h4 className="mb-2 font-headline-md text-body-lg font-semibold text-on-surface transition-colors group-hover:text-primary">
            {title}
          </h4>
        </Link>
        {excerpt && (
          <p className="line-clamp-2 font-body-md text-body-md text-on-surface-variant">{excerpt}</p>
        )}
      </div>
    </article>
  )
}

export function SectionHeading({
  title,
  href,
  linkLabel = 'View All',
}: {
  title: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="flex items-end justify-between border-b border-outline-variant pb-4">
      <h2 className="font-headline-lg text-headline-lg text-on-surface">{title}</h2>
      {href && (
        <Link
          className="group flex items-center gap-1 font-label-md text-label-md text-primary transition-colors hover:text-surface-tint"
          href={href}
        >
          {linkLabel}
          <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
