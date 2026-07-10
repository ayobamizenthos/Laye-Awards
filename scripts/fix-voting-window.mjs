import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import pg from 'pg'

const here = dirname(fileURLToPath(import.meta.url))
loadEnv({ path: join(here, '..', '.env.local') })

const PROJECT_REF = 'xulhnbldvotnqwbxfpht'
const REGION = 'eu-west-2'

const client = new pg.Client({
  host: `aws-1-${REGION}.pooler.supabase.com`,
  port: 5432,
  user: `postgres.${PROJECT_REF}`,
  password: process.env.SUPABASE_DB_PASSWORD,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
})

try {
  await client.connect()
  const before = await client.query(
    'select voting_opens_at, voting_closes_at from voting_settings where id = 1'
  )
  console.log('Before:', before.rows[0])
  await client.query(
    `update voting_settings
        set voting_opens_at = '2026-08-20T00:00:00+01:00',
            voting_closes_at = '2026-09-30T23:59:59+01:00'
      where id = 1`
  )
  const after = await client.query(
    'select voting_opens_at, voting_closes_at from voting_settings where id = 1'
  )
  console.log('After:', after.rows[0])
} catch (err) {
  console.error('Failed:', err.message)
  process.exit(1)
} finally {
  await client.end()
}
