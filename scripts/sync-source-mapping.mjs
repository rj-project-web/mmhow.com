#!/usr/bin/env node
/**
 * Export source mapping FROM CMS to docs/source-mapping.csv + xlsx (backup only).
 * Source of truth: Payload Admin → Articles (sourceUrl, sourceTitle, sourcePlatform).
 *
 * Usage: node --env-file=.env --import tsx/esm scripts/sync-source-mapping.mjs
 */
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

process.chdir(ROOT)

const { exportSourceMappingFiles } = await import('../src/lib/agent/source-mapping.ts')
const { default: config } = await import('../src/payload.config.ts')
const { getPayload } = await import('payload')

const payload = await getPayload({ config })
const count = await exportSourceMappingFiles(payload)

console.log(`Exported ${count} published articles → docs/source-mapping.csv (+ xlsx if available)`)
process.exit(0)
