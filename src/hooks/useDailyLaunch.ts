// Owns everything about launching today's puzzle — start, resume, abandon-and-restart,
// and the solved state — so Home and Daily show the same truth and never drift.

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDailyStore } from '../store/dailyStore'
import { useGameStore } from '../store/gameStore'

export type DailyLaunchState = 'loading' | 'start' | 'resume' | 'done'

export function useDailyLaunch() {
  const navigate = useNavigate()

  const puzzle              = useDailyStore(s => s.puzzle)
  const completed           = useDailyStore(s => s.completed)
  const completedDifficulty = useDailyStore(s => s.completedDifficulty)
  const ensureTodayPuzzle   = useDailyStore(s => s.ensureTodayPuzzle)

  const startGame  = useGameStore(s => s.startGame)
  const gameStatus = useGameStore(s => s.gameStatus)
  const gamePuzzle = useGameStore(s => s.puzzle)
  const gameIsDaily = useGameStore(s => s.isDaily)

  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => { ensureTodayPuzzle() }, [ensureTodayPuzzle])

  const inProgress = gameStatus === 'playing' || gameStatus === 'paused'

  // A paused daily from *yesterday* must not count as resuming today's — check the puzzle itself.
  const isResumingTodaysDaily =
    inProgress && gameIsDaily && !!puzzle && gamePuzzle?.clues === puzzle.clues

  const state: DailyLaunchState =
    !puzzle ? 'loading'
    : completed ? 'done'
    : isResumingTodaysDaily ? 'resume'
    : 'start'

  function startNow() {
    if (!puzzle) return
    startGame(puzzle, true)
    navigate('/game')
  }

  /** The one entry point for the primary button: resumes, starts, or asks first if another game would be lost. */
  function launch() {
    if (state === 'resume') { navigate('/game'); return }
    if (state !== 'start') return
    if (inProgress) { setConfirmOpen(true); return }
    startNow()
  }

  function confirmAbandon() {
    setConfirmOpen(false)
    startNow()
  }

  return {
    state,
    puzzle,
    completedDifficulty,
    /** True when some *other* game (ad-hoc, or a stale daily) is in progress. */
    otherGameInProgress: inProgress && !isResumingTodaysDaily,
    launch,
    confirmOpen,
    closeConfirm: () => setConfirmOpen(false),
    confirmAbandon,
  }
}
