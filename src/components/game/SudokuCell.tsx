import { motion } from 'framer-motion'
import { rowOf, colOf, boxOf } from '../../lib/sudoku/generator'

interface Props {
  idx: number
  value: string          // '0' = empty, '1'-'9' = filled
  isGiven: boolean       // clue cell — immutable
  isSelected: boolean
  isSameNumber: boolean  // same digit as selected cell
  isRelated: boolean     // same row/col/box as selected cell
  isConflict: boolean    // duplicate in unit (showErrors on)
  isHint: boolean        // placed via hint button
  notes: number[]
  onPress: (idx: number) => void
}

export function SudokuCell({
  idx, value, isGiven, isSelected, isSameNumber,
  isRelated, isConflict, isHint, notes, onPress,
}: Props) {
  const isEmpty = value === '0'

  // ── Background ────────────────────────────────────────────────────────────
  let bg = 'bg-white dark:bg-[#1E1E1E]'
  if (isSelected)    bg = 'bg-[#6AAD6440] dark:bg-[#6AAD6430]'
  else if (isConflict) bg = 'bg-[#E5737320] dark:bg-[#E5737318]'
  else if (isSameNumber) bg = 'bg-gray-100 dark:bg-gray-800'
  else if (isRelated)    bg = 'bg-gray-50 dark:bg-[#242424]'

  // ── Text colour ───────────────────────────────────────────────────────────
  let textColour = 'text-gray-900 dark:text-white'
  if (isGiven)     textColour = 'text-black dark:text-white font-semibold'
  else if (isHint) textColour = 'text-[#5B9BD5]'
  else if (isConflict) textColour = 'text-[#E57373]'

  // ── Border classes (box borders thicker) ─────────────────────────────────
  const r = rowOf(idx), c = colOf(idx), b = boxOf(idx)
  const borderTop    = r % 3 === 0 && r !== 0 ? 'border-t-2 border-t-gray-800 dark:border-t-gray-300' : 'border-t border-t-gray-200 dark:border-t-gray-700'
  const borderLeft   = c % 3 === 0 && c !== 0 ? 'border-l-2 border-l-gray-800 dark:border-l-gray-300' : 'border-l border-l-gray-200 dark:border-l-gray-700'
  void b  // suppress unused warning — boxOf used for future highlighting

  return (
    <motion.button
      className={`relative aspect-square flex items-center justify-center select-none ${bg} ${borderTop} ${borderLeft} focus:outline-none`}
      onTap={() => onPress(idx)}
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.08 }}
    >
      {!isEmpty && (
        <span className={`text-[clamp(14px,4vw,22px)] leading-none ${textColour}`}>
          {value}
        </span>
      )}
      {isEmpty && notes.length > 0 && (
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-px">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <span
              key={n}
              className={`text-[clamp(6px,1.8vw,10px)] flex items-center justify-center text-gray-400 dark:text-gray-500 ${notes.includes(n) ? '' : 'opacity-0'}`}
            >
              {n}
            </span>
          ))}
        </div>
      )}
    </motion.button>
  )
}
