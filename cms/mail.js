function leadText(lead) {
  const parcels = Array.isArray(lead.parcels)
    ? lead.parcels
        .filter((p) => p && (p.item || p.kg))
        .map((p, i) => `${i + 1}. ${p.item || '-'} : ${p.kg || '?'} kg`)
        .join('\n')
    : lead.parcels || ''
  return [
    'Nouvelle demande de rappel — S.A.M TRANSPORT CHARK',
    '',
    `Nom: ${lead.name}`,
    `Téléphone: ${lead.phone}`,
    `Sens: ${lead.direction || '-'}`,
    `Départ: ${lead.cityFrom || '-'}`,
    `Arrivée: ${lead.cityTo || '-'}`,
    lead.weight ? `Poids: ${lead.weight} kg` : '',
    parcels ? `Colis:\n${parcels}` : '',
    lead.message ? `Message: ${lead.message}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export async function sendCallbackEmail(lead) {
  const to = process.env.CALLBACK_EMAIL
  if (!to) return { ok: false, error: 'mail-not-configured' }
  const text = leadText(lead)
  const subject = `Rappel SAMT — ${lead.name}`

  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'SAMT <onboarding@resend.dev>',
        to: [to],
        subject,
        text,
      }),
    })
    if (res.ok) return { ok: true }
  }

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: subject,
      _template: 'box',
      _captcha: 'false',
      name: lead.name,
      telephone: lead.phone,
      direction: lead.direction || '',
      depart: lead.cityFrom || '',
      arrivee: lead.cityTo || '',
      poids: lead.weight || '',
      message: lead.message || '',
      colis: Array.isArray(lead.parcels) ? leadText(lead) : '',
    }),
  })
  if (!res.ok) return { ok: false, error: 'mail-failed' }
  return { ok: true }
}
