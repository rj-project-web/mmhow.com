/** Canonical public site origin (no trailing slash). */
export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.mmhow.com').replace(/\/$/, '')
}

export function absoluteUrl(path: string) {
  const base = getSiteUrl()
  if (path.startsWith('http')) return path
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
