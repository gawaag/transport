import { WhatsappLogo } from '@phosphor-icons/react'
import { useSite } from '../context/SiteContext'
import { quoteIntro, waHref } from '../lib/whatsapp'

export function WhatsAppFab() {
  const { content, lang, ui } = useSite()
  return (
    <a
      href={waHref(content.contact.whatsapp, quoteIntro(content.brand.name, lang))}
      target="_blank"
      rel="noreferrer"
      className="fixed end-4 bottom-4 z-30 flex items-center gap-2 rounded-full bg-[#128C7E] px-4 py-3 text-sm font-medium text-white shadow-[var(--shadow)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98] md:end-6 md:bottom-6"
      aria-label={ui.waLabel}
    >
      <WhatsappLogo weight="fill" className="size-5" />
      <span className="hidden sm:inline">{content.hero.ctaPrimary}</span>
    </a>
  )
}
