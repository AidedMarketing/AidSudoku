import type { ReactNode } from 'react'

interface Props {
  value: ReactNode
  label: string
  /** Gold for figures the player earned (streaks, mastery); default ink otherwise. */
  tone?: 'ink' | 'aha'
  className?: string
}

/** A single figure with its label. Solid paper, never glass — numbers get read closely. */
export function StatTile({ value, label, tone = 'ink', className = '' }: Props) {
  return (
    <div className={`bg-paper-2 border border-line rounded-2xl px-3 py-4 text-center ${className}`}>
      <p className={`font-display text-3xl font-bold leading-none tabular ${tone === 'aha' ? 'text-aha-ink' : 'text-ink'}`}>
        {value}
      </p>
      <p className="text-xs text-ink-3 mt-2">{label}</p>
    </div>
  )
}
