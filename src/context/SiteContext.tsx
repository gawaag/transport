import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import fallback from '../data/site.json'
import { localize } from '../lib/locale'
import { t } from '../lib/ui'
import type { Lang, SiteContent } from '../types'

type ThemeMode = 'light' | 'dark'

type SiteContextValue = {
  source: SiteContent
  content: SiteContent
  setContent: (next: SiteContent) => void
  theme: ThemeMode
  toggleTheme: () => void
  lang: Lang
  setLang: (lang: Lang) => void
  ui: ReturnType<typeof t>
  reload: () => Promise<void>
}

const SiteContext = createContext<SiteContextValue | null>(null)

function applyThemeVars(content: SiteContent) {
  const root = document.documentElement
  root.style.setProperty('--accent', content.theme.accent)
  root.style.setProperty('--accent-ink', content.theme.accentInk)
  root.style.setProperty('--radius', `${content.theme.radius}px`)
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [source, setSource] = useState<SiteContent>(fallback as SiteContent)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('lx-theme') as ThemeMode | null
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('lx-lang')
    return saved === 'ar' ? 'ar' : 'fr'
  })

  const content = useMemo(() => localize(source, lang), [source, lang])

  const setContent = useCallback((next: SiteContent) => {
    setSource(next)
    applyThemeVars(next)
  }, [])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    localStorage.setItem('lx-lang', next)
  }, [])

  const reload = useCallback(async () => {
    try {
      const apiRes = await fetch('/api/content', { cache: 'no-store' })
      const type = apiRes.headers.get('content-type') || ''
      if (apiRes.ok && type.includes('json')) {
        const payload = (await apiRes.json()) as { content?: SiteContent }
        if (payload.content && payload.content.brand) {
          setContent(payload.content)
          return
        }
      }
    } catch {
      /* static host without API */
    }
    try {
      const res = await fetch('/content.json', { cache: 'no-store' })
      if (!res.ok) return
      const data = (await res.json()) as SiteContent
      if (data?.brand) setContent(data)
    } catch {
      setContent(fallback as SiteContent)
    }
  }, [setContent])

  useEffect(() => {
    applyThemeVars(source)
  }, [source])

  useEffect(() => {
    document.title = content.seo.title
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', content.seo.description)
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'fr'
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [content.seo, lang])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('lx-theme', theme)
  }, [theme])

  useEffect(() => {
    void reload()
  }, [reload])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({
      source,
      content,
      setContent,
      theme,
      toggleTheme,
      lang,
      setLang,
      ui: t(lang),
      reload,
    }),
    [source, content, setContent, theme, toggleTheme, lang, setLang, reload],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used inside SiteProvider')
  return ctx
}
