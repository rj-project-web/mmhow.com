import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPage } from '@/components/layout/LegalPage'
import { buildWebPageJsonLd } from '@/lib/seo/structured-data'
import { absoluteUrl } from '@/lib/site-url'

const LAST_UPDATED = 'July 14, 2026'
const PAGE_DESCRIPTION =
  'Terms of Service for MMHow.com — rules for using our educational guides, comments, affiliate links, and YMYL content disclaimers.'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service | MMHow',
    description: PAGE_DESCRIPTION,
    url: '/terms',
    type: 'website',
  },
}

export default function TermsPage() {
  const jsonLd = buildWebPageJsonLd({
    name: 'Terms of Service — MMHow',
    url: absoluteUrl('/terms'),
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
        description="Please read these terms before using MMHow.com or relying on our money-making guides."
        eyebrow="Legal"
        lastUpdated={LAST_UPDATED}
        title="Terms of Service"
      >
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of{' '}
          <strong>mmhow.com</strong> (the &quot;Site&quot;), operated by MMHow (&quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;). By accessing the Site, you agree to these Terms. If
          you do not agree, do not use the Site.
        </p>

        <h2>1. Use of the Site</h2>
        <p>
          You may use the Site for lawful, personal, non-commercial purposes unless we agree
          otherwise in writing. You agree not to:
        </p>
        <ul>
          <li>Violate any applicable law or regulation</li>
          <li>Scrape, crawl, or harvest data from the Site without permission</li>
          <li>Attempt to gain unauthorized access to our systems or user accounts</li>
          <li>Upload malware, spam, or harmful code</li>
          <li>Impersonate MMHow or misrepresent your affiliation with us</li>
          <li>Reproduce, republish, or resell our content for commercial use without consent</li>
        </ul>

        <h2>2. Content &amp; Intellectual Property</h2>
        <p>
          All text, graphics, logos, and other materials on the Site are owned by MMHow or our
          licensors and protected by copyright and other intellectual property laws. You may share
          links to our pages and quote brief excerpts with attribution and a link back to the
          original article.
        </p>
        <p>
          User-submitted comments remain your responsibility. By posting a comment, you grant us a
          non-exclusive license to display, moderate, and remove that content on the Site.
        </p>

        <h2>3. Educational Content — Not Professional Advice</h2>
        <p>
          Content on MMHow is provided for <strong>general informational and educational purposes
          only</strong>. It does not constitute financial, legal, tax, investment, or business
          advice. We do not guarantee any specific income, return, ranking, or outcome. Illustrative
          figures in guides are examples, not promises.
        </p>
        <p>
          Consult qualified professionals before acting on information related to money, taxes,
          investments, employment law, or business formation. Your use of third-party platforms
          (marketplaces, brokers, social apps) is subject to their own terms and policies.
        </p>

        <h2>4. Affiliate &amp; Third-Party Links</h2>
        <p>
          The Site may contain links to third-party websites, products, or services, including
          affiliate links. We are not responsible for third-party content, pricing, availability, or
          practices. Affiliate relationships, where present, are disclosed in context. Your use of
          external sites is at your own risk and subject to their terms.
        </p>

        <h2>5. Accuracy &amp; Updates</h2>
        <p>
          We strive to keep guides accurate and current through periodic review. Platform rules, fees,
          and features change frequently. Article URLs remain stable while body content may be
          updated; check the article&apos;s review notes and publication context. Report errors to{' '}
          <a href="mailto:hello@mmhow.com">hello@mmhow.com</a>.
        </p>

        <h2>6. Disclaimer of Warranties</h2>
        <p>
          THE SITE AND CONTENT ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
          WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE
          UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, MMHOW AND ITS OPERATORS WILL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS,
          DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SITE OR RELIANCE ON OUR CONTENT.
        </p>

        <h2>8. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless MMHow from claims, damages, and expenses
          (including reasonable legal fees) arising from your violation of these Terms or misuse of
          the Site.
        </p>

        <h2>9. Changes</h2>
        <p>
          We may update these Terms at any time. The &quot;Last updated&quot; date at the top
          indicates the latest revision. Continued use of the Site after changes constitutes
          acceptance of the revised Terms.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These Terms are governed by the laws applicable in our principal place of operation,
          without regard to conflict-of-law principles. Disputes will be resolved in the courts of
          competent jurisdiction unless otherwise required by mandatory local law.
        </p>

        <h2>11. Contact</h2>
        <p>
          Questions about these Terms: <a href="mailto:legal@mmhow.com">legal@mmhow.com</a>
        </p>
        <p>
          See also our <Link href="/privacy">Privacy Policy</Link> and{' '}
          <Link href="/about">About Us</Link>.
        </p>
      </LegalPage>
    </>
  )
}
