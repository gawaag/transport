import { List, X } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { useSite } from '../context/SiteContext'
import { quoteIntro, waHref } from '../lib/whatsapp'
import { Logo } from './Logo'
import { LangToggle } from './LangToggle'
import { ThemeToggle } from './ThemeToggle'

export function Nav() {
  const { content, lang, ui } = useSite()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const links = [
    { href: '#offre', label: ui.offre },
    { href: '#trajet', label: ui.trajet },
    { href: '#agence', label: ui.agence },
    { href: '#contact', label: ui.devis },
  ]

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0.12 },
    )
    const hero = document.getElementById('hero-watch')
    if (hero) io.observe(hero)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-4 md:pt-5">
        <nav
          className={`pointer-events-auto flex h-14 max-w-[860px] items-center gap-1 rounded-full px-2 ps-3 shadow-[var(--shadow)] ring-1 ring-[var(--line)] transition-[background,backdrop-filter] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            scrolled
              ? 'bg-[color-mix(in_oklab,var(--bg-elev)_86%,transparent)] backdrop-blur-2xl'
              : 'bg-[color-mix(in_oklab,var(--bg-elev)_72%,transparent)] backdrop-blur-xl'
          }`}
          aria-label="Navigation"
        >
          <a href="#top" className="flex items-center pe-2">
            <Logo className="h-9 w-auto" />
          </a>
          <div className="hidden items-center md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-2 text-[13px] text-[var(--muted)] transition-colors duration-300 hover:text-[var(--ink)]"
              >
                {l.label}
              </a>
            ))}
          </div>
          <LangToggle />
          <ThemeToggle />
          <a
            href={waHref(content.contact.whatsapp, quoteIntro(content.brand.name, lang))}
            target="_blank"
            rel="noreferrer"
            className="ms-auto hidden rounded-full bg-[var(--accent)] px-4 py-2 text-[13px] font-medium text-[var(--accent-ink)] sm:inline-flex"
          >
            {ui.whatsapp}
          </a>
          <button
            type="button"
            className="relative ms-auto grid size-10 place-items-center rounded-full md:hidden"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X weight="light" className="size-5" /> : <List weight="light" className="size-5" />}
          </button>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-20 bg-[color-mix(in_oklab,var(--bg)_88%,transparent)] px-6 pt-24 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-2 py-4 text-3xl tracking-tight"
              >
                {l.label}
              </a>
            ))}
            <a
              href={waHref(content.contact.whatsapp, quoteIntro(content.brand.name, lang))}
              className="mt-4 inline-flex w-fit rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[var(--accent-ink)]"
              target="_blank"
              rel="noreferrer"
            >
              {content.hero.ctaPrimary}
            </a>
          </div>
        </div>
      )}
    </>
  )
}
