import { usePassportStore } from '../../store/passportStore'
import { PassportStamp } from './PassportStamp'
import { ALL_TECHNIQUES } from '../../types'

export function PassportView() {
  const passport = usePassportStore(s => s.passport)

  const learned  = ALL_TECHNIQUES.filter(t => passport[t].status !== 'locked').length
  const mastered = ALL_TECHNIQUES.filter(t => passport[t].status === 'mastered').length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Technique Passport</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {learned}/{ALL_TECHNIQUES.length} learned · {mastered} mastered
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${(learned / ALL_TECHNIQUES.length) * 100}%` }}
        />
      </div>

      {/* Stamp grid */}
      <div className="grid grid-cols-3 gap-3">
        {ALL_TECHNIQUES.map(technique => (
          <PassportStamp
            key={technique}
            technique={technique}
            status={passport[technique].status}
            useCount={passport[technique].useCount}
          />
        ))}
      </div>

      <p className="text-xs text-center text-gray-400 dark:text-gray-600">
        Play puzzles and apply techniques to earn stamps.
        Complete lessons to unlock new ones.
      </p>
    </div>
  )
}
