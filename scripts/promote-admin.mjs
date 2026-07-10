import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import pg from 'pg'

const here = dirname(fileURLToPath(import.meta.url))
loadEnv({ path: join(here, '..', '.env.local') })

const email = process.argv[2]
if (!email) {
  console.error('Usage: node scripts/promote-admin.mjs <email>')
  process.exit(1)
}

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
  const { rowCount } = await client.query(
    `update public.profiles
        set role = 'admin'
      where id = (select id from auth.users where lower(email) = lower($1))
      returning id`,
    [email]
  )
  if (rowCount === 0) {
    console.error(`× No user found with email ${email}. Have they registered yet?`)
    process.exit(1)
  }
  console.log(`✓ ${email} is now an admin.`)
} catch (err) {
  console.error('× Promotion failed:', err.message)
  process.exit(1)
} finally {
  await client.end()
}
