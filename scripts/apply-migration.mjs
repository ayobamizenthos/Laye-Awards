import { readFile, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadEnv } from 'dotenv'
import pg from 'pg'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

loadEnv({ path: join(root, '.env.local') })

const PROJECT_REF = 'xulhnbldvotnqwbxfpht'
const REGION = 'eu-west-2'
const password = process.env.SUPABASE_DB_PASSWORD
if (!password) {
  console.error('SUPABASE_DB_PASSWORD is missing from .env.local')
  process.exit(1)
}

const POOLER_HOSTS = [
  `aws-1-${REGION}.pooler.supabase.com`,
  `aws-0-${REGION}.pooler.supabase.com`,
  `aws-2-${REGION}.pooler.supabase.com`,
]

async function connect() {
  for (const host of POOLER_HOSTS) {
    const candidate = new pg.Client({
      host,
      port: 5432,
      user: `postgres.${PROJECT_REF}`,
      password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10_000,
    })
    try {
      await candidate.connect()
      console.log(`Connected via ${host}`)
      return candidate
    } catch (err) {
      console.log(`  ${host} → ${err.message}, trying next`)
      try {
        await candidate.end()
      } catch {}
    }
  }
  throw new Error('Could not connect through any pooler shard')
}

async function readSqlFiles(dir) {
  const files = await readdir(dir)
  return files.filter(name => name.endsWith('.sql')).sort()
}

async function runFile(client, filePath, label) {
  const sql = await readFile(filePath, 'utf8')
  console.log(`\n→ ${label}`)
  await client.query(sql)
  console.log(`  done`)
}

async function main() {
  console.log('Connecting to Postgres …')
  const client = await connect()

  for (const target of ['migrations', 'seeds']) {
    const dir = join(root, 'supabase', target)
    const files = await readSqlFiles(dir)
    for (const name of files) {
      await runFile(client, join(dir, name), `${target}/${name}`)
    }
  }

  await client.end()
  console.log('\n✓ Schema applied. Categories seeded.')
}

main().catch(err => {
  console.error('\n× Migration failed:', err.message)
  if (err.detail) console.error('  detail:', err.detail)
  if (err.hint) console.error('  hint:', err.hint)
  process.exit(1)
})
