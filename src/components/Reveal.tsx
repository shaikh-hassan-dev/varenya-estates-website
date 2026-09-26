import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { reveal, type RevealOptions } from '../motion'

// Reference ScrollReveal "slide-up": opacity 0→1, y 20px→0, 0.6s easeOut, once, 20% inside the viewport.
const scrollReveal: RevealOptions = { y: 20, duration: 0.6, margin: '-20%' }

export function Reveal({
  children,
  className,
  delay = 0,
  options = scrollReveal,
}: {
  children: ReactNode
  className?: string
  delay?: number
  options?: RevealOptions
}) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => reveal(ref.current!, { ...options, delay }), [options, delay])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
