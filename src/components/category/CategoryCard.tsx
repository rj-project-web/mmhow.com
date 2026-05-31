import Link from 'next/link'

import type { SiteCategory } from '@/lib/categories'

export function CategoryCard({ category }: { category: SiteCategory }) {
  return (
    <Link
      className="card-fintech group flex flex-col gap-3 p-6"
      href={`/category/${category.slug}`}
    >
      <h3 className="font-headline-md text-headline-md text-on-surface transition-colors group-hover:text-primary">
        {category.name}
      </h3>
      {category.description ? (
        <p className="line-clamp-3 font-body-md text-body-md text-on-surface-variant">
          {category.description}
        </p>
      ) : (
        <p className="font-body-md text-body-md text-on-surface-variant">View articles →</p>
      )}
    </Link>
  )
}
