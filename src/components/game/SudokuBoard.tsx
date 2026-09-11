import { useMemo } from 'react'
import { SudokuCell } from './SudokuCell'
import { useGame } from '../../hooks/useGame'
import { useSettingsStore } from '../../store/settingsStore'
import { getConflicts } from '../../lib/sudoku/validator'
import { rowOf, colOf, boxOf } from '../../lib/sudoku/generator'

interface Props {
  coachHighlight?: Set<number>
  coachTarget?: number | null
  /** Cell whose placement just fired an A-ha, plus a key that changes per moment. */
  ahaCell?: number | null
  ahaKey?: number
}

export function SudokuBoard({ coachHighlight, coachTarget, ahaCell, ahaKey }: Props = {}) {
  const {
    board, initialClues, selectedCell, notes,
    handleCellPress, puzzle,
  } = useGame()

  const showErrors = useSettingsStore(s => s.showErrors)

  // Memoised so the O(81×20) scan only runs when board or error-setting changes
  const conflicts = useMemo(() => {
    if (!board || !showErrors) return new Set<number>()
    return new Set(
      [...Array(81).keys()].flatMap(i =>
        board[i] !== '0' ? [...getConflicts(board, i)] : []
      )
    )
  }, [board, showErrors])

  if (!puzzle || !board) return null

  const selectedValue = selectedCell !== null ? board[selectedCell] : null

  return (
    <div
      className="grid w-full max-w-[min(92vw,400px)] mx-auto aspect-square bg-board border-2 border-board-box rounded-[10px] overflow-hidden shadow-board touch-none"
      style={{ gridTemplateColumns: 'repeat(9, 1fr)', gridTemplateRows: 'repeat(9, 1fr)' }}
    >
      {Array.from({ length: 81 }, (_, i) => {
        const value       = board[i]
        const isGiven     = initialClues[i] !== '0'
        const isSelected  = selectedCell === i
        const isEmpty     = value === '0'

        const isRelated = selectedCell !== null && !isSelected && (
          rowOf(i) === rowOf(selectedCell) ||
          colOf(i) === colOf(selectedCell) ||
          boxOf(i) === boxOf(selectedCell)
        )

        const isSameNumber =
          !isEmpty &&
          selectedValue !== null &&
          selectedValue !== '0' &&
          value === selectedValue &&
          !isSelected

        return (
          <SudokuCell
            key={i}
            idx={i}
            value={value}
            isGiven={isGiven}
            isSelected={isSelected}
            isSameNumber={isSameNumber}
            isRelated={isRelated}
            isConflict={conflicts.has(i)}
            isCoachTarget={coachTarget === i}
            isCoachRelated={coachTarget !== i && (coachHighlight?.has(i) ?? false)}
            isAha={ahaCell === i}
            ahaKey={ahaKey}
            notes={notes[i] ?? []}
            onPress={handleCellPress}
          />
        )
      })}
    </div>
  )
}
