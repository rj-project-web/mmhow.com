import type { Metadata } from 'next'
import { Source_Sans_3, Source_Serif_4 } from 'next/font/google'
import React from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { getAllCategories } from '@/lib/categories'
import '@/styles/globals.css'

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
})

export const metadata: Metadata = {
  title: {
    default: 'MMHow — How to Make Money',
    template: '%s | MMHow',
  },
  description:
    'Practical guides on side hustles, online income, investing, and passive revenue — learn how to make money with proven strategies.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getAllCategories()

  return (
    <html className={`${sourceSans.variable} ${sourceSerif.variable}`} lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
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
