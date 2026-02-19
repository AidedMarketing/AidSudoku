// Central game logic hook — bridges the store, engine, and UI actions.

import { useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { useSettingsStore } from '../store/settingsStore'
import { useHaptics } from './useHaptics'
import { getHint } from '../lib/sudoku/solver'
import { isCellValid } from '../lib/sudoku/validator'

export function useGame() {
  const store         = useGameStore()
  const showErrors    = useSettingsStore(s => s.showErrors)
  const autoRemoveNotes = useSettingsStore(s => s.autoRemoveNotes)
  const { vibrate }   = useHaptics()

  const handleCellPress = useCallback((idx: number) => {
    store.selectCell(idx === store.selectedCell ? null : idx)
    vibrate('light')
  }, [store, vibrate])

  const handleNumberInput = useCallback((num: number) => {
    if (store.selectedCell === null) return
    if (store.isNotesMode) {
      store.enterNote(num)
      vibrate('light')
      return
    }

    const { board, puzzle, selectedCell } = store
    if (!puzzle) return

    const isValid = isCellValid(board, selectedCell, num)
    if (!isValid && showErrors) {
      vibrate('error')
    } else {
      vibrate('medium')
    }

    store.enterNumber(num)

    // Auto-remove notes for peers if setting is on
    if (autoRemoveNotes && isValid) {
      // Notes cleanup is handled inside enterNumber via peer resolution (future enhancement)
    }
  }, [store, showErrors, autoRemoveNotes, vibrate])

  const handleHint = useCallback(() => {
    const { puzzle, board, initialClues } = store
    if (!puzzle) return
    const hint = getHint(initialClues, board)
    if (!hint) return
    store.applyHint(hint.cellIndex, hint.value)
    vibrate('success')
  }, [store, vibrate])

  const handleErase = useCallback(() => {
    store.erase()
    vibrate('light')
  }, [store, vibrate])

  const handleUndo = useCallback(() => {
    store.undo()
    vibrate('light')
  }, [store, vibrate])

  return {
    ...store,
    handleCellPress,
    handleNumberInput,
    handleHint,
    handleErase,
    handleUndo,
  }
}
