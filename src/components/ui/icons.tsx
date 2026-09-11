// One home for every glyph in the app — tab bar, game controls, status marks.
// All 24×24. Filled glyphs use currentColor fill; stroked glyphs use currentColor stroke.

import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { className?: string }

function Fill({ className = 'w-5 h-5', children, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} {...rest}>
      {children}
    </svg>
  )
}

function Stroke({ className = 'w-5 h-5', children, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  )
}

// ─── Navigation ────────────────────────────────────────────────────────────────

export const HomeIcon = (p: IconProps) => (
  <Fill {...p}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></Fill>
)
export const CalendarIcon = (p: IconProps) => (
  <Fill {...p}><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" /></Fill>
)
export const LearnIcon = (p: IconProps) => (
  <Fill {...p}><path d="M3 4.5h6.5A2.5 2.5 0 0112 7v13.5a2 2 0 00-2-2H3V4.5zm18 0h-6.5A2.5 2.5 0 0012 7v13.5a2 2 0 012-2h7V4.5z" /></Fill>
)
export const PassportIcon = (p: IconProps) => (
  <Fill {...p}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 2.75c1.24 0 2.25 1.01 2.25 2.25S13.24 11.25 12 11.25 9.75 10.24 9.75 9 10.76 6.75 12 6.75zM17 17H7v-.75c0-1.67 3.33-2.5 5-2.5s5 .83 5 2.5V17z" /></Fill>
)
export const StatsIcon = (p: IconProps) => (
  <Fill {...p}><path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z" /></Fill>
)
export const SettingsIcon = (p: IconProps) => (
  <Fill {...p}><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" /></Fill>
)

// ─── Game controls ─────────────────────────────────────────────────────────────

export const UndoIcon = (p: IconProps) => (
  <Stroke {...p}><path d="M9 14L4 9l5-5" /><path d="M4 9h10a6 6 0 010 12h-3" /></Stroke>
)
export const EraseIcon = (p: IconProps) => (
  <Stroke {...p}><path d="M20 20H8L2 12l6-8h12z" /><path d="M12 9l6 6M18 9l-6 6" /></Stroke>
)
export const NotesIcon = (p: IconProps) => (
  <Stroke {...p}><path d="M4 20h4l10-10-4-4L4 16z" /><path d="M12 8l4 4" /></Stroke>
)
export const HintIcon = (p: IconProps) => (
  <Stroke {...p}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5" /><path d="M12 17h.01" /></Stroke>
)
export const CoachIcon = (p: IconProps) => (
  <Stroke {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /></Stroke>
)
export const PlayIcon = (p: IconProps) => (
  <Fill {...p}><path d="M7 4.5v15l12-7.5z" /></Fill>
)
export const PauseIcon = (p: IconProps) => (
  <Fill {...p}><path d="M6 4.5h4v15H6zm8 0h4v15h-4z" /></Fill>
)
export const BackIcon = (p: IconProps) => (
  <Stroke {...p}><path d="M15 5l-7 7 7 7" /></Stroke>
)
export const ArrowRightIcon = (p: IconProps) => (
  <Stroke {...p}><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></Stroke>
)

// ─── Status marks ──────────────────────────────────────────────────────────────

/** The A-ha mark — insight earned. */
export const SparkIcon = (p: IconProps) => (
  <Fill {...p}><path d="M12 2l2.2 6.6L21 12l-6.8 3.4L12 22l-2.2-6.6L3 12l6.8-3.4z" /></Fill>
)
export const StarIcon = (p: IconProps) => (
  <Fill {...p}><path d="M12 2.5l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.7 5.9 21.1l1.4-6.8L2.2 9.6l6.9-.8z" /></Fill>
)
export const CheckIcon = (p: IconProps) => (
  <Stroke {...p}><path d="M5 12.5l4.5 4.5L19 7" /></Stroke>
)
export const LockIcon = (p: IconProps) => (
  <Stroke {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></Stroke>
)
