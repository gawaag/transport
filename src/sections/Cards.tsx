import { Logo } from '../components/Logo'
import { Reveal } from '../components/Reveal'
import { SocialBar } from '../components/SocialBar'
import { useSite } from '../context/SiteContext'
import { formatPhone } from '../lib/format'

export function Cards() {
  const { content } = useSite()
  const { contact, brand } = content
  return (
    <section className="py-24 md:py-32">
      <div className="lx-wrap">
        <Reveal>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] leading-[1.08] font-medium tracking-[-0.04em]">
            {content.cardsTitle}
          </h2>
          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-[var(--muted)]">
            {content.cardsBody}
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Reveal>
            <figure>
              <article className="lx-bizcard lx-bizcard-front" dir="ltr">
                <Logo className="h-11 w-auto" />
                <div className="mt-auto">
                  <p className="text-[15px] font-semibold tracking-tight">{brand.name}</p>
                  <p className="mt-1 text-[11px] tracking-[0.18em] uppercase opacity-70">
                    Paris · Maroc
                  </p>
                  <p className="mt-4 text-sm opacity-80">1,50 € / kg</p>
                </div>
              </article>
              <figcaption className="mt-4 text-sm font-medium">{content.cardsFront}</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.08}>
            <figure>
              <article className="lx-bizcard lx-bizcard-back" dir="ltr">
                <Logo className="h-8 w-auto" />
                <div className="mt-5 space-y-1 text-[12px] leading-relaxed">
                  <p className="font-medium">{brand.name}</p>
                  <p>
                    {contact.address}
                    <br />
                    {contact.city}
                  </p>
                  <p className="lx-phone pt-2">{formatPhone(contact.phone1)}</p>
                  <p className="lx-phone">{formatPhone(contact.phone2)}</p>
                </div>
                <div className="mt-auto pt-4">
                  <SocialBar compact />
                </div>
              </article>
              <figcaption className="mt-4 text-sm font-medium">{content.cardsBack}</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
