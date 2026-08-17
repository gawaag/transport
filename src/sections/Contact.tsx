import { Minus, Phone, Plus, WhatsappLogo } from '@phosphor-icons/react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { useSite } from '../context/SiteContext'
import { api } from '../lib/api'
import { formatPhone, telHref } from '../lib/format'
import { buildQuoteMessage, waHref } from '../lib/whatsapp'

type Parcel = { item: string; kg: string }
type NeedMode = 'note' | 'parcels'

export function Contact() {
  const { content, lang, ui } = useSite()
  const { form, contact, offer } = content
  const directions = [form.dirFrMa, form.dirMaFr]
  const [status, setStatus] = useState<'idle' | 'ok-wa' | 'ok-call' | 'error'>('idle')
  const [error, setError] = useState('')
  const [needMode, setNeedMode] = useState<NeedMode>('parcels')
  const [parcels, setParcels] = useState<Parcel[]>([{ item: '', kg: '' }])
  const [fields, setFields] = useState({
    name: '',
    phone: '',
    direction: form.dirFrMa,
    weight: '',
    cityFrom: '',
    cityTo: '',
    message: '',
  })

  const parcelTotal = useMemo(
    () => parcels.reduce((sum, p) => sum + (Number(p.kg) || 0), 0),
    [parcels],
  )

  useEffect(() => {
    setFields((f) => ({ ...f, direction: form.dirFrMa }))
  }, [form.dirFrMa])

  function set<K extends keyof typeof fields>(key: K, value: string) {
    setFields((f) => ({ ...f, [key]: value }))
  }

  function patchParcel(i: number, next: Parcel) {
    setParcels((rows) => rows.map((row, j) => (j === i ? next : row)))
  }

  async function submit(prefer: 'whatsapp' | 'callback') {
    setError('')
    if (!fields.name.trim() || !fields.phone.trim()) {
      setError(form.error)
      setStatus('error')
      return
    }
    const weight =
      needMode === 'parcels' && parcelTotal > 0 ? String(parcelTotal) : fields.weight
    const filledParcels = parcels.filter((p) => p.item.trim() || p.kg.trim())
    const payload = {
      ...fields,
      weight,
      brand: content.brand.name,
      lang,
      parcels: needMode === 'parcels' ? filledParcels : [],
    }
    try {
      await api.postLead({ ...payload, prefer })
    } catch {
      /* WhatsApp remains the main path */
    }
    if (prefer === 'whatsapp') {
      window.open(waHref(contact.whatsapp, buildQuoteMessage(payload)), '_blank')
      setStatus('ok-wa')
    } else {
      setStatus('ok-call')
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void submit('whatsapp')
  }

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="lx-wrap grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <Reveal>
          <h2 className="max-w-[16ch] text-[clamp(1.8rem,4vw,3rem)] leading-[1.08] font-medium tracking-[-0.04em]">
            {form.headline}
          </h2>
          <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-[var(--muted)]">
            {form.body}
          </p>
          <div className="mt-10 overflow-hidden rounded-[var(--radius)]">
            <img
              src={content.agencyImage}
              alt=""
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="mt-6 flex flex-col gap-2 text-sm text-[var(--muted)]">
            <p>
              {contact.address}, {contact.city}
            </p>
            <a href={telHref(contact.phone1)} className="hover:text-[var(--ink)]">
              {formatPhone(contact.phone1)}
            </a>
            <a href={telHref(contact.phone2)} className="hover:text-[var(--ink)]">
              {formatPhone(contact.phone2)}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <form
            onSubmit={onSubmit}
            className="rounded-[calc(var(--radius)+6px)] bg-[var(--bg-elev)] p-1.5 ring-1 ring-[var(--line)]"
          >
            <div className="rounded-[var(--radius)] bg-[var(--bg)] p-6 md:p-8">
              <Field label={form.name} htmlFor="name">
                <input
                  id="name"
                  value={fields.name}
                  onChange={(e) => set('name', e.target.value)}
                  autoComplete="name"
                  required
                />
              </Field>
              <Field label={form.phone} htmlFor="phone">
                <input
                  id="phone"
                  value={fields.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  required
                />
              </Field>
              <Field label={form.direction} htmlFor="direction">
                <select
                  id="direction"
                  value={fields.direction}
                  onChange={(e) => set('direction', e.target.value)}
                >
                  {directions.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={form.from} htmlFor="from">
                  <input
                    id="from"
                    value={fields.cityFrom}
                    onChange={(e) => set('cityFrom', e.target.value)}
                    placeholder="Savigny"
                  />
                </Field>
                <Field label={form.to} htmlFor="to">
                  <input
                    id="to"
                    value={fields.cityTo}
                    onChange={(e) => set('cityTo', e.target.value)}
                    placeholder="Casablanca"
                  />
                </Field>
              </div>

              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{form.need}</span>
                <div className="flex rounded-full text-[12px] font-medium ring-1 ring-[var(--line)]">
                  <button
                    type="button"
                    onClick={() => setNeedMode('note')}
                    className={`rounded-full px-3 py-1.5 ${needMode === 'note' ? 'bg-[var(--ink)] text-[var(--bg)]' : 'text-[var(--muted)]'}`}
                  >
                    {ui.needNote}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNeedMode('parcels')}
                    className={`rounded-full px-3 py-1.5 ${needMode === 'parcels' ? 'bg-[var(--ink)] text-[var(--bg)]' : 'text-[var(--muted)]'}`}
                  >
                    {ui.needParcels}
                  </button>
                </div>
              </div>

              {needMode === 'note' ? (
                <>
                  <Field label={form.weight} htmlFor="weight">
                    <input
                      id="weight"
                      value={fields.weight}
                      onChange={(e) => set('weight', e.target.value)}
                      inputMode="decimal"
                    />
                  </Field>
                  <Field label={form.need} htmlFor="msg">
                    <textarea
                      id="msg"
                      rows={4}
                      value={fields.message}
                      onChange={(e) => set('message', e.target.value)}
                    />
                  </Field>
                </>
              ) : (
                <div className="mb-4">
                  <div className="mb-2 hidden grid-cols-[1fr_88px_36px] gap-2 text-xs text-[var(--muted)] sm:grid">
                    <span>{ui.parcelItem}</span>
                    <span>{ui.parcelKg}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {parcels.map((row, i) => (
                      <div key={i} className="grid grid-cols-[1fr_88px_36px] gap-2">
                        <input
                          value={row.item}
                          onChange={(e) => patchParcel(i, { ...row, item: e.target.value })}
                          placeholder={`${ui.parcelItem} ${i + 1}`}
                          className="w-full rounded-xl bg-[var(--bg-elev)] px-3 py-3 ring-1 ring-[var(--line)] outline-none"
                        />
                        <input
                          value={row.kg}
                          onChange={(e) => patchParcel(i, { ...row, kg: e.target.value })}
                          inputMode="decimal"
                          placeholder="kg"
                          className="w-full rounded-xl bg-[var(--bg-elev)] px-3 py-3 ring-1 ring-[var(--line)] outline-none"
                        />
                        <button
                          type="button"
                          className="grid size-9 place-items-center self-center rounded-full text-[var(--muted)] hover:text-[var(--ink)]"
                          aria-label={ui.removeParcel}
                          onClick={() =>
                            setParcels((rows) =>
                              rows.length === 1 ? [{ item: '', kg: '' }] : rows.filter((_, j) => j !== i),
                            )
                          }
                        >
                          <Minus weight="light" className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setParcels((rows) => [...rows, { item: '', kg: '' }])}
                      className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--ink)]"
                    >
                      <Plus weight="light" className="size-4" />
                      {ui.addParcel}
                    </button>
                    {parcelTotal > 0 && (
                      <p className="text-sm text-[var(--muted)]">
                        {parcelTotal} kg
                      </p>
                    )}
                  </div>
                </div>
              )}

              <p className="mb-5 max-w-[48ch] text-sm leading-relaxed text-[var(--muted)]">
                {offer.weighNote}
              </p>

              {status === 'error' && (
                <p className="mb-4 text-sm text-[#b42318]" role="alert">
                  {error}
                </p>
              )}
              {status === 'ok-wa' && (
                <p className="mb-4 text-sm text-[var(--muted)]">{form.successWhatsapp}</p>
              )}
              {status === 'ok-call' && (
                <p className="mb-4 text-sm text-[var(--muted)]">{form.successCallback}</p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button type="submit" icon={<WhatsappLogo weight="bold" className="size-4" />}>
                  {form.submitWhatsapp}
                </Button>
                <button
                  type="button"
                  onClick={() => void submit('callback')}
                  className="inline-flex items-center gap-2 text-sm text-[var(--muted)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
                >
                  <Phone weight="light" className="size-4" />
                  {form.submitCallback}
                </button>
              </div>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="mb-4 block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <span className="block [&_input]:w-full [&_input]:rounded-xl [&_input]:bg-[var(--bg-elev)] [&_input]:px-3 [&_input]:py-3 [&_input]:text-[var(--ink)] [&_input]:ring-1 [&_input]:ring-[var(--line)] [&_input]:outline-none [&_input]:placeholder:text-[var(--muted)] [&_select]:w-full [&_select]:rounded-xl [&_select]:bg-[var(--bg-elev)] [&_select]:px-3 [&_select]:py-3 [&_select]:ring-1 [&_select]:ring-[var(--line)] [&_select]:outline-none [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-xl [&_textarea]:bg-[var(--bg-elev)] [&_textarea]:px-3 [&_textarea]:py-3 [&_textarea]:ring-1 [&_textarea]:ring-[var(--line)] [&_textarea]:outline-none">
        {children}
      </span>
    </label>
  )
}
