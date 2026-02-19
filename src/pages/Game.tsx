import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SudokuBoard } from '../components/game/SudokuBoard'
import { NumberPad } from '../components/game/NumberPad'
import { GameControls } from '../components/game/GameControls'
import { GameTimer } from '../components/game/GameTimer'
import { SolveReport } from '../components/solve-report/SolveReport'
import { Toast } from '../components/ui/Toast'
import { useGameStore } from '../store/gameStore'
import { useTimer } from '../hooks/useTimer'
import { useAhaMoment } from '../hooks/useAhaMoment'
import { useSolveReport } from '../hooks/useSolveReport'
import { useStatsStore } from '../store/statsStore'

export function Game() {
  const navigate    = useNavigate()
  const gameStatus  = useGameStore(s => s.gameStatus)
  const resetGame   = useGameStore(s => s.resetGame)
  const recordSolve = useStatsStore(s => s.recordSolve)

  // Drive the stopwatch
  useTimer()

  const { ahaMoment } = useAhaMoment()
  const report = useSolveReport()

  // Redirect to home if no active game
  useEffect(() => {
    if (gameStatus === 'idle') navigate('/', { replace: true })
  }, [gameStatus, navigate])

  // Record the solve when the game is won
  const hasRecordedRef = { current: false }
  useEffect(() => {
    if (gameStatus === 'won' && report && !hasRecordedRef.current) {
      hasRecordedRef.current = true
      recordSolve({
        date: new Date().toDateString(),
        difficulty: report.difficulty,
        timeSeconds: report.timeSeconds,
        hintsUsed: report.hintsUsed,
        stars: report.stars,
      })
    }
  }, [gameStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center min-h-screen bg-white dark:bg-[#121212] pt-safe">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between px-4 pt-4 pb-2">
        <button
          className="text-gray-400 dark:text-gray-500 text-sm font-medium active:opacity-60"
          onClick={() => {
            if (gameStatus !== 'won') resetGame()
            navigate('/')
          }}
        >
          ← Back
        </button>
        <GameTimer />
      </div>

      {/* Board */}
      <div className="flex-1 flex flex-col justify-center items-center gap-5 w-full px-2 py-4">
        <AnimatePresence>
          {gameStatus === 'paused' && (
            <motion.div
              className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400">Paused</p>
            </motion.div>
          )}
        </AnimatePresence>

        <SudokuBoard />
        <GameControls />
        <NumberPad />
      </div>

      {/* A-ha! Toast */}
      <Toast
        message={ahaMoment ? `Nice — you used ${ahaMoment.label}!` : null}
        isNew={ahaMoment?.isNew}
      />

      {/* Solve Report */}
      {gameStatus === 'won' && report && (
        <SolveReport
          report={report}
          onClose={() => {
            resetGame()
            navigate('/')
          }}
        />
      )}
    </div>
  )
}
