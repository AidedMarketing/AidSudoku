import { motion } from 'framer-motion'
import { useGame } from '../../hooks/useGame'

export function NumberPad() {
  const { handleNumberInput, isNotesMode } = useGame()

  return (
    <div className="grid grid-cols-9 gap-1.5 w-full max-w-[min(92vw,400px)] mx-auto px-0.5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
        <motion.button
          key={num}
          className={`aspect-square flex items-center justify-center rounded-xl text-xl font-semibold select-none
            ${isNotesMode
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-700'
            }`}
          whileTap={{ scale: 0.88 }}
          transition={{ duration: 0.08 }}
          onClick={() => handleNumberInput(num)}
        >
          {isNotesMode
            ? <span className="text-xs text-gray-400">{num}</span>
            : num
          }
        </motion.button>
      ))}
    </div>
  )
}
