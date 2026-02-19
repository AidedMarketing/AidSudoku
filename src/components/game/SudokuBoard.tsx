import { SudokuCell } from './SudokuCell'
import { useGame } from '../../hooks/useGame'
import { useSettingsStore } from '../../store/settingsStore'
import { getConflicts } from '../../lib/sudoku/validator'
import { rowOf, colOf, boxOf } from '../../lib/sudoku/generator'

interface Props {
  coachHighlight?: Set<number>
  coachTarget?: number | null
}

export function SudokuBoard({ coachHighlight, coachTarget }: Props = {}) {
  const {
    board, initialClues, selectedCell, notes,
    handleCellPress, puzzle,
  } = useGame()

  const showErrors = useSettingsStore(s => s.showErrors)

  if (!puzzle || !board) return null

  const selectedValue = selectedCell !== null ? board[selectedCell] : null
  const conflicts = showErrors
    ? new Set([...Array(81).keys()].flatMap(i =>
        board[i] !== '0' ? [...getConflicts(board, i)] : []
      ))
    : new Set<number>()

  return (
    <div
      className="grid border-2 border-gray-900 dark:border-white w-full max-w-[min(92vw,400px)] mx-auto aspect-square"
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

        const isConflict      = conflicts.has(i)
        const isCoachTarget   = coachTarget === i
        const isCoachRelated  = !isCoachTarget && (coachHighlight?.has(i) ?? false)

        return (
          <SudokuCell
            key={i}
            idx={i}
            value={value}
            isGiven={isGiven}
            isSelected={isSelected || isCoachRelated}
            isSameNumber={isSameNumber}
            isRelated={isRelated}
            isConflict={isConflict}
            isHint={isCoachTarget}
            notes={notes[i] ?? []}
            onPress={handleCellPress}
          />
        )
      })}
    </div>
  )
}
