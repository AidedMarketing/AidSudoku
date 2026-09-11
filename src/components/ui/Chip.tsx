import type { ReactNode } from 'react'
import type { PassportStatus } from '../../types'

interface Props {
  children: ReactNode
  /** Passport-status coloring: mastered = gold, learned = teal, locked = quiet. */
  status?: PassportStatus | 'neutral'
  /** Selected state for choice chips (quick-play difficulty). */
  active?: boolean
  /** Glass background for chips that float over the page. */
  glass?: boolean
  onClick?: () => void
  className?: string
}

const statusCls: Record<NonNullable<Props['status']>, string> = {
  mastered: 'bg-aha/15 text-aha-ink',
  learned:  'bg-guide/15 text-guide-ink',
  locked:   'bg-line/60 text-ink-3',
  neutral:  'text-ink-2',
}

export function Chip({ children, status = 'neutral', active = false, glass = false, onClick, className = '' }: Props) {
  const cls = [
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap',
    glass ? 'glass text-ink-2' : statusCls[status],
    active ? 'text-ink shadow-[inset_0_0_0_1.5px_rgb(var(--c-aha))]' : '',
    onClick ? 'active:scale-95 transition-transform' : '',
    className,
  ].join(' ')

  if (onClick) {
    return <button type="button" onClick={onClick} className={cls}>{children}</button>
  }
  return <span className={cls}>{children}</span>
}
