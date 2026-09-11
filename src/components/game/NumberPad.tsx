import { motion } from 'framer-motion'
import { useDigitCounts } from '../../hooks/useDigitCounts'
import { useMotionSafe } from '../../lib/motion'

interface Props {
  /** 81-char board — used to show how many of each digit remain. */
  board: string
  notesMode: boolean
  onInput: (digit: number) => void
}

/**
 * The nine keys. One glass container (not nine separate blurs — that would cost too much on
 * a phone GPU) with solid keys inside. Each key shows how many of that digit are still to be
 * placed and dims at zero, so the player never has to count.
 */
export function NumberPad({ board, notesMode, onInput }: Props) {
  const remaining = useDigitCounts(board)
  const { tap } = useMotionSafe()

  return (
    <div className="glass w-full max-w-[min(92vw,400px)] mx-auto rounded-[20px] p-1.5 grid grid-cols-9 gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
        const left = remaining[num]
        const done = left === 0
        return (
          <motion.button
            key={num}
            type="button"
            disabled={done}
            aria-label={`${num}, ${left} remaining`}
            className={`relative min-h-[46px] rounded-xl flex flex-col items-center justify-center select-none tabular transition-colors ${
              notesMode
                ? 'bg-aha/10 border border-aha/40 text-aha-ink'
                : 'bg-paper-2/80 border border-line/60 text-ink'
            } ${done ? 'opacity-35' : ''}`}
            onClick={() => onInput(num)}
            {...(done ? {} : tap)}
          >
            <span className={`leading-none ${notesMode ? 'text-sm font-bold' : 'text-xl font-semibold'}`}>{num}</span>
            <span className="text-[9px] leading-none mt-1 text-ink-3 font-medium">{left}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
