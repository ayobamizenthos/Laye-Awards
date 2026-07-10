import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const TARGET = process.argv[2] ?? 'http://localhost:3000'
const OUT = 'screenshots'
await mkdir(OUT, { recursive: true })

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
]

const browser = await chromium.launch({ channel: 'chrome' })
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  await page.goto(TARGET, { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(6000)
  await page.screenshot({ path: `${OUT}/hero-${vp.name}.png` })
  console.log(`${vp.name} captured`)
  await ctx.close()
}
await browser.close()
