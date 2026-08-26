import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Difficulty, PuzzleData } from '../types'
import { generateDailyPuzzle } from '../lib/sudoku/generator'
import { useStatsStore } from './statsStore'

const TIERS: Difficulty[] = ['easy', 'medium', 'hard', 'expert']
const PROMOTION_THRESHOLD = 5

/** Highest difficulty tier the player has completed at least
 *  PROMOTION_THRESHOLD times — the "consistently completed" level. */
export function computeDailyDifficulty(): Difficulty {
  const { getGamesPlayed } = useStatsStore.getState()
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (getGamesPlayed(TIERS[i]) >= PROMOTION_THRESHOLD) return TIERS[i]
  }
  return 'easy'
}

function todayKey(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

interface DailyState {
  date: string | null
  puzzle: PuzzleData | null
  completed: boolean
  completedDifficulty: Difficulty | null

  ensureTodayPuzzle: () => PuzzleData
  markCompleted: () => void
}

export const useDailyStore = create<DailyState>()(
  persist(
    (set, get) => ({
      date: null,
      puzzle: null,
      completed: false,
      completedDifficulty: null,

      ensureTodayPuzzle() {
        const today = todayKey()
        const { date, puzzle } = get()
        if (date === today && puzzle) return puzzle

        const difficulty = computeDailyDifficulty()
        const newPuzzle = generateDailyPuzzle(today, difficulty)
        set({ date: today, puzzle: newPuzzle, completed: false, completedDifficulty: null })
        return newPuzzle
      },

      markCompleted() {
        set({ completed: true, completedDifficulty: get().puzzle?.difficulty ?? null })
      },
    }),
    { name: 'aidsudoku-daily' },
  ),
)
