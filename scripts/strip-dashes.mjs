import fs from 'node:fs'
import path from 'node:path'

const exts = new Set(['.ts', '.tsx'])
const roots = ['app', 'components', 'config', 'lib', 'types']
let touched = 0

const walk = dir => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p)
    else if (exts.has(path.extname(entry.name))) process(p)
  }
}

const process = file => {
  const before = fs.readFileSync(file, 'utf8')
  let src = before

  src = src.replace(/\s+—\s+/g, ', ')
  src = src.replace(/—\s/g, ', ')
  src = src.replace(/\s—/g, ',')
  src = src.replace(/—/g, ', ')

  src = src.replace(/\s+–\s+/g, ' to ')
  src = src.replace(/(\d)\s*–\s*(\d)/g, '$1-$2')
  src = src.replace(/–/g, '-')

  if (src !== before) {
    fs.writeFileSync(file, src)
    touched += 1
    console.log('updated', file)
  }
}

for (const root of roots) {
  if (fs.existsSync(root)) walk(root)
}
console.log(`done — ${touched} files updated`)
