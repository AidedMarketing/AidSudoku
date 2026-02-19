import { motion, AnimatePresence } from 'framer-motion'
import { SolveScore } from './SolveScore'
import { TechniqueBreakdown } from './TechniqueBreakdown'
import { Button } from '../ui/Button'
import type { SolveReportData } from '../../types'
import { useNavigate } from 'react-router-dom'
import { usePassportStore } from '../../store/passportStore'
import { useGameStore } from '../../store/gameStore'

interface Props {
  report: SolveReportData
  onClose: () => void
}

export function SolveReport({ report, onClose }: Props) {
  const navigate = useNavigate()
  const unlockNakedSingles = usePassportStore(s => s.unlockTechnique)
  const resetGame = useGameStore(s => s.resetGame)

  // Ensure Naked Singles is unlocked on first solve
  unlockNakedSingles('naked_singles')

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
