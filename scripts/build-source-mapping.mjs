#!/usr/bin/env node
/** @deprecated Use `npm run source-mapping:sync` instead. */
import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const script = join(dirname(fileURLToPath(import.meta.url)), 'sync-source-mapping.mjs')
const result = spawnSync(process.execPath, [script], { stdio: 'inherit', env: process.env })
process.exit(result.status ?? 1)
