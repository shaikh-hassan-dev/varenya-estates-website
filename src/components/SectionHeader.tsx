import type { SectionCopy } from '../content/content'
import { AnimatedText } from './AnimatedText'
import { Button } from './Button'
import { Reveal } from './Reveal'

// About tag entrance (reference): opacity 0→1, y 10px→0, 0.4s easeOut, once, 15% inside the viewport.
const tagReveal = { y: 10, duration: 0.4, margin: '-15%' }

type Props = SectionCopy & {
  /** Hero renders an H1; every heading gets the reference's gradient-clipped text once animated in. */
  level?: 1 | 2
  /** Heading size utilities; defaults to the reference's section H2 scale. */
  size?: string
  /** Light text for use over the about image overlay. */
  light?: boolean
  className?: string
}

export function SectionHeader({
  eyebrow,
  heading,
  intro,
  ctas,
  level = 2,
  size = 'text-6xl 2xl:text-7xl',
  light = false,
  className = 'gap-2 w-content-width mx-auto',
}: Props) {
  const tone = light ? 'text-primary-cta-text' : 'md:max-w-8/10'
  // Reference settled state. Over the about image the light text colour wins, so the text stays opaque.
  const gradient = `bg-gradient-to-r from-foreground to-primary-cta bg-clip-text ${light ? '' : 'text-transparent'} pb-[0.1em] -mb-[0.1em]`

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {light ? (
        <Reveal options={tagReveal} className="px-3 py-1 mb-1 text-sm card rounded w-fit">
          <p>{eyebrow}</p>
        </Reveal>
      ) : (
        <div className="px-3 py-1 mb-1 text-sm card rounded w-fit">
          <p>{eyebrow}</p>
        </div>
      )}
      <AnimatedText
        tag={level === 1 ? 'h1' : 'h2'}
        text={heading}
        gradient={gradient}
        className={`${tone} ${size} leading-[1.15] font-semibold text-center text-balance`}
      />
      {intro && (
        <AnimatedText
          tag="p"
          text={intro}
          className={`${light ? 'text-primary-cta-text' : 'md:max-w-7/10'} text-lg md:text-xl leading-snug text-center text-balance`}
        />
      )}
      {ctas && (
        <div className="flex flex-wrap justify-center gap-3 mt-2 md:mt-3">
          {ctas.map((cta, i) => (
            <Button key={cta.label} {...cta} variant={i === 0 ? 'primary' : 'secondary'} delay={i === 0 ? 0 : 0.1} />
          ))}
        </div>
      )}
    </div>
  )
}
