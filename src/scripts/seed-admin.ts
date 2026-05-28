/**
 * Create the first admin user (dev only).
 * Usage: npm run seed:admin
 */
import { getPayload } from 'payload'

import config from '../payload.config'

const email = process.env.SEED_ADMIN_EMAIL || 'admin@mmhow.com'
const password = process.env.SEED_ADMIN_PASSWORD || 'Mmhow1234!'

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    console.log('Users already exist. Skipping seed.')
    console.log('Existing:', existing.docs.map((u) => u.email).join(', '))
    process.exit(0)
  }

  const user = await payload.create({
    collection: 'users',
    data: {
      email,
      password,
      name: 'Admin',
    },
  })

  console.log('Admin user created:')
  console.log('  Email:   ', user.email)
  console.log('  Password:', password)
  console.log('  Login:   http://localhost:3001/admin')
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
