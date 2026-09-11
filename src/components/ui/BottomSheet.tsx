import { type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMotionSafe } from '../../lib/motion'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

/** A glass sheet that rises from the bottom edge. Scrim tap and Escape both close it. */
export function BottomSheet({ open, onClose, title, children }: Props) {
  const { sheet } = useMotionSafe()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-ink/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="glass fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-[28px] border-b-0"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={sheet}
            onKeyDown={e => { if (e.key === 'Escape') onClose() }}
          >
            <div className="w-10 h-1 bg-ink/20 rounded-full mx-auto mt-3 mb-4" />
            {title && (
              <h2 className="font-display text-center font-bold text-xl text-ink mb-4 px-6">
                {title}
              </h2>
            )}
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
