import { useSite } from '../context/SiteContext'
import { Reveal } from '../components/Reveal'

export function Coverage() {
  const { content } = useSite()
  const { coverage } = content
  return (
    <section id="villes" className="py-24 md:py-32">
      <div className="lx-wrap grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius)] bg-[#14161a]">
            <img
              src={coverage.mapImage}
              alt="Carte du Maroc"
              className="aspect-[4/3] w-full object-cover opacity-90"
              loading="lazy"
            />
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="max-w-[14ch] text-[clamp(1.8rem,4vw,3rem)] leading-[1.08] font-medium tracking-[-0.04em]">
            {coverage.headline}
          </h2>
          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-[var(--muted)]">
            {coverage.body}
          </p>
          <p className="mt-8 text-sm font-medium">{coverage.fromLabel}</p>
          <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-[var(--muted)]">
            {coverage.fromPlaces.join(', ')}
          </p>
          <p className="mt-8 text-sm font-medium">{coverage.toLabel}</p>
          <div className="mt-3 grid grid-cols-2 gap-x-6 text-sm">
            {coverage.cities.map((city) => (
              <p key={city} className="border-b border-[var(--line)] py-2.5">
                {city}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
