import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const TARGET = 'http://localhost:3000'
const OUT = 'screenshots/responsive'

const devices = [
  { name: 'phone-360', width: 360, height: 800 },
  { name: 'phone-414', width: 414, height: 896 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'tablet-1024', width: 1024, height: 1366 },
  { name: 'laptop-1280', width: 1280, height: 800 },
  { name: 'desktop-1920', width: 1920, height: 1080 },
  { name: 'wide-2560', width: 2560, height: 1440 },
]

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })

for (const device of devices) {
  const context = await browser.newContext({
    viewport: { width: device.width, height: device.height },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  await page.goto(TARGET, { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(2600)

  const stops = [0, 1.5, 3.4, 6]
  for (let i = 0; i < stops.length; i += 1) {
    await page.evaluate(y => window.scrollTo(0, y), stops[i] * device.height)
    await page.waitForTimeout(1200)
    await page.screenshot({
      path: `${OUT}/${device.name}-${i}.png`,
    })
  }
  console.log(`${device.name} captured`)
  await context.close()
}

await browser.close()
console.log('responsive capture complete')
