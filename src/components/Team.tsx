import { content } from '../content/content'
import { GridOrCarousel } from './GridOrCarousel'
import { Photo } from './Photo'
import { SectionHeader } from './SectionHeader'

const { team } = content

// Reference overlay card: no hover state, no links or social icons.
export function Team() {
  return (
    <section id="team" aria-label="Team section" className="py-20">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeader {...team} />
        <GridOrCarousel>
          {team.members.map((m) => (
            <div key={m.name} className="relative aspect-4/5 card rounded">
              <div className="relative w-full h-full rounded overflow-hidden">
                <Photo image={m.image} />
                <div className="absolute inset-x-4 bottom-4 xl:inset-x-5 xl:bottom-5 2xl:inset-x-6 2xl:bottom-6 flex items-center justify-between gap-4 xl:gap-5 2xl:gap-6 p-4 xl:p-5 2xl:p-6 card backdrop-blur-sm rounded">
                  <span className="text-xl font-semibold leading-snug truncate">{m.name}</span>
                  <div className="px-3 py-2 text-sm primary-button text-primary-cta-text rounded">
                    <p className="truncate">{m.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </GridOrCarousel>
      </div>
    </section>
  )
}
