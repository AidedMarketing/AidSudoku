import { motion } from 'framer-motion'
import { useGame } from '../../hooks/useGame'

export function NumberPad() {
  const { handleNumberInput, isNotesMode } = useGame()

  return (
    <div className="grid grid-cols-9 gap-1 w-full max-w-[min(92vw,400px)] mx-auto px-0.5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
        <motion.button
          key={num}
          className={`min-h-[44px] flex items-center justify-center rounded-xl font-semibold select-none
            ${isNotesMode
              ? 'bg-accent/10 dark:bg-accent/[0.15] border border-accent/40 text-accent dark:text-accent'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700'
            }`}
          whileTap={{ scale: 0.88 }}
          transition={{ duration: 0.08 }}
          onClick={() => handleNumberInput(num)}
        >
          {isNotesMode
            ? <span className="text-xs font-bold">{num}</span>
            : <span className="text-xl">{num}</span>
          }
        </motion.button>
      ))}
    </div>
  )
}
