// Usage: node scripts/measure.mjs [url] [screenshotDir]
// Prints computed font sizes, H1 line count and nav box per viewport width.
import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://localhost:5173/'
const shotDir = process.argv[3]
const widths = [390, 700, 768, 1024, 1176, 1280, 1440, 1536, 1920]

const browser = await chromium.launch()
const rows = []
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  if (shotDir && [390, 768, 1176].includes(width)) await page.screenshot({ path: `${shotDir}/shell-${width}.png`, fullPage: true })
  rows.push(
    await page.evaluate((width) => {
      const host = document.querySelector('#properties')
      // Probe: H3 uses the reference card-title classes; cards are not built yet.
      if (!host.querySelector('h3')) {
        const h3 = document.createElement('h3')
        h3.className = 'text-2xl font-semibold leading-snug'
        h3.textContent = 'Probe'
        host.append(h3)
      }
      const fs = (sel) => parseFloat(getComputedStyle(document.querySelector(sel)).fontSize)
      const h1 = document.querySelector('h1')
      const cs = getComputedStyle(h1)
      const lines = Math.round((h1.getBoundingClientRect().height - parseFloat(cs.paddingBottom)) / parseFloat(cs.lineHeight))
      const nav = document.querySelector('nav').getBoundingClientRect()
      const bar = document.querySelector('nav > div').getBoundingClientRect()
      return {
        width,
        h1: fs('h1'),
        h2: fs('#properties h2'),
        h3: fs('#properties h3'),
        p: fs('#properties p'),
        intro: fs('#properties h2 + p'),
        logo: fs('nav a'),
        h1Lines: lines,
        nav: `${Math.round(nav.width)}x${Math.round(nav.height)}`,
        bar: `${Math.round(bar.width)}x${Math.round(bar.height)}`,
      }
    }, width),
  )
  await page.close()
}

// QA-01: render a rupee price and ask the browser which font actually drew it.
const page = await browser.newPage()
await page.goto(url, { waitUntil: 'networkidle' })
await page.evaluate(() => {
  const el = document.createElement('p')
  el.id = 'price-probe'
  el.textContent = '₹85,00,00,000'
  document.body.append(el)
  return document.fonts.ready
})
const cdp = await page.context().newCDPSession(page)
await cdp.send('DOM.enable')
await cdp.send('CSS.enable')
const { root } = await cdp.send('DOM.getDocument')
const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#price-probe' })
const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId })
await browser.close()

console.table(rows)
console.log('QA-01 fonts used for "₹85,00,00,000":', fonts.map((f) => `${f.familyName} (${f.glyphCount} glyphs, ${f.isCustomFont ? 'web font' : 'system'})`).join(', '))
