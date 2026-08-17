import { CaretDown } from '@phosphor-icons/react'
import { useState } from 'react'
import { useSite } from '../context/SiteContext'
import { Reveal } from '../components/Reveal'

export function Faq() {
  const { faq, faqTitle } = useSite().content
  const [open, setOpen] = useState(0)
  if (!faq.length) return null
  return (
    <section className="py-24 md:py-32">
      <div className="lx-wrap max-w-3xl">
        <Reveal>
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] leading-[1.08] font-medium tracking-[-0.04em]">
            {faqTitle}
          </h2>
        </Reveal>
        <div className="mt-10">
          {faq.map((item, i) => {
            const active = open === i
            return (
              <div key={item.q} className="border-b border-[var(--line)]">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={active}
                  onClick={() => setOpen(active ? -1 : i)}
                >
                  <span className="text-base font-medium tracking-tight md:text-lg">{item.q}</span>
                  <CaretDown
                    weight="light"
                    className={`size-5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${active ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-[var(--muted)]">
                    <span className="block pb-5">{item.a}</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
