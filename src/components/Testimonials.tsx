import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { content } from '../content/content'
import { Photo } from './Photo'
import { SectionHeader } from './SectionHeader'

type EmblaCarouselType = NonNullable<UseEmblaCarouselType[1]>
const { testimonials, carousel } = content

// Reference split cards: looping Embla carousel (no autoplay, no arrows) with one dot per slide.
export function Testimonials() {
  const [viewportRef, embla] = useEmblaCarousel({ loop: true, align: 'center', containScroll: 'trimSnaps' })
  const [selected, setSelected] = useState(0)
  const onSelect = useCallback((api: EmblaCarouselType) => setSelected(api.selectedScrollSnap()), [])

  useEffect(() => {
    if (!embla) return
    embla.on('select', onSelect).on('reInit', onSelect)
    return () => {
      embla.off('select', onSelect).off('reInit', onSelect)
    }
  }, [embla, onSelect])

  return (
    <section id="testimonials" aria-label="Testimonials section" className="py-20">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeader {...testimonials} />
        <div className="flex flex-col">
          <div ref={viewportRef} className="overflow-hidden">
            <div className="flex">
              {testimonials.items.map((t) => (
                <div key={t.name} className="flex-none w-content-width md:w-[calc(var(--width-content-width)*0.8)] mr-5 mb-10">
                  <div className="flex flex-col justify-between md:grid md:grid-cols-2 h-full gap-6 p-6 md:p-10 card rounded overflow-hidden">
                    <div className="flex flex-col justify-between gap-4 md:gap-10">
                      <div className="flex flex-col gap-2">
                        <div className="px-3 py-1 mb-1 w-fit text-sm card rounded">
                          <p>{t.tag}</p>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-semibold leading-[1.15] text-balance">{t.title}</h3>
                        <p className="text-base md:text-lg leading-snug text-balance">{t.quote}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <img
                          src={t.avatar.src}
                          srcSet={t.avatar.srcSet}
                          alt={t.avatar.alt}
                          width={t.avatar.width}
                          height={t.avatar.height}
                          loading="lazy"
                          decoding="async"
                          className="min-h-0 size-10 md:size-11 2xl:size-12 rounded-full object-cover"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-base text-foreground font-semibold leading-snug truncate">{t.name}</span>
                          <span className="text-base text-foreground/75 leading-snug truncate">{t.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative min-h-80 h-full md:aspect-square">
                      <Photo image={t.image} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2">
            {testimonials.items.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => embla?.scrollTo(i)}
                aria-label={`${carousel.goToSlide} ${i + 1}`}
                aria-current={i === selected}
                className={`size-2 rounded-full transition-colors ${i === selected ? 'bg-foreground' : 'bg-foreground/5'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
