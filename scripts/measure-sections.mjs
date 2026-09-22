// Usage: node scripts/measure-sections.mjs <url> [label] [screenshotDir]
// Prints hero/about section heights and image boxes per viewport width as JSON.
import { chromium } from 'playwright'

const [url, label = 'build', shotDir] = process.argv.slice(2)
const widths = [390, 700, 768, 1024, 1176, 1440, 1920]

const browser = await chromium.launch()
const out = {}
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(2500) // let any entrance animation settle
  if (shotDir && [390, 768, 1176].includes(width)) {
    for (const id of ['hero', 'about']) {
      const el = page.locator(`#${id} section`).or(page.locator(`section#${id}`)).first()
      await el.screenshot({ path: `${shotDir}/${label}-${id}-${width}.png`, animations: 'disabled' })
    }
  }
  out[width] = await page.evaluate(() => {
    const sec = (id) => document.querySelector(`#${id} section`) ?? document.querySelector(`section#${id}`)
    const hero = sec('hero')
    const about = sec('about')
    const rect = (el) => { const b = el.getBoundingClientRect(); return [b.x, b.y + scrollY, b.width, b.height].map((v) => Math.round(v * 10) / 10) }
    const visible = (el) => el.getBoundingClientRect().width > 0
    const imgs = [...hero.querySelectorAll('img')].filter(visible)
    const marquee = hero.querySelector('.animate-marquee-horizontal')
    const cards = imgs.map((i) => i.parentElement)
    return {
      heroH: Math.round(hero.getBoundingClientRect().height * 10) / 10,
      aboutH: Math.round(about.getBoundingClientRect().height * 10) / 10,
      h1Lines: Math.round(document.querySelector('h1').getBoundingClientRect().height / parseFloat(getComputedStyle(document.querySelector('h1')).lineHeight)),
      mode: marquee && visible(marquee) ? 'marquee' : 'row',
      // Layout size (pre-transform) of each card and image, plus bounding box (post-transform) for the desktop row.
      cards: cards.slice(0, marquee && visible(marquee) ? 2 : 5).map((c) => ({
        card: `${c.offsetWidth}x${c.offsetHeight}`,
        img: `${c.firstElementChild.offsetWidth}x${c.firstElementChild.offsetHeight}`,
        bbox: rect(c),
        mr: getComputedStyle(c).marginRight,
      })),
      marquee: marquee && visible(marquee) ? { anim: getComputedStyle(marquee).animation, items: marquee.children.length, trackW: marquee.offsetWidth, mask: getComputedStyle(marquee.parentElement).maskImage } : null,
      aboutImg: rect(about.querySelector('img') ?? about.querySelector('.absolute')),
      aboutBox: rect(about.firstElementChild),
    }
  })
  await page.close()
}
await browser.close()
console.log(JSON.stringify(out, null, 1))
