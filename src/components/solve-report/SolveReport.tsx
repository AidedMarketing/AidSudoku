import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SolveScore } from './SolveScore'
import { TechniqueBreakdown } from './TechniqueBreakdown'
import { Button } from '../ui/Button'
import type { SolveReportData, TechniqueName } from '../../types'
import { TECHNIQUE_LABELS } from '../../types'
import { useNavigate } from 'react-router-dom'
import { usePassportStore } from '../../store/passportStore'
import { useGameStore } from '../../store/gameStore'
import { FREE_TECHNIQUES } from '../../data/lessonContent'

interface Props {
  report: SolveReportData
  onClose: () => void
}

export function SolveReport({ report, onClose }: Props) {
  const navigate       = useNavigate()
  const unlockTechnique = usePassportStore(s => s.unlockTechnique)
  const passport        = usePassportStore(s => s.passport)
  const resetGame       = useGameStore(s => s.resetGame)

  // Ensure Naked Singles is unlocked on first solve (run once on mount)
  useEffect(() => { unlockTechnique('naked_singles') }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Find the first technique used in this solve that has a lesson and isn't mastered yet
  const learnCTATechnique: TechniqueName | null =
    report.techniquesUsed.find(
      t => FREE_TECHNIQUES.includes(t) && passport[t].status !== 'mastered'
    ) ?? null

  function handleViewPassport() {
    resetGame()
    onClose()
    navigate('/passport')
  }

  function handlePlayAgain() {
    resetGame()
    onClose()
    navigate('/')
  }

  function handleLearnTechnique(t: TechniqueName) {
    resetGame()
    onClose()
    navigate(`/learn/${t}`)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-end bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl p-6 pb-10 shadow-2xl flex flex-col gap-6"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">You solved it!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
              {report.difficulty} · Solve Report
            </p>
          </div>

          <SolveScore
            stars={report.stars}
            timeSeconds={report.timeSeconds}
            hintsUsed={report.hintsUsed}
          />

          <TechniqueBreakdown techniques={report.techniquesUsed} />

          {/* Learn CTA — shown when a technique used in this solve has a lesson */}
          {learnCTATechnique && (
            <motion.div
              className="bg-accent/10 border border-accent/30 rounded-2xl px-4 py-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                Want to understand <strong>{TECHNIQUE_LABELS[learnCTATechnique]}</strong>? See the full lesson.
              </p>
              <button
                className="text-sm font-semibold text-accent active:opacity-60"
                onClick={() => handleLearnTechnique(learnCTATechnique)}
              >
                Learn {TECHNIQUE_LABELS[learnCTATechnique]} →
              </button>
            </motion.div>
          )}

          <div className="flex flex-col gap-3 mt-2">
            <Button size="lg" className="w-full" onClick={handleViewPassport}>
              View Passport
            </Button>
            <Button variant="secondary" size="lg" className="w-full" onClick={handlePlayAgain}>
              Play Again
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
