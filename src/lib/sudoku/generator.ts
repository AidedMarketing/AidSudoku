import type { Difficulty, PuzzleData } from '../../types'

type Grid = number[] // 81-element, 0 = empty

// ─── Clue counts per difficulty ──────────────────────────────────────────────

const CLUE_RANGES: Record<Difficulty, [number, number]> = {
  easy:   [36, 46],
  medium: [27, 35],
  hard:   [22, 26],
  expert: [17, 21],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function rowOf(idx: number)    { return Math.floor(idx / 9) }
function colOf(idx: number)    { return idx % 9 }
function boxOf(idx: number)    { return Math.floor(rowOf(idx) / 3) * 3 + Math.floor(colOf(idx) / 3) }

function peers(idx: number): number[] {
  const r = rowOf(idx), c = colOf(idx)
  const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3
  const set = new Set<number>()
  for (let i = 0; i < 9; i++) {
    set.add(r * 9 + i)       // same row
    set.add(i * 9 + c)       // same col
    set.add((br + Math.floor(i / 3)) * 9 + (bc + (i % 3))) // same box
  }
  set.delete(idx)
  return [...set]
}

function isValidPlacement(grid: Grid, idx: number, num: number): boolean {
  for (const p of peers(idx)) {
    if (grid[p] === num) return false
  }
  return true
}

// ─── Solution generator (backtracking) ───────────────────────────────────────

function fillGrid(grid: Grid): boolean {
  const idx = grid.indexOf(0)
  if (idx === -1) return true

  for (const num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    if (isValidPlacement(grid, idx, num)) {
      grid[idx] = num
      if (fillGrid(grid)) return true
      grid[idx] = 0
    }
  }
  return false
}

// ─── Unique-solution checker ──────────────────────────────────────────────────

function countSolutions(grid: Grid, limit = 2): number {
  const idx = grid.indexOf(0)
  if (idx === -1) return 1

  let count = 0
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, idx, num)) {
      grid[idx] = num
      count += countSolutions(grid, limit)
      grid[idx] = 0
      if (count >= limit) return count
    }
  }
  return count
}

// ─── Puzzle creation (remove clues symmetrically) ────────────────────────────

function createPuzzle(solution: Grid, difficulty: Difficulty): Grid {
  const [minClues, maxClues] = CLUE_RANGES[difficulty]
  const targetClues = minClues + Math.floor(Math.random() * (maxClues - minClues + 1))
  const targetRemovals = 81 - targetClues

  const puzzle = [...solution]
  const positions = shuffle([...Array(81).keys()])
  let removed = 0

  for (const pos of positions) {
    if (removed >= targetRemovals) break
    const backup = puzzle[pos]
    puzzle[pos] = 0
    if (countSolutions([...puzzle]) === 1) {
      removed++
    } else {
      puzzle[pos] = backup
    }
  }

  return puzzle
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generatePuzzle(difficulty: Difficulty): PuzzleData {
  const solution: Grid = new Array(81).fill(0)
  fillGrid(solution)

  const puzzle = createPuzzle(solution, difficulty)

  return {
    clues:      puzzle.map(n => n === 0 ? '0' : String(n)).join(''),
    solution:   solution.map(String).join(''),
    difficulty,
  }
}

export function gridFromString(s: string): Grid {
  return s.split('').map(Number)
}

export { rowOf, colOf, boxOf, peers, isValidPlacement }
