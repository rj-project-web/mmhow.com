import { getPayloadClient } from '@/lib/payload'

export type SiteCategory = {
  id: number | string
  name: string
  slug: string
  description?: string | null
}

export async function getAllCategories(): Promise<SiteCategory[]> {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'name',
  })

  return docs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
  }))
}
