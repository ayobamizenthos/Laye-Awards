import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const TARGET = process.argv[2] ?? 'http://localhost:3000'
const SLUG = process.argv[3] ?? 'home'
const OUT = 'screenshots'

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome' })

for (const vp of viewports) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()
  await page.goto(TARGET, { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(5400)

  let frame = 0
  let lastScroll = -1
  for (let i = 0; i < 20; i += 1) {
    await page.screenshot({
      path: `${OUT}/${SLUG}-${vp.name}-${String(frame).padStart(2, '0')}.png`,
    })
    frame += 1

    const { scrollY, maxScroll } = await page.evaluate(
      step => {
        window.scrollBy(0, step)
        return {
          scrollY: window.scrollY,
          maxScroll: document.body.scrollHeight - window.innerHeight,
        }
      },
      Math.round(vp.height * 0.82)
    )

    await page.waitForTimeout(1100)
    if (scrollY >= maxScroll || scrollY === lastScroll) break
    lastScroll = scrollY
  }

  console.log(`${vp.name}: ${frame} frames`)
  await context.close()
}

await browser.close()
console.log('capture complete')
