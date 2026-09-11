import { useGameStore } from '../../store/gameStore'
import { useSettingsStore } from '../../store/settingsStore'
import { formatTime } from '../../hooks/useTimer'
import { PlayIcon, PauseIcon } from '../ui/icons'

const DIFFICULTY_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Expert' } as const

/** Difficulty on the left, the stopwatch on the right. Tapping the time pauses. */
export function GameTimer() {
  const timerSeconds = useGameStore(s => s.timerSeconds)
  const gameStatus   = useGameStore(s => s.gameStatus)
  const pauseTimer   = useGameStore(s => s.pauseTimer)
  const resumeTimer  = useGameStore(s => s.resumeTimer)
  const difficulty   = useGameStore(s => s.difficulty)
  const showTimer    = useSettingsStore(s => s.showTimer)

  const isPaused = gameStatus === 'paused'

  return (
    <div className="flex items-center gap-3">
      <span className="text-[15px] font-semibold text-ink-2">{DIFFICULTY_LABEL[difficulty]}</span>
      {showTimer && (
        <button
          type="button"
          onClick={() => (isPaused ? resumeTimer() : pauseTimer())}
          aria-label={isPaused ? 'Resume' : 'Pause'}
          className="flex items-center gap-1.5 text-[15px] font-semibold text-ink tabular active:opacity-60"
        >
          <span>{formatTime(timerSeconds)}</span>
          {isPaused ? <PlayIcon className="w-4 h-4 text-ink-3" /> : <PauseIcon className="w-4 h-4 text-ink-3" />}
        </button>
      )}
    </div>
  )
}
