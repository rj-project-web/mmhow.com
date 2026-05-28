import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { authorName, authorEmail, content, article } = body

    if (!authorName || !content || !article) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = await getPayloadClient()

    const created = await payload.create({
      collection: 'comments',
      data: {
        authorName,
        authorEmail: authorEmail || undefined,
        content,
        article,
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, id: created.id })
  } catch (error) {
    console.error('Comment submission failed:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
