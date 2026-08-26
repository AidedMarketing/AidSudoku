// Today's puzzle — same puzzle for the whole day, difficulty grows with the
// player's own history. Fully local: no backend, no leaderboard.

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { BottomSheet } from '../components/ui/BottomSheet'
import { useGameStore } from '../store/gameStore'
import { useDailyStore } from '../store/dailyStore'
import { useStatsStore } from '../store/statsStore'
import { formatTime } from '../hooks/useTimer'

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  expert: 'Expert',
}

export function Daily() {
  const navigate = useNavigate()

  const daily             = useDailyStore()
  const ensureTodayPuzzle = useDailyStore(s => s.ensureTodayPuzzle)
  const startGame         = useGameStore(s => s.startGame)
  const gameStatus        = useGameStore(s => s.gameStatus)
  const gamePuzzle        = useGameStore(s => s.puzzle)
  const gameIsDaily       = useGameStore(s => s.isDaily)
  const history           = useStatsStore(s => s.history)
  const currentStreak     = useStatsStore(s => s.currentStreak)

  const [showConfirmSheet, setShowConfirmSheet] = useState(false)

  useEffect(() => { ensureTodayPuzzle() }, [ensureTodayPuzzle])

  if (!daily.puzzle) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#121212]">
        <p className="text-sm text-gray-400">Preparing today's puzzle…</p>
      </div>
    )
  }

  const isResumingTodaysDaily =
    (gameStatus === 'playing' || gameStatus === 'paused') &&
    gameIsDaily &&
    gamePuzzle?.clues === daily.puzzle.clues

  function startToday() {
    if (!daily.puzzle) return
    startGame(daily.puzzle, true)
    navigate('/game')
  }

  function handleStartPress() {
    if (isResumingTodaysDaily) {
      navigate('/game')
      return
    }
    if (gameStatus === 'playing' || gameStatus === 'paused') {
      setShowConfirmSheet(true)
      return
    }
    startToday()
  }

  function confirmAbandon() {
    setShowConfirmSheet(false)
    startToday()
  }

  if (daily.completed) {
    const todayStr = new Date().toDateString()
    const record = [...history].reverse().find(
      r => r.difficulty === daily.completedDifficulty && r.date === todayStr
    )

    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5 pb-28 bg-white dark:bg-[#121212]">
        <div className="text-center max-w-xs">
          <p className="text-3xl mb-3">✓</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Today's puzzle solved
          </h2>
          {record && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {formatTime(record.timeSeconds)} · {DIFFICULTY_LABEL[record.difficulty]} · {'★'.repeat(record.stars)}
            </p>
          )}
          {currentStreak > 0 && (
            <p className="text-sm text-accent font-medium mb-4">
              🔥 {currentStreak}-day streak
            </p>
          )}
          <p className="text-sm text-gray-400">Come back tomorrow for a new puzzle.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5 pb-28 bg-white dark:bg-[#121212]">
      <div className="text-center max-w-xs w-full">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          Today's Puzzle
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {DIFFICULTY_LABEL[daily.puzzle.difficulty]} · one puzzle a day
        </p>
        <Button size="lg" className="w-full" onClick={handleStartPress}>
          {isResumingTodaysDaily ? 'Resume' : 'Start'}
        </Button>
      </div>

      <BottomSheet
        open={showConfirmSheet}
        onClose={() => setShowConfirmSheet(false)}
        title="Abandon current game?"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Your current puzzle will be lost. This can't be undone.
        </p>
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full" onClick={confirmAbandon}>
            Start today's puzzle
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => setShowConfirmSheet(false)}
          >
            Cancel
          </Button>
        </div>
      </BottomSheet>
    </div>
  )
}
