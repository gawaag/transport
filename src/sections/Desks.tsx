import { useSite } from '../context/SiteContext'
import { formatPhone, telHref } from '../lib/format'
import { Reveal } from '../components/Reveal'

export function Desks() {
  const { desks, desksTitle, desksBody } = useSite().content
  return (
    <section id="agence" className="py-24 md:py-32">
      <div className="lx-wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <h2 className="max-w-[14ch] text-[clamp(1.8rem,4vw,3rem)] leading-[1.08] font-medium tracking-[-0.04em]">
            {desksTitle}
          </h2>
          <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-[var(--muted)]">
            {desksBody}
          </p>
        </Reveal>
        <div>
          {desks.map((desk) => (
            <article key={desk.country} className="border-b border-[var(--line)] py-6 first:pt-0 last:border-b-0">
              <p className="text-lg font-medium tracking-tight">{desk.country}</p>
              <div className="mt-2 flex flex-col gap-1 text-sm">
                {desk.phones.map((phone) => (
                  <a key={phone} href={telHref(phone)} className="text-[var(--muted)] hover:text-[var(--ink)]">
                    {formatPhone(phone)}
                  </a>
                ))}
              </div>
              <p className="mt-2 text-sm text-[var(--muted)]">{desk.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
