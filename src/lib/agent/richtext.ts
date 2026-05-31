import { convertHTMLToLexical, convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import type { Payload, PayloadRequest, SanitizedConfig } from 'payload'
import { randomUUID } from 'crypto'

import { articleLexicalEditor } from '@/lib/article-editor'
import type { Article } from '@/payload-types'

import { uploadImageFromUrl, type AgentImageInput } from './media'

type DescriptionFormat = 'markdown' | 'html' | 'plain'

function paragraphNode(text: string) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      {
        type: 'text',
        detail: 0,
        format: 0,
        mode: 'normal',
        style: '',
        text,
        version: 1,
      },
    ],
  }
}

function uploadNode(mediaId: number | string) {
  return {
    type: 'upload',
    format: '',
    version: 1,
    relationTo: 'media',
    fields: null,
    id: randomUUID(),
    value: mediaId,
  }
}

export async function buildArticleContent({
  config,
  description,
  descriptionFormat = 'markdown',
  images = [],
  payload,
  req,
}: {
  config: SanitizedConfig
  description: string
  descriptionFormat?: DescriptionFormat
  images?: AgentImageInput[]
  payload: Payload
  req: PayloadRequest
}) {
  const editorConfig = await editorConfigFactory.fromEditor({
    config,
    editor: articleLexicalEditor,
  })

  let lexicalState: Article['content']

  if (descriptionFormat === 'html') {
    lexicalState = await convertHTMLToLexical({
      editorConfig,
      html: description,
      JSDOM,
    })
  } else if (descriptionFormat === 'plain') {
    const blocks = description
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean)

    lexicalState = {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: (blocks.length > 0 ? blocks.map(paragraphNode) : [paragraphNode(description)]) as Article['content']['root']['children'],
      },
    } as Article['content']
  } else {
    lexicalState = await convertMarkdownToLexical({
      editorConfig,
      markdown: description,
    })
  }

  const uploadedIds: Array<number | string> = []

  for (const image of images) {
    const mediaId = await uploadImageFromUrl(payload, req, image)
    uploadedIds.push(mediaId)
    lexicalState.root.children.push(uploadNode(mediaId))
  }

  return {
    content: lexicalState,
    uploadedMediaIds: uploadedIds,
  }
}

export function excerptFromDescription(description: string, maxLength = 200) {
  const plain = description
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[#>*_`~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (plain.length <= maxLength) return plain
  return `${plain.slice(0, maxLength).trim()}…`
}
