import { useGameStore } from '../../store/gameStore'
import { useSettingsStore } from '../../store/settingsStore'
import { formatTime } from '../../hooks/useTimer'

export function GameTimer() {
  const timerSeconds   = useGameStore(s => s.timerSeconds)
  const gameStatus     = useGameStore(s => s.gameStatus)
  const pauseTimer     = useGameStore(s => s.pauseTimer)
  const resumeTimer    = useGameStore(s => s.resumeTimer)
  const showTimer      = useSettingsStore(s => s.showTimer)
  const difficulty     = useGameStore(s => s.difficulty)

  const isPaused = gameStatus === 'paused'

  const difficultyLabel = {
    easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Expert',
  }[difficulty]

  return (
    <div className="flex items-center justify-between w-full max-w-[min(92vw,400px)] mx-auto px-1 py-2">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {difficultyLabel}
      </span>

      {showTimer && (
        <button
          onClick={() => isPaused ? resumeTimer() : pauseTimer()}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-mono text-lg font-semibold"
        >
          <span>{formatTime(timerSeconds)}</span>
          <span className="text-xs text-gray-400">{isPaused ? '▶' : '⏸'}</span>
        </button>
      )}
    </div>
  )
}
