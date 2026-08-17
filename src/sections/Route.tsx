import { CorridorSketch } from '../components/CorridorSketch'
import { Reveal } from '../components/Reveal'
import { useSite } from '../context/SiteContext'

export function Route() {
  const { content } = useSite()
  const { route } = content
  return (
    <section id="trajet" className="py-24 md:py-32">
      <div className="lx-wrap">
        <Reveal>
          <h2 className="max-w-[16ch] text-[clamp(1.8rem,4vw,3rem)] leading-[1.08] font-medium tracking-[-0.04em]">
            {route.headline}
          </h2>
          <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-[var(--muted)]">
            {route.body}
          </p>
          <CorridorSketch />
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {route.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <figure>
                <div className="overflow-hidden rounded-[var(--radius)]">
                  <img
                    src={step.image}
                    alt=""
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-4">
                  <p className="text-lg font-medium tracking-tight">{step.title}</p>
                  <p className="mt-1 max-w-[36ch] text-sm leading-relaxed text-[var(--muted)]">
                    {step.text}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
