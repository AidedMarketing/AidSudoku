// Shared motion vocabulary. One place for every spring and tap so the app moves as a single system,
// and one hook that switches it all off for people who asked the OS for reduced motion.

import { useReducedMotion } from 'framer-motion'

/** Press feedback on tappable surfaces (cells, keys, chips, buttons). */
export const TAP = { scale: 0.94 } as const
export const TAP_TRANSITION = { duration: 0.12 } as const

/** Sheets and anything that slides in from an edge. */
export const SHEET_SPRING = { type: 'spring', damping: 30, stiffness: 300 } as const

/** Content that appears in place (cards, rows, toasts). */
export const FADE_UP = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: 8 },
  transition: { duration: 0.2 },
} as const

/** Route/tab content swaps — a crossfade, never a slide. */
export const CROSSFADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.15 },
} as const

/** The A-ha bloom on a resolved cell: gold swells then settles, once. */
export const BLOOM_MS = 600

/**
 * Returns motion props that respect prefers-reduced-motion.
 * Spread `tap` onto motion elements; use `fadeUp`/`crossfade` in place of the constants above.
 */
export function useMotionSafe() {
  const reduced = !!useReducedMotion()
  return {
    reduced,
    tap: reduced ? {} : { whileTap: TAP, transition: TAP_TRANSITION },
    fadeUp: reduced ? { initial: false as const } : FADE_UP,
    crossfade: reduced ? { initial: false as const } : CROSSFADE,
    sheet: reduced ? { duration: 0 } : SHEET_SPRING,
  }
}
