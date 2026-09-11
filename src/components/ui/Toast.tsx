import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMotionSafe } from '../../lib/motion'

interface Props {
  message: string | null
  /** Changing the id re-triggers the entrance even if the message text repeats. */
  id?: string | number
  /** Leading glyph — the A-ha spark, a check, etc. */
  icon?: ReactNode
  /** Top for in-game moments (over the board); bottom for practice/lesson feedback. */
  position?: 'top' | 'bottom'
}

/** A single floating glass capsule. Dismissal timing is the caller's job. */
export function Toast({ message, id, icon, position = 'top' }: Props) {
  const { reduced } = useMotionSafe()
  const fromY = position === 'top' ? -14 : 14

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={id ?? message}
          className={`pointer-events-none fixed inset-x-0 z-50 flex justify-center px-6 ${
            position === 'top' ? 'top-[calc(env(safe-area-inset-top,0px)_+_3.75rem)]' : 'bottom-[calc(env(safe-area-inset-bottom,0px)_+_6.5rem)]'
          }`}
          initial={reduced ? false : { opacity: 0, y: fromY, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: fromY, scale: 0.96 }}
          transition={{ duration: 0.2 }}
        >
          <div className="glass inline-flex items-center gap-2 rounded-full pl-3 pr-4 py-2.5 text-sm font-semibold text-ink max-w-xs text-center">
            {icon && <span className="shrink-0 text-aha">{icon}</span>}
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
