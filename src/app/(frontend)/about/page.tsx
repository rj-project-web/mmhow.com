import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPage } from '@/components/layout/LegalPage'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'MMHow helps you discover practical ways to make money online — side hustles, freelancing, investing, and passive income.',
}

export default function AboutPage() {
  return (
    <LegalPage
      description="Practical guides for earning more — without hype, shortcuts, or get-rich-quick promises."
      eyebrow="About"
      lastUpdated="May 31, 2026"
      title="About MMHow"
    >
      <h2>Our Mission</h2>
      <p>
        MMHow (<strong>mmhow.com</strong>) is an English-language resource for people who want to
        earn more through legitimate, actionable strategies. We cover side hustles, freelancing,
        e-commerce, content monetization, investing basics, and passive income — with step-by-step
        guides you can apply today.
      </p>
      <p>
        Our name reflects what we do: show you <em>how</em> to make money, with clear playbooks
        instead of vague motivation.
      </p>

      <h2>What We Publish</h2>
      <ul>
        <li>
          <strong>Guides &amp; articles</strong> — researched, practical content on ways to earn
          online and offline.
        </li>
        <li>
          <strong>Categories</strong> — organized topics so you can go deep on freelancing,
          investing, digital products, and more.
        </li>
        <li>
          <strong>Editorial standards</strong> — we prioritize clarity, transparency, and realistic
          expectations over sensational claims.
        </li>
      </ul>

      <h2>What We Are Not</h2>
      <p>
        MMHow is <strong>not</strong> a financial advisor, broker, or tax professional. Content is
        for general information and education only. Results vary based on effort, skills, market
        conditions, and local laws. Always do your own research and consult qualified professionals
        before making financial decisions.
      </p>

      <h2>How We Make Money</h2>
      <p>
        MMHow may earn revenue through affiliate links, sponsored content, or partnerships where
        clearly disclosed. Our editorial team aims to recommend tools and strategies we believe are
        genuinely useful — compensation never overrides our commitment to honest, helpful guidance.
      </p>

      <h2>Contact</h2>
      <p>
        Questions, corrections, or partnership inquiries:{' '}
        <a href="mailto:hello@mmhow.com">hello@mmhow.com</a>
      </p>
      <p>
        Browse our latest guides on the <Link href="/">homepage</Link> or explore{' '}
        <Link href="/categories">all categories</Link>.
      </p>
    </LegalPage>
  )
}
