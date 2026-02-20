import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { BottomSheet } from '../components/ui/BottomSheet'
import { useGameStore } from '../store/gameStore'
import { generatePuzzle } from '../lib/sudoku/generator'
import type { Difficulty } from '../types'

const DIFFICULTIES: { value: Difficulty; label: string; desc: string }[] = [
  { value: 'easy',   label: 'Easy',   desc: '36+ clues — great for building confidence' },
  { value: 'medium', label: 'Medium', desc: '27–35 clues — a satisfying challenge' },
  { value: 'hard',   label: 'Hard',   desc: '22–26 clues — requires logic techniques' },
  { value: 'expert', label: 'Expert', desc: '17–21 clues — for seasoned solvers' },
]

export function Home() {
  const navigate    = useNavigate()
  const startGame   = useGameStore(s => s.startGame)
  const gameStatus  = useGameStore(s => s.gameStatus)

  const [showDiffSheet,    setShowDiffSheet]    = useState(false)
  const [showConfirmSheet, setShowConfirmSheet] = useState(false)
  const [pendingDifficulty, setPendingDifficulty] = useState<Difficulty | null>(null)

  function tryStart(difficulty: Difficulty) {
    if (gameStatus === 'playing' || gameStatus === 'paused') {
      // Game in progress — ask for confirmation first
      setPendingDifficulty(difficulty)
      setShowDiffSheet(false)
      setShowConfirmSheet(true)
    } else {
      setShowDiffSheet(false)
      startGame(generatePuzzle(difficulty))
      navigate('/game')
    }
  }

  function confirmAbandon() {
    if (!pendingDifficulty) return
    setShowConfirmSheet(false)
    startGame(generatePuzzle(pendingDifficulty))
    navigate('/game')
  }

  return (
    <div className="flex flex-col px-5 pt-10 pb-28 min-h-screen bg-white dark:bg-[#121212]">
      {/* Wordmark */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Aid<span className="text-accent">Sudoku</span>
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          The Sudoku app that makes you better.
        </p>
      </motion.div>

      {/* Resume card */}
      {(gameStatus === 'playing' || gameStatus === 'paused') && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent/10 border border-accent/20 rounded-2xl p-4 mb-6 flex items-center justify-between"
        >
          <div>
            <p className="font-semibold text-accent-dim dark:text-accent">Game in progress</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tap to continue</p>
          </div>
          <Button size="sm" onClick={() => navigate('/game')}>Resume</Button>
        </motion.div>
      )}

      {/* Quick-start */}
      <div className="flex flex-col gap-3">
        <Button size="lg" className="w-full" onClick={() => setShowDiffSheet(true)}>
          New Puzzle
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => navigate('/daily')}
        >
          Today's Puzzle
        </Button>
      </div>

      {/* Difficulty picker */}
      <BottomSheet
        open={showDiffSheet}
        onClose={() => setShowDiffSheet(false)}
        title="Choose difficulty"
      >
        <div className="flex flex-col gap-3">
          {DIFFICULTIES.map(d => (
            <button
              key={d.value}
              className="flex flex-col text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-800"
              onClick={() => tryStart(d.value)}
            >
              <span className="font-semibold text-gray-900 dark:text-white">{d.label}</span>
              <span className="text-xs text-gray-400 mt-0.5">{d.desc}</span>
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Abandon confirmation */}
      <BottomSheet
        open={showConfirmSheet}
        onClose={() => setShowConfirmSheet(false)}
        title="Abandon current game?"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Your current puzzle will be lost. This can't be undone.
        </p>
        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full" onClick={confirmAbandon}>
            Start new game
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => { setShowConfirmSheet(false); navigate('/game') }}
          >
            Keep playing
          </Button>
        </div>
      </BottomSheet>
    </div>
  )
}
