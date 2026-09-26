import { content } from './content/content'
import { Nav } from './components/Nav'
import { SectionHeader } from './components/SectionHeader'
import { Hero } from './components/Hero'
import { Photo } from './components/Photo'
import { Properties } from './components/Properties'
import { Services } from './components/Services'
import { Reveal } from './components/Reveal'
import { scrollToTarget } from './motion'
import { Team } from './components/Team'
import { Metrics } from './components/Metrics'
import { Testimonials } from './components/Testimonials'

const { about, cta, footer, site } = content

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />

        <section id="about" aria-label="About section" className="py-20">
          <div className="relative flex items-center justify-center py-8 md:py-12 mx-auto w-content-width rounded overflow-hidden">
            <div className="absolute inset-0">
              <Photo image={about.image} />
              <div className="absolute inset-0 bg-foreground/40 backdrop-blur-xs pointer-events-none select-none" />
            </div>
            <div className="relative z-10 flex items-center justify-center px-5 py-10 mx-auto min-h-100 md:min-h-120 md:w-1/2 w-content-width">
              <SectionHeader {...about} light className="gap-2" />
            </div>
          </div>
        </section>

        <Properties />
        <Services />

        <Team />
        <Metrics />
        <Testimonials />

        <section id="contact" aria-label="Contact section" className="py-20">
          <div className="w-content-width mx-auto">
            <Reveal>
              <div className="flex flex-col items-center gap-8 md:gap-10 py-20 px-8 rounded card">
                <SectionHeader {...cta} size="text-5xl 2xl:text-6xl" className="gap-2" />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer id="footer" aria-label="Site footer" className="w-full pt-20 pb-10">
        <div className="w-content-width mx-auto pt-10 border-t border-foreground/15">
          <div className="w-full flex flex-wrap justify-between gap-y-10 mb-10">
            {footer.columns.map((col) => (
              <div key={col.heading} className="w-1/2 md:w-auto flex flex-col items-start gap-3">
                <h3 className="text-sm opacity-50 truncate">{col.heading}</h3>
                {/* Reference footer items are buttons; "#" placeholders do nothing. */}
                {col.links.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => scrollToTarget(link.target)}
                    className="text-base hover:opacity-75 transition-opacity cursor-pointer"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="w-full h-px bg-foreground/20" />
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
