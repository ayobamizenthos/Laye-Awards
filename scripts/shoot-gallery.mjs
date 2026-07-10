import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.LAYE_BASE ?? 'http://localhost:3000'
const OUT = 'screenshots'
await mkdir(OUT, { recursive: true })

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]

const browser = await chromium.launch({ channel: 'chrome' })
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  await page.goto(`${BASE}/gallery`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3500)
  await page.screenshot({ path: `${OUT}/gallery-${vp.name}.png`, fullPage: true })
  console.log(`${vp.name} done`)
  await ctx.close()
}
await browser.close()
