// Standalone interactive practice board for technique lessons.
// Self-contained local state — independent of the main game store — but it renders with the
// same SudokuCell, NumberPad and Toast the real game uses, so a lesson looks exactly like play.

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SudokuCell } from '../game/SudokuCell'
import { NumberPad } from '../game/NumberPad'
import { Toast } from '../ui/Toast'
import { Button } from '../ui/Button'
import { SparkIcon, EraseIcon } from '../ui/icons'
import { generatePuzzle, rowOf, colOf, boxOf } from '../../lib/sudoku/generator'
import { getNextCoachStep } from '../../lib/sudoku/techniques'
import { detectTechnique } from '../../lib/sudoku/techniqueDetector'
import { isCellValid } from '../../lib/sudoku/validator'
import type { TechniqueName, Difficulty, PuzzleData } from '../../types'
import { TECHNIQUE_LABELS } from '../../types'

interface Props {
  technique: TechniqueName
  difficulty: Difficulty
  practicePuzzle?: PuzzleData
  onMastered?: () => void
}

export function PracticeBoard({ technique, difficulty, practicePuzzle, onMastered }: Props) {
  const [clues,    setClues]    = useState('')
  const [board,    setBoard]    = useState('')
  const [solution, setSolution] = useState('')
  const [selected, setSelected] = useState<number | null>(null)
  const [hintStep, setHintStep] = useState<ReturnType<typeof getNextCoachStep>>(null)
  const [toast, setToast]       = useState<{ msg: string; key: number; spark: boolean } | null>(null)
  const [complete, setComplete] = useState(false)
  const [ahaCell, setAhaCell]   = useState<number | null>(null)
  const toastId = useRef(0)
  const prevBoardRef = useRef('')

  function showToast(msg: string, spark = false) {
    setToast({ msg, key: ++toastId.current, spark })
    setTimeout(() => setToast(null), 2500)
  }

  function newPuzzle() {
    const p = practicePuzzle ?? generatePuzzle(difficulty)
    setClues(p.clues)
    setBoard(p.clues)
    setSolution(p.solution)
    setSelected(null)
    setHintStep(null)
    setComplete(false)
    setAhaCell(null)
    prevBoardRef.current = p.clues
  }

  // Generate a puzzle on mount and when difficulty/practicePuzzle changes
  useEffect(() => { newPuzzle() }, [difficulty, practicePuzzle]) // eslint-disable-line react-hooks/exhaustive-deps

  // Detect technique application after each board change
  useEffect(() => {
    const prev = prevBoardRef.current
    if (!prev || prev === board) return

    for (let i = 0; i < 81; i++) {
      if (prev[i] !== board[i] && board[i] !== '0') {
        const result = detectTechnique(prev, board, i)
        if (result && result.technique === technique) {
          setAhaCell(i)
          showToast(`${TECHNIQUE_LABELS[technique]} applied`, true)
          onMastered?.()
        }
        break
      }
    }
    prevBoardRef.current = board
  }, [board]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCellPress = useCallback((idx: number) => {
    if (clues[idx] !== '0') return // given cell — immutable
    setSelected(prev => prev === idx ? null : idx)
    setHintStep(null)
  }, [clues])

  const handleNumber = useCallback((num: number) => {
    if (selected === null) return
    if (clues[selected] !== '0') return

    if (!isCellValid(board, selected, num)) {
      showToast('That number conflicts — check the row, column, and box.')
      return
    }

    const newBoard = board.split('')
    newBoard[selected] = String(num)
    const newBoardStr = newBoard.join('')
    setBoard(newBoardStr)
    setHintStep(null)

    if (newBoardStr === solution) {
      setComplete(true)
      showToast('Puzzle complete.')
    }
  }, [selected, board, clues, solution])

  const handleErase = useCallback(() => {
    if (selected === null || clues[selected] !== '0') return
    const newBoard = board.split('')
    newBoard[selected] = '0'
    setBoard(newBoard.join(''))
  }, [selected, board, clues])

  const handleCoach = useCallback(() => {
    const step = getNextCoachStep(board)
    setHintStep(step)
    if (step) setSelected(step.cellIndex)
  }, [board])

  // Derived highlight sets
  const highlightCells = new Set(hintStep?.highlightCells ?? [])
  const coachTarget    = hintStep?.cellIndex ?? null
  const selectedValue  = selected !== null ? board[selected] : null

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Board — same cell component as the real game */}
      <div
        className="grid w-full aspect-square bg-board border-2 border-board-box rounded-[10px] overflow-hidden shadow-board touch-none"
        style={{ gridTemplateColumns: 'repeat(9, 1fr)', gridTemplateRows: 'repeat(9, 1fr)' }}
      >
        {Array.from({ length: 81 }, (_, i) => {
          const val = board[i] ?? '0'
          const isSel = selected === i
          const isEmpty = val === '0'
          const isRelated = selected !== null && !isSel && (
            rowOf(i) === rowOf(selected) || colOf(i) === colOf(selected) || boxOf(i) === boxOf(selected)
          )
          const isSameNumber = !isEmpty && !!selectedValue && selectedValue !== '0' && val === selectedValue && !isSel
          return (
            <SudokuCell
              key={i}
              idx={i}
              value={val}
              isGiven={clues[i] !== '0'}
              isSelected={isSel}
              isSameNumber={isSameNumber}
              isRelated={isRelated}
              isConflict={false}
              isCoachTarget={coachTarget === i}
              isCoachRelated={coachTarget !== i && highlightCells.has(i)}
              isAha={ahaCell === i}
              ahaKey={toast?.key}
              notes={[]}
              onPress={handleCellPress}
            />
          )
        })}
      </div>

      {/* Coach hint explanation — guidance, so teal */}
      <AnimatePresence>
        {hintStep && (
          <motion.div
            key="hint"
            className="w-full bg-guide/10 border border-guide/30 rounded-2xl px-4 py-3"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-guide-ink mb-1">
              {TECHNIQUE_LABELS[hintStep.technique]}
            </p>
            <p className="text-sm text-ink-2 leading-snug">{hintStep.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keys — the real game's pad, with remaining counts */}
      {!complete && <NumberPad board={board} notesMode={false} onInput={handleNumber} />}

      {/* Actions */}
      <div className="flex gap-2 w-full">
        <Button variant="glass" className="flex-1" onClick={handleCoach}>Coach hint</Button>
        {complete ? (
          <Button variant="secondary" className="flex-1" onClick={newPuzzle}>New puzzle</Button>
        ) : (
          <Button variant="secondary" className="px-4" onClick={handleErase} aria-label="Erase">
            <EraseIcon className="w-5 h-5" />
          </Button>
        )}
      </div>

      <Toast
        message={toast?.msg ?? null}
        id={toast?.key}
        icon={toast?.spark ? <SparkIcon className="w-4 h-4" /> : undefined}
        position="bottom"
      />
    </div>
  )
}
