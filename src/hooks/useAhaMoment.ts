import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { usePassportStore } from '../store/passportStore'
import { detectTechnique } from '../lib/sudoku/techniqueDetector'
import type { TechniqueName } from '../types'
import { TECHNIQUE_LABELS } from '../types'

// Phase 2: all 4 free-tier techniques fire A-ha! moments
const AHA_ELIGIBLE: TechniqueName[] = [
  'naked_singles',
  'hidden_singles',
  'naked_pairs',
  'hidden_pairs',
]

export type AhaMomentType = 'aha' | 'mastered' | 'discovered'

export interface AhaMoment {
  id: number
  technique: TechniqueName
  label: string
  type: AhaMomentType
}

/**
 * Watches the board for technique applications and returns
 * the latest A-ha! moment to display as a toast.
 */
export function useAhaMoment() {
  const board          = useGameStore(s => s.board)
  const gameStatus     = useGameStore(s => s.gameStatus)
  const addTechnique   = useGameStore(s => s.addTechnique)
  const recordUse      = usePassportStore(s => s.recordTechniqueUse)
  const unlockTechnique= usePassportStore(s => s.unlockTechnique)
  const passport       = usePassportStore(s => s.passport)

  const prevBoardRef = useRef<string>('')
  const [ahaMoment, setAhaMoment] = useState<AhaMoment | null>(null)
  const idRef = useRef(0)

  useEffect(() => {
    const prev = prevBoardRef.current
    if (!prev || !board || gameStatus !== 'playing') {
      prevBoardRef.current = board
      return
    }

    // Find the cell that changed
    let changedIdx = -1
    for (let i = 0; i < 81; i++) {
      if (prev[i] !== board[i] && board[i] !== '0') {
        changedIdx = i
        break
      }
    }

    if (changedIdx !== -1) {
      const result = detectTechnique(prev, board, changedIdx)
      if (result) {
        const technique = result.technique
        const entry = passport[technique]

        addTechnique(technique)
        recordUse(technique)

        if (AHA_ELIGIBLE.includes(technique)) {
          let type: AhaMomentType

          if (entry.status === 'locked') {
            // Stumbled upon a technique not yet learned → "discovered" toast
            unlockTechnique(technique)
            type = 'discovered'
          } else if (
            entry.status === 'learned' &&
            entry.useCount + 1 >= 5  // passportStore MASTERY_THRESHOLD = 5
          ) {
            type = 'mastered'
          } else {
            type = 'aha'
          }

          setAhaMoment({
            id: ++idRef.current,
            technique,
            label: TECHNIQUE_LABELS[technique],
            type,
          })

          // Auto-dismiss
          setTimeout(() => setAhaMoment(null), type === 'mastered' ? 4000 : 3000)
        }
      }
    }

    prevBoardRef.current = board
  }, [board]) // eslint-disable-line react-hooks/exhaustive-deps

  return { ahaMoment, dismiss: () => setAhaMoment(null) }
}
