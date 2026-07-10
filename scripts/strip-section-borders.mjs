import { readFile, writeFile } from 'node:fs/promises'

const targets = [
  'app/about/page.tsx',
  'app/categories/page.tsx',
  'app/nominees/page.tsx',
  'app/sponsorship/page.tsx',
  'components/home/Partnership.tsx',
  'components/home/GalleryPreview.tsx',
  'components/home/Objectives.tsx',
  'components/home/NomineesSection.tsx',
  'components/home/Experience.tsx',
  'components/home/HowItWorks.tsx',
  'components/home/Categories.tsx',
  'components/home/About.tsx',
]

for (const file of targets) {
  const src = await readFile(file, 'utf8')
  let out = src
    .replace(/border-t border-hairline bg-surface/g, 'bg-surface')
    .replace(/border-t border-hairline /g, '')
    .replace(/ border-t border-hairline/g, '')
    .replace(/className="border-t border-hairline"/g, 'className=""')
  await writeFile(file, out)
}

console.log('done')
