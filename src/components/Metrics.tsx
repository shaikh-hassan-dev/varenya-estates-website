import { content, type Stat } from '../content/content'
import { GridOrCarousel } from './GridOrCarousel'
import { icon } from './icon'
import { SectionHeader } from './SectionHeader'

const { numbers } = content

// Lucide icons used by the reference (same version's path data); indian-rupee replaces dollar-sign (D-18).
const icons: Record<Stat['icon'], React.ReactNode> = {
  house: (
    <>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M16 3.128a4 4 0 0 1 0 7.744" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  'indian-rupee': (
    <>
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8.5 8" />
      <path d="M6 13h3" />
      <path d="M9 13c6.667 0 6.667-10 0-10" />
    </>
  ),
  'trending-up': (
    <>
      <path d="M16 7h6v6" />
      <path d="m22 7-8.5 8.5-5-5L2 17" />
    </>
  ),
}

// Reference metric cards. Values render final; the reference has no count-up.
export function Metrics() {
  return (
    <section id="metrics" aria-label="Metrics section" className="py-20">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeader {...numbers} />
        <GridOrCarousel>
          {numbers.stats.map((s) => (
            <div
              key={s.value}
              className="flex flex-col items-center justify-center gap-3 xl:gap-3.5 2xl:gap-4 p-6 xl:p-7 2xl:p-8 min-h-70 xl:min-h-80 2xl:min-h-90 h-full card rounded"
            >
              <div className="flex items-center justify-center gap-2 min-w-0">
                <div className="flex items-center justify-center shrink-0 size-8 primary-button rounded">
                  <svg {...icon} strokeWidth="1.5" className="h-2/5 w-2/5 text-primary-cta-text">
                    {icons[s.icon]}
                  </svg>
                </div>
                <span className="text-xl truncate min-w-0">{s.label}</span>
              </div>
              <span className="text-9xl md:text-8xl font-semibold leading-none truncate">{s.value}</span>
            </div>
          ))}
        </GridOrCarousel>
      </div>
    </section>
  )
}
