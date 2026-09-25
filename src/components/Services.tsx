import { content, type Service } from '../content/content'
import { Photo } from './Photo'
import { SectionHeader } from './SectionHeader'
import { GridOrCarousel } from './GridOrCarousel'
import { icon } from './icon'

const { services } = content

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

export function Services() {
  return (
    <section id="services" aria-label="Services section" className="py-20">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeader {...services} />
        <GridOrCarousel>
          {services.items.map((item, i) => (
            <Card key={item.title} item={item} n={i + 1} />
          ))}
        </GridOrCarousel>
      </div>
    </section>
  )
}
