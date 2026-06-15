import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPage } from '@/components/layout/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for MMHow.com — rules for using our website and content.',
  alternates: {
    canonical: '/terms',
  },
}

export default function TermsPage() {
  return (
    <LegalPage
      description="Please read these terms carefully before using MMHow.com."
      eyebrow="Legal"
      lastUpdated="May 31, 2026"
      title="Terms of Service"
    >
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of{' '}
        <strong>mmhow.com</strong> (the &quot;Site&quot;), operated by MMHow (&quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;). By accessing the Site, you agree to these Terms. If
        you do not agree, do not use the Site.
      </p>

      <h2>1. Use of the Site</h2>
      <p>You may use the Site for lawful, personal, non-commercial purposes unless we agree otherwise in writing. You agree not to:</p>
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

      <h2>3. No Professional Advice</h2>
      <p>
        Content on MMHow is provided for <strong>general informational and educational purposes
        only</strong>. It does not constitute financial, legal, tax, or investment advice. We do not
        guarantee any specific income, return, or outcome. Consult qualified professionals before
        acting on information related to money, taxes, investments, or business decisions.
      </p>

      <h2>4. Affiliate &amp; Third-Party Links</h2>
      <p>
        The Site may contain links to third-party websites, products, or services, including
        affiliate links. We are not responsible for third-party content, pricing, availability, or
        practices. Your use of external sites is at your own risk and subject to their terms.
      </p>

      <h2>5. Disclaimer of Warranties</h2>
      <p>
        THE SITE AND CONTENT ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
        WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE
        UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, MMHOW AND ITS OPERATORS WILL NOT BE LIABLE FOR ANY
        INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS,
        DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SITE OR RELIANCE ON OUR CONTENT.
      </p>

      <h2>7. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless MMHow from claims, damages, and expenses (including
        reasonable legal fees) arising from your violation of these Terms or misuse of the Site.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update these Terms at any time. The &quot;Last updated&quot; date at the top
        indicates the latest revision. Continued use of the Site after changes constitutes acceptance
        of the revised Terms.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        These Terms are governed by the laws applicable in our principal place of operation, without
        regard to conflict-of-law principles. Disputes will be resolved in the courts of competent
        jurisdiction unless otherwise required by mandatory local law.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these Terms: <a href="mailto:legal@mmhow.com">legal@mmhow.com</a>
      </p>
      <p>
        See also our <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  )
}
