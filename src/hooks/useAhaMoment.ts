import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { usePassportStore } from '../store/passportStore'
import { detectTechnique } from '../lib/sudoku/techniqueDetector'
import type { TechniqueName } from '../types'
import { TECHNIQUE_LABELS } from '../types'

// Only fire A-ha! toasts for techniques the player has at least observed
const AHA_ELIGIBLE: TechniqueName[] = [
  'naked_singles',
  'hidden_singles',
]

export interface AhaMoment {
  id: number
  technique: TechniqueName
  label: string
  isNew: boolean  // true if first time detecting this technique
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
      if (result && AHA_ELIGIBLE.includes(result.technique)) {
        const technique = result.technique
        addTechnique(technique)
        recordUse(technique)

        const isNew = passport[technique].status === 'locked'
        if (isNew) unlockTechnique(technique)

        setAhaMoment({
          id: ++idRef.current,
          technique,
          label: TECHNIQUE_LABELS[technique],
          isNew,
        })

        // Auto-dismiss after 3 s
        setTimeout(() => setAhaMoment(null), 3000)
      }
    }

    prevBoardRef.current = board
  }, [board]) // eslint-disable-line react-hooks/exhaustive-deps

  return { ahaMoment, dismiss: () => setAhaMoment(null) }
}
