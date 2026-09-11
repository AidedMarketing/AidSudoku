import { motion } from 'framer-motion'
import { rowOf, colOf } from '../../lib/sudoku/generator'
import { useMotionSafe } from '../../lib/motion'

interface Props {
  idx: number
  value: string          // '0' = empty, '1'-'9' = filled
  isGiven: boolean       // clue cell — immutable
  isSelected: boolean
  isSameNumber: boolean  // same digit as selected cell
  isRelated: boolean     // same row/col/box as selected cell
  isConflict: boolean    // duplicate in unit (showErrors on)
  isCoachTarget: boolean // the cell Coach mode wants you to look at
  isCoachRelated: boolean// cells Coach mode highlights to explain the step
  isAha: boolean         // the cell whose placement just triggered an A-ha
  ahaKey?: number        // changes per A-ha so the bloom re-runs
  notes: number[]
  onPress: (idx: number) => void
}

/**
 * One board cell. The board is the one surface that never gets glass: opaque paper,
 * crisp lines, and every state pairs its color with a second cue (weight, ring, or fill)
 * so nothing rides on hue alone.
 */
export function SudokuCell({
  idx, value, isGiven, isSelected, isSameNumber, isRelated, isConflict,
  isCoachTarget, isCoachRelated, isAha, ahaKey, notes, onPress,
}: Props) {
  const { tap } = useMotionSafe()
  const isEmpty = value === '0'

  // ── Background + ring (priority order) ────────────────────────────────────
  let bg = 'bg-board'
  if (isSelected)          bg = 'bg-aha/30 shadow-[inset_0_0_0_2px_rgb(var(--c-aha))]'
  else if (isCoachTarget)  bg = 'bg-guide/20 shadow-[inset_0_0_0_2px_rgb(var(--c-guide))]'
  else if (isConflict)     bg = 'bg-signal/[0.14]'
  else if (isCoachRelated) bg = 'bg-guide/10'
  else if (isSameNumber)   bg = 'bg-ink/10'
  else if (isRelated)      bg = 'bg-ink/5'

  // ── Text ──────────────────────────────────────────────────────────────────
  let text = 'text-ink font-medium'
  if (isGiven)         text = 'text-ink font-bold'
  else if (isAha)      text = 'text-aha-ink font-bold'
  else if (isConflict) text = 'text-signal font-semibold'

  // ── Borders: hairlines inside a box, heavy lines between boxes ────────────
  const r = rowOf(idx), c = colOf(idx)
  const borderTop  = r % 3 === 0 && r !== 0 ? 'border-t-2 border-t-board-box' : 'border-t border-t-board-line'
  const borderLeft = c % 3 === 0 && c !== 0 ? 'border-l-2 border-l-board-box' : 'border-l border-l-board-line'

  return (
    <motion.button
      type="button"
      className={`relative aspect-square flex items-center justify-center select-none focus:outline-none ${bg} ${borderTop} ${borderLeft}`}
      onTap={() => onPress(idx)}
      {...tap}
    >
      {isAha && <span key={ahaKey} aria-hidden="true" className="absolute inset-0 animate-bloom pointer-events-none" />}
      {!isEmpty && (
        <span className={`relative text-[clamp(16px,4.2vw,24px)] leading-none tabular ${text}`}>
          {value}
        </span>
      )}
      {isEmpty && notes.length > 0 && (
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-px">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <span
              key={n}
              className={`text-[clamp(7px,1.9vw,10px)] leading-none flex items-center justify-center text-ink-3 ${notes.includes(n) ? '' : 'opacity-0'}`}
            >
              {n}
            </span>
          ))}
        </div>
      )}
    </motion.button>
  )
}
