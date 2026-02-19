import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Difficulty, GameStatus, PuzzleData, TechniqueName } from '../types'

interface GameState {
  // Puzzle
  puzzle: PuzzleData | null
  board: string        // 81-char current state (clues + user entries)
  initialClues: string // 81-char — which cells are given (immutable)

  // Interaction
  selectedCell: number | null
  notes: Record<number, number[]>  // cell index → candidate numbers
  isNotesMode: boolean

  // History
  history: Array<{ board: string; notes: Record<number, number[]> }>

  // Timer
  timerSeconds: number
  isTimerRunning: boolean

  // Progress
  gameStatus: GameStatus
  difficulty: Difficulty
  hintsUsed: number
  errorsMode: boolean
  techniquesDetected: TechniqueName[]

  // Actions
  startGame: (puzzle: PuzzleData) => void
  selectCell: (idx: number | null) => void
  enterNumber: (num: number) => void
  enterNote: (num: number) => void
  erase: () => void
  undo: () => void
  toggleNotesMode: () => void
  applyHint: (cellIdx: number, value: number) => void
  addTechnique: (t: TechniqueName) => void
  tickTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  resetGame: () => void
}

const EMPTY_NOTES: Record<number, number[]> = {}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      puzzle: null,
      board: '',
      initialClues: '',
      selectedCell: null,
      notes: EMPTY_NOTES,
      isNotesMode: false,
      history: [],
      timerSeconds: 0,
      isTimerRunning: false,
      gameStatus: 'idle',
      difficulty: 'medium',
      hintsUsed: 0,
      errorsMode: true,
      techniquesDetected: [],

      startGame(puzzle) {
        set({
          puzzle,
          board: puzzle.clues,
          initialClues: puzzle.clues,
          selectedCell: null,
          notes: {},
          isNotesMode: false,
          history: [],
          timerSeconds: 0,
          isTimerRunning: true,
          gameStatus: 'playing',
          difficulty: puzzle.difficulty,
          hintsUsed: 0,
          techniquesDetected: [],
        })
      },

      selectCell(idx) {
        set({ selectedCell: idx })
      },

      enterNumber(num) {
        const { selectedCell, board, initialClues, notes, history, puzzle } = get()
        if (selectedCell === null) return
        if (initialClues[selectedCell] !== '0') return // given cell — immutable

        // Push undo snapshot
        history.push({ board, notes: { ...notes } })

        const newBoard = board.split('')
        newBoard[selectedCell] = String(num)
        const newBoardStr = newBoard.join('')

        // Clear notes for peers when a number is placed
        const newNotes = { ...notes }
        delete newNotes[selectedCell]

        // Check win
        const isWon = puzzle && newBoardStr === puzzle.solution

        set({
          board: newBoardStr,
          notes: newNotes,
          history: [...history],
          gameStatus: isWon ? 'won' : 'playing',
          isTimerRunning: !isWon,
        })
      },

      enterNote(num) {
        const { selectedCell, board, initialClues, notes, history } = get()
        if (selectedCell === null) return
        if (initialClues[selectedCell] !== '0') return
        if (board[selectedCell] !== '0') return // cell already filled

        history.push({ board, notes: { ...notes } })

        const cellNotes = notes[selectedCell] ?? []
        const newNotes = {
          ...notes,
          [selectedCell]: cellNotes.includes(num)
            ? cellNotes.filter(n => n !== num)
            : [...cellNotes, num].sort(),
        }

        set({ notes: newNotes, history: [...history] })
      },

      erase() {
        const { selectedCell, board, initialClues, notes, history } = get()
        if (selectedCell === null) return
        if (initialClues[selectedCell] !== '0') return

        history.push({ board, notes: { ...notes } })
        const newBoard = board.split('')
        newBoard[selectedCell] = '0'
        const newNotes = { ...notes }
        delete newNotes[selectedCell]

        set({ board: newBoard.join(''), notes: newNotes, history: [...history] })
      },

      undo() {
        const { history } = get()
        if (history.length === 0) return
        const last = history[history.length - 1]
        set({ board: last.board, notes: last.notes, history: history.slice(0, -1) })
      },

      toggleNotesMode() {
        set(s => ({ isNotesMode: !s.isNotesMode }))
      },

      applyHint(cellIdx, value) {
        const { board, notes, history } = get()
        history.push({ board, notes: { ...notes } })
        const newBoard = board.split('')
        newBoard[cellIdx] = String(value)
        const newNotes = { ...notes }
        delete newNotes[cellIdx]
        set({
          board: newBoard.join(''),
          notes: newNotes,
          history: [...history],
          hintsUsed: get().hintsUsed + 1,
          selectedCell: cellIdx,
        })
      },

      addTechnique(t) {
        const { techniquesDetected } = get()
        if (!techniquesDetected.includes(t)) {
          set({ techniquesDetected: [...techniquesDetected, t] })
        }
      },

      tickTimer() {
        if (get().isTimerRunning) {
          set(s => ({ timerSeconds: s.timerSeconds + 1 }))
        }
      },

      pauseTimer() {
        set({ isTimerRunning: false, gameStatus: 'paused' })
      },

      resumeTimer() {
        if (get().gameStatus === 'paused') {
          set({ isTimerRunning: true, gameStatus: 'playing' })
        }
      },

      resetGame() {
        set({
          puzzle: null,
          board: '',
          initialClues: '',
          selectedCell: null,
          notes: {},
          isNotesMode: false,
          history: [],
          timerSeconds: 0,
          isTimerRunning: false,
          gameStatus: 'idle',
          hintsUsed: 0,
          techniquesDetected: [],
        })
      },
    }),
    {
      name: 'aidsudoku-game',
      // Don't persist timer-running state — restart timer on load
      partialize: state => ({
        puzzle: state.puzzle,
        board: state.board,
        initialClues: state.initialClues,
        notes: state.notes,
        timerSeconds: state.timerSeconds,
        gameStatus: state.gameStatus === 'won' ? 'won' : 'paused',
        difficulty: state.difficulty,
        hintsUsed: state.hintsUsed,
        techniquesDetected: state.techniquesDetected,
      }),
    },
  ),
)
