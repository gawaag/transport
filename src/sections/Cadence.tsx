import { useSite } from '../context/SiteContext'
import { Reveal } from '../components/Reveal'

export function Cadence() {
  const { cadence } = useSite().content
  return (
    <section className="py-24 md:py-32">
      <div className="lx-wrap">
        <Reveal>
          <p className="text-[clamp(5rem,14vw,10rem)] leading-[0.8] font-medium tracking-[-0.07em] text-[var(--accent)]">
            {cadence.value}
            <span className="ms-3 align-middle text-2xl tracking-tight text-[var(--muted)] md:text-4xl">
              {cadence.unit}
            </span>
          </p>
          <h2 className="mt-8 max-w-[16ch] text-[clamp(1.8rem,4vw,3rem)] leading-[1.08] font-medium tracking-[-0.04em]">
            {cadence.headline}
          </h2>
          <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-[var(--muted)]">
            {cadence.body}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
