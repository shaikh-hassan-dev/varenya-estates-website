import { content } from '../content/content'

export function Nav() {
  return (
    <nav className="fixed z-1000 top-5 left-1/2 -translate-x-1/2 w-content-width">
      <div className="mx-auto w-full md:w-1/2 overflow-hidden rounded backdrop-blur-sm card">
        <div className="relative z-10 flex items-center justify-between gap-3 xl:gap-4 2xl:gap-5 p-3 xl:p-4 2xl:p-5">
          {/* min-h-9 keeps the bar height of the reference, whose row also holds a 36px menu toggle (omitted per brief). */}
          <a href={content.nav.logoTarget} className="flex items-center min-h-9 text-xl font-medium text-foreground">
            {content.nav.logoText}
          </a>
        </div>
      </div>
    </nav>
  )
}
