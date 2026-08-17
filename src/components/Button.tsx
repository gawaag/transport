import { ArrowUpRight } from '@phosphor-icons/react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
  variant?: 'primary' | 'ghost' | 'dark' | 'onDark'
  icon?: ReactNode
  children: ReactNode
}

export function Button({
  href,
  variant = 'primary',
  icon,
  children,
  className = '',
  ...rest
}: Props) {
  const styles = {
    primary:
      'bg-[var(--accent)] text-[var(--accent-ink)] hover:brightness-[1.04]',
    ghost:
      'bg-transparent text-[var(--ink)] ring-1 ring-[var(--line)] hover:bg-[var(--bg-elev)]',
    dark: 'bg-[var(--ink)] text-[var(--bg)] hover:opacity-90',
    onDark: 'bg-transparent text-[#f3f1ec] ring-1 ring-white/25 hover:bg-white/10',
  }[variant]

  const inner = (
    <>
      <span className="whitespace-nowrap">{children}</span>
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-black/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px dark:bg-white/12">
        {icon ?? <ArrowUpRight weight="bold" className="size-4" />}
      </span>
    </>
  )

  const cls = `group inline-flex items-center gap-3 rounded-full py-2 pr-2 pl-5 text-sm font-medium tracking-tight transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${styles} ${className}`

  if (href) {
    const external = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
    return (
      <a
        href={href}
        className={cls}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
      >
        {inner}
      </a>
    )
  }

  return (
    <button type="button" className={cls} {...rest}>
      {inner}
    </button>
  )
}
