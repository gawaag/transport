export function digits(raw: string) {
  return raw.replace(/\D/g, '')
}

export function formatPhone(raw: string) {
  const d = digits(raw)
  if (d.startsWith('212') && d.length >= 12) {
    return `+212 ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`
  }
  if (d.startsWith('33') && d.length >= 11) {
    const n = d.slice(2)
    return `+33 ${n[0]} ${n.slice(1, 3)} ${n.slice(3, 5)} ${n.slice(5, 7)} ${n.slice(7)}`
  }
  if (d.length === 10 && d.startsWith('0')) {
    return `+33 ${d[1]} ${d.slice(2, 4)} ${d.slice(4, 6)} ${d.slice(6, 8)} ${d.slice(8, 10)}`
  }
  return raw
}

export function intlPhone(raw: string) {
  const d = digits(raw)
  if (d.startsWith('33') || d.startsWith('212')) return d
  if (d.startsWith('0')) return `33${d.slice(1)}`
  return d
}

export function telHref(raw: string) {
  return `tel:+${intlPhone(raw)}`
}

export function smsHref(raw: string) {
  return `sms:+${intlPhone(raw)}`
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
