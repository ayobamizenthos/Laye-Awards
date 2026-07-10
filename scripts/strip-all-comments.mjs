import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, extname } from 'node:path'
import strip from 'strip-comments'

const ROOTS = ['app', 'components', 'lib', 'config', 'types', 'scripts']
const SQL_DIRS = ['supabase/migrations', 'supabase/seeds']
const CSS_PATHS = ['app/globals.css']
const JS_EXT = new Set(['.ts', '.tsx', '.js', '.mjs'])
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', '.vercel'])

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const p = join(dir, entry.name)
    if (entry.isDirectory()) await walk(p, out)
    else out.push(p)
  }
  return out
}

const tidy = src =>
  src
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+/, '')

function stripJsx(src) {
  let out = strip(src, { preserveNewlines: false, keepProtected: true })
  out = out.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '')
  return tidy(out) + '\n'
}

function stripSql(src) {
  const lines = src.split('\n').filter(line => !/^\s*--/.test(line))
  let joined = lines.join('\n').replace(/\/\*[\s\S]*?\*\//g, '')
  return tidy(joined) + '\n'
}

function stripCss(src) {
  return tidy(src.replace(/\/\*[\s\S]*?\*\//g, '')) + '\n'
}

const targets = []
for (const root of ROOTS) {
  for (const file of await walk(root)) {
    if (JS_EXT.has(extname(file))) targets.push({ file, kind: 'js' })
  }
}
for (const dir of SQL_DIRS) {
  for (const file of await walk(dir)) {
    if (extname(file) === '.sql') targets.push({ file, kind: 'sql' })
  }
}
for (const file of CSS_PATHS) targets.push({ file, kind: 'css' })

let touched = 0
for (const { file, kind } of targets) {
  const original = await readFile(file, 'utf8')
  const cleaned =
    kind === 'js' ? stripJsx(original) : kind === 'sql' ? stripSql(original) : stripCss(original)
  if (cleaned !== original) {
    await writeFile(file, cleaned)
    touched += 1
    console.log(`  ${file}`)
  }
}

console.log(`\n${touched} files cleaned of ${targets.length} scanned.`)
