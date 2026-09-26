import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { onceInView, reducedMotion, wordEase } from '../motion'

// Reference TextAnimation "slide-up": the text is split into inline-block words that rise from
// y 50% with opacity 0→1 (0.6s, stagger 0.04s) once 20% inside the viewport. 0.7s after the last
// word lands, the words are replaced by the plain text, so the settled DOM is a single text node.
export function AnimatedText({ text, tag: Tag, className }: { text: string; tag: 'h1' | 'h2' | 'p'; className: string }) {
  const ref = useRef<HTMLElement>(null)
  const [done, setDone] = useState(reducedMotion)

  useLayoutEffect(() => {
    if (done) return
    const words = ref.current!.querySelectorAll('.inline-block')
    gsap.set(words, { opacity: 0, yPercent: 50 })
    let timer = 0
    const stop = onceInView(ref.current!, '-20%', () =>
      gsap.to(words, {
        opacity: 1,
        yPercent: 0,
        duration: 0.6,
        ease: wordEase,
        stagger: 0.04,
        onComplete: () => void (timer = window.setTimeout(() => setDone(true), 700)),
      }),
    )
    return () => {
      stop()
      clearTimeout(timer)
      gsap.killTweensOf(words)
    }
  }, [done])

  return (
    <Tag ref={ref as never} className={className}>
      {done
        ? text
        : text.split(' ').map((word, i) => (
            <span key={i}>
              {i > 0 && ' '}
              <span className="inline-block">{word}</span>
            </span>
          ))}
    </Tag>
  )
}
