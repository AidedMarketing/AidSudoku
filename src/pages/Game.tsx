import { useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SudokuBoard } from '../components/game/SudokuBoard'
import { NumberPad } from '../components/game/NumberPad'
import { GameControls } from '../components/game/GameControls'
import { GameTimer } from '../components/game/GameTimer'
import { SolveReport } from '../components/solve-report/SolveReport'
import { CoachOverlay } from '../components/learn/CoachOverlay'
import { Toast } from '../components/ui/Toast'
import { useGameStore } from '../store/gameStore'
import { useTimer } from '../hooks/useTimer'
import { useAhaMoment } from '../hooks/useAhaMoment'
import { useSolveReport } from '../hooks/useSolveReport'
import { useStatsStore } from '../store/statsStore'
import { useDailyStore } from '../store/dailyStore'
import { useGame } from '../hooks/useGame'
import { useKeyboard } from '../hooks/useKeyboard'
import { getNextCoachStep } from '../lib/sudoku/techniques'

export function Game() {
  const navigate       = useNavigate()
  const gameStatus     = useGameStore(s => s.gameStatus)
  const resetGame      = useGameStore(s => s.resetGame)
  const coachMode      = useGameStore(s => s.coachMode)
  const board          = useGameStore(s => s.board)
  const isDaily        = useGameStore(s => s.isDaily)
  const recordSolve    = useStatsStore(s => s.recordSolve)
  const { handleHint } = useGame()

  // Drive the stopwatch
  useTimer()

  // Physical keyboard support (number keys, arrows, backspace)
  useKeyboard()

  const { ahaMoment } = useAhaMoment()
  const report = useSolveReport()

  // Compute coach step when coachMode is on
  const coachStep = useMemo(
    () => (coachMode && board ? getNextCoachStep(board) : null),
    [coachMode, board],
  )

  const coachHighlight = useMemo(
    () => coachStep ? new Set(coachStep.highlightCells) : undefined,
    [coachStep],
  )
  const coachTarget = coachStep?.cellIndex ?? null

  // Redirect to home if no active game
  useEffect(() => {
    if (gameStatus === 'idle') navigate('/', { replace: true })
  }, [gameStatus, navigate])

  // Record the solve when the game is won (ref persists across re-renders)
  const hasRecordedRef = useRef(false)
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

  // Mark today's daily puzzle complete when a daily game is won (independent of
  // the recordSolve effect above — separate ref, separate store, no shared state)
  const hasMarkedDailyRef = useRef(false)
  useEffect(() => {
    if (gameStatus === 'won' && isDaily && !hasMarkedDailyRef.current) {
      hasMarkedDailyRef.current = true
      useDailyStore.getState().markCompleted()
    }
  }, [gameStatus, isDaily])

  return (
    <div className="flex flex-col items-center h-dvh overflow-hidden bg-white dark:bg-[#121212] pt-safe">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button
          className="text-gray-400 dark:text-gray-500 text-sm font-medium active:opacity-60 px-2 py-2"
          onClick={() => {
            if (gameStatus !== 'won') resetGame()
            navigate('/')
          }}
        >
          ← Back
        </button>
        <GameTimer />
      </div>

      {/* Board area — fills remaining space and never overflows */}
      <div className="flex-1 flex flex-col justify-center items-center gap-2 w-full px-2 py-1 pb-safe overflow-hidden">
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

        <SudokuBoard coachHighlight={coachHighlight} coachTarget={coachTarget} />

        {/* Coach overlay — shown between board and controls when coachMode is on */}
        <AnimatePresence>
          {coachMode && (
            <CoachOverlay
              step={coachStep}
              onApply={handleHint}
            />
          )}
        </AnimatePresence>

        <GameControls />
        <NumberPad />
      </div>

      {/* A-ha! Toast */}
      <Toast
        id={ahaMoment?.id}
        message={
          !ahaMoment ? null :
          ahaMoment.type === 'mastered'   ? `${ahaMoment.label} — mastered` :
          ahaMoment.type === 'discovered' ? `${ahaMoment.label} — first use` :
          ahaMoment.label
        }
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
