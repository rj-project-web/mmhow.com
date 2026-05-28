import type { SiteCategory } from '@/lib/categories'

import { CategoryCard } from './CategoryCard'

export function CategoriesGrid({ categories }: { categories: SiteCategory[] }) {
  if (categories.length === 0) {
    return (
      <p className="font-body-md text-body-md text-on-surface-variant">No categories yet.</p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}
