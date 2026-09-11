import { useNavigate } from 'react-router-dom'
import { usePassportStore } from '../../store/passportStore'
import { PassportStamp } from './PassportStamp'
import { ALL_TECHNIQUES } from '../../types'
import { LESSONS } from '../../data/lessonContent'

export function PassportView() {
  const passport = usePassportStore(s => s.passport)
  const navigate = useNavigate()

  const learned  = ALL_TECHNIQUES.filter(t => passport[t].status !== 'locked').length
  const mastered = ALL_TECHNIQUES.filter(t => passport[t].status === 'mastered').length

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-[28px] font-bold leading-none text-ink">Passport</h1>
        <p className="text-sm text-ink-3 mt-1.5 tabular">
          {learned} of {ALL_TECHNIQUES.length} learned · {mastered} mastered
        </p>
        {/* Progress runs teal (guidance) into gold (mastery) */}
        <div className="h-1.5 bg-line rounded-full overflow-hidden mt-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-guide to-aha transition-all duration-500"
            style={{ width: `${(learned / ALL_TECHNIQUES.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Stamp grid — every technique has a lesson now, so every stamp opens one */}
      <div className="grid grid-cols-3 gap-x-2 gap-y-4">
        {ALL_TECHNIQUES.map(technique => (
          <PassportStamp
            key={technique}
            technique={technique}
            status={passport[technique].status}
            useCount={passport[technique].useCount}
            onPress={LESSONS[technique] ? () => navigate(`/learn/${technique}`) : undefined}
          />
        ))}
      </div>

      <p className="text-xs text-center text-ink-3">
        Tap a technique to open its lesson. Use one five times in real games to master it.
      </p>
    </div>
  )
}
