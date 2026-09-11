import { PageShell } from '../components/ui/PageShell'
import { StatTile } from '../components/ui/StatTile'
import { SectionLabel } from '../components/ui/SectionLabel'
import { SparkIcon } from '../components/ui/icons'
import { useStatsStore } from '../store/statsStore'
import { formatTime } from '../hooks/useTimer'
import { DIFFICULTIES, DIFFICULTY_LABEL } from '../lib/difficulty'

export function Stats() {
  const store = useStatsStore()

  if (store.history.length === 0) {
    return (
      <PageShell center>
        <span className="w-14 h-14 rounded-full bg-paper-2 border border-line grid place-items-center">
          <SparkIcon className="w-6 h-6 text-ink-3" />
        </span>
        <p className="font-display text-xl font-bold text-ink mt-4">No puzzles yet</p>
        <p className="text-sm text-ink-3 text-center mt-1 max-w-xs">Complete your first puzzle to start tracking your stats.</p>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <h1 className="font-display text-[28px] font-bold leading-none text-ink mb-6">Stats</h1>

      {/* Streak — numbers you earned, so the current streak is gold */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatTile value={store.currentStreak} label="Current streak" tone="aha" />
        <StatTile value={store.longestStreak} label="Best streak" />
        <StatTile value={store.history.length} label="Total solves" />
      </div>

      {/* Per-difficulty breakdown */}
      <SectionLabel>By difficulty</SectionLabel>
      <div className="flex flex-col gap-3">
        {DIFFICULTIES.map(d => {
          const played = store.getGamesPlayed(d)
          const best   = store.getBestTime(d)
          const avg    = store.getAverageTime(d)
          return (
            <div key={d} className={`bg-paper-2 border border-line rounded-2xl p-4 ${played === 0 ? 'opacity-60' : ''}`}>
              <p className="font-semibold text-ink mb-3">{DIFFICULTY_LABEL[d]}</p>
              <div className="grid grid-cols-3 text-center tabular">
                <div><p className="font-semibold text-ink">{played}</p><p className="text-xs text-ink-3 mt-0.5">Played</p></div>
                <div><p className="font-semibold text-ink">{best !== null ? formatTime(best) : '—'}</p><p className="text-xs text-ink-3 mt-0.5">Best</p></div>
                <div><p className="font-semibold text-ink">{avg !== null ? formatTime(avg) : '—'}</p><p className="text-xs text-ink-3 mt-0.5">Average</p></div>
              </div>
            </div>
          )
        })}
      </div>
    </PageShell>
  )
}
