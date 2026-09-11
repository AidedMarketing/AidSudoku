import { motion } from 'framer-motion'
import type { TechniqueName, PassportStatus } from '../../types'
import { TECHNIQUE_LABELS } from '../../types'
import { StarIcon, CheckIcon } from '../ui/icons'
import { useMotionSafe } from '../../lib/motion'

interface Props {
  technique: TechniqueName
  status: PassportStatus
  useCount: number
  onPress?: () => void
}

const ring: Record<PassportStatus, string> = {
  locked:   'border-2 border-dashed border-line text-ink-3',
  learned:  'border-2 border-guide bg-guide/10 text-guide-ink',
  mastered: 'border-2 border-aha bg-aha/15 text-aha-ink shadow-[0_0_0_4px_rgb(var(--c-aha)/0.15)]',
}

/** One passport stamp: a ring whose state is legible by glyph and weight, not color alone. */
export function PassportStamp({ technique, status, useCount, onPress }: Props) {
  const { tap } = useMotionSafe()

  const inner = (
    <>
      <span className={`w-[58px] h-[58px] rounded-full grid place-items-center ${ring[status]}`}>
        {status === 'mastered' && <StarIcon className="w-6 h-6" />}
        {status === 'learned'  && <CheckIcon className="w-6 h-6" />}
        {status === 'locked'   && <span className="w-1.5 h-1.5 rounded-full bg-line" />}
      </span>
      <span className={`text-[10.5px] leading-tight text-center ${status === 'locked' ? 'font-medium text-ink-3' : 'font-semibold text-ink-2'}`}>
        {TECHNIQUE_LABELS[technique]}
      </span>
      {status === 'learned' && useCount > 0 && (
        <span className="text-[10px] text-ink-3 tabular -mt-0.5">{Math.min(useCount, 5)}/5</span>
      )}
    </>
  )

  const cls = 'flex flex-col items-center gap-1.5 select-none'
  if (onPress) {
    return (
      <motion.button type="button" className={cls} onClick={onPress} {...tap}>
        {inner}
      </motion.button>
    )
  }
  return <div className={cls}>{inner}</div>
}
