import { useSite } from '../context/SiteContext'

export function LangToggle() {
  const { lang, setLang, ui } = useSite()
  return (
    <div className="flex items-center rounded-full text-[12px] font-medium">
      <button
        type="button"
        onClick={() => setLang('fr')}
        className={`rounded-full px-2 py-1 ${lang === 'fr' ? 'bg-[var(--ink)] text-[var(--bg)]' : 'text-[var(--muted)]'}`}
        aria-label={ui.switchToFr}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLang('ar')}
        className={`rounded-full px-2 py-1 ${lang === 'ar' ? 'bg-[var(--ink)] text-[var(--bg)]' : 'text-[var(--muted)]'}`}
        aria-label={ui.switchToAr}
      >
        AR
      </button>
    </div>
  )
}
