// Usage: node scripts/measure-page.mjs <url> [label] [screenshotDir]
// Full-page geometry per viewport width: every section's top and height, page height,
// contact card and footer boxes. Boxes are [x, y relative to section top, width, height].
import { chromium } from 'playwright'

const [url, label = 'build', shotDir] = process.argv.slice(2)
const widths = [390, 700, 768, 1024, 1176, 1440, 1920]
const ids = ['hero', 'about', 'properties', 'services', 'team', 'metrics', 'testimonials', 'contact']

async function settle(page) {
  await page.evaluate(() => document.fonts.ready)
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y <= height; y += 300) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(80)
  }
  await page.waitForTimeout(4000)
}

const browser = await chromium.launch()
const out = {}
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await settle(page)
  if (shotDir && [390, 768, 1176].includes(width)) {
    for (const [id, loc] of [['contact', page.locator('#contact section, section#contact').first()], ['footer', page.locator('footer')]]) {
      await loc.scrollIntoViewIfNeeded()
      await page.waitForTimeout(300)
      await loc.screenshot({ path: `${shotDir}/${label}-${id}-${width}.png`, animations: 'disabled' })
    }
  }
  out[width] = await page.evaluate((ids) => {
    const r1 = (v) => Math.round(v * 10) / 10
    const sec = (id) => document.querySelector(`#${id} section`) ?? document.querySelector(`section#${id}`)
    const at = (top) => (el) => { const b = el.getBoundingClientRect(); return [b.x, b.y - top, b.width, b.height].map(r1) }
    const sections = Object.fromEntries(ids.map((id) => { const b = sec(id).getBoundingClientRect(); return [id, [r1(b.top + scrollY), r1(b.height)]] }))
    const contact = sec('contact')
    const cBox = at(contact.getBoundingClientRect().top)
    const card = contact.querySelector('.card.py-20')
    const footer = document.querySelector('footer')
    const fBox = at(footer.getBoundingClientRect().top)
    const cols = [...footer.querySelectorAll('h3')].map((h) => h.parentElement)
    return {
      pageH: document.documentElement.scrollHeight,
      sections,
      contact: { card: cBox(card), h2: cBox(card.querySelector('h2')), h2Font: getComputedStyle(card.querySelector('h2')).fontSize, buttons: [...card.querySelectorAll('a')].map(cBox) },
      footer: {
        box: fBox(footer),
        cols: cols.map(fBox),
        items: cols.map((c) => [...c.querySelectorAll('button')].map((b) => fBox(b).slice(1, 4).join(' ')).join(' / ')),
        bottom: [...footer.querySelectorAll('span')].map(fBox),
      },
    }
  }, ids)
  await page.close()
}
await browser.close()
console.log(JSON.stringify(out, null, 1))
