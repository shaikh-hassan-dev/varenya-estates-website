// Motion layer: Lenis smooth scrolling and GSAP entrance animations, matching the reference's
// framer-motion values. Under prefers-reduced-motion everything renders in its final state (NV-06).
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import Lenis from 'lenis'

gsap.registerPlugin(CustomEase)

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// framer-motion "easeOut" and the reference's word easing.
export const easeOut = CustomEase.create('framerEaseOut', '0,0,0.58,1')
export const wordEase = CustomEase.create('framerWord', '0.25,0.46,0.45,0.94')

// Reference: <ReactLenis root /> with Lenis defaults.
export const lenis = reducedMotion ? null : new Lenis({ autoRaf: true })

/** Reference click handling for in-page targets: never writes the hash to the URL. */
export function scrollToTarget(target: string) {
  if (!target.startsWith('#')) return
  const el = document.getElementById(target.slice(1))
  if (!el) return // "#" placeholders do nothing, as in the reference
  setTimeout(() => {
    if (lenis) lenis.scrollTo(el, { offset: 0 })
    else el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
  }, 50)
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
}

/** Runs `play` once, the first time `el` intersects the viewport shrunk by `margin` (framer whileInView, once). */
export function onceInView(el: Element, margin: string, play: () => void) {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect()
        play()
      }
    },
    { rootMargin: margin },
  )
  io.observe(el)
  return () => io.disconnect()
}

export type RevealOptions = { y: number; duration: number; delay?: number; margin: string }

/** Fade and slide up once in view; inline styles are cleared at the end so the settled DOM is untouched. */
export function reveal(el: HTMLElement, { y, duration, delay = 0, margin }: RevealOptions) {
  if (reducedMotion) return
  gsap.set(el, { opacity: 0, y })
  const stop = onceInView(el, margin, () =>
    gsap.to(el, { opacity: 1, y: 0, duration, delay, ease: easeOut, clearProps: 'opacity,transform' }),
  )
  return () => {
    stop()
    gsap.killTweensOf(el)
    gsap.set(el, { clearProps: 'opacity,transform' })
  }
}
