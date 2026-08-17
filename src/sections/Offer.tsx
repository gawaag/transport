import { useState } from 'react'
import { useSite } from '../context/SiteContext'
import { euro, priceLabel } from '../lib/format'
import { Reveal } from '../components/Reveal'

export function Offer() {
  const { content, ui } = useSite()
  const { offer } = content
  const [kg, setKg] = useState(offer.defaultKg)
  const total = kg * offer.pricePerKg

  return (
    <section id="offre" className="py-24 md:py-32">
      <div className="lx-wrap grid items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <Reveal>
          <p className="text-[clamp(4.5rem,12vw,9rem)] leading-[0.85] font-medium tracking-[-0.06em] text-[var(--accent)]">
            {priceLabel(offer.pricePerKg)}
            <span className="ms-2 align-middle text-2xl tracking-tight text-[var(--muted)] md:text-3xl">
              / kg
            </span>
          </p>
          <h2 className="mt-8 max-w-[12ch] text-[clamp(1.8rem,4vw,3rem)] leading-[1.08] font-medium tracking-[-0.04em]">
            {offer.headline}
          </h2>
          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-[var(--muted)]">
            {offer.body}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="lg:pt-6">
          <div className="rounded-[calc(var(--radius)+6px)] bg-[var(--bg-elev)] p-1.5 ring-1 ring-[var(--line)]">
            <div className="rounded-[var(--radius)] bg-[var(--bg)] p-6 md:p-8">
              <label htmlFor="kg" className="text-sm font-medium">
                {ui.weightLabel}
              </label>
              <div className="mt-3 flex items-end gap-3">
                <input
                  id="kg"
                  type="number"
                  min={1}
                  max={500}
                  value={kg}
                  onChange={(e) => setKg(Math.max(1, Number(e.target.value) || 1))}
                  className="w-28 rounded-xl bg-transparent text-4xl tracking-tight outline-none"
                />
                <span className="pb-1 text-[var(--muted)]">kg</span>
              </div>
              <input
                type="range"
                min={5}
                max={120}
                value={Math.min(120, kg)}
                onChange={(e) => setKg(Number(e.target.value))}
                className="mt-6 w-full accent-[var(--accent)]"
                aria-label={ui.weightLabel}
              />
              <p className="mt-8 text-sm text-[var(--muted)]">{ui.estimated}</p>
              <p className="mt-1 text-4xl tracking-tight">{euro(total)}</p>
              <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-[var(--muted)]">
                {offer.weighNote}
              </p>
            </div>
          </div>

          <ul className="mt-8">
            {offer.points.map((p) => (
              <li key={p.title} className="border-b border-[var(--line)] py-4 first:pt-0 last:border-b-0">
                <p className="font-medium tracking-tight">{p.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{p.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
