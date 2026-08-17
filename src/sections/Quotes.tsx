import type { Quote } from '../types'
import { useSite } from '../context/SiteContext'
import { Reveal } from '../components/Reveal'

export function Quotes() {
  const quotes = useSite().source.quotes || []
  if (!quotes.length) return null
  const [main, ...rest] = quotes
  return (
    <section className="py-24 md:py-32">
      <div className="lx-wrap grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
        <Reveal>
          <QuoteBlock quote={main} large />
        </Reveal>
        <div className="flex flex-col justify-center gap-10">
          {rest.map((q, i) => (
            <Reveal key={`${q.name}-${i}`} delay={0.06 * (i + 1)}>
              <QuoteBlock quote={q} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function QuoteBlock({ quote, large = false }: { quote: Quote; large?: boolean }) {
  const arabic = quote.lang === 'ar'
  return (
    <blockquote dir={arabic ? 'rtl' : 'ltr'} lang={quote.lang || 'fr'}>
      <p
        className={
          large
            ? 'max-w-[18ch] text-[clamp(1.6rem,3.4vw,2.7rem)] leading-[1.2] font-medium tracking-[-0.035em]'
            : 'text-lg leading-snug tracking-tight'
        }
      >
        “{quote.text}”
      </p>
      <footer className={`text-sm text-[var(--muted)] ${large ? 'mt-6' : 'mt-3'}`}>
        {quote.name}
        <span className="mt-1 block">{quote.meta}</span>
      </footer>
    </blockquote>
  )
}
