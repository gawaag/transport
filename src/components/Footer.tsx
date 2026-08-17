import { Logo } from './Logo'
import { SocialBar } from './SocialBar'
import { useSite } from '../context/SiteContext'
import { formatPhone, telHref } from '../lib/format'
import { quoteIntro, waHref } from '../lib/whatsapp'

export function Footer() {
  const { content, lang, ui } = useSite()
  const { contact, brand, footer } = content
  return (
    <footer className="border-t border-[var(--line)] py-16">
      <div className="lx-wrap grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex flex-col gap-2">
            <Logo className="h-10 w-auto" />
            <strong className="text-[15px] font-medium tracking-tight">{brand.name}</strong>
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">{content.arabicTagline}</p>
          <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-[var(--muted)]">
            {footer.blurb}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">{footer.agency}</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            {contact.address}
            <br />
            {contact.city}
            <br />
            {contact.hours}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">{footer.contact}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <a className="text-[var(--muted)] hover:text-[var(--ink)]" href={telHref(contact.phone1)}>
              {formatPhone(contact.phone1)}
            </a>
            <a className="text-[var(--muted)] hover:text-[var(--ink)]" href={telHref(contact.phone2)}>
              {formatPhone(contact.phone2)}
            </a>
            <a
              className="text-[var(--muted)] hover:text-[var(--ink)]"
              href={waHref(contact.whatsapp, quoteIntro(brand.name, lang))}
              target="_blank"
              rel="noreferrer"
            >
              {ui.whatsapp}
            </a>
          </div>
          <div className="mt-5">
            <SocialBar />
          </div>
        </div>
      </div>
      <div className="lx-wrap mt-12 text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} {brand.name}. {ui.groupage}
      </div>
    </footer>
  )
}
