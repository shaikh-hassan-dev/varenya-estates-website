import type { SectionCopy } from '../content/content'
import { Button } from './Button'

type Props = SectionCopy & {
  /** Hero renders an H1 with the reference's gradient-clipped text. */
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
  const Heading = level === 1 ? 'h1' : 'h2'
  const tone = light ? 'text-primary-cta-text' : 'md:max-w-8/10'
  const gradient = level === 1 ? 'bg-gradient-to-r from-foreground to-primary-cta bg-clip-text text-transparent pb-[0.1em] -mb-[0.1em]' : ''

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="px-3 py-1 mb-1 text-sm card rounded w-fit">
        <p>{eyebrow}</p>
      </div>
      <Heading className={`${gradient} ${tone} ${size} leading-[1.15] font-semibold text-center text-balance`}>
        {heading}
      </Heading>
      {intro && (
        <p className={`${light ? 'text-primary-cta-text' : 'md:max-w-7/10'} text-lg md:text-xl leading-snug text-center text-balance`}>
          {intro}
        </p>
      )}
      {ctas && (
        <div className="flex flex-wrap justify-center gap-3 mt-2 md:mt-3">
          {ctas.map((cta, i) => (
            <Button key={cta.label} {...cta} variant={i === 0 ? 'primary' : 'secondary'} />
          ))}
        </div>
      )}
    </div>
  )
}
