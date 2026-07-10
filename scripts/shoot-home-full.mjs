import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.LAYE_BASE ?? 'http://localhost:3000'
const OUT = 'screenshots'
await mkdir(OUT, { recursive: true })

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

const browser = await chromium.launch({ channel: 'chrome' })
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(4500)
  await page.screenshot({ path: `${OUT}/home-${vp.name}.png`, fullPage: true })
  console.log(`${vp.name} done`)
  await ctx.close()
}
await browser.close()
