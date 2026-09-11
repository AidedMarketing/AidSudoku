import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Vertically center the content (used by sparse screens like Daily). */
  center?: boolean
  /** Full-screen routes have no tab bar, so they only need the home-indicator inset. */
  fullscreen?: boolean
  className?: string
}

/**
 * The canonical page container: paper ground, side gutters, status-bar inset on top,
 * and enough bottom room for the floating tab capsule (or just the home indicator).
 */
export function PageShell({ children, center = false, fullscreen = false, className = '' }: Props) {
  return (
    <main
      className={`min-h-screen bg-paper px-5 pt-page ${fullscreen ? 'pb-safe' : 'pb-tab-safe'} ${
        center ? 'flex flex-col items-center justify-center' : ''
      } ${className}`}
    >
      {children}
    </main>
  )
}
