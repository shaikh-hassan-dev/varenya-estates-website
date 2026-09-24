// Usage: node scripts/measure-sections.mjs <url> [label] [screenshotDir]
// Prints hero, about, properties and services geometry per viewport width as JSON.
import { chromium } from 'playwright'

const [url, label = 'build', shotDir] = process.argv.slice(2)
const widths = [390, 700, 768, 1024, 1176, 1440, 1920]

// Reference entrance animations fire once per element when it is 20% inside the viewport and finish
// within 0.04s x words + 0.6s + 0.7s (about 3.1s for the longest paragraph). Scroll the whole page
// through, wait 4s, then return to the top so every section is captured in its settled state.
export async function settle(page) {
  await page.evaluate(() => document.fonts.ready)
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y <= height; y += 300) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(80)
  }
  await page.waitForTimeout(4000)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
}

// Properties and services: boxes are [x, y relative to section top, width, height].
const sections = (page) =>
  page.evaluate(() => {
    const sec = (id) => document.querySelector(`#${id} section`) ?? document.querySelector(`section#${id}`)
    const r1 = (v) => Math.round(v * 10) / 10
    const box = (el, top) => { const b = el.getBoundingClientRect(); return [b.x, b.y - top, b.width, b.height].map(r1) }
    const shown = (el) => el.getBoundingClientRect().width > 0
    const props = sec('properties')
    const pTop = props.getBoundingClientRect().top
    const grid = props.querySelector('.grid')
    const services = sec('services')
    const sTop = services.getBoundingClientRect().top
    const sGrid = services.querySelector('.grid-cols-4')
    const carousel = sGrid && shown(sGrid) ? null : services.querySelector('.cursor-grab')
    const sCards = [...services.querySelectorAll('[class*="aspect-6/7"]')].filter(shown)
    const controls = carousel && carousel.nextElementSibling
    return {
      propertiesH: r1(props.getBoundingClientRect().height),
      propGrid: box(grid, pTop),
      propCards: [...grid.children].map((c) => {
        const h3 = c.querySelector('h3')
        return {
          card: box(c, pTop),
          img: box(c.querySelector('img').parentElement, pTop),
          text: box(c.lastElementChild, pTop),
          price: c.querySelector('span').getBoundingClientRect().width.toFixed(1),
          titleTruncated: h3.scrollWidth > h3.clientWidth,
        }
      }),
      servicesH: r1(services.getBoundingClientRect().height),
      servicesMode: carousel ? 'carousel' : 'grid',
      serviceCards: sCards.map((c) => box(c, sTop)),
      serviceTitle: box(sCards[0].querySelector('h3'), sTop),
      flip: box(sCards[0].querySelector('.size-8'), sTop),
      controls: controls ? { row: box(controls, sTop), progress: box(controls.querySelector('.h-2'), sTop), buttons: [...controls.querySelectorAll('button')].map((b) => [...box(b, sTop), b.disabled]) } : null,
    }
  })

const browser = await chromium.launch()
const out = {}
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await settle(page)
  if (shotDir && [390, 768, 1176].includes(width)) {
    for (const id of ['hero', 'about', 'properties', 'services']) {
      const el = page.locator(`#${id} section`).or(page.locator(`section#${id}`)).first()
      await el.screenshot({ path: `${shotDir}/${label}-${id}-${width}.png`, animations: 'disabled' })
    }
  }
  out[width] = { ...(await sections(page)), ...(await page.evaluate(() => {
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
  })) }
  await page.close()
}
await browser.close()
console.log(JSON.stringify(out, null, 1))
