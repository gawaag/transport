export function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, '')
  if (d.startsWith('212') && d.length >= 12) {
    return `+212 ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`
  }
  if (d.length === 10) {
    return d.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
  }
  return raw
}

export function telHref(raw: string) {
  const d = raw.replace(/\D/g, '')
  if (d.startsWith('212') || d.startsWith('32') || d.startsWith('33')) return `tel:+${d}`
  return `tel:+33${d.replace(/^0/, '')}`
}

export function euro(n: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n)
}

export function priceLabel(n: number) {
  const [int, dec] = n.toFixed(2).replace('.', ',').split(',')
  if (dec === '00') return `${int} €`
  return `${int},${dec} €`
}
