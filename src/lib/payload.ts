import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getPayloadClient() {
  const config = await configPromise
  return getPayload({ config })
}

export function formatDate(value?: string | null) {
  if (!value) return ''

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function getMediaUrl(url?: string | null) {
  if (!url) return null
  if (url.startsWith('http')) return url
  // Same-origin CMS files: relative path so Next.js Image localPatterns match.
  if (url.startsWith('/api/media/')) return url
  return `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`
}
