import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const API_KEY = process.env.MMHOW_API_KEY
const BASE = process.env.MMHOW_API_BASE || 'https://www.mmhow.com'

if (!API_KEY) {
  console.error('MMHOW_API_KEY required')
  process.exit(1)
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function svgDataUrl(name) {
  const svg = readFileSync(join(root, 'public/article-assets', name), 'utf8')
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

function prepareMarkdown(file) {
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

async function publish(article) {
  const res = await fetch(`${BASE}/api/agent/articles`, {
    method: 'POST',
    headers: {
      Authorization: `users API-Key ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(article),
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = { raw: text }
  }
  if (!res.ok) {
    throw new Error(`${res.status} ${JSON.stringify(json)}`)
  }
  return json
}

const articles = [
  {
    title: '7 AI Side Hustle Paths That Can Add $1,000/Day (Realistically)',
    slug: 'seven-ai-side-hustle-paths',
    category: 'ai-powered-side-hustles',
    status: 'draft',
    featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
    file: '_drafts/01-seven-ai-side-hustle-paths.md',
    images: [
      { file: 'ai-side-hustle-paths.svg', alt: 'Seven AI side hustle paths decision chart', caption: 'Figure 1: Seven proven paths. Start with one, not all seven.' },
      { file: 'ai-multiplier-framework.svg', alt: 'Skill times AI tools equals paid delivery', caption: 'Figure 2: AI multiplies a skill. Without the skill, results plateau quickly.' },
      { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80', alt: 'Developer laptop workspace for AI-assisted content work' },
    ],
  },
  {
    title: 'How I Replaced $1,000/Month in Outsourcing with AI Tools',
    slug: 'replace-outsourcing-with-ai-tools',
    category: 'ai-powered-side-hustles',
    status: 'draft',
    featuredImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80',
    file: '_drafts/02-replace-outsourcing-with-ai.md',
    images: [
      { file: 'ai-outsourcing-savings.svg', alt: 'Monthly cost comparison outsourcing vs AI-assisted solo work', caption: 'Figure 1: Illustrative costs for a solo operator.' },
      { file: 'ai-multiplier-framework.svg', alt: 'Skill multiplied by AI tools framework', caption: 'Figure 2: AI is the multiplier, not the business model.' },
      { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80', alt: 'Analytics dashboard for tracking side hustle metrics' },
    ],
  },
]

for (const spec of articles) {
  const description = prepareMarkdown(spec.file)
  const images = spec.images.map((img) =>
    'file' in img && img.file
      ? { url: svgDataUrl(img.file), alt: img.alt, caption: img.caption }
      : { url: img.url, alt: img.alt, caption: img.caption },
  )

  const result = await publish({
    title: spec.title,
    slug: spec.slug,
    category: spec.category,
    status: spec.status,
    descriptionFormat: 'markdown',
    description,
    featuredImage: spec.featuredImage,
    images,
  })
  console.log(JSON.stringify(result, null, 2))
}
