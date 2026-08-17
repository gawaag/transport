import type { Lang, SiteContent } from '../types'

export function localize(source: SiteContent, lang: Lang): SiteContent {
  if (lang !== 'ar' || !source.ar) return source
  const a = source.ar
  return {
    ...source,
    seo: { ...source.seo, ...a.seo },
    arabicTagline: a.arabicTagline ?? source.arabicTagline,
    hero: { ...source.hero, ...a.hero },
    offer: {
      ...source.offer,
      headline: a.offer?.headline ?? source.offer.headline,
      body: a.offer?.body ?? source.offer.body,
      weighNote: a.offer?.weighNote ?? source.offer.weighNote,
      points: a.offer?.points ?? source.offer.points,
    },
    cadence: { ...source.cadence, ...a.cadence },
    servicesTitle: a.servicesTitle ?? source.servicesTitle,
    servicesBody: a.servicesBody ?? source.servicesBody,
    services: a.services ?? source.services,
    route: {
      ...source.route,
      headline: a.route?.headline ?? source.route.headline,
      body: a.route?.body ?? source.route.body,
      steps: source.route.steps.map((step, i) => ({
        ...step,
        ...(a.route?.steps?.[i] ?? {}),
      })),
    },
    coverage: {
      ...source.coverage,
      ...a.coverage,
    },
    desksTitle: a.desksTitle ?? source.desksTitle,
    desksBody: a.desksBody ?? source.desksBody,
    desks: a.desks ?? source.desks,
    quotes: source.quotes,
    faqTitle: a.faqTitle ?? source.faqTitle,
    faq: a.faq ?? source.faq,
    form: { ...source.form, ...a.form },
    footer: { ...source.footer, ...a.footer },
    cardsTitle: a.cardsTitle ?? source.cardsTitle,
    cardsBody: a.cardsBody ?? source.cardsBody,
    cardsFront: a.cardsFront ?? source.cardsFront,
    cardsBack: a.cardsBack ?? source.cardsBack,
  }
}
