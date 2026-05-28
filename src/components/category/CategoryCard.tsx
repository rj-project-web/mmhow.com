import Link from 'next/link'

import type { SiteCategory } from '@/lib/categories'

export function CategoryCard({ category }: { category: SiteCategory }) {
  return (
    <Link
      className="group flex flex-col gap-3 rounded-xl border border-tertiary bg-surface-container-lowest p-6 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
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
