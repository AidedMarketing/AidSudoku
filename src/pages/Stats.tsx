import { useStatsStore } from '../store/statsStore'
import { formatTime } from '../hooks/useTimer'
import type { Difficulty } from '../types'

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert']

export function Stats() {
  const store = useStatsStore()

  return (
    <div className="px-5 pt-10 pb-28 min-h-screen bg-white dark:bg-[#121212]">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Stats</h1>

      {/* Streak */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{store.currentStreak}</p>
          <p className="text-xs text-gray-400 mt-1">Current streak</p>
        </div>
        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{store.longestStreak}</p>
          <p className="text-xs text-gray-400 mt-1">Best streak</p>
        </div>
        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{store.history.length}</p>
          <p className="text-xs text-gray-400 mt-1">Total solves</p>
        </div>
      </div>

      {/* Per-difficulty breakdown */}
      <div className="flex flex-col gap-3">
        {DIFFICULTIES.map(d => {
          const played = store.getGamesPlayed(d)
          const best   = store.getBestTime(d)
          const avg    = store.getAverageTime(d)

          return (
            <div key={d} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
              <p className="font-semibold capitalize text-gray-900 dark:text-white mb-3">{d}</p>
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <p className="font-bold text-gray-900 dark:text-white">{played}</p>
                  <p className="text-xs text-gray-400">Played</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {best !== null ? formatTime(best) : '—'}
                  </p>
                  <p className="text-xs text-gray-400">Best</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {avg !== null ? formatTime(avg) : '—'}
                  </p>
                  <p className="text-xs text-gray-400">Average</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
