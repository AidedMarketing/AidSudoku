// Phase 2 — technique lesson hub.
// Lists the 4 free techniques with status badges; tapping navigates to the full lesson.

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePassportStore } from '../store/passportStore'
import { FREE_TECHNIQUES, LESSONS } from '../data/lessonContent'
import { ALL_TECHNIQUES, TECHNIQUE_LABELS } from '../types'
import type { TechniqueName } from '../types'

const STATUS_ICON: Record<string, string> = {
  mastered: '★',
  learned:  '✓',
  locked:   '○',
}

const COMING_SOON: TechniqueName[] = ALL_TECHNIQUES.filter(
  t => !FREE_TECHNIQUES.includes(t)
)

export function Learn() {
  const navigate = useNavigate()
  const passport = usePassportStore(s => s.passport)

  return (
    <div className="px-5 pt-10 pb-28 min-h-screen bg-white dark:bg-[#121212]">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Learn</h1>
      <p className="text-sm text-gray-400 mb-8">
        Study the logic behind every solve.
      </p>

      {/* Free techniques */}
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
        Free lessons
      </h2>
      <div className="flex flex-col gap-2 mb-8">
        {FREE_TECHNIQUES.map((t, idx) => {
          const { status } = passport[t]
          const lesson = LESSONS[t]
          if (!lesson) return null

          return (
            <motion.button
              key={t}
              className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/70 text-left w-full active:scale-[0.98] transition-transform"
              onClick={() => navigate(`/learn/${t}`)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              {/* Status badge */}
              <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-lg ${
                status === 'mastered' ? 'bg-accent/15' :
                status === 'learned'  ? 'bg-blue-100 dark:bg-blue-950' :
                                        'bg-gray-200 dark:bg-gray-700'
              }`}>
                {STATUS_ICON[status]}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {lesson.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {lesson.tagline}
                </p>
              </div>

              <div className="flex flex-col items-end shrink-0 gap-1">
                <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${
                  status === 'mastered' ? 'bg-accent/15 text-accent' :
                  status === 'learned'  ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300' :
                                          'text-gray-400'
                }`}>
                  {status === 'locked' ? 'Start' : status === 'mastered' ? 'Mastered' : 'Learned'}
                </span>
                <span className="text-gray-300 dark:text-gray-600 text-xs">→</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Advanced — coming soon */}
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
        Advanced techniques
      </h2>
      <div className="flex flex-col gap-2 opacity-60">
        {COMING_SOON.filter(t => LESSONS[t] === null).map(t => (
          <div
            key={t}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/40"
          >
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {TECHNIQUE_LABELS[t]}
            </span>
            <span className="text-xs text-gray-400">Coming soon</span>
          </div>
        ))}
      </div>
    </div>
  )
}
