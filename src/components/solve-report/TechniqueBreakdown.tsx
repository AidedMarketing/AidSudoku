import type { TechniqueName } from '../../types'
import { TECHNIQUE_LABELS } from '../../types'
import { usePassportStore } from '../../store/passportStore'

interface Props {
  techniques: TechniqueName[]
}

export function TechniqueBreakdown({ techniques }: Props) {
  const passport = usePassportStore(s => s.passport)

  if (techniques.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-2">
        No techniques detected in this solve.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Techniques used
      </p>
      <div className="flex flex-wrap gap-2">
        {techniques.map(t => {
          const status = passport[t].status
          return (
            <span
              key={t}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === 'mastered'
                  ? 'bg-accent/15 text-accent-dim dark:text-accent'
                  : status === 'learned'
                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {TECHNIQUE_LABELS[t]}
            </span>
          )
        })}
      </div>
    </div>
  )
}
