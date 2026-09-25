import { Children, useCallback, useEffect, useState, type ReactNode } from 'react'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { content } from '../content/content'
import { icon } from './icon'

type EmblaCarouselType = NonNullable<UseEmblaCarouselType[1]>
const { carousel } = content

const arrow = 'flex items-center justify-center h-8 aspect-square secondary-button rounded cursor-pointer disabled:opacity-50'

// Reference GridOrCarousel: up to 3 items render as a static grid; 4 items render as a static
// four-column grid at ≥1536px and as a carousel below (the hidden copy is display:none).
export function GridOrCarousel({ children }: { children: ReactNode }) {
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

  const items = Children.toArray(children)
  if (items.length <= 3) {
    const cols = items.length === 3 ? 'md:grid-cols-3' : items.length === 2 ? 'md:grid-cols-2' : ''
    return (
      <div>
        <div className={`grid grid-cols-1 gap-5 mx-auto w-content-width ${cols}`}>{children}</div>
      </div>
    )
  }
  const four = items.length === 4

  return (
    <div>
      {four && <div className="hidden 2xl:grid grid-cols-4 gap-5 mx-auto w-content-width">{children}</div>}
      <div className={`flex flex-col gap-5 w-full overflow-hidden ${four ? '2xl:hidden' : ''}`}>
        <div ref={viewportRef} className="w-full cursor-grab">
          <div className="flex gap-4 items-stretch">
            <div className="shrink-0 w-carousel-padding" />
            {items.map((item, i) => (
              <div key={i} className="shrink-0 *:h-full w-carousel-item-3 2xl:w-carousel-item-4">
                {item}
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
              <button type="button" onClick={() => embla?.scrollPrev()} disabled={prevDisabled} aria-label={carousel.previous} className={arrow}>
                <svg {...icon} strokeWidth="2" className="h-2/5 aspect-square text-secondary-cta-text">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button type="button" onClick={() => embla?.scrollNext()} disabled={nextDisabled} aria-label={carousel.next} className={arrow}>
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
  )
}
