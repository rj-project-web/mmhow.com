import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import configPromise from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { buildArticleContent } from '@/lib/agent/richtext'
import type { Article } from '@/payload-types'

const root = join(import.meta.dirname, '../..')

function prepareMarkdown(file: string) {
  return readFileSync(join(root, file), 'utf8')
    .replace(/^# .+\n\n/m, '')
    .replace(/^\*\*Category:\*\*.+\n/m, '')
    .replace(/^\*\*Cover.+\n/m, '')
    .replace(/^\*\*Inspired by:\*\*.+\n/m, '')
    .replace(/^---\n\n/m, '')
    .replace(/\n---\n\n## Image assets[\s\S]*$/m, '')
    .replace(/!\[[^\]]*\]\([^)]+\)\n\n/g, '')
    .replace(/\*Figure \d+:[^\n]*\*\n\n/g, '')
}

function preserveUploadNodes(content: Article['content']) {
  return content.root.children.filter((node) => node.type === 'upload')
}

const articles = [
  {
    slug: 'seven-ai-side-hustle-paths',
    file: '_drafts/01-seven-ai-side-hustle-paths.md',
  },
  {
    slug: 'replace-outsourcing-with-ai-tools',
    file: '_drafts/02-replace-outsourcing-with-ai.md',
  },
]

const config = await configPromise
const payload = await getPayload({ config })

for (const spec of articles) {
  const { docs } = await payload.find({
    collection: 'articles',
    limit: 1,
    where: { slug: { equals: spec.slug } },
  })

  if (docs.length === 0) {
    console.log(`SKIP: no article for slug "${spec.slug}"`)
    continue
  }

  const existing = docs[0]
  const description = prepareMarkdown(spec.file)
  const uploads = preserveUploadNodes(existing.content)
  const req = await createLocalReq({}, payload)

  const { content } = await buildArticleContent({
    config,
    description,
    descriptionFormat: 'markdown',
    images: [],
    payload,
    req,
  })

  content.root.children.push(...uploads)

  const updated = await payload.update({
    collection: 'articles',
    id: existing.id,
    data: { content },
  })

  const hasTable = JSON.stringify(content).includes('"type":"table"')
  console.log(
    `${hasTable ? 'OK' : 'WARN'}: ${updated.slug} (id ${updated.id}) — tables ${hasTable ? 'present' : 'missing'}`,
  )
}
