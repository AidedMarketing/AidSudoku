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
  locked:   '○',
  learned:  '✓',
  mastered: '★',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PassportStamp({ technique, status, useCount: _useCount, onPress }: Props) {
  const baseClass = `flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-center ${statusStyles[status]}`
  const inner = (
    <>
      <span className="text-xl leading-none">{statusIcon[status]}</span>
      <span className="text-[10px] font-semibold leading-tight">
        {TECHNIQUE_LABELS[technique]}
      </span>
    </>
  )

  if (onPress) {
    return (
      <motion.button className={baseClass} whileTap={{ scale: 0.95 }} onClick={onPress}>
        {inner}
      </motion.button>
    )
  }

  return <div className={baseClass}>{inner}</div>
}
