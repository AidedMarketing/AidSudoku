import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** glass = floating chrome; solid = opaque paper (anything read closely); tinted = a meaning-colored callout. */
  variant?: 'glass' | 'solid' | 'tinted'
  /** Tint color for the tinted variant: gold = earned, teal = guidance. */
  tone?: 'aha' | 'guide'
  /** Renders as a button when tappable — gives the press state and semantics for free. */
  onClick?: () => void
  className?: string
}

const base = 'rounded-3xl p-4 text-left'

const variants = {
  glass:  'glass',
  solid:  'bg-paper-2 border border-line',
  tinted: '',
}

const tones = {
  aha:   'bg-aha/10 border border-aha/25',
  guide: 'bg-guide/10 border border-guide/25',
}

export function Card({ children, variant = 'solid', tone = 'aha', onClick, className = '' }: Props) {
  const cls = `${base} ${variant === 'tinted' ? tones[tone] : variants[variant]} ${className}`
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${cls} w-full active:scale-[0.985] transition-transform`}>
        {children}
      </button>
    )
  }
  return <div className={cls}>{children}</div>
}
