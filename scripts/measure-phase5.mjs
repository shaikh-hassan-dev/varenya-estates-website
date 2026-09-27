// Usage: node scripts/measure-phase5.mjs <url> [label]
// Motion checks: entrance timelines, magnetic hover, in-page navigation without a URL hash,
// and prefers-reduced-motion. Run against the reference and the build and compare the output.
import { chromium } from 'playwright'

const [url = 'http://localhost:5173/', label = 'build'] = process.argv.slice(2)
const sel = (id) => `#${id} section, section#${id}`
const browser = await chromium.launch()
const log = (...a) => console.log(label.padEnd(9), ...a)

// Opacity / translateY of an element (inline-block words: first and last word).
const probe = (s) =>
  document.querySelector(s) &&
  (() => {
    const sec = document.querySelector(s)
    const st = (e) => {
      if (!e) return '-'
      const c = getComputedStyle(e)
      return `${(+c.opacity).toFixed(2)}/${new DOMMatrix(c.transform).m42.toFixed(1)}`
    }
    const words = (el) => {
      const w = el.querySelectorAll('.inline-block')
      return w.length ? `${st(w[0])}..${st(w[w.length - 1])}` : 'text'
    }
    return `h2 ${words(sec.querySelector('h2'))} | p ${words(sec.querySelector('h2 + p'))} | grid ${st(sec.querySelector('.grid')?.parentElement)} | btn ${st(sec.querySelector('a')?.parentElement)}`
  })()

// 1. Entrance timeline of the properties section, reached by wheel scrolling (as a user would).
{
  const page = await browser.newPage({ viewport: { width: 1176, height: 900 } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.mouse.move(600, 450)
  const top = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, sel('properties'))
  while ((await page.evaluate(() => scrollY)) < top - 900 * 0.45 - 60) {
    await page.mouse.wheel(0, 120)
    await page.waitForTimeout(30)
  }
  const t0 = Date.now()
  for (let i = 0; i < 12; i++) {
    log(`entrance ${String(Date.now() - t0).padStart(4)}ms`, await page.evaluate(probe, sel('properties')))
    await page.waitForTimeout(i < 6 ? 100 : 300)
  }
  await page.close()
}

// 2. Magnetic hover at 1176 and 700 ("See all properties", cursor +20px/+8px from its centre).
// Not the hero button: in the reference the tilted hero cards cover it at 1176 once images load.
for (const width of [1176, 700]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  await page.goto(url, { waitUntil: 'networkidle' })
  const a = page.locator(`${sel('properties')} a`).first()
  // Wheel, not scrollIntoView: the reference's Lenis instance overrides programmatic scrolling.
  await page.mouse.move(width / 2, 450)
  while ((await a.boundingBox()).y > 450) {
    await page.mouse.wheel(0, 120)
    await page.waitForTimeout(30)
  }
  await page.waitForTimeout(2500)
  const bb = await a.boundingBox()
  await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 5 })
  await page.mouse.move(bb.x + bb.width / 2 + 20, bb.y + bb.height / 2 + 8, { steps: 5 })
  const tl = []
  for (let i = 0; i < 10; i++) {
    // Read the inline transform: both sites set translateX/translateY on the element's style.
    tl.push(await a.evaluate((e) => (e.style.transform.match(/-?[\d.]+(?=px)/g) ?? ['0', '0']).map((v) => (+v).toFixed(2)).join(',')))
    await page.waitForTimeout(100)
  }
  await page.mouse.move(5, 5, { steps: 3 })
  await page.waitForTimeout(1500)
  log(`magnetic ${width}`, tl.join(' '), '| after leave:', await a.evaluate((e) => e.style.transform || 'none'))
  await page.close()
}

// 3. In-page navigation never adds a hash (build only: the reference logo leaves the template page).
if (label === 'build') {
  const page = await browser.newPage({ viewport: { width: 1176, height: 900 } })
  await page.goto(url, { waitUntil: 'networkidle' })
  const check = async (name, action, target) => {
    if (target) {
      await target.scrollIntoViewIfNeeded()
      await page.waitForTimeout(1500)
    }
    const before = await page.evaluate(() => scrollY)
    await action()
    await page.waitForTimeout(2500)
    log(`no-hash ${name.padEnd(28)} url=${page.url()} scrollY ${Math.round(before)}→${Math.round(await page.evaluate(() => scrollY))}`)
  }
  await check('hero "Explore Properties"', () => page.locator(`${sel('hero')} a`).first().click())
  const services = page.getByRole('button', { name: 'Our Services' })
  await check('footer "Our Services"', () => services.click(), services)
  const blog = page.getByRole('button', { name: 'Blog' })
  await check('footer "Blog" (placeholder)', () => blog.click(), blog)
  await check('nav logo', () => page.locator('nav a').first().click())
  await check('nav menu "Team"', async () => {
    await page.getByRole('button', { name: 'Menu' }).click()
    await page.waitForTimeout(600)
    await page.locator('#site-menu a', { hasText: 'Team' }).click()
  })
  await page.close()
}

// 4. prefers-reduced-motion: final states immediately, no Lenis, marquee paused, no magnetic.
if (label === 'build') {
  for (const width of [390, 1176]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(100)
    const r = await page.evaluate(() => ({
      hiddenInline: [...document.querySelectorAll('[style]')].filter((e) => e.style.opacity === '0').length,
      splitWords: document.querySelectorAll('.inline-block').length,
      lenis: document.documentElement.classList.contains('lenis'),
      marquee: getComputedStyle(document.querySelector('.animate-marquee-horizontal')).animationPlayState,
      firstSectionOpacity: getComputedStyle(document.querySelector('section#properties .grid').parentElement).opacity,
    }))
    let magnetic = 'n/a'
    if (width >= 768) {
      const a = page.locator(`${sel('hero')} a`).first()
      const bb = await a.boundingBox()
      await page.mouse.move(bb.x + bb.width / 2 + 20, bb.y + bb.height / 2 + 8, { steps: 5 })
      await page.waitForTimeout(400)
      magnetic = await a.evaluate((e) => e.style.transform || 'none')
    }
    log(`reduced-motion ${width}`, JSON.stringify({ ...r, magnetic }))
    await context.close()
  }
}

await browser.close()
