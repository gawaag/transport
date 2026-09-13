import { Phone, WhatsappLogo } from '@phosphor-icons/react'
import { useSite } from '../context/SiteContext'
import { formatPhone, smsHref, telHref } from '../lib/format'
import { quoteIntro, waHref } from '../lib/whatsapp'

export function ContactPhones({ compact = false }: { compact?: boolean }) {
  const { content, lang, ui } = useSite()
  const { contact, brand } = content
  const intro = quoteIntro(brand.name, lang)
  const lines = [
    { call: contact.phone1, wa: contact.whatsapp },
    { call: contact.phone2, wa: contact.whatsapp2 || contact.phone2 },
  ]

  return (
    <div className="flex flex-col gap-3" dir="ltr">
      {lines.map((line) => (
        <div
          key={line.call}
          className={`flex flex-wrap items-center gap-2 ${compact ? 'text-sm' : 'text-sm'}`}
        >
          <a
            href={telHref(line.call)}
            className="lx-phone font-medium text-[var(--ink)] hover:text-[var(--accent)]"
          >
            {formatPhone(line.call)}
          </a>
          <a
            href={telHref(line.call)}
            className="rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-[var(--line)] hover:bg-[var(--bg-elev)]"
          >
            {ui.call}
          </a>
          <a
            href={smsHref(line.call)}
            className="rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-[var(--line)] hover:bg-[var(--bg-elev)]"
          >
            {ui.sms}
          </a>
          <a
            href={waHref(line.wa, intro)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full bg-[#128C7E] px-2.5 py-1 text-[11px] font-medium text-white"
          >
            <WhatsappLogo weight="fill" className="size-3.5" />
            {ui.whatsapp}
          </a>
        </div>
      ))}
      <p className="flex items-center gap-1.5 text-sm text-[var(--muted)]">
        <Phone weight="fill" className="size-3.5 text-[#22a06b]" />
        {content.availableLabel}
      </p>
    </div>
  )
}
