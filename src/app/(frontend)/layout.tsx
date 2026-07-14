import type { Metadata } from 'next'
import React from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { getAllCategories } from '@/lib/categories'
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/lib/seo/structured-data'
import { getSiteUrl } from '@/lib/site-url'
import '@/styles/globals.css'

// Render frontend pages per-request. Payload's data layer is queried at request
// time; build-time prerendering of these pages is intentionally avoided.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'MMHow — How to Make Money',
    template: '%s | MMHow',
  },
  description:
    'Practical guides on side hustles, online income, investing, and passive revenue — learn how to make money with proven strategies.',
  openGraph: {
    type: 'website',
    siteName: 'MMHow',
    locale: 'en_US',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'MMHow — How to Make Money' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getAllCategories()
  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { ...buildOrganizationJsonLd(), '@context': undefined },
      { ...buildWebSiteJsonLd(), '@context': undefined },
    ],
  }

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
          type="application/ld+json"
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <SiteHeader categories={categories} />
        {children}
        <SiteFooter categories={categories} />
      </body>
    </html>
  )
}
