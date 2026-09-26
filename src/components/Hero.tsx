import { content } from '../content/content'
import { Photo } from './Photo'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const { hero } = content

const card = 'p-2 xl:p-3 2xl:p-4 card rounded overflow-hidden'

// Desktop row: alternating tilt and offset, each card stacked above the previous one.
const tilt = [
  '-rotate-6 z-10 -translate-y-5',
  'rotate-6 z-20 translate-y-5 -ml-15',
  '-rotate-6 z-30 -translate-y-5 -ml-15',
  'rotate-6 z-40 translate-y-5 -ml-15',
  '-rotate-6 z-50 -translate-y-5 -ml-15',
]

// Decorative vertical bars fading in from each side, as in the reference.
const bars = (direction: '90deg' | '270deg') =>
  Array.from({ length: 8 }, (_, i) => (
    <div
      key={i}
      className={`h-full flex-1 min-w-[30px] max-w-[82px] opacity-[0.075] ${direction === '90deg' ? 'bg-[linear-gradient(90deg,var(--color-primary-cta),transparent)]' : 'bg-[linear-gradient(270deg,var(--color-primary-cta),transparent)]'}`}
    />
  ))

export function Hero() {
  return (
    <section id="hero" aria-label="Hero section" className="relative h-svh md:h-auto pt-25 pb-20 md:pt-30">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div className="flex h-4/5 w-full justify-between mask-[linear-gradient(0deg,transparent_0%,black_100%)]">
          <div className="flex h-full w-[35%] overflow-hidden mask-[linear-gradient(270deg,transparent_0%,black_100%)]">{bars('90deg')}</div>
          <div className="flex h-full w-[35%] justify-end overflow-hidden mask-[linear-gradient(90deg,transparent_0%,black_100%)]">{bars('270deg')}</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-12 md:gap-15 w-full md:w-content-width mx-auto">
        <SectionHeader {...hero} level={1} size="text-7xl 2xl:text-8xl" className="gap-3 w-content-width mx-auto" />

        {/* Mobile: seamless marquee (track duplicated, animation moves it by half). Paused for reduced motion. */}
        <Reveal delay={0.2} className="block md:hidden w-full overflow-hidden mask-padding-x">
          <div className="flex w-max animate-marquee-horizontal motion-reduce:[animation-play-state:paused]">
            {[...hero.images, ...hero.images].map((image, i) => (
              <div key={i} aria-hidden={i >= hero.images.length || undefined} className={`shrink-0 w-[50vw] mr-5 aspect-4/5 ${card}`}>
                <Photo image={image} eager />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2} className="hidden md:flex justify-center items-center w-full">
          {/* w-full: the reference wrapper shrink-wraps and settles at full width once images load;
              fixing it at full width gives the same layout without the load-time shift. */}
          <div className="flex items-center justify-center w-full">
            {hero.images.map((image, i) => (
              <div
                key={i}
                className={`relative w-[23%] aspect-4/5 ${card} shadow-lg transition-transform duration-500 ease-out hover:scale-110 ${tilt[i]}`}
              >
                <Photo image={image} eager />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
