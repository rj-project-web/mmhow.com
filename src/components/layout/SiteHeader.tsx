import Link from 'next/link'
import { ChevronDown, Search } from 'lucide-react'

import { SiteLogo } from '@/components/layout/SiteLogo'
import type { SiteCategory } from '@/lib/categories'

type SiteHeaderProps = {
  categories: SiteCategory[]
}

export function SiteHeader({ categories }: SiteHeaderProps) {
  const firstCategory = categories[0]

  return (
    <header className="sticky top-0 z-50 mx-auto flex min-h-[86px] w-full max-w-container-max items-center justify-between border-b border-outline bg-white/95 px-margin-mobile py-2.5 backdrop-blur-sm md:min-h-[97px] md:px-margin-desktop">
      <div className="flex min-w-0 flex-1 items-center gap-gutter">
        <SiteLogo priority sizeClass="h-[61px] sm:h-[68px] md:h-[79px]" />
        <nav className="ml-4 hidden min-w-0 items-center gap-2 md:flex">
          <div className="group relative">
            <button
              className="flex items-center gap-1 rounded-lg px-3 py-2 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-slate-50 hover:text-primary"
              type="button"
            >
              Categories
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="invisible absolute left-0 top-full z-50 mt-1 max-h-[70vh] w-80 overflow-y-auto rounded-xl bg-white py-2 opacity-0 shadow-lg shadow-slate-200/50 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  className="block px-4 py-2.5 font-body-md text-body-md text-on-surface transition-colors hover:bg-blue-50 hover:text-primary"
                  href={`/category/${category.slug}`}
                >
                  {category.name}
                </Link>
              ))}
              <div className="mt-1 border-t border-outline pt-1">
                <Link
                  className="block px-4 py-2.5 font-label-md text-label-md text-primary"
                  href="/categories"
                >
                  View all categories
                </Link>
              </div>
            </div>
          </div>
          <Link
            className="shrink-0 rounded-lg px-3 py-2 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-slate-50 hover:text-primary"
            href="/categories"
          >
            All Topics
          </Link>
        </nav>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <div className="relative hidden text-on-surface-variant lg:flex">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
          <input
            className="w-48 rounded-xl border border-outline bg-white py-2 pl-10 pr-4 font-body-md text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 xl:w-64"
            placeholder="Search..."
            type="search"
          />
        </div>
        <Link
          className="btn-cta-sm"
          href={firstCategory ? `/category/${firstCategory.slug}` : '/categories'}
        >
          Make Money
        </Link>
      </div>
    </header>
  )
}
