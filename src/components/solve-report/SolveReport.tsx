import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SolveScore } from './SolveScore'
import { TechniqueBreakdown } from './TechniqueBreakdown'
import { BottomSheet } from '../ui/BottomSheet'
import { Button } from '../ui/Button'
import { ArrowRightIcon } from '../ui/icons'
import type { SolveReportData, TechniqueName } from '../../types'
import { TECHNIQUE_LABELS } from '../../types'
import { usePassportStore } from '../../store/passportStore'
import { useGameStore } from '../../store/gameStore'
import { FREE_TECHNIQUES } from '../../data/lessonContent'
import { DIFFICULTY_LABEL } from '../../lib/difficulty'
import { useMotionSafe } from '../../lib/motion'

interface Props {
  report: SolveReportData
  onClose: () => void
}

export function SolveReport({ report, onClose }: Props) {
  const navigate        = useNavigate()
  const unlockTechnique = usePassportStore(s => s.unlockTechnique)
  const passport        = usePassportStore(s => s.passport)
  const resetGame       = useGameStore(s => s.resetGame)
  const isDaily         = useGameStore(s => s.isDaily)
  const { reduced }     = useMotionSafe()

  // Ensure Naked Singles is unlocked on first solve (run once on mount)
  useEffect(() => { unlockTechnique('naked_singles') }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Find the first technique used in this solve that has a lesson and isn't mastered yet
  const learnCTATechnique: TechniqueName | null =
    report.techniquesUsed.find(
      t => FREE_TECHNIQUES.includes(t) && passport[t].status !== 'mastered'
    ) ?? null

  function go(path: string) {
    resetGame()
    onClose()
    navigate(path)
  }

  return (
    <BottomSheet open onClose={() => go('/')} title={isDaily ? "Tonight's puzzle, solved" : 'Solved'}>
      <div className="flex flex-col gap-5">
        <p className="text-sm text-ink-3 text-center -mt-2">{DIFFICULTY_LABEL[report.difficulty]} · Solve report</p>

        <SolveScore stars={report.stars} timeSeconds={report.timeSeconds} hintsUsed={report.hintsUsed} />

        <TechniqueBreakdown techniques={report.techniquesUsed} />

        {/* Learn CTA — guidance offered, so teal */}
        {learnCTATechnique && (
          <motion.button
            type="button"
            className="w-full text-left bg-guide/10 border border-guide/30 rounded-2xl px-4 py-3 active:scale-[0.985] transition-transform"
            onClick={() => go(`/learn/${learnCTATechnique}`)}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.25 }}
          >
            <p className="text-sm text-ink-2">
              Want to understand <strong className="text-ink">{TECHNIQUE_LABELS[learnCTATechnique]}</strong>? See the full lesson.
            </p>
            <p className="inline-flex items-center gap-1 text-sm font-semibold text-guide-ink mt-1.5">
              Learn {TECHNIQUE_LABELS[learnCTATechnique]} <ArrowRightIcon className="w-4 h-4" />
            </p>
          </motion.button>
        )}

        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full" onClick={() => go('/passport')}>View Passport</Button>
          <Button variant="secondary" size="lg" className="w-full" onClick={() => go('/')}>Done</Button>
        </div>
      </div>
    </BottomSheet>
  )
}
