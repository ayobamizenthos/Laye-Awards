import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'

const BASE = process.env.LAYE_BASE ?? 'http://localhost:3000'
const OUT = join('screenshots', 'responsive')
await mkdir(OUT, { recursive: true })

const viewports = [
  { name: 'mobile-320', width: 320, height: 720 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-414', width: 414, height: 896 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'tablet-1024', width: 1024, height: 1366 },
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'ultrawide-2560', width: 2560, height: 1440 },
]

const pages = [
  { path: '/', slug: 'home' },
  { path: '/about', slug: 'about' },
  { path: '/categories', slug: 'categories' },
  { path: '/nominees', slug: 'nominees' },
  { path: '/sponsorship', slug: 'sponsorship' },
  { path: '/gallery', slug: 'gallery' },
  { path: '/contact', slug: 'contact' },
  { path: '/apply', slug: 'apply' },
  { path: '/login', slug: 'login' },
  { path: '/register', slug: 'register' },
  { path: '/admin', slug: 'admin' },
  { path: '/admin/applications', slug: 'admin-applications' },
  { path: '/admin/nominees', slug: 'admin-nominees' },
  { path: '/admin/votes', slug: 'admin-votes' },
  { path: '/admin/settings', slug: 'admin-settings' },
  { path: '/dashboard/profile', slug: 'dashboard-profile' },
]

const browser = await chromium.launch({ channel: 'chrome' })

const authContext = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  storageState: undefined,
})
const authPage = await authContext.newPage()
await authPage.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
await authPage.fill('input[type="email"]', 'layeaward@gmail.com')
const password = process.env.LAYE_PASSWORD
if (!password) {
  console.error('LAYE_PASSWORD env var missing — set it for admin captures.')
} else {
  await authPage.fill('input[type="password"]', password)
  await authPage.click('button[type="submit"]')
  await authPage.waitForURL(/\/(admin|dashboard)/, { timeout: 15000 }).catch(() => null)
}
const storage = await authContext.storageState()
await authContext.close()

for (const vp of viewports) {
  console.log(`\n=== ${vp.name} ${vp.width}x${vp.height} ===`)
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    storageState: storage,
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  for (const target of pages) {
    try {
      await page.goto(`${BASE}${target.path}`, { waitUntil: 'load', timeout: 30000 })
      await page.waitForTimeout(1800)
      await page.screenshot({
        path: join(OUT, `${target.slug}-${vp.name}.png`),
        fullPage: false,
      })
      console.log(`  ✓ ${target.slug}`)
    } catch (error) {
      console.log(`  × ${target.slug} — ${error.message}`)
    }
  }
  await context.close()
}

await browser.close()
console.log('\nDone. Screenshots at', OUT)
