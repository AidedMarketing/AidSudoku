import { formatTime } from '../../hooks/useTimer'
import { StarIcon } from '../ui/icons'

interface Props {
  stars: 1 | 2 | 3
  timeSeconds: number
  hintsUsed: number
}

export function SolveScore({ stars, timeSeconds, hintsUsed }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1.5" aria-label={`${stars} of 3 stars`}>
        {[1, 2, 3].map(s => (
          <StarIcon key={s} className={`w-8 h-8 ${s <= stars ? 'text-aha' : 'text-line'}`} />
        ))}
      </div>

      <div className="flex gap-8 mt-1">
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-ink tabular">{formatTime(timeSeconds)}</p>
          <p className="text-xs text-ink-3 mt-0.5">Time</p>
        </div>
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-ink tabular">{hintsUsed}</p>
          <p className="text-xs text-ink-3 mt-0.5">Hints</p>
        </div>
      </div>
    </div>
  )
}
