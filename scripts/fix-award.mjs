import { chromium } from 'playwright'
import path from 'path'
import fs from 'fs'
;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1024, height: 1024 },
  })

  // Read images and convert to base64
  const bgImageBase64 = fs.readFileSync(path.resolve('public/award-promo.png')).toString('base64')
  const badgeBase64 = fs.readFileSync(path.resolve('public/laye-emblem.png')).toString('base64')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 0; width: 1024px; height: 1024px; overflow: hidden; background: url('data:image/png;base64,${bgImageBase64}'); background-size: cover; font-family: 'Times New Roman', serif; }
        .plaque-cover {
          position: absolute;
          left: 410px;
          top: 735px;
          width: 220px;
          height: 95px;
          background: rgba(204, 169, 87, 0.2);
          backdrop-filter: blur(8px) contrast(0.9) brightness(1.1);
          -webkit-backdrop-filter: blur(8px) contrast(0.9) brightness(1.1);
          transform-origin: center;
          transform: perspective(500px) rotateX(20deg) rotateY(12deg) rotateZ(-2deg) skewX(-3deg);
          border-radius: 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 5px 5px 5px 35px;
          box-sizing: border-box;
          color: #1a1610;
          position: relative;
        }
        .badge {
          position: absolute;
          left: 5px;
          top: 10px;
          width: 25px;
          height: auto;
          filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
        }
        .plaque-cover h1 { font-size: 6px; margin: 0 0 4px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
        .plaque-cover h2 { font-size: 10px; margin: 0 0 5px -25px; width: calc(100% + 25px); font-weight: bold; background: #1a1610; color: #cca957; padding: 2px 5px; text-transform: uppercase; }
        .plaque-cover p { font-size: 6px; margin: 0 0 0 -25px; width: calc(100% + 25px); font-weight: bold; }
        .plaque-cover .edition { font-size: 7px; margin-top: 3px; margin-left: -25px; width: calc(100% + 25px); font-weight: bold; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <div class="plaque-cover">
        <img src="data:image/png;base64,${badgeBase64}" class="badge" />
        <h1>Young Philanthropic Social<br>Impact Entrepreneur<br>of the Year</h1>
        <h2>[ WINNER NAME ]</h2>
        <p>Lagos Young Entrepreneur Awards 2026</p>
        <div class="edition">Seventh Edition</div>
      </div>
    </body>
    </html>
  `

  await page.setContent(html)
  await page.screenshot({ path: 'public/award-promo-fixed.png' })
  await browser.close()
})()
