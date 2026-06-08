import { readSourceMappingRows } from '@/lib/agent/source-mapping'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const config = await configPromise
const payload = await getPayload({ config })
const rows = readSourceMappingRows()

let updated = 0
let skipped = 0

for (const row of rows) {
  const id = Number(row['MMHow ID'])
  const slug = row['MMHow 网址'].split('/articles/')[1]?.trim()

  if (!id && !slug) {
    skipped++
    continue
  }

  let article
  if (id) {
    try {
      article = await payload.findByID({ collection: 'articles', id })
    } catch {
      article = null
    }
  }

  if (!article && slug) {
    const { docs } = await payload.find({
      collection: 'articles',
      limit: 1,
      where: { slug: { equals: slug } },
    })
    article = docs[0]
  }

  if (!article) {
    console.log(`SKIP: no article for id=${id} slug=${slug}`)
    skipped++
    continue
  }

  await payload.update({
    collection: 'articles',
    id: article.id,
    data: {
      sourcePlatform: row['源平台'] || article.sourcePlatform || '',
      sourceUrl: row['原网址'] || article.sourceUrl || '',
      sourceTitle: row['原标题'] || article.sourceTitle || '',
      contentFingerprint: row['内容指纹'] || article.contentFingerprint || '',
    },
  })

  console.log(`OK: #${article.id} ${article.slug}`)
  updated++
}

console.log(`\nImported ${updated} rows, skipped ${skipped}`)
process.exit(0)
