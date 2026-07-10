import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import pg from 'pg'

const here = dirname(fileURLToPath(import.meta.url))
loadEnv({ path: join(here, '..', '.env.local') })

const client = new pg.Client({
  host: 'aws-1-eu-west-2.pooler.supabase.com',
  port: 5432,
  user: 'postgres.xulhnbldvotnqwbxfpht',
  password: process.env.SUPABASE_DB_PASSWORD,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
})

const email = process.argv[2]
if (!email) {
  console.error('Usage: node scripts/check-user.mjs <email>')
  process.exit(1)
}

try {
  await client.connect()
  const { rows } = await client.query(
    `select u.id, u.email, u.email_confirmed_at, p.full_name, p.role, p.created_at
     from auth.users u
     left join public.profiles p on p.id = u.id
     where lower(u.email) = lower($1)`,
    [email]
  )
  if (rows.length === 0) {
    console.log(`No user with email ${email}`)
  } else {
    console.log(JSON.stringify(rows[0], null, 2))
  }
} finally {
  await client.end()
}
