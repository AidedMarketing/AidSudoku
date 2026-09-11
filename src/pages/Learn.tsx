// Technique lesson hub.
// Lists every technique with a lesson, status badges; tapping navigates to the full lesson.

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageShell } from '../components/ui/PageShell'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Chip } from '../components/ui/Chip'
import { StarIcon, CheckIcon, ArrowRightIcon } from '../components/ui/icons'
import { usePassportStore } from '../store/passportStore'
import { FREE_TECHNIQUES, LESSONS } from '../data/lessonContent'
import { ALL_TECHNIQUES, TECHNIQUE_LABELS } from '../types'
import type { TechniqueName } from '../types'
import { useMotionSafe } from '../lib/motion'

const COMING_SOON: TechniqueName[] = ALL_TECHNIQUES.filter(t => !FREE_TECHNIQUES.includes(t))

export function Learn() {
  const navigate = useNavigate()
  const passport = usePassportStore(s => s.passport)
  const { reduced } = useMotionSafe()

  return (
    <PageShell>
      <header className="mb-6">
        <h1 className="font-display text-[28px] font-bold leading-none text-ink">Learn</h1>
        <p className="text-sm text-ink-3 mt-1.5">Study the logic behind every solve.</p>
      </header>

      <SectionLabel aside={`${FREE_TECHNIQUES.length} lessons`}>Lessons</SectionLabel>
      <div className="flex flex-col gap-2">
        {FREE_TECHNIQUES.map((t, idx) => {
          const { status } = passport[t]
          const lesson = LESSONS[t]
          if (!lesson) return null

          return (
            <motion.button
              key={t}
              type="button"
              className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-paper-2 border border-line text-left w-full active:scale-[0.985] transition-transform"
              onClick={() => navigate(`/learn/${t}`)}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: reduced ? 0 : idx * 0.04 }}
            >
              {/* Status mark */}
              <span className={`w-9 h-9 rounded-full shrink-0 grid place-items-center ${
                status === 'mastered' ? 'bg-aha/15 text-aha-ink' :
                status === 'learned'  ? 'bg-guide/15 text-guide-ink' :
                                        'border border-dashed border-line text-ink-3'
              }`}>
                {status === 'mastered' && <StarIcon className="w-[18px] h-[18px]" />}
                {status === 'learned'  && <CheckIcon className="w-[18px] h-[18px]" />}
                {status === 'locked'   && <span className="text-xs font-semibold tabular">{idx + 1}</span>}
              </span>

              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-ink">{lesson.title}</span>
                <span className="block text-xs text-ink-3 mt-0.5 truncate">{lesson.tagline}</span>
              </span>

              <span className="flex items-center gap-2 shrink-0">
                <Chip status={status}>{status === 'locked' ? 'Start' : status === 'mastered' ? 'Mastered' : 'Learned'}</Chip>
                <ArrowRightIcon className="w-4 h-4 text-ink-3" />
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Only shows if a technique ever ships without a lesson */}
      {COMING_SOON.length > 0 && (
        <div className="mt-8">
          <SectionLabel>Coming soon</SectionLabel>
          <div className="flex flex-col gap-2 opacity-60">
            {COMING_SOON.map(t => (
              <div key={t} className="flex items-center justify-between px-4 py-3 rounded-2xl bg-paper-2 border border-line">
                <span className="text-sm text-ink-2">{TECHNIQUE_LABELS[t]}</span>
                <span className="text-xs text-ink-3">Coming soon</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  )
}
