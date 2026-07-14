import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPage } from '@/components/layout/LegalPage'
import { buildWebPageJsonLd } from '@/lib/seo/structured-data'
import { absoluteUrl } from '@/lib/site-url'

const LAST_UPDATED = 'July 14, 2026'
const PAGE_DESCRIPTION =
  'MMHow publishes research-backed guides on side hustles, online income, and investing — who we are, how we edit, and what we are not.'

export const metadata: Metadata = {
  title: 'About Us — Editorial Standards & E-E-A-T',
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About MMHow',
    description: PAGE_DESCRIPTION,
    url: '/about',
    type: 'website',
  },
}

export default function AboutPage() {
  const jsonLd = buildWebPageJsonLd({
    name: 'About MMHow',
    url: absoluteUrl('/about'),
    description: PAGE_DESCRIPTION,
    dateModified: '2026-07-14',
  })

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <LegalPage
        description="Who publishes MMHow, how we research guides, and how we handle money-related topics responsibly."
        eyebrow="About"
        lastUpdated={LAST_UPDATED}
        title="About MMHow"
      >
        <h2>Our Mission</h2>
        <p>
          MMHow (<strong>mmhow.com</strong>) is an English-language educational site for people
          exploring legitimate ways to earn more — through side hustles, freelancing, e-commerce,
          content monetization, digital products, and long-term investing basics. We translate
          practical playbooks from real operator workflows into clear, step-by-step guides you can
          apply and measure.
        </p>
        <p>
          Our name reflects what we do: show you <em>how</em> to make money with structured SOPs,
          economics tables, and honest failure modes — not motivational slogans.
        </p>

        <h2>Experience, Expertise &amp; Trust (E-E-A-T)</h2>
        <p>
          MMHow content is produced by an editorial team focused on <strong>online income and
          platform operations</strong>. Guides are adapted from publicly available operator
          write-ups (e.g., Zhihu, industry blogs), cross-checked against platform documentation
          where possible, and expanded with illustrative economics — always labeled as
          non-guaranteed.
        </p>
        <ul>
          <li>
            <strong>Experience</strong> — articles emphasize workflows editors have seen in the
            field: listing setup, margin math, compliance gates, and weekly metrics rows.
          </li>
          <li>
            <strong>Expertise</strong> — each guide targets one category (freelancing, RED/Douyin,
            dropshipping, index DCA, etc.) with domain-specific vocabulary and kill rules.
          </li>
          <li>
            <strong>Authoritativeness</strong> — we cite source platforms in Payload Admin (source
            URL / title) for traceability; readers can compare our adaptation to original context.
          </li>
          <li>
            <strong>Trustworthiness</strong> — no hidden paywalls on core guides; affiliate or
            sponsored relationships are disclosed when present; YMYL topics include conservative
            language and disclaimers.
          </li>
        </ul>

        <h2>Editorial Process</h2>
        <ol>
          <li>
            <strong>Topic selection</strong> — keyword and category alignment from our editorial
            keyword sheet; one primary search intent per article.
          </li>
          <li>
            <strong>Source review</strong> — Chinese-language operator articles or product-industry
            write-ups; duplicate sources are rejected at publish time.
          </li>
          <li>
            <strong>Adaptation</strong> — 1,200–1,800 word English guides with tables, SOPs, FAQ,
            and Key Takeaways; internal links to related MMHow articles.
          </li>
          <li>
            <strong>Review &amp; refresh</strong> — rolling updates keep platform fees, policies,
            and links current while <strong>URLs stay unchanged</strong> (see site editorial refresh
            schedule maintained by our content team).
          </li>
        </ol>

        <h2>What We Publish</h2>
        <ul>
          <li>
            <strong>Guides &amp; articles</strong> — long-form playbooks with economics, compliance
            notes, and thirty-day ramp checklists.
          </li>
          <li>
            <strong>Categories &amp; topics</strong> — organized paths so you can go deep on one lane
            at a time.
          </li>
          <li>
            <strong>Key Takeaways</strong> — concise summary bullets at the top of each article for
            skimmers and search extractors.
          </li>
        </ul>

        <h2>What We Are Not</h2>
        <p>
          MMHow is <strong>not</strong> a registered investment adviser, broker-dealer, tax preparer,
          or legal practice. Content is <strong>general information and education only</strong>.
          Results vary with skill, effort, market conditions, and local law. Always do your own
          research and consult qualified professionals before financial, tax, or legal decisions.
        </p>

        <h2>Corrections &amp; Feedback</h2>
        <p>
          Found an error, broken link, or outdated platform rule? Email{' '}
          <a href="mailto:hello@mmhow.com">hello@mmhow.com</a> with the article URL. We aim to
          review factual corrections within a reasonable timeframe and note material updates in the
          article body when applicable.
        </p>

        <h2>How We Make Money</h2>
        <p>
          MMHow may earn revenue through affiliate links, display advertising, or partnerships where
          clearly disclosed. Compensation does not determine which strategies we cover; editorial
          priority is usefulness and accuracy for readers.
        </p>

        <h2>Contact</h2>
        <p>
          General inquiries: <a href="mailto:hello@mmhow.com">hello@mmhow.com</a>
        </p>
        <p>
          Browse guides on the <Link href="/">homepage</Link>, explore{' '}
          <Link href="/categories">all categories</Link>, or read our{' '}
          <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </LegalPage>
    </>
  )
}
