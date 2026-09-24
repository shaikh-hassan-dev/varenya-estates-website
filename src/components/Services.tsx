import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { content, type Service } from '../content/content'
import { Photo } from './Photo'
import { SectionHeader } from './SectionHeader'

const { services } = content
type EmblaCarouselType = NonNullable<UseEmblaCarouselType[1]>

const icon = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

// Reference reveal card. Every group-hover state is mirrored by group-focus-visible for keyboard users.
function Card({ item, n }: { item: Service; n: number }) {
  return (
    <div tabIndex={0} className="group relative overflow-hidden aspect-6/7 rounded">
      <Photo image={item.image} className="absolute inset-0" />
      <div className="absolute top-4 left-4 xl:top-6 xl:left-6 2xl:top-8 2xl:left-8 z-20 perspective-[1000px]">
        <div className="relative size-8 transform-3d transition-transform duration-400 group-hover:rotate-y-180 group-focus-visible:rotate-y-180">
          <div className="absolute inset-0 flex items-center justify-center text-sm rounded bg-background backface-hidden text-foreground">
            <p>{n}</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded bg-background backface-hidden rotate-y-180">
            <svg {...icon} strokeWidth="1.5" className="h-1/2 w-1/2 text-foreground">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute -inset-x-px -bottom-px h-2/5 backdrop-blur-xl mask-fade-top-overlay" aria-hidden="true" />
      <div className="absolute inset-x-2 bottom-2 xl:inset-x-3 xl:bottom-3 2xl:inset-x-4 2xl:bottom-4 z-10">
        <div className="relative flex flex-col gap-0 group-hover:gap-1 xl:group-hover:gap-2 2xl:group-hover:gap-3 group-focus-visible:gap-1 xl:group-focus-visible:gap-2 2xl:group-focus-visible:gap-3 p-2 xl:p-3 2xl:p-4 transition-all duration-400">
          <div className="absolute inset-0 -z-10 card rounded translate-y-full opacity-0 transition-all duration-400 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100" />
          <h3 className="text-2xl font-semibold leading-snug text-white transition-colors duration-400 group-hover:text-foreground group-focus-visible:text-foreground">
            {item.title}
          </h3>
          <div className="grid grid-rows-[0fr] transition-all duration-400 ease-out group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
            <p className="overflow-hidden text-sm leading-snug text-foreground opacity-0 transition-opacity duration-400 group-hover:opacity-100 group-focus-visible:opacity-100">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const arrow = 'flex items-center justify-center h-8 aspect-square secondary-button rounded cursor-pointer disabled:opacity-50'

export function Services() {
  // Reference options; everything else is Embla's default (no loop, no autoplay, align centre, duration 25).
  const [viewportRef, embla] = useEmblaCarousel({ dragFree: true, containScroll: 'trimSnaps' })
  const [prevDisabled, setPrevDisabled] = useState(true)
  // Initial state matches the reference at load: start position, so Previous off, Next on, progress 0.
  const [nextDisabled, setNextDisabled] = useState(false)
  const [progress, setProgress] = useState(0)

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setPrevDisabled(!api.canScrollPrev())
    setNextDisabled(!api.canScrollNext())
  }, [])
  const onScroll = useCallback((api: EmblaCarouselType) => {
    setProgress(Math.max(0, Math.min(1, api.scrollProgress())) * 100)
  }, [])

  useEffect(() => {
    if (!embla) return
    embla.on('reInit', onSelect).on('select', onSelect).on('reInit', onScroll).on('scroll', onScroll)
    return () => {
      embla.off('reInit', onSelect).off('select', onSelect).off('reInit', onScroll).off('scroll', onScroll)
    }
  }, [embla, onSelect, onScroll])

  return (
    <section id="services" aria-label="Services section" className="py-20">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeader {...services} />
        <div>
          {/* ≥1536px: static four-column grid. Below: carousel. The hidden copy is display:none. */}
          <div className="hidden 2xl:grid grid-cols-4 gap-5 mx-auto w-content-width">
            {services.items.map((item, i) => (
              <Card key={item.title} item={item} n={i + 1} />
            ))}
          </div>
          <div className="flex flex-col gap-5 w-full overflow-hidden 2xl:hidden">
            <div ref={viewportRef} className="w-full cursor-grab">
              <div className="flex gap-4 items-stretch">
                <div className="shrink-0 w-carousel-padding" />
                {services.items.map((item, i) => (
                  <div key={item.title} className="shrink-0 *:h-full w-carousel-item-3 2xl:w-carousel-item-4">
                    <Card item={item} n={i + 1} />
                  </div>
                ))}
                <div className="shrink-0 w-carousel-padding" />
              </div>
            </div>
            <div className="flex w-full">
              <div className="shrink-0 w-carousel-padding-controls" />
              <div className="flex justify-between items-center w-full">
                <div className="relative h-2 w-1/2 card rounded overflow-hidden" aria-hidden="true">
                  <div
                    className="absolute top-0 bottom-0 -left-full w-full primary-button rounded"
                    style={{ transform: `translate3d(${progress}%,0px,0px)` }}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => embla?.scrollPrev()} disabled={prevDisabled} aria-label={services.carousel.previous} className={arrow}>
                    <svg {...icon} strokeWidth="2" className="h-2/5 aspect-square text-secondary-cta-text">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button type="button" onClick={() => embla?.scrollNext()} disabled={nextDisabled} aria-label={services.carousel.next} className={arrow}>
                    <svg {...icon} strokeWidth="2" className="h-2/5 aspect-square text-secondary-cta-text">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="shrink-0 w-carousel-padding-controls" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
