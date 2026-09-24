import { content } from '../content/content'
import { Photo } from './Photo'
import { SectionHeader } from './SectionHeader'

const { properties } = content

// The reference card is a <button> with no click handler (no navigation, no in-page action),
// so it is rendered as a plain element with the same classes.
export function Properties() {
  return (
    <section id="properties" aria-label="Properties section" className="py-20">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeader {...properties} />
        <div className="grid grid-cols-1 gap-5 mx-auto w-content-width md:grid-cols-3">
          {properties.items.map((item) => (
            <div
              key={item.name}
              className="group h-full flex flex-col gap-3 xl:gap-3.5 2xl:gap-4 p-3 xl:p-3.5 2xl:p-4 text-left card rounded cursor-pointer"
            >
              <div className="relative aspect-square rounded overflow-hidden">
                <Photo image={item.image} className="transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center group-hover:bg-background/20 group-hover:backdrop-blur-xs transition-all duration-300">
                  <div className="flex items-center justify-center size-12 rounded-full primary-button opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="size-5 text-primary-cta-text"
                    >
                      <path d="M7 7h10v10" />
                      <path d="M7 17 17 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 p-3 xl:p-3.5 2xl:p-4">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <h3 className="text-2xl font-semibold truncate leading-snug text-balance">{item.name}</h3>
                  <p className="text-base text-foreground/75 truncate">{item.detail}</p>
                </div>
                <span className="text-xl font-medium shrink-0">{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
