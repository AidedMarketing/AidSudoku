import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  message: string | null
  isNew?: boolean
}

export function Toast({ message, isNew }: Props) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          className="pointer-events-none fixed top-20 inset-x-0 flex justify-center z-50"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
        >
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 rounded-2xl shadow-lg text-sm font-medium max-w-xs text-center">
            {isNew && <span className="mr-1">✨</span>}
            {message}
            {isNew && <span className="ml-1">🎯</span>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
