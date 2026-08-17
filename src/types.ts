export type Lang = 'fr' | 'ar'

export type OfferPoint = {
  title: string
  text: string
}

export type RouteStep = {
  title: string
  text: string
  image: string
}

export type Quote = {
  text: string
  name: string
  meta: string
  lang?: 'fr' | 'ar'
}

export type FaqItem = {
  q: string
  a: string
}

export type Desk = {
  country: string
  phones: string[]
  note: string
}

export type ServiceItem = {
  title: string
  text: string
}

export type CopyBlock = {
  seo: {
    title: string
    description: string
  }
  hero: {
    kicker: string
    headline: string
    sub: string
    ctaPrimary: string
    ctaSecondary: string
  }
  offer: {
    headline: string
    body: string
    weighNote: string
    points: OfferPoint[]
  }
  cadence: {
    headline: string
    body: string
    kicker: string
  }
  servicesTitle: string
  servicesBody: string
  services: ServiceItem[]
  route: {
    headline: string
    body: string
    steps: { title: string; text: string }[]
  }
  coverage: {
    headline: string
    body: string
    fromLabel: string
    toLabel: string
  }
  desksTitle: string
  desksBody: string
  desks: Desk[]
  quotes: Quote[]
  faqTitle: string
  faq: FaqItem[]
  form: {
    headline: string
    body: string
    submitWhatsapp: string
    submitCallback: string
    successWhatsapp: string
    successCallback: string
    name: string
    phone: string
    direction: string
    weight: string
    from: string
    to: string
    need: string
    dirFrMa: string
    dirMaFr: string
    error: string
  }
  footer: {
    blurb: string
    agency: string
    contact: string
  }
  cardsTitle: string
  cardsBody: string
  cardsFront: string
  cardsBack: string
  arabicTagline: string
}

export type SiteContent = {
  brand: {
    name: string
    shortName: string
    mark: string
  }
  contact: {
    phone1: string
    phone2: string
    whatsapp: string
    email: string
    address: string
    city: string
    hours: string
    instagram?: string
    tiktok?: string
  }
  theme: {
    accent: string
    accentInk: string
    radius: number
  }
  hero: {
    kicker: string
    headline: string
    sub: string
    ctaPrimary: string
    ctaSecondary: string
    image: string
  }
  offer: {
    pricePerKg: number
    headline: string
    body: string
    defaultKg: number
    weighNote: string
    points: OfferPoint[]
  }
  cadence: {
    value: string
    unit: string
    headline: string
    body: string
    kicker: string
  }
  servicesTitle: string
  servicesBody: string
  services: ServiceItem[]
  route: {
    headline: string
    body: string
    steps: RouteStep[]
  }
  coverage: {
    headline: string
    body: string
    fromLabel: string
    fromPlaces: string[]
    toLabel: string
    cities: string[]
    mapImage: string
    sideImage: string
  }
  desksTitle: string
  desksBody: string
  desks: Desk[]
  quotes: Quote[]
  faqTitle: string
  faq: FaqItem[]
  form: {
    headline: string
    body: string
    submitWhatsapp: string
    submitCallback: string
    successWhatsapp: string
    successCallback: string
    name: string
    phone: string
    direction: string
    weight: string
    from: string
    to: string
    need: string
    dirFrMa: string
    dirMaFr: string
    error: string
  }
  footer: {
    blurb: string
    agency: string
    contact: string
  }
  seo: {
    title: string
    description: string
  }
  cardsTitle: string
  cardsBody: string
  cardsFront: string
  cardsBack: string
  arabicTagline: string
  agencyImage: string
  cardFront: string
  cardBack: string
  ar: Partial<CopyBlock>
}

export type Lead = {
  id: string
  createdAt: string
  name: string
  phone: string
  direction: string
  weight: string
  cityFrom: string
  cityTo: string
  message: string
  prefer: string
}
