/**
 * All article 301 redirects for Next.js.
 * - LEGACY_REDIRECTS: slug year-suffix cleanups and manual fixes
 * - GHOST_404_REDIRECTS: spider-discovered 404 slugs → canonical published articles
 *   Regenerate: npm run redirects:404-map
 */
import { GHOST_404_REDIRECTS } from './404-redirects.generated.mjs'

export const LEGACY_REDIRECTS = [
  {
    source: '/articles/make-money-content-creator-opc-monetization-map-2026',
    destination: '/articles/make-money-content-creator-opc-monetization-map',
    permanent: true,
  },
  {
    source: '/articles/step-by-step-guide-make-money-online-agent-workflow-2026',
    destination: '/articles/step-by-step-guide-make-money-online-light-apps',
    permanent: true,
  },
  {
    source: '/articles/side-hustles-earn-extra-income-coze-douyin-loop-2026',
    destination: '/articles/side-hustles-earn-extra-income-coze-douyin-loop',
    permanent: true,
  },
  {
    source: '/articles/passive-income-e-commerce-ozon-eac-compliance-2026',
    destination: '/articles/passive-income-e-commerce-ozon-eac-compliance',
    permanent: true,
  },
  {
    source: '/articles/make-money-digital-products-three-platform-tests-2026',
    destination: '/articles/make-money-digital-products-three-platform-tests',
    permanent: true,
  },
  {
    source: '/articles/earn-online-work-freelance-platforms-2026-update',
    destination: '/articles/earn-online-work-freelance-platforms-guide',
    permanent: true,
  },
  {
    source: '/articles/side-hustles-earn-extra-cash-home-virtual-shops-2026',
    destination: '/articles/side-hustles-earn-extra-cash-home-virtual-shops',
    permanent: true,
  },
  {
    source: '/articles/ways-for-extra-income-campus-expert-tasks-2026',
    destination: '/articles/ways-for-extra-income-campus-expert-tasks',
    permanent: true,
  },
  {
    source: '/articles/real-ways-make-passive-income-dividend-fund-screen-2026',
    destination: '/articles/real-ways-make-passive-income-dividend-fund-screen',
    permanent: true,
  },
  {
    source: '/articles/courses-for-side-hustle-lightweight-stack-2026',
    destination: '/articles/courses-for-side-hustle-lightweight-stack',
    permanent: true,
  },
]

export const ARTICLE_REDIRECTS = [...LEGACY_REDIRECTS, ...GHOST_404_REDIRECTS]
