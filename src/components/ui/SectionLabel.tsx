import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Optional right-aligned slot (a count, a link). */
  aside?: ReactNode
  className?: string
}

/** The eyebrow that names a group of content. */
export function SectionLabel({ children, aside, className = '' }: Props) {
  return (
    <div className={`flex items-baseline justify-between gap-3 mb-2 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">{children}</p>
      {aside && <div className="text-xs text-ink-3 tabular">{aside}</div>}
    </div>
  )
}
