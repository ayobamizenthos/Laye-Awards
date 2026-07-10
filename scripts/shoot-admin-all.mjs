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

const routes = [
  { path: '/admin', slug: 'overview' },
  { path: '/admin/applications', slug: 'applications' },
  { path: '/admin/nominees', slug: 'nominees' },
  { path: '/admin/votes', slug: 'votes' },
  { path: '/admin/settings', slug: 'settings' },
]

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
]

const browser = await chromium.launch({ channel: 'chrome' })

for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', 'admin@layeaward.com')
  await page.fill('input[type="password"]', PASSWORD)
  await page.click('button[type="submit"]')
  try {
    await page.waitForURL(
      u => u.pathname.startsWith('/admin') || u.pathname.startsWith('/dashboard'),
      { timeout: 30000 }
    )
  } catch {
    await page.screenshot({ path: `${OUT}/admin-login-fail-${vp.name}.png` })
    const err = await page
      .locator('[role="alert"]')
      .first()
      .textContent()
      .catch(() => null)
    console.error('login failed', vp.name, err)
    await ctx.close()
    continue
  }
  for (const route of routes) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)
    await page.screenshot({
      path: `${OUT}/admin-${route.slug}-${vp.name}.png`,
      fullPage: true,
    })
    console.log(`${vp.name} ${route.slug}`)
  }
  await ctx.close()
}

await browser.close()
