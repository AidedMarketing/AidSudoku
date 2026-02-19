import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TechniqueName, PassportStatus } from '../types'
import { ALL_TECHNIQUES } from '../types'

type PassportMap = Record<TechniqueName, { status: PassportStatus; useCount: number; firstUsedAt: string | null }>

function defaultPassport(): PassportMap {
  return Object.fromEntries(
    ALL_TECHNIQUES.map(t => [t, { status: 'locked' as PassportStatus, useCount: 0, firstUsedAt: null }])
  ) as PassportMap
}

interface PassportState {
  passport: PassportMap

  recordTechniqueUse: (technique: TechniqueName) => void
  unlockTechnique: (technique: TechniqueName) => void  // called after lesson completion
  getStatus: (technique: TechniqueName) => PassportStatus
}

// Mastery threshold: 5 real-game detections after the technique is learned
const MASTERY_THRESHOLD = 5

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      passport: defaultPassport(),

      recordTechniqueUse(technique) {
        const { passport } = get()
        const entry = passport[technique]
        const newCount = entry.useCount + 1
        let newStatus = entry.status

        // naked_singles auto-unlocks on first completed puzzle (handled in useAhaMoment)
        if (entry.status === 'locked') {
          // Stumbled-upon technique — mark as observed but don't unlock yet
          set({
            passport: {
              ...passport,
              [technique]: {
                ...entry,
                useCount: newCount,
                firstUsedAt: entry.firstUsedAt ?? new Date().toISOString(),
              },
            },
          })
          return
        }

        if (entry.status === 'learned' && newCount >= MASTERY_THRESHOLD) {
          newStatus = 'mastered'
        }

        set({
          passport: {
            ...passport,
            [technique]: {
              status: newStatus,
              useCount: newCount,
              firstUsedAt: entry.firstUsedAt ?? new Date().toISOString(),
            },
          },
        })
      },

      unlockTechnique(technique) {
        const { passport } = get()
        const entry = passport[technique]
        if (entry.status !== 'locked') return
        set({
          passport: {
            ...passport,
            [technique]: {
              ...entry,
              status: 'learned',
              firstUsedAt: entry.firstUsedAt ?? new Date().toISOString(),
            },
          },
        })
      },

      getStatus(technique) {
        return get().passport[technique].status
      },
    }),
    { name: 'aidsudoku-passport' },
  ),
)
