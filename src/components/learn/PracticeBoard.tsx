// Standalone interactive practice board for technique lessons.
// Self-contained local state — independent of the main game store.

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generatePuzzle } from '../../lib/sudoku/generator'
import { getNextCoachStep } from '../../lib/sudoku/techniques'
import { detectTechnique } from '../../lib/sudoku/techniqueDetector'
import { isCellValid } from '../../lib/sudoku/validator'
import type { TechniqueName, Difficulty } from '../../types'
import { TECHNIQUE_LABELS } from '../../types'
import { rowOf, colOf, boxOf } from '../../lib/sudoku/generator'

interface Props {
  technique: TechniqueName
  difficulty: Difficulty
  onMastered?: () => void
}

export function PracticeBoard({ technique, difficulty, onMastered }: Props) {
  const [clues,    setClues]    = useState('')
  const [board,    setBoard]    = useState('')
  const [solution, setSolution] = useState('')
  const [selected, setSelected] = useState<number | null>(null)
  const [hintStep, setHintStep] = useState<ReturnType<typeof getNextCoachStep>>(null)
  const [toast, setToast]       = useState<{ msg: string; key: number } | null>(null)
  const [complete, setComplete] = useState(false)
  const toastId = useRef(0)
  const prevBoardRef = useRef('')

  function showToast(msg: string) {
    setToast({ msg, key: ++toastId.current })
    setTimeout(() => setToast(null), 2500)
  }

  function newPuzzle() {
    const p = generatePuzzle(difficulty)
    setClues(p.clues)
    setBoard(p.clues)
    setSolution(p.solution)
    setSelected(null)
    setHintStep(null)
    setComplete(false)
    prevBoardRef.current = p.clues
  }

  // Generate a puzzle on mount and when difficulty changes
  useEffect(() => { newPuzzle() }, [difficulty]) // eslint-disable-line react-hooks/exhaustive-deps

  // Detect technique application after each board change
  useEffect(() => {
    const prev = prevBoardRef.current
    if (!prev || prev === board) return

    for (let i = 0; i < 81; i++) {
      if (prev[i] !== board[i] && board[i] !== '0') {
        const result = detectTechnique(prev, board, i)
        if (result && result.technique === technique) {
          showToast(`Nice — you used ${TECHNIQUE_LABELS[technique]}! 🎯`)
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

    const newBoard = board.split('')
    newBoard[selected] = String(num)
    const newBoardStr = newBoard.join('')

    if (!isCellValid(board, selected, num)) {
      showToast('That number conflicts — check the row, column, and box.')
      return
    }

    setBoard(newBoardStr)
    setHintStep(null)

    if (newBoardStr === solution) {
      setComplete(true)
      showToast('Puzzle complete! Great work.')
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
    if (step) {
      setSelected(step.cellIndex)
    }
  }, [board])

  // Derived highlight sets
  const highlightCells = new Set(hintStep?.highlightCells ?? [])
  const coachTarget    = hintStep?.cellIndex ?? null

  const selectedValue = selected !== null ? board[selected] : null

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Board */}
      <div
        className="grid border-2 border-gray-900 dark:border-white w-full aspect-square"
        style={{ gridTemplateColumns: 'repeat(9, 1fr)', gridTemplateRows: 'repeat(9, 1fr)' }}
      >
        {Array.from({ length: 81 }, (_, i) => {
          const val      = board[i]
          const isGiven  = clues[i] !== '0'
          const isSel    = selected === i
          const isEmpty  = val === '0'
          const r = rowOf(i), c = colOf(i)
          const isRelated = selected !== null && !isSel && (
            rowOf(i) === rowOf(selected) ||
            colOf(i) === colOf(selected) ||
            boxOf(i) === boxOf(selected)
          )
          const isSameNum = !isEmpty && selectedValue && selectedValue !== '0' && val === selectedValue && !isSel
          const isCoachTarget = coachTarget === i
          const isHighlighted = highlightCells.has(i)

          let bg = 'bg-white dark:bg-[#1E1E1E]'
          if (isCoachTarget)   bg = 'bg-[#6AAD6460]'
          else if (isSel)      bg = 'bg-[#6AAD6440] dark:bg-[#6AAD6430]'
          else if (isHighlighted) bg = 'bg-blue-50 dark:bg-blue-950/30'
          else if (isSameNum)  bg = 'bg-gray-100 dark:bg-gray-800'
          else if (isRelated)  bg = 'bg-gray-50 dark:bg-[#242424]'

          let textColor = 'text-gray-900 dark:text-white'
          if (isGiven)         textColor = 'text-black dark:text-white font-semibold'
          else if (isCoachTarget) textColor = 'text-[#6AAD64] font-bold'

          const borderTop  = r % 3 === 0 && r !== 0 ? 'border-t-2 border-t-gray-800 dark:border-t-gray-300' : 'border-t border-t-gray-200 dark:border-t-gray-700'
          const borderLeft = c % 3 === 0 && c !== 0 ? 'border-l-2 border-l-gray-800 dark:border-l-gray-300' : 'border-l border-l-gray-200 dark:border-l-gray-700'

          return (
            <motion.button
              key={i}
              className={`relative aspect-square flex items-center justify-center select-none ${bg} ${borderTop} ${borderLeft} focus:outline-none`}
              onTap={() => handleCellPress(i)}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.07 }}
            >
              {!isEmpty && (
                <span className={`text-[clamp(12px,3.5vw,20px)] leading-none ${textColor}`}>{val}</span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Coach hint explanation */}
      <AnimatePresence>
        {hintStep && (
          <motion.div
            key="hint"
            className="w-full bg-[#6AAD64]/10 border border-[#6AAD64]/30 rounded-xl px-4 py-3"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-xs font-semibold text-[#6AAD64] mb-1">
              {TECHNIQUE_LABELS[hintStep.technique]}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
              {hintStep.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Number pad */}
      {!complete && (
        <div className="grid grid-cols-5 gap-2 w-full">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button
              key={n}
              className="aspect-square rounded-xl text-lg font-semibold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
              onClick={() => handleNumber(n)}
            >
              {n}
            </button>
          ))}
          <button
            className="aspect-square rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 active:bg-gray-200 dark:active:bg-gray-700"
            onClick={handleErase}
          >
            ⌫
          </button>
        </div>
      )}

      {/* Actions row */}
      <div className="flex gap-3 w-full">
        <button
          className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[#6AAD64]/15 text-[#6AAD64] active:bg-[#6AAD64]/25 transition-colors"
          onClick={handleCoach}
        >
          Coach hint
        </button>
        {complete && (
          <button
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 active:opacity-70"
            onClick={newPuzzle}
          >
            New puzzle
          </button>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.key}
            className="fixed bottom-36 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium px-4 py-2.5 rounded-full shadow-lg whitespace-nowrap"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
