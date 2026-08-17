export function toIntlPhone(raw: string) {
  const d = raw.replace(/\D/g, '')
  if (d.startsWith('33')) return d
  if (d.startsWith('212')) return d
  if (d.startsWith('0')) return `33${d.slice(1)}`
  return d
}

export function waHref(phone: string, text: string) {
  return `https://wa.me/${toIntlPhone(phone)}?text=${encodeURIComponent(text)}`
}

export function quoteIntro(brand: string, lang: 'fr' | 'ar' = 'fr') {
  if (lang === 'ar') return `مرحبا، أريد عرض سعر من ${brand}.`
  return `Bonjour, je souhaite un devis ${brand}.`
}

export function buildQuoteMessage(input: {
  name: string
  phone: string
  direction: string
  weight: string
  cityFrom: string
  cityTo: string
  message: string
  brand?: string
  lang?: 'fr' | 'ar'
  parcels?: { item: string; kg: string }[]
}) {
  const parcelLines = (input.parcels || [])
    .filter((p) => p.item.trim() || p.kg.trim())
    .map((p, i) => `${i + 1}. ${p.item || '-'} : ${p.kg || '?'} kg`)
  const lines = [
    quoteIntro(input.brand || 'S.A.M TRANSPORT CHARK', input.lang),
    `Nom: ${input.name}`,
    `Tel: ${input.phone}`,
    `Sens: ${input.direction}`,
    input.cityFrom || input.cityTo
      ? `Trajet: ${input.cityFrom || '?'} vers ${input.cityTo || '?'}`
      : '',
    parcelLines.length ? `Colis:\n${parcelLines.join('\n')}` : '',
    input.weight ? `Poids total: ${input.weight} kg` : '',
    input.message ? `Besoin: ${input.message}` : '',
  ]
  return lines.filter(Boolean).join('\n')
}
