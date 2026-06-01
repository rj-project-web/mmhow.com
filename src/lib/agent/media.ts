import type { Payload, PayloadRequest } from 'payload'

export type AgentImageInput = {
  url: string
  alt?: string
  caption?: string
}

function parseDataUrl(url: string): { buffer: Buffer; contentType: string; name: string } {
  const match = url.match(/^data:([^;,]+)?(?:;base64)?,(.*)$/s)
  if (!match) {
    throw new Error(`Invalid data URL: ${url.slice(0, 80)}…`)
  }

  const contentType = match[1] || 'application/octet-stream'
  const payload = match[2]
  const buffer = url.includes(';base64,')
    ? Buffer.from(payload, 'base64')
    : Buffer.from(decodeURIComponent(payload), 'utf8')

  const ext =
    contentType === 'image/svg+xml'
      ? 'svg'
      : contentType === 'image/png'
        ? 'png'
        : contentType === 'image/webp'
          ? 'webp'
          : 'jpg'

  return {
    buffer,
    contentType,
    name: `upload-${Date.now()}.${ext}`,
  }
}

export async function uploadImageFromUrl(
  payload: Payload,
  req: PayloadRequest,
  input: AgentImageInput,
): Promise<number | string> {
  let buffer: Buffer
  let contentType: string
  let name: string

  if (input.url.startsWith('data:')) {
    ;({ buffer, contentType, name } = parseDataUrl(input.url))
  } else {
    const response = await fetch(input.url)

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${input.url} (${response.status})`)
    }

    contentType = response.headers.get('content-type') || 'image/jpeg'
    buffer = Buffer.from(await response.arrayBuffer())
    const urlPath = new URL(input.url).pathname
    const fallbackName = `image-${Date.now()}.jpg`
    const rawName = urlPath.split('/').pop()?.split('?')[0] || fallbackName
    name = rawName.includes('.') ? rawName : `${rawName}.jpg`
  }

  const media = await payload.create({
    collection: 'media',
    data: {
      alt: input.alt || name,
      caption: input.caption,
    },
    file: {
      data: buffer,
      mimetype: contentType,
      name,
      size: buffer.length,
    },
    req,
  })

  return media.id
}
