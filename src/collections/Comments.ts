import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/access'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'article', 'status', 'createdAt'],
  },
  access: {
    create: anyone,
    delete: authenticated,
    read: ({ req: { user } }) => {
      if (user) return true

      return {
        status: {
          equals: 'approved',
        },
      }
    },
    update: authenticated,
  },
  fields: [
    {
      name: 'authorName',
      type: 'text',
      required: true,
    },
    {
      name: 'authorEmail',
      type: 'email',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'article',
      type: 'relationship',
      relationTo: 'articles',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
