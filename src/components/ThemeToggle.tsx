import { Moon, Sun } from '@phosphor-icons/react'
import { useSite } from '../context/SiteContext'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useSite()
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`grid size-10 place-items-center rounded-full text-[var(--ink)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-black/5 active:scale-95 ${className}`}
      aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {dark ? <Sun weight="light" className="size-5" /> : <Moon weight="light" className="size-5" />}
    </button>
  )
}
