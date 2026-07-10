import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const TARGET = process.argv[2] ?? 'http://localhost:3000'
const OUT = 'screenshots'
await mkdir(OUT, { recursive: true })

const viewports = [
  { name: 'mobile-small', width: 360, height: 740 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
]

const browser = await chromium.launch({ channel: 'chrome' })
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  await page.goto(TARGET, { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(5500)
  await page.click('button[aria-label="Open menu"]')
  await page.waitForTimeout(1100)
  await page.screenshot({ path: `${OUT}/menu-${vp.name}.png` })
  console.log(`${vp.name} captured`)
  await ctx.close()
}
await browser.close()
