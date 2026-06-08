import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { formatDateTime } from '@/lib/datetime'

export async function getPayloadClient() {
  const config = await configPromise
  return getPayload({ config })
}

/** Published At / comment dates: `2026-06-07 15:30` */
export function formatDate(value?: string | null) {
  return formatDateTime(value)
}

export function getMediaUrl(url?: string | null) {
  if (!url) return null
  if (url.startsWith('http')) return url
  // Same-origin CMS files: relative path so Next.js Image localPatterns match.
  if (url.startsWith('/api/media/')) return url
  return `${process.env.NEXT_PUBLIC_SERVER_URL}${url}`
}

/** Payload media URLs must bypass the Next.js image optimizer on same-origin paths. */
export function isCmsMediaUrl(url?: string | null) {
  if (!url) return false
  return url.includes('/api/media/file/')
}
