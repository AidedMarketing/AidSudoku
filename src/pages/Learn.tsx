// Phase 2 — technique lessons, practice boards, Coach mode.
// Placeholder for Phase 1.

import { ALL_TECHNIQUES, TECHNIQUE_LABELS } from '../types'
import { usePassportStore } from '../store/passportStore'

export function Learn() {
  const passport = usePassportStore(s => s.passport)

  return (
    <div className="px-5 pt-10 pb-28 min-h-screen bg-white dark:bg-[#121212]">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Learn</h1>
      <p className="text-sm text-gray-400 mb-6">
        Interactive lessons coming in Phase 2. Track your techniques below.
      </p>

      <div className="flex flex-col gap-2">
        {ALL_TECHNIQUES.map(t => {
          const { status, useCount } = passport[t]
          return (
            <div
              key={t}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {TECHNIQUE_LABELS[t]}
              </span>
              <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${
                status === 'mastered'
                  ? 'bg-accent/15 text-accent-dim dark:text-accent'
                  : status === 'learned'
                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  : 'text-gray-400'
              }`}>
                {status === 'locked' ? '🔒 Locked' : `${status} ×${useCount}`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
