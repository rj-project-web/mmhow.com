import { NextResponse } from 'next/server'

import { authenticateAgentRequest, AgentAuthError } from '@/lib/agent/auth'
import { getPayloadClient } from '@/lib/payload'

/** List categories (for Agent to pick slug when publishing). */
export async function GET(request: Request) {
  try {
    await authenticateAgentRequest(request.headers)
    const payload = await getPayloadClient()

    const { docs } = await payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'name',
    })

    return NextResponse.json({
      success: true,
      categories: docs.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
      })),
    })
  } catch (error) {
    if (error instanceof AgentAuthError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.status })
    }

    console.error('[agent/categories]', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
