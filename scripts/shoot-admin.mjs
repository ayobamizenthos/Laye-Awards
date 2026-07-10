import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.LAYE_BASE ?? 'http://localhost:3000'
const PASSWORD = process.env.LAYE_PASSWORD
const OUT = 'screenshots'
await mkdir(OUT, { recursive: true })

if (!PASSWORD) {
  console.error('LAYE_PASSWORD env required')
  process.exit(1)
}

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'mobile-small', width: 360, height: 740 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]

const browser = await chromium.launch({ channel: 'chrome' })

for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', 'layeaward@gmail.com')
  await page.fill('input[type="password"]', PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL(
    url => url.pathname.startsWith('/admin') || url.pathname.startsWith('/dashboard'),
    {
      timeout: 30000,
    }
  )
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  await page.screenshot({ path: `${OUT}/admin-${vp.name}.png`, fullPage: true })
  console.log(`${vp.name} captured`)
  await ctx.close()
}

await browser.close()
