import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { content } from '../content/content'
import { Button } from './Button'

const { nav } = content

export function Nav() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const close = () => {
    setOpen(false)
    toggleRef.current?.focus({ preventScroll: true })
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const goTo = (e: MouseEvent, target: string) => {
    e.preventDefault()
    document.getElementById(target.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    close()
  }

  return (
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-999 bg-foreground transition-opacity duration-400 ease-[cubic-bezier(0,0,0.58,1)] ${open ? 'opacity-15' : 'opacity-0 pointer-events-none'}`}
      />
      <nav className="fixed z-1000 top-5 left-1/2 -translate-x-1/2 w-content-width">
        <div className="mx-auto w-full md:w-1/2 overflow-hidden rounded backdrop-blur-sm card">
          <div className="relative z-10 flex items-center justify-between gap-3 xl:gap-4 2xl:gap-5 p-3 xl:p-4 2xl:p-5">
            <a href={nav.logoTarget} className="text-xl font-medium text-foreground">
              {nav.logoText}
            </a>
            <button
              ref={toggleRef}
              type="button"
              aria-label={nav.menuLabel}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen(!open)}
              className="flex items-center justify-center shrink-0 size-9 rounded cursor-pointer primary-button"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`w-1/2 h-1/2 text-primary-cta-text transition-transform duration-300 ${open ? 'rotate-45' : 'rotate-0'}`}
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
          </div>

          <div
            id="site-menu"
            inert={!open}
            className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="flex flex-col gap-3 xl:gap-4 2xl:gap-5 p-3 xl:p-4 2xl:p-5 pt-0 xl:pt-0 2xl:pt-0">
                <div className="px-3 xl:px-4 2xl:px-5 py-0 md:py-1 2xl:py-2 rounded card">
                  {nav.menu.map((item, i) => (
                    <div key={item.label}>
                      <a href={item.target} onClick={(e) => goTo(e, item.target)} className="group flex items-center justify-between py-3 w-full">
                        <span className="text-xl md:text-2xl font-medium text-foreground group-hover:ml-3 transition-[margin] duration-300">
                          {item.label}
                        </span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className="h-(--text-xl) md:h-(--text-2xl) w-auto text-foreground group-hover:rotate-45 group-hover:mr-3 transition-all duration-300"
                        >
                          <path d="M7 7h10v10" />
                          <path d="M7 17 17 7" />
                        </svg>
                      </a>
                      {i < nav.menu.length - 1 && <div className="h-px bg-accent/50" />}
                    </div>
                  ))}
                </div>
                {/* As in the reference, the menu CTA does not close the menu. */}
                <Button {...nav.cta} className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
