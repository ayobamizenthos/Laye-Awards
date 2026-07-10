import { Jimp } from 'jimp'

const SRC = 'laye-logo.png'
const THRESHOLD = 58

const base = await Jimp.read(SRC)
const { width, height } = base.bitmap
const data = base.bitmap.data

const isDark = i => data[i] < THRESHOLD && data[i + 1] < THRESHOLD && data[i + 2] < THRESHOLD

const seen = new Uint8Array(width * height)
const stack = []
for (let x = 0; x < width; x += 1) {
  stack.push(x, (height - 1) * width + x)
}
for (let y = 0; y < height; y += 1) {
  stack.push(y * width, y * width + width - 1)
}
while (stack.length) {
  const p = stack.pop()
  if (seen[p]) continue
  seen[p] = 1
  const i = p * 4
  if (!isDark(i)) continue
  data[i + 3] = 0
  const x = p % width
  const y = (p / width) | 0
  if (x > 0) stack.push(p - 1)
  if (x < width - 1) stack.push(p + 1)
  if (y > 0) stack.push(p - width)
  if (y < height - 1) stack.push(p + width)
}

const opaque = (x, y) => data[(y * width + x) * 4 + 3] > 16

let fMinX = width,
  fMinY = height,
  fMaxX = 0,
  fMaxY = 0
const rowCount = new Array(height).fill(0)
for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    if (opaque(x, y)) {
      rowCount[y] += 1
      if (x < fMinX) fMinX = x
      if (x > fMaxX) fMaxX = x
      if (y < fMinY) fMinY = y
      if (y > fMaxY) fMaxY = y
    }
  }
}

const emblemTop = fMinY
const emblemBottom = fMinY + Math.round((fMaxY - fMinY) * 0.685)
let eMinX = width,
  eMaxX = 0
for (let y = emblemTop; y <= emblemBottom; y += 1) {
  for (let x = 0; x < width; x += 1) {
    if (opaque(x, y)) {
      if (x < eMinX) eMinX = x
      if (x > eMaxX) eMaxX = x
    }
  }
}

const pad = 6
const clamp = (v, max) => Math.max(0, Math.min(v, max))

const emblem = base.clone()
emblem.crop({
  x: clamp(eMinX - pad, width),
  y: clamp(emblemTop - pad, height),
  w: clamp(eMaxX - eMinX + pad * 2, width),
  h: clamp(emblemBottom - emblemTop + pad * 2, height),
})
await emblem.write('public/laye-emblem.png')

base.crop({
  x: clamp(fMinX - pad, width),
  y: clamp(fMinY - pad, height),
  w: clamp(fMaxX - fMinX + pad * 2, width),
  h: clamp(fMaxY - fMinY + pad * 2, height),
})
await base.write('public/laye-logo.png')

console.log(`source ${width}x${height}`)
console.log(`emblem ${emblem.bitmap.width}x${emblem.bitmap.height}`)
console.log(`full   ${base.bitmap.width}x${base.bitmap.height}`)
