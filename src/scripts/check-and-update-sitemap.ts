/**
 * Compare CMS published articles with sitemap.xml; regenerate only when new/changed.
 * Usage: npm run sitemap:check
 */
import { checkAndUpdateSitemap } from '@/lib/sitemap'

async function main() {
  const outcome = await checkAndUpdateSitemap()

  if (!outcome.updated) {
    console.log(
      `Sitemap up to date (${outcome.cmsArticleCount} published articles, no changes).`,
    )
    return
  }

  const { result } = outcome
  console.log(
    `Sitemap updated: CMS ${outcome.cmsArticleCount} articles (was ${outcome.sitemapArticleCount} in sitemap) → ${result?.urlCount} URLs`,
  )
  console.log(`Written: ${result?.sitemapPath}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('[check-and-update-sitemap]', error)
    process.exit(1)
  })
