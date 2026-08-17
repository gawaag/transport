import { WhatsappLogo } from '@phosphor-icons/react'
import { useSite } from '../context/SiteContext'
import { quoteIntro, waHref } from '../lib/whatsapp'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'

export function Hero() {
  const { content, lang } = useSite()
  const { hero, contact } = content
  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      <span id="hero-watch" className="absolute inset-0 -z-10" />
      <img
        src={hero.image}
        alt="Camion de groupage sur route de nuit"
        className="absolute inset-0 size-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(20_22_26/0.28)_0%,rgb(20_22_26/0.55)_48%,rgb(20_22_26/0.88)_100%)]" />
      <div className="relative flex min-h-[100dvh] items-end">
        <div className="lx-wrap w-full pt-24 pb-16 md:pb-20">
          <Reveal>
            <p className="text-sm text-white/70">{hero.kicker}</p>
            <h1 className={`mt-4 text-[clamp(2.4rem,7vw,5.4rem)] leading-[1.1] font-medium tracking-[-0.05em] text-[#f3f1ec] ${lang === 'ar' ? 'max-w-[12ch] pb-1' : 'max-w-[14ch] leading-[1.02]'}`}>
              {hero.headline}
            </h1>
            <p className="mt-5 max-w-[36ch] text-base leading-relaxed text-white/78">
              {hero.sub}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                href={waHref(
                  contact.whatsapp,
                  quoteIntro(content.brand.name, lang),
                )}
                icon={<WhatsappLogo weight="bold" className="size-4" />}
              >
                {hero.ctaPrimary}
              </Button>
              <Button href="#offre" variant="onDark">
                {hero.ctaSecondary}
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
