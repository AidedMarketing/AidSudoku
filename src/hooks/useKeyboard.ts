// Keyboard support for desktop and mobile physical keyboards.
// Handles number input, erase, and arrow-key cell navigation.

import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { rowOf, colOf } from '../lib/sudoku/generator'
import { useGame } from './useGame'

export function useKeyboard() {
  const selectedCell    = useGameStore(s => s.selectedCell)
  const selectCell      = useGameStore(s => s.selectCell)
  const gameStatus      = useGameStore(s => s.gameStatus)
  const { handleNumberInput, handleErase } = useGame()

  useEffect(() => {
    if (gameStatus !== 'playing') return

    function onKeyDown(e: KeyboardEvent) {
      // Ignore events from inputs/textareas
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      // ── Number entry ──────────────────────────────────────────────
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault()
        handleNumberInput(Number(e.key))
        return
      }

      // ── Erase ─────────────────────────────────────────────────────
      if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault()
        handleErase()
        return
      }

      // ── Deselect ──────────────────────────────────────────────────
      if (e.key === 'Escape') {
        e.preventDefault()
        selectCell(null)
        return
      }

      // ── Arrow navigation ──────────────────────────────────────────
      if (!e.key.startsWith('Arrow')) return
      e.preventDefault()

      const current = selectedCell ?? 0
      const row = rowOf(current)
      const col = colOf(current)

      let next = current
      switch (e.key) {
        case 'ArrowUp':    if (row > 0) next = current - 9; break
        case 'ArrowDown':  if (row < 8) next = current + 9; break
        case 'ArrowLeft':  if (col > 0) next = current - 1; break
        case 'ArrowRight': if (col < 8) next = current + 1; break
      }

      if (next !== current || selectedCell === null) {
        selectCell(next)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedCell, gameStatus, selectCell, handleNumberInput, handleErase])
}
