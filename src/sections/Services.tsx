import { useSite } from '../context/SiteContext'
import { Reveal } from '../components/Reveal'

export function Services() {
  const { content } = useSite()
  const { services, servicesTitle, servicesBody } = content
  const [first, ...rest] = services
  return (
    <section className="py-24 md:py-32">
      <div className="lx-wrap">
        <Reveal>
          <h2 className="max-w-[14ch] text-[clamp(1.8rem,4vw,3rem)] leading-[1.08] font-medium tracking-[-0.04em]">
            {servicesTitle}
          </h2>
          <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-[var(--muted)]">
            {servicesBody}
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Reveal className="md:col-span-2">
            <div className="overflow-hidden rounded-[var(--radius)]">
              <img
                src={content.agencyImage}
                alt=""
                className="aspect-[16/9] w-full object-cover"
                loading="lazy"
              />
            </div>
            {first && (
              <div className="mt-5">
                <p className="text-lg font-medium tracking-tight">{first.title}</p>
                <p className="mt-1 max-w-[46ch] text-sm text-[var(--muted)]">{first.text}</p>
              </div>
            )}
          </Reveal>
          <div className="flex flex-col justify-end gap-8">
            {rest.map((item, i) => (
              <Reveal key={item.title} delay={0.06 * (i + 1)}>
                <p className="text-lg font-medium tracking-tight">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
