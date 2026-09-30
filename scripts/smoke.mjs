// Usage: node scripts/smoke.mjs [url]
// Cross-browser smoke test (Chromium, Firefox, WebKit at 390 and 1176): render, nav menu,
// carousels and smooth in-page scrolling without a URL hash.
import { chromium, firefox, webkit } from 'playwright'

const url = process.argv[2] ?? 'http://localhost:5173/'
const results = []
for (const [name, type] of [['chromium', chromium], ['firefox', firefox], ['webkit', webkit]]) {
  let browser
  try {
    browser = await type.launch()
  } catch (e) {
    results.push({ browser: name, error: `launch failed: ${e.message.split('\n')[0]}` })
    continue
  }
  for (const width of [390, 1176]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    const r = { browser: name, width }
    try {
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1500)
      r.render = await page.evaluate(() => ({
        sections: document.querySelectorAll('main section').length,
        h1: document.querySelector('h1').getBoundingClientRect().height > 0,
        imagesLoaded: [...document.querySelectorAll('#hero img')].filter((i) => i.getBoundingClientRect().width).every((i) => i.complete && i.naturalWidth > 0),
      }))

      const toggle = page.getByRole('button', { name: 'Menu' })
      await toggle.click()
      await page.waitForTimeout(700)
      const openH = await page.locator('#site-menu').evaluate((e) => e.getBoundingClientRect().height)
      await page.keyboard.press('Escape')
      await page.waitForTimeout(700)
      r.menu = `open ${Math.round(openH)}px, aria-expanded after Esc=${await toggle.getAttribute('aria-expanded')}`

      // Smooth scroll: sample scrollY while the hero CTA scrolls to the properties section.
      const samples = []
      await page.locator('section#hero a').first().click()
      for (let i = 0; i < 12; i++) {
        samples.push(Math.round(await page.evaluate(() => scrollY)))
        await page.waitForTimeout(100)
      }
      const target = await page.evaluate(() => Math.round(document.getElementById('properties').getBoundingClientRect().top))
      r.smoothScroll = `${samples.filter((v, i) => i && v !== samples[i - 1]).length} intermediate steps, end ${samples.at(-1)}, properties top ${target}px, url ${new URL(page.url()).hash || 'no hash'}`

      const services = page.locator('section#services')
      const track = services.locator('.cursor-grab > div')
      if (await track.isVisible()) {
        await services.scrollIntoViewIfNeeded()
        const tx = () => track.evaluate((e) => Math.round(new DOMMatrix(getComputedStyle(e).transform).m41))
        const before = await tx()
        await services.getByRole('button', { name: 'Next' }).click()
        await page.waitForTimeout(1300)
        r.servicesCarousel = `${before} → ${await tx()}`
      } else r.servicesCarousel = 'grid'

      const t = page.locator('section#testimonials')
      await t.scrollIntoViewIfNeeded()
      await t.getByRole('button', { name: 'Go to slide 2' }).click()
      await page.waitForTimeout(1300)
      r.testimonialDots = await t.locator('button').evaluateAll((d) => d.map((b) => (b.getAttribute('aria-current') === 'true' ? '●' : '○')).join(''))
    } catch (e) {
      r.error = e.message.split('\n')[0]
    }
    r.consoleErrors = errors.length
    results.push(r)
    await page.close()
  }
  await browser.close()
}
for (const r of results) console.log(JSON.stringify(r))
