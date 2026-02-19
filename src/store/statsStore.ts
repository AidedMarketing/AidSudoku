import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Difficulty } from '../types'

interface SolveRecord {
  date: string
  difficulty: Difficulty
  timeSeconds: number
  hintsUsed: number
  stars: 1 | 2 | 3
}

interface StatsState {
  history: SolveRecord[]
  currentStreak: number
  longestStreak: number
  lastPlayedDate: string | null

  recordSolve: (record: SolveRecord) => void
  getBestTime: (difficulty: Difficulty) => number | null
  getAverageTime: (difficulty: Difficulty) => number | null
  getGamesPlayed: (difficulty: Difficulty) => number
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      history: [],
      currentStreak: 0,
      longestStreak: 0,
      lastPlayedDate: null,

      recordSolve(record) {
        const { history, currentStreak, longestStreak, lastPlayedDate } = get()

        // Streak logic
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        let newStreak = currentStreak

        if (lastPlayedDate === today) {
          // Already played today — streak doesn't change
        } else if (lastPlayedDate === yesterday) {
          newStreak = currentStreak + 1
        } else {
          newStreak = 1
        }

        set({
          history: [...history, record],
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
          lastPlayedDate: today,
        })
      },

      getBestTime(difficulty) {
        const times = get().history.filter(r => r.difficulty === difficulty).map(r => r.timeSeconds)
        return times.length ? Math.min(...times) : null
      },

      getAverageTime(difficulty) {
        const times = get().history.filter(r => r.difficulty === difficulty).map(r => r.timeSeconds)
        return times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null
      },

      getGamesPlayed(difficulty) {
        return get().history.filter(r => r.difficulty === difficulty).length
      },
    }),
    { name: 'aidsudoku-stats' },
  ),
)
