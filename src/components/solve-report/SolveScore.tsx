import { formatTime } from '../../hooks/useTimer'

interface Props {
  stars: 1 | 2 | 3
  timeSeconds: number
  hintsUsed: number
}

export function SolveScore({ stars, timeSeconds, hintsUsed }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1.5 text-3xl text-accent">
        {[1, 2, 3].map(s => (
          <span key={s} className={s <= stars ? 'opacity-100' : 'opacity-20'}>
            ★
          </span>
        ))}
      </div>

      <div className="flex gap-6 mt-1">
        <div className="text-center">
          <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
            {formatTime(timeSeconds)}
          </p>
          <p className="text-xs text-gray-400">Time</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{hintsUsed}</p>
          <p className="text-xs text-gray-400">Hints</p>
        </div>
      </div>
    </div>
  )
}
