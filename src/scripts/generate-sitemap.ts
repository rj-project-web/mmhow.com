/**
 * Generate static public/sitemap.xml and public/robots.txt from CMS data.
 * Usage: npm run generate:sitemap
 */
import { generateSitemap } from '@/lib/sitemap'

async function main() {
  const result = await generateSitemap()
  console.log(`Sitemap: ${result.sitemapPath} (${result.urlCount} URLs, ${result.articleCount} articles)`)
  console.log(`Robots:  ${result.robotsPath}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('[generate-sitemap]', error)
    process.exit(1)
  })
