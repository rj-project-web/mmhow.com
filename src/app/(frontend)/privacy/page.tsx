import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPage } from '@/components/layout/LegalPage'
import { buildWebPageJsonLd } from '@/lib/seo/structured-data'
import { absoluteUrl } from '@/lib/site-url'

const LAST_UPDATED = 'July 14, 2026'
const PAGE_DESCRIPTION =
  'Privacy Policy for MMHow.com — what we collect, how we use data, cookies, your rights, and how we handle educational content interactions.'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | MMHow',
    description: PAGE_DESCRIPTION,
    url: '/privacy',
    type: 'website',
  },
}

export default function PrivacyPage() {
  const jsonLd = buildWebPageJsonLd({
    name: 'Privacy Policy — MMHow',
    url: absoluteUrl('/privacy'),
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
        description="How MMHow collects, uses, and protects information when you read our guides or interact with the site."
        eyebrow="Legal"
        lastUpdated={LAST_UPDATED}
        title="Privacy Policy"
      >
        <p>
          MMHow (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates <strong>mmhow.com</strong>.
          This Privacy Policy describes how we collect, use, disclose, and safeguard information when
          you visit our website and read our educational content.
        </p>

        <h2>1. Information We Collect</h2>
        <h3>Information you provide</h3>
        <ul>
          <li>
            <strong>Comments</strong> — name, email (optional), and comment text when you submit a
            comment on an article
          </li>
          <li>
            <strong>Contact email</strong> — if you email us for corrections, partnerships, or
            support
          </li>
          <li>
            <strong>Admin accounts</strong> — credentials for authorized users of our content
            management system
          </li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li>
            <strong>Log &amp; device data</strong> — IP address, browser type, referring URLs, pages
            viewed, and approximate location derived from IP
          </li>
          <li>
            <strong>Cookies &amp; similar technologies</strong> — small files stored on your device to
            remember preferences, analyze traffic, and improve the Site
          </li>
          <li>
            <strong>Analytics</strong> — aggregated usage statistics (e.g., page views, session
            duration) via analytics providers we may enable
          </li>
        </ul>

        <h2>2. How We Use Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Operate, maintain, and improve the Site and our educational articles</li>
          <li>Publish and moderate user comments</li>
          <li>Respond to correction requests and support inquiries</li>
          <li>Monitor security, prevent fraud, and enforce our Terms</li>
          <li>Understand audience interests and improve guide quality (aggregated where possible)</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>
          We do <strong>not</strong> sell your personal information. We do not use your reading
          history to provide personalized investment or financial product recommendations.
        </p>

        <h2>3. Legal Bases (EEA/UK Users)</h2>
        <p>Where applicable, we process personal data based on:</p>
        <ul>
          <li>
            <strong>Consent</strong> — e.g., non-essential cookies where required
          </li>
          <li>
            <strong>Legitimate interests</strong> — site security, analytics, and content
            improvement
          </li>
          <li>
            <strong>Contract</strong> — providing services you request (e.g., comment submission)
          </li>
          <li>
            <strong>Legal obligation</strong> — when required by law
          </li>
        </ul>

        <h2>4. Sharing of Information</h2>
        <p>We may share data with:</p>
        <ul>
          <li>
            <strong>Service providers</strong> — hosting, email delivery, analytics, and security
            vendors who process data on our behalf under contract
          </li>
          <li>
            <strong>Legal authorities</strong> — when required by law or to protect rights and safety
          </li>
          <li>
            <strong>Business transfers</strong> — in connection with a merger, acquisition, or asset
            sale, subject to continued protection
          </li>
        </ul>

        <h2>5. Cookies</h2>
        <p>
          You can control cookies through your browser settings. Disabling cookies may affect certain
          Site features. Where required by law, we will request consent before placing non-essential
          cookies.
        </p>

        <h2>6. Data Retention</h2>
        <p>
          We retain personal information only as long as needed for the purposes described above,
          unless a longer period is required by law. Comment data may be kept while published or as
          needed for moderation records.
        </p>

        <h2>7. Security</h2>
        <p>
          We implement reasonable technical and organizational measures to protect information.
          However, no method of transmission over the Internet is 100% secure, and we cannot
          guarantee absolute security.
        </p>

        <h2>8. Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access, correct, or delete your personal data</li>
          <li>Object to or restrict certain processing</li>
          <li>Withdraw consent where processing is consent-based</li>
          <li>Data portability (where applicable)</li>
          <li>Lodge a complaint with a supervisory authority</li>
        </ul>
        <p>
          To exercise these rights, contact us at{' '}
          <a href="mailto:privacy@mmhow.com">privacy@mmhow.com</a>. We will respond within the
          timeframe required by applicable law.
        </p>

        <h2>9. Children</h2>
        <p>
          The Site is not directed to children under 13 (or the minimum age in your jurisdiction). We
          do not knowingly collect personal information from children. If you believe a child has
          provided us data, contact us and we will delete it promptly.
        </p>

        <h2>10. International Transfers</h2>
        <p>
          Your information may be processed in countries other than your own. Where required, we use
          appropriate safeguards for cross-border transfers.
        </p>

        <h2>11. Educational &amp; YMYL Content</h2>
        <p>
          MMHow publishes guides about money, business, and investing for <strong>general education
          only</strong>. Reading an article does not create an advisory relationship. Do not submit
          sensitive financial account numbers or government IDs through public comment fields or
          general contact email.
        </p>

        <h2>12. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date
          reflects the latest version. Material changes will be noted on this page.
        </p>

        <h2>13. Contact</h2>
        <p>
          Privacy questions: <a href="mailto:privacy@mmhow.com">privacy@mmhow.com</a>
        </p>
        <p>
          See also our <Link href="/terms">Terms of Service</Link> and{' '}
          <Link href="/about">About Us</Link> page.
        </p>
      </LegalPage>
    </>
  )
}
