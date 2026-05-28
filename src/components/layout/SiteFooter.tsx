import Link from 'next/link'

import type { SiteCategory } from '@/lib/categories'

const footerLinks = [
  { href: '#', label: 'About Us' },
  { href: '#', label: 'Terms of Service' },
  { href: '#', label: 'Privacy Policy' },
  { href: '/categories', label: 'Categories' },
]

type SiteFooterProps = {
  categories: SiteCategory[]
}

export function SiteFooter({ categories }: SiteFooterProps) {
  return (
    <footer className="mx-auto mt-auto w-full max-w-container-max border-t border-outline-variant bg-surface-container-low px-margin-mobile py-12 pb-8 pt-14 md:px-margin-desktop">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-3 font-headline-md text-headline-md font-bold text-primary">MMHow</div>
          <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
            How to make money online — side hustles, freelancing, investing, and passive income.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {footerLinks.map((item) => (
            <Link
              key={item.label}
              className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {categories.length > 0 && (
        <div className="mb-8 border-t border-outline-variant/80 pt-8">
          <h2 className="mb-4 font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">
            Categories
          </h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary"
                  href={`/category/${category.slug}`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="border-t border-outline-variant/80 pt-6 text-center font-body-md text-sm text-on-surface-variant md:text-right">
        © {new Date().getFullYear()} MMHow. All rights reserved.
      </div>
    </footer>
  )
}
