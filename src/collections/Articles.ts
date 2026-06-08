import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated, authenticatedOrPublished } from '@/access'
import { articleLexicalEditor } from '@/lib/article-editor'
import { contentFingerprint, detectSourcePlatform } from '@/lib/agent/source-mapping'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'sourcePlatform', 'sourceUrl', 'publishedAt'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    excerpt: true,
    featuredImage: true,
    category: true,
    topics: true,
    publishedAt: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: articleLexicalEditor,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'topics',
      type: 'relationship',
      relationTo: 'topics',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published At',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
        description: '格式：2026-06-07 15:30（年-月-日 时:分）',
        components: {
          Cell: '@/components/admin/PublishedAtCell#PublishedAtCell',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }

            return value
          },
        ],
      },
    },
    slugField({ fieldToUse: 'title' }),
    {
      name: 'sourcePlatform',
      type: 'text',
      label: '源平台',
      admin: {
        position: 'sidebar',
        description: '如：知乎、小红书、搜狐。保存时若留空且填写了原网址，会自动识别。',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: '原网址',
      admin: {
        position: 'sidebar',
        description: '灵感来源的原始文章 URL（用于排重与溯源）',
      },
    },
    {
      name: 'sourceTitle',
      type: 'text',
      label: '原标题',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'contentFingerprint',
      type: 'text',
      label: '内容指纹',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: '根据摘要自动计算，用于排重。无需手填。',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        const excerpt = typeof data.excerpt === 'string' ? data.excerpt : ''
        if (excerpt) {
          data.contentFingerprint = contentFingerprint(excerpt)
        }

        const sourceUrl = typeof data.sourceUrl === 'string' ? data.sourceUrl : ''
        if (sourceUrl && !data.sourcePlatform) {
          data.sourcePlatform = detectSourcePlatform(sourceUrl)
        }

        return data
      },
    ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 500,
      },
    },
    maxPerDoc: 20,
  },
}
