import type { PayloadRequest, User } from 'payload'
import { headers as getHeaders } from 'next/headers'

import { getPayloadClient } from '@/lib/payload'

export async function authenticateAgentRequest(
  requestHeaders?: Headers,
): Promise<{ payload: Awaited<ReturnType<typeof getPayloadClient>>; user: User; req: PayloadRequest }> {
  const payload = await getPayloadClient()
  const headers = requestHeaders ?? (await getHeaders())

  const { user } = await payload.auth({ headers })

  if (!user) {
    throw new AgentAuthError('Unauthorized. Provide header: Authorization: users API-Key <your-key>')
  }

  const req = {
    headers,
    payload,
    user,
  } as PayloadRequest

  return { payload, user, req }
}

export class AgentAuthError extends Error {
  status = 401

  constructor(message: string) {
    super(message)
    this.name = 'AgentAuthError'
  }
}

export class AgentValidationError extends Error {
  status = 400

  constructor(message: string) {
    super(message)
    this.name = 'AgentValidationError'
  }
}
