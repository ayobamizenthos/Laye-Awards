import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
;(async () => {
  const inputPath = path.resolve(process.argv[2] || 'public/award-promo.png')
  const outputPath = path.resolve(process.argv[3] || 'public/award-hero.png')

  const imgBase64 = fs.readFileSync(inputPath).toString('base64')

  // Target: 1920x900 (roughly 21:9 ultrawide hero)
  const W = 1920
  const H = 900

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: W, height: H } })

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; }
        body {
          width: ${W}px;
          height: ${H}px;
          overflow: hidden;
          background: #141110;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        /* Ambient golden bokeh glow on sides */
        .glow-left {
          position: absolute;
          left: -100px;
          top: 50%;
          transform: translateY(-50%);
          width: 500px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%);
          filter: blur(60px);
        }
        .glow-right {
          position: absolute;
          right: -100px;
          top: 50%;
          transform: translateY(-50%);
          width: 500px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%);
          filter: blur(60px);
        }
        .glow-center {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 700px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 60%);
          filter: blur(40px);
        }
        .trophy {
          position: relative;
          z-index: 2;
          height: 100%;
          width: auto;
          object-fit: contain;
        }
      </style>
    </head>
    <body>
      <div class="glow-left"></div>
      <div class="glow-right"></div>
      <div class="glow-center"></div>
      <img src="data:image/png;base64,${imgBase64}" class="trophy" />
    </body>
    </html>
  `

  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.screenshot({ path: outputPath, type: 'png' })
  await browser.close()

  console.log(`Created landscape hero: ${outputPath} (${W}x${H})`)
})()
