import Link from 'next/link'
import { ChevronDown, Search } from 'lucide-react'

import type { SiteCategory } from '@/lib/categories'

type SiteHeaderProps = {
  categories: SiteCategory[]
}

export function SiteHeader({ categories }: SiteHeaderProps) {
  const firstCategory = categories[0]

  return (
    <header className="sticky top-0 z-50 mx-auto flex h-20 w-full max-w-container-max items-center justify-between border-b border-outline-variant bg-surface px-margin-mobile md:px-margin-desktop">
      <div className="flex min-w-0 flex-1 items-center gap-gutter">
        <Link className="shrink-0 flex flex-col leading-tight" href="/">
          <span className="font-headline-md text-headline-md font-bold text-primary">MMHow</span>
          <span className="hidden font-label-md text-[11px] font-semibold uppercase tracking-widest text-secondary sm:block">
            How to Make Money
          </span>
        </Link>
        <nav className="ml-4 hidden min-w-0 items-center gap-2 md:flex">
          <div className="group relative">
            <button
              className="flex items-center gap-1 rounded-DEFAULT px-3 py-2 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
              type="button"
            >
              Categories
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="invisible absolute left-0 top-full z-50 mt-1 max-h-[70vh] w-80 overflow-y-auto rounded-xl border border-tertiary bg-surface-container-lowest py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  className="block px-4 py-2.5 font-body-md text-body-md text-on-surface transition-colors hover:bg-surface-container-low hover:text-primary"
                  href={`/category/${category.slug}`}
                >
                  {category.name}
                </Link>
              ))}
              <div className="mt-1 border-t border-outline-variant pt-1">
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
            className="shrink-0 rounded-DEFAULT px-3 py-2 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
            href="/categories"
          >
            All Topics
          </Link>
        </nav>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <div className="relative hidden text-on-surface-variant lg:flex">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" />
          <input
            className="w-48 rounded-DEFAULT border border-tertiary bg-surface py-2 pl-10 pr-4 font-body-md text-body-md focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary xl:w-64"
            placeholder="Search..."
            type="search"
          />
        </div>
        <Link
          className="hidden px-4 py-2 font-label-md text-label-md text-on-surface-variant hover:text-primary sm:inline"
          href="/admin"
        >
          Admin
        </Link>
        <Link
          className="rounded-DEFAULT bg-accent px-6 py-2.5 font-label-md text-label-md text-on-accent shadow-sm transition-colors hover:bg-secondary"
          href={firstCategory ? `/category/${firstCategory.slug}` : '/categories'}
        >
          Make Money
        </Link>
      </div>
    </header>
  )
}
