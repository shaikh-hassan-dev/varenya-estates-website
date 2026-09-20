import { content } from './content/content'
import { Nav } from './components/Nav'
import { SectionHeader } from './components/SectionHeader'

const { hero, about, properties, services, team, numbers, testimonials, cta, footer, site } = content

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <section id="hero" className="relative h-svh md:h-auto pt-25 pb-20 md:pt-30">
          <div className="flex flex-col items-center gap-12 md:gap-15 w-full md:w-content-width mx-auto">
            <SectionHeader {...hero} level={1} size="text-7xl 2xl:text-8xl" className="gap-3 w-content-width mx-auto" />
          </div>
        </section>

        <section id="about" className="py-20">
          <div className="relative flex items-center justify-center py-8 md:py-12 mx-auto w-content-width rounded overflow-hidden">
            {/* Image slot: neutral overlay only until photography is supplied. */}
            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-xs pointer-events-none select-none" />
            <div className="relative z-10 flex items-center justify-center px-5 py-10 mx-auto min-h-100 md:min-h-120 md:w-1/2 w-content-width">
              <SectionHeader {...about} light className="gap-2" />
            </div>
          </div>
        </section>

        {[
          { id: 'properties', copy: properties },
          { id: 'services', copy: services },
          { id: 'team', copy: team },
          { id: 'numbers', copy: numbers },
          { id: 'testimonials', copy: testimonials },
        ].map(({ id, copy }) => (
          <section key={id} id={id} className="py-20">
            <SectionHeader {...copy} />
          </section>
        ))}

        <section id="contact" className="py-20">
          <div className="w-content-width mx-auto">
            <div className="flex flex-col items-center gap-8 md:gap-10 py-20 px-8 rounded card">
              <SectionHeader {...cta} size="text-5xl 2xl:text-6xl" className="gap-2" />
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="w-full pt-20 pb-10">
        <div className="w-content-width mx-auto pt-10 border-t border-foreground/15">
          <div className="w-full flex items-center justify-between pt-5">
            <span className="text-sm opacity-50">{footer.copyright}</span>
            <span className="text-sm opacity-50">{footer.tagline}</span>
          </div>
          {site.reraRegistrationNumber && (
            <p className="pt-5 text-sm opacity-50">
              {site.reraLabel} {site.reraRegistrationNumber}
            </p>
          )}
        </div>
      </footer>
    </>
  )
}
