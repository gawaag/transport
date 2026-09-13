import { FloppyDisk, SignOut } from '@phosphor-icons/react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import { api, clearToken, getToken, setToken } from '../lib/api'
import type { FaqItem, Lead, Quote, RouteStep, SiteContent } from '../types'

const tabs = [
  'Marque',
  'Offre',
  'Trajet',
  'Villes',
  'Avis',
  'FAQ',
  'Couleurs',
  'Contact',
  'Demandes',
  'Accès',
] as const

type Tab = (typeof tabs)[number]

export function Admin() {
  const { source, setContent, reload } = useSite()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [tab, setTab] = useState<Tab>('Marque')
  const [draft, setDraft] = useState<SiteContent>(source)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(source)
  }, [source])

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setChecking(false)
      return
    }
    api
      .session()
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false))
      .finally(() => setChecking(false))
  }, [])

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', draft.theme.accent)
    document.documentElement.style.setProperty('--accent-ink', draft.theme.accentInk)
    document.documentElement.style.setProperty('--radius', `${draft.theme.radius}px`)
  }, [draft.theme])

  async function save() {
    setSaving(true)
    setStatus('')
    try {
      await api.saveContent(draft)
      setContent(draft)
      setStatus('Enregistré.')
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Impossible d’enregistrer.')
    } finally {
      setSaving(false)
    }
  }

  if (checking) {
    return <div className="grid min-h-[100dvh] place-items-center text-sm text-[var(--muted)]">Chargement…</div>
  }

  if (!authed) {
    return (
      <Login
        onOk={async () => {
          setAuthed(true)
          await reload()
        }}
      />
    )
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--bg)]">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--line)] bg-[color-mix(in_oklab,var(--bg)_90%,transparent)] px-4 py-3 backdrop-blur-xl">
        <p className="text-sm font-medium tracking-tight">Studio S.A.M</p>
        <Link to="/" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
          Voir le site
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {status && <span className="text-sm text-[var(--muted)]">{status}</span>}
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-ink)] disabled:opacity-60"
          >
            <FloppyDisk weight="bold" className="size-4" />
            {saving ? 'Enregistrement' : 'Enregistrer'}
          </button>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full"
            aria-label="Déconnexion"
            onClick={() => {
              clearToken()
              setAuthed(false)
            }}
          >
            <SignOut weight="light" className="size-5" />
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[200px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-2 text-left text-sm whitespace-nowrap ${
                tab === t ? 'bg-[var(--bg-elev)] font-medium ring-1 ring-[var(--line)]' : 'text-[var(--muted)]'
              }`}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className="max-w-3xl pb-24">
          {tab === 'Marque' && <BrandTab draft={draft} setDraft={setDraft} />}
          {tab === 'Offre' && <OfferTab draft={draft} setDraft={setDraft} />}
          {tab === 'Trajet' && <RouteTab draft={draft} setDraft={setDraft} />}
          {tab === 'Villes' && <CoverageTab draft={draft} setDraft={setDraft} />}
          {tab === 'Avis' && <QuotesTab draft={draft} setDraft={setDraft} />}
          {tab === 'FAQ' && <FaqTab draft={draft} setDraft={setDraft} />}
          {tab === 'Couleurs' && <ThemeTab draft={draft} setDraft={setDraft} />}
          {tab === 'Contact' && <ContactTab draft={draft} setDraft={setDraft} />}
          {tab === 'Demandes' && <LeadsTab />}
          {tab === 'Accès' && <AccessTab />}
        </div>
      </div>
    </div>
  )
}

function Login({ onOk }: { onOk: () => Promise<void> }) {
  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const res = await api.login(username, code)
      setToken(res.token)
      await onOk()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Accès refusé.')
    }
  }

  return (
    <div className="grid min-h-[100dvh] place-items-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-[24px] bg-[var(--bg-elev)] p-8 ring-1 ring-[var(--line)]"
      >
        <p className="text-sm text-[var(--muted)]">Espace privé</p>
        <h1 className="mt-2 text-2xl tracking-tight">Studio S.A.M</h1>
        <label className="mt-8 block text-sm font-medium">
          Identifiant
          <input
            className="mt-2 w-full rounded-xl bg-[var(--bg)] px-3 py-3 ring-1 ring-[var(--line)] outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Code
          <input
            type="password"
            className="mt-2 w-full rounded-xl bg-[var(--bg)] px-3 py-3 ring-1 ring-[var(--line)] outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="mt-3 text-sm text-[#b42318]" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-[var(--accent)] py-3 text-sm font-medium text-[var(--accent-ink)]"
        >
          Entrer
        </button>
      </form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string | number
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <label className="mb-4 block text-sm font-medium">
      {label}
      <input
        type={type}
        className="mt-2 w-full rounded-xl bg-[var(--bg-elev)] px-3 py-3 text-[15px] font-normal ring-1 ring-[var(--line)] outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="mb-4 block text-sm font-medium">
      {label}
      <textarea
        rows={3}
        className="mt-2 w-full rounded-xl bg-[var(--bg-elev)] px-3 py-3 text-[15px] font-normal ring-1 ring-[var(--line)] outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

function BrandTab({
  draft,
  setDraft,
}: {
  draft: SiteContent
  setDraft: (c: SiteContent) => void
}) {
  return (
    <>
      <Field
        label="Nom de l'agence"
        value={draft.brand.name}
        onChange={(v) => setDraft({ ...draft, brand: { ...draft.brand, name: v } })}
      />
      <Field
        label="Nom court (nav)"
        value={draft.brand.shortName}
        onChange={(v) => setDraft({ ...draft, brand: { ...draft.brand, shortName: v } })}
      />
      <Field
        label="Monogramme (2 lettres)"
        value={draft.brand.mark}
        onChange={(v) => setDraft({ ...draft, brand: { ...draft.brand, mark: v } })}
      />
      <Field
        label="Titre SEO"
        value={draft.seo.title}
        onChange={(v) => setDraft({ ...draft, seo: { ...draft.seo, title: v } })}
      />
      <Area
        label="Description SEO"
        value={draft.seo.description}
        onChange={(v) => setDraft({ ...draft, seo: { ...draft.seo, description: v } })}
      />
      <Field
        label="Accroche au-dessus du titre"
        value={draft.hero.kicker}
        onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, kicker: v } })}
      />
      <Field
        label="Titre d'accueil"
        value={draft.hero.headline}
        onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, headline: v } })}
      />
      <Area
        label="Sous-titre"
        value={draft.hero.sub}
        onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, sub: v } })}
      />
      <Field
        label="Bouton principal"
        value={draft.hero.ctaPrimary}
        onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, ctaPrimary: v } })}
      />
      <Field
        label="Bouton secondaire"
        value={draft.hero.ctaSecondary}
        onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, ctaSecondary: v } })}
      />
      <Field
        label="Image d'accueil (chemin)"
        value={draft.hero.image}
        onChange={(v) => setDraft({ ...draft, hero: { ...draft.hero, image: v } })}
      />
      <Area
        label="Texte pied de page"
        value={draft.footer.blurb}
        onChange={(v) => setDraft({ ...draft, footer: { ...draft.footer, blurb: v } })}
      />
    </>
  )
}

function OfferTab({
  draft,
  setDraft,
}: {
  draft: SiteContent
  setDraft: (c: SiteContent) => void
}) {
  return (
    <>
      <Field
        label="Prix au kilo (€)"
        type="number"
        value={draft.offer.pricePerKg}
        onChange={(v) =>
          setDraft({ ...draft, offer: { ...draft.offer, pricePerKg: Number(v) || 0 } })
        }
      />
      <Field
        label="Poids par défaut du calculateur"
        type="number"
        value={draft.offer.defaultKg}
        onChange={(v) =>
          setDraft({ ...draft, offer: { ...draft.offer, defaultKg: Number(v) || 1 } })
        }
      />
      <Field
        label="Titre offre"
        value={draft.offer.headline}
        onChange={(v) => setDraft({ ...draft, offer: { ...draft.offer, headline: v } })}
      />
      <Area
        label="Texte offre"
        value={draft.offer.body}
        onChange={(v) => setDraft({ ...draft, offer: { ...draft.offer, body: v } })}
      />
      {draft.offer.points.map((p, i) => (
        <div key={i} className="mb-4 rounded-2xl p-4 ring-1 ring-[var(--line)]">
          <Field
            label={`Point ${i + 1} - titre`}
            value={p.title}
            onChange={(v) => {
              const points = draft.offer.points.slice()
              points[i] = { ...p, title: v }
              setDraft({ ...draft, offer: { ...draft.offer, points } })
            }}
          />
          <Area
            label="Texte"
            value={p.text}
            onChange={(v) => {
              const points = draft.offer.points.slice()
              points[i] = { ...p, text: v }
              setDraft({ ...draft, offer: { ...draft.offer, points } })
            }}
          />
        </div>
      ))}
    </>
  )
}

function RouteTab({
  draft,
  setDraft,
}: {
  draft: SiteContent
  setDraft: (c: SiteContent) => void
}) {
  function patch(i: number, next: RouteStep) {
    const steps = draft.route.steps.slice()
    steps[i] = next
    setDraft({ ...draft, route: { ...draft.route, steps } })
  }
  return (
    <>
      <Field
        label="Titre trajet"
        value={draft.route.headline}
        onChange={(v) => setDraft({ ...draft, route: { ...draft.route, headline: v } })}
      />
      <Area
        label="Texte trajet"
        value={draft.route.body}
        onChange={(v) => setDraft({ ...draft, route: { ...draft.route, body: v } })}
      />
      {draft.route.steps.map((s, i) => (
        <div key={i} className="mb-4 rounded-2xl p-4 ring-1 ring-[var(--line)]">
          <Field label={`Étape ${i + 1}`} value={s.title} onChange={(v) => patch(i, { ...s, title: v })} />
          <Area label="Texte" value={s.text} onChange={(v) => patch(i, { ...s, text: v })} />
          <Field label="Image" value={s.image} onChange={(v) => patch(i, { ...s, image: v })} />
        </div>
      ))}
    </>
  )
}

function CoverageTab({
  draft,
  setDraft,
}: {
  draft: SiteContent
  setDraft: (c: SiteContent) => void
}) {
  return (
    <>
      <Field
        label="Titre villes"
        value={draft.coverage.headline}
        onChange={(v) => setDraft({ ...draft, coverage: { ...draft.coverage, headline: v } })}
      />
      <Area
        label="Texte"
        value={draft.coverage.body}
        onChange={(v) => setDraft({ ...draft, coverage: { ...draft.coverage, body: v } })}
      />
      <Area
        label="Villes France (une par ligne)"
        value={draft.coverage.fromPlaces.join('\n')}
        onChange={(v) =>
          setDraft({
            ...draft,
            coverage: { ...draft.coverage, fromPlaces: v.split('\n').map((s) => s.trim()).filter(Boolean) },
          })
        }
      />
      <Area
        label="Villes Maroc (une par ligne)"
        value={draft.coverage.cities.join('\n')}
        onChange={(v) =>
          setDraft({
            ...draft,
            coverage: { ...draft.coverage, cities: v.split('\n').map((s) => s.trim()).filter(Boolean) },
          })
        }
      />
    </>
  )
}

function QuotesTab({
  draft,
  setDraft,
}: {
  draft: SiteContent
  setDraft: (c: SiteContent) => void
}) {
  function patch(i: number, next: Quote) {
    const quotes = draft.quotes.slice()
    quotes[i] = next
    setDraft({ ...draft, quotes })
  }
  return (
    <>
      {draft.quotes.map((q, i) => (
        <div key={i} className="mb-4 rounded-2xl p-4 ring-1 ring-[var(--line)]">
          <Area label="Citation" value={q.text} onChange={(v) => patch(i, { ...q, text: v })} />
          <Field label="Langue" value={q.lang || 'fr'} onChange={(v) => patch(i, { ...q, lang: v === 'ar' ? 'ar' : 'fr' })} />
          <Field label="Nom" value={q.name} onChange={(v) => patch(i, { ...q, name: v })} />
          <Field label="Trajet" value={q.meta} onChange={(v) => patch(i, { ...q, meta: v })} />
          <button
            type="button"
            className="text-sm text-[var(--muted)] underline"
            onClick={() => setDraft({ ...draft, quotes: draft.quotes.filter((_, j) => j !== i) })}
          >
            Retirer
          </button>
        </div>
      ))}
      <button
        type="button"
        className="rounded-full px-4 py-2 text-sm ring-1 ring-[var(--line)]"
        onClick={() =>
          setDraft({
            ...draft,
            quotes: [...draft.quotes, { text: '', name: '', meta: '', lang: 'fr' }],
          })
        }
      >
        Ajouter un avis
      </button>
    </>
  )
}

function FaqTab({
  draft,
  setDraft,
}: {
  draft: SiteContent
  setDraft: (c: SiteContent) => void
}) {
  function patch(i: number, next: FaqItem) {
    const faq = draft.faq.slice()
    faq[i] = next
    setDraft({ ...draft, faq })
  }
  return (
    <>
      <Field
        label="Titre de la section"
        value={draft.faqTitle}
        onChange={(v) => setDraft({ ...draft, faqTitle: v })}
      />
      {draft.faq.map((item, i) => (
        <div key={i} className="mb-4 rounded-2xl p-4 ring-1 ring-[var(--line)]">
          <Field label="Question" value={item.q} onChange={(v) => patch(i, { ...item, q: v })} />
          <Area label="Réponse" value={item.a} onChange={(v) => patch(i, { ...item, a: v })} />
          <button
            type="button"
            className="text-sm text-[var(--muted)] underline"
            onClick={() => setDraft({ ...draft, faq: draft.faq.filter((_, j) => j !== i) })}
          >
            Retirer
          </button>
        </div>
      ))}
      <button
        type="button"
        className="rounded-full px-4 py-2 text-sm ring-1 ring-[var(--line)]"
        onClick={() => setDraft({ ...draft, faq: [...draft.faq, { q: '', a: '' }] })}
      >
        Ajouter une question
      </button>
    </>
  )
}

function ThemeTab({
  draft,
  setDraft,
}: {
  draft: SiteContent
  setDraft: (c: SiteContent) => void
}) {
  return (
    <>
      <p className="mb-6 text-sm text-[var(--muted)]">
        La couleur d'accent s'applique aux boutons, au tarif et au monogramme. Enregistrez puis
        rechargez le site public pour tout voir.
      </p>
      <label className="mb-4 flex items-center gap-3 text-sm font-medium">
        Accent
        <input
          type="color"
          value={draft.theme.accent}
          onChange={(e) => setDraft({ ...draft, theme: { ...draft.theme, accent: e.target.value } })}
        />
        <input
          className="flex-1 rounded-xl bg-[var(--bg-elev)] px-3 py-2 ring-1 ring-[var(--line)]"
          value={draft.theme.accent}
          onChange={(e) => setDraft({ ...draft, theme: { ...draft.theme, accent: e.target.value } })}
        />
      </label>
      <label className="mb-4 flex items-center gap-3 text-sm font-medium">
        Texte sur accent
        <input
          type="color"
          value={draft.theme.accentInk}
          onChange={(e) =>
            setDraft({ ...draft, theme: { ...draft.theme, accentInk: e.target.value } })
          }
        />
        <input
          className="flex-1 rounded-xl bg-[var(--bg-elev)] px-3 py-2 ring-1 ring-[var(--line)]"
          value={draft.theme.accentInk}
          onChange={(e) =>
            setDraft({ ...draft, theme: { ...draft.theme, accentInk: e.target.value } })
          }
        />
      </label>
      <Field
        label="Arrondi des images (px)"
        type="number"
        value={draft.theme.radius}
        onChange={(v) =>
          setDraft({ ...draft, theme: { ...draft.theme, radius: Number(v) || 0 } })
        }
      />
      <div
        className="mt-6 rounded-2xl p-6"
        style={{ background: draft.theme.accent, color: draft.theme.accentInk }}
      >
        Aperçu bouton {draft.hero.ctaPrimary}
      </div>
    </>
  )
}

function ContactTab({
  draft,
  setDraft,
}: {
  draft: SiteContent
  setDraft: (c: SiteContent) => void
}) {
  const c = draft.contact
  function patch(part: Partial<typeof c>) {
    setDraft({ ...draft, contact: { ...c, ...part } })
  }
  return (
    <>
      <Field label="Téléphone 1" value={c.phone1} onChange={(v) => patch({ phone1: v })} />
      <Field label="Téléphone 2" value={c.phone2} onChange={(v) => patch({ phone2: v })} />
      <Field label="WhatsApp (numéro)" value={c.whatsapp} onChange={(v) => patch({ whatsapp: v })} />
      <Field
        label="WhatsApp ligne 2"
        value={c.whatsapp2 ?? ''}
        onChange={(v) => patch({ whatsapp2: v })}
      />
      <Field label="Email" value={c.email} onChange={(v) => patch({ email: v })} />
      <Field label="Adresse" value={c.address} onChange={(v) => patch({ address: v })} />
      <Field label="Ville / CP" value={c.city} onChange={(v) => patch({ city: v })} />
      <Field label="Horaires" value={c.hours} onChange={(v) => patch({ hours: v })} />
      <Field
        label="Instagram (lien)"
        value={c.instagram ?? ''}
        onChange={(v) => patch({ instagram: v })}
      />
      <Field label="TikTok (lien)" value={c.tiktok ?? ''} onChange={(v) => patch({ tiktok: v })} />
      <Field
        label="Titre formulaire"
        value={draft.form.headline}
        onChange={(v) => setDraft({ ...draft, form: { ...draft.form, headline: v } })}
      />
      <Area
        label="Texte formulaire"
        value={draft.form.body}
        onChange={(v) => setDraft({ ...draft, form: { ...draft.form, body: v } })}
      />
      <Field
        label="Bouton WhatsApp"
        value={draft.form.submitWhatsapp}
        onChange={(v) => setDraft({ ...draft, form: { ...draft.form, submitWhatsapp: v } })}
      />
      <Field
        label="Lien rappel"
        value={draft.form.submitCallback}
        onChange={(v) => setDraft({ ...draft, form: { ...draft.form, submitCallback: v } })}
      />
    </>
  )
}

function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    api
      .leads()
      .then((r) => setLeads((r.leads || []) as Lead[]))
      .catch((err: Error) => setError(err.message))
  }, [])
  if (error) return <p className="text-sm text-[#b42318]">{error}</p>
  if (!leads.length) return <p className="text-sm text-[var(--muted)]">Aucune demande pour l'instant.</p>
  return (
    <div className="flex flex-col gap-4">
      {leads.map((l) => (
        <article key={l.id} className="rounded-2xl p-4 ring-1 ring-[var(--line)]">
          <p className="font-medium">
            {l.name} · {l.phone}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {l.direction} · {l.cityFrom} vers {l.cityTo} · {l.weight} kg
          </p>
          {l.message && <p className="mt-2 text-sm">{l.message}</p>}
          <p className="mt-2 text-xs text-[var(--muted)]">
            {new Date(l.createdAt).toLocaleString('fr-FR')} · {l.prefer}
          </p>
        </article>
      ))}
    </div>
  )
}

function AccessTab() {
  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  async function save(e: FormEvent) {
    e.preventDefault()
    setMsg('')
    try {
      await api.saveCredentials(username, code)
      setMsg('Identifiants mis à jour.')
      setUsername('')
      setCode('')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Erreur.')
    }
  }
  return (
    <form onSubmit={save}>
      <p className="mb-4 text-sm text-[var(--muted)]">
        Changez l'identifiant et le code d'accès à cet espace. Minimum 4 caractères pour le nom, 6
        pour le code.
      </p>
      <Field label="Nouvel identifiant" value={username} onChange={setUsername} />
      <Field label="Nouveau code" value={code} onChange={setCode} type="password" />
      {msg && <p className="mb-3 text-sm text-[var(--muted)]">{msg}</p>}
      <button type="submit" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-[var(--accent-ink)]">
        Mettre à jour l'accès
      </button>
    </form>
  )
}
