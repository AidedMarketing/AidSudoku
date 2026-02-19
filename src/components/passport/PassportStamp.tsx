import { motion } from 'framer-motion'
import type { TechniqueName, PassportStatus } from '../../types'
import { TECHNIQUE_LABELS } from '../../types'

interface Props {
  technique: TechniqueName
  status: PassportStatus
  useCount: number
  onPress?: () => void
}

const statusStyles: Record<PassportStatus, string> = {
  locked:   'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400',
  learned:  'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
  mastered: 'bg-accent/10 border-accent/30 text-accent-dim dark:text-accent',
}

const statusIcon: Record<PassportStatus, string> = {
  locked:   '🔒',
  learned:  '📖',
  mastered: '✦',
}

export function PassportStamp({ technique, status, useCount, onPress }: Props) {
  return (
    <motion.button
      className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-center ${statusStyles[status]}`}
      whileTap={{ scale: 0.95 }}
      onClick={onPress}
    >
      <span className="text-2xl">{statusIcon[status]}</span>
      <span className="text-[10px] font-semibold leading-tight">
        {TECHNIQUE_LABELS[technique]}
      </span>
      {status !== 'locked' && (
        <span className="text-[9px] opacity-60">×{useCount}</span>
      )}
    </motion.button>
  )
}
