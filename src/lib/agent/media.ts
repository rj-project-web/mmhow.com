import type { Payload, PayloadRequest } from 'payload'

export type AgentImageInput = {
  url: string
  alt?: string
  caption?: string
}

export async function uploadImageFromUrl(
  payload: Payload,
  req: PayloadRequest,
  input: AgentImageInput,
): Promise<number | string> {
  const response = await fetch(input.url)

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${input.url} (${response.status})`)
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const buffer = Buffer.from(await response.arrayBuffer())
  const urlPath = new URL(input.url).pathname
  const fallbackName = `image-${Date.now()}.jpg`
  const name = urlPath.split('/').pop()?.split('?')[0] || fallbackName

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
