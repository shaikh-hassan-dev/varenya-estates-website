// Usage: node scripts/measure-p4.mjs <url> [label] [screenshotDir]
// Prints team, metrics and testimonials geometry per viewport width as JSON.
// Boxes are [x, y relative to section top, width, height].
import { chromium } from 'playwright'

const [url, label = 'build', shotDir] = process.argv.slice(2)
const widths = [390, 700, 768, 1024, 1176, 1440, 1920]

// Same settling as measure-sections.mjs: entrance animations finish before anything is read.
async function settle(page) {
  await page.evaluate(() => document.fonts.ready)
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y <= height; y += 300) {
    await page.evaluate((y) => window.scrollTo(0, y), y)
    await page.waitForTimeout(80)
  }
  await page.waitForTimeout(4000)
}

const measure = (page) =>
  page.evaluate(() => {
    const sec = (id) => document.querySelector(`#${id} section`) ?? document.querySelector(`section#${id}`)
    const r1 = (v) => Math.round(v * 10) / 10
    const shown = (el) => el.getBoundingClientRect().width > 0
    const at = (top) => (el) => { const b = el.getBoundingClientRect(); return [b.x, b.y - top, b.width, b.height].map(r1) }
    const cut = (el) => el.scrollWidth > el.clientWidth

    const team = sec('team')
    const tBox = at(team.getBoundingClientRect().top)
    const tGrid = team.querySelector('.grid')
    const teamOut = {
      h: r1(team.getBoundingClientRect().height),
      header: tBox(team.querySelector('h2').parentElement),
      grid: tBox(tGrid),
      cards: [...tGrid.children].map((c) => {
        const bar = c.querySelector('.backdrop-blur-sm')
        return { card: tBox(c), bar: tBox(bar), name: tBox(bar.firstElementChild), nameCut: cut(bar.firstElementChild), role: tBox(bar.lastElementChild) }
      }),
    }

    const met = sec('metrics')
    const mBox = at(met.getBoundingClientRect().top)
    const mGrid = met.querySelector('.grid-cols-4')
    const carousel = mGrid && shown(mGrid) ? null : met.querySelector('.cursor-grab')
    const mCards = [...met.querySelectorAll('.min-h-70')].filter(shown)
    const controls = carousel && carousel.nextElementSibling
    const metricsOut = {
      h: r1(met.getBoundingClientRect().height),
      mode: carousel ? 'carousel' : 'grid',
      cards: mCards.map((c) => {
        const [row, value] = c.children
        const lbl = row.lastElementChild
        return {
          card: mBox(c), icon: mBox(row.firstElementChild), label: mBox(lbl), labelText: lbl.textContent, labelCut: cut(lbl),
          labelNatural: r1(lbl.scrollWidth), value: mBox(value), valueText: value.textContent, valueCut: cut(value),
          valueNatural: r1(value.scrollWidth), valueFont: getComputedStyle(value).fontSize, valueWeight: getComputedStyle(value).fontWeight,
        }
      }),
      controls: controls ? { row: mBox(controls), progress: mBox(controls.querySelector('.h-2')), buttons: [...controls.querySelectorAll('button')].map((b) => [...mBox(b), b.disabled]) } : null,
    }

    const tes = sec('testimonials')
    const sBox = at(tes.getBoundingClientRect().top)
    const viewport = tes.querySelector('.overflow-hidden')
    const slides = [...viewport.firstElementChild.children]
    const slide = (s) => {
      const card = s.firstElementChild
      const [left, media] = card.children
      return {
        slide: sBox(s), card: sBox(card), left: sBox(left), tag: sBox(left.querySelector('.card')), h3: sBox(left.querySelector('h3')),
        quote: sBox(left.querySelector('h3 + p')), avatar: sBox(left.querySelector('img')), name: sBox(left.querySelector('span')), media: sBox(media),
      }
    }
    const dots = [...tes.querySelectorAll('button')]
    const testimonialsOut = {
      h: r1(tes.getBoundingClientRect().height),
      viewport: sBox(viewport),
      track: getComputedStyle(viewport.firstElementChild).transform,
      slides: slides.map(slide),
      dots: dots.map((d) => [...sBox(d), getComputedStyle(d).backgroundColor]),
    }
    return { team: teamOut, metrics: metricsOut, testimonials: testimonialsOut }
  })

const browser = await chromium.launch()
const out = {}
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await settle(page)
  if (shotDir && [390, 768, 1176].includes(width)) {
    for (const id of ['team', 'metrics', 'testimonials']) {
      const el = page.locator(`#${id} section`).or(page.locator(`section#${id}`)).first()
      await el.scrollIntoViewIfNeeded()
      await page.waitForTimeout(300)
      await el.screenshot({ path: `${shotDir}/${label}-${id}-${width}.png`, animations: 'disabled' })
    }
  }
  out[width] = await measure(page)
  await page.close()
}
await browser.close()
console.log(JSON.stringify(out, null, 1))
