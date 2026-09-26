import { useEffect, useRef, type MouseEvent } from 'react'
import { gsap } from 'gsap'
import type { Link } from '../content/content'
import { reducedMotion, scrollToTarget } from '../motion'
import { Reveal } from './Reveal'

const variants = {
  primary: 'primary-button text-primary-cta-text',
  secondary: 'secondary-button text-secondary-cta-text',
}

// Reference button entrance: opacity 0→1, y 20px→0, 0.6s easeOut, once, as soon as any part is in view.
const buttonReveal = { y: 20, duration: 0.6, margin: '0px' }

// Reference magnetic hover (≥768px): the button follows 15% of the cursor's offset from its centre
// through a spring (stiffness 150, damping 15, mass 1) and springs back to rest on leave.
function useMagnetic() {
  const ref = useRef<HTMLAnchorElement>(null)
  const state = useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 })

  useEffect(() => {
    const el = ref.current!
    const s = state.current
    const tick = (_t: number, deltaMs: number) => {
      const steps = Math.ceil(Math.min(deltaMs, 64) / 4)
      const dt = Math.min(deltaMs, 64) / 1000 / steps
      for (let i = 0; i < steps; i++) {
        s.vx += (-150 * (s.x - s.tx) - 15 * s.vx) * dt
        s.vy += (-150 * (s.y - s.ty) - 15 * s.vy) * dt
        s.x += s.vx * dt
        s.y += s.vy * dt
      }
      const resting = Math.abs(s.x - s.tx) + Math.abs(s.y - s.ty) + Math.abs(s.vx) + Math.abs(s.vy) < 0.01
      if (resting) {
        s.x = s.tx
        s.y = s.ty
        s.vx = s.vy = 0
        gsap.ticker.remove(tick)
      }
      el.style.transform = s.x || s.y ? `translateX(${s.x}px) translateY(${s.y}px)` : ''
    }
    const to = (tx: number, ty: number) => {
      s.tx = tx
      s.ty = ty
      gsap.ticker.remove(tick)
      gsap.ticker.add(tick)
    }
    const move = (e: globalThis.MouseEvent) => {
      if (window.innerWidth < 768) return
      const r = el.getBoundingClientRect()
      to((e.clientX - r.left - r.width / 2) * 0.15, (e.clientY - r.top - r.height / 2) * 0.15)
    }
    const leave = () => to(0, 0)
    if (reducedMotion) return
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
      gsap.ticker.remove(tick)
    }
  }, [])

  return ref
}

export function Button({
  label,
  target,
  variant = 'primary',
  className = '',
  animate = true,
  delay = 0,
}: Link & { variant?: keyof typeof variants; className?: string; animate?: boolean; delay?: number }) {
  const ref = useMagnetic()
  const onClick = (e: MouseEvent) => {
    if (!target.startsWith('#')) return
    e.preventDefault()
    scrollToTarget(target)
  }
  const link = (
    <a
      ref={ref}
      href={target}
      onClick={onClick}
      className={`flex items-center justify-center h-10 px-6 text-sm rounded cursor-pointer ${variants[variant]} ${className}`}
    >
      {label}
    </a>
  )
  return animate ? (
    <Reveal options={buttonReveal} delay={delay}>
      {link}
    </Reveal>
  ) : (
    link
  )
}
