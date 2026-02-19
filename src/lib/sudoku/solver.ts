// Constraint-propagation + backtracking solver
// Used for: hint generation, validation, coaching

import { peers, isValidPlacement } from './generator'

type Grid = number[]

/** Returns the solved grid, or null if unsolvable */
export function solve(clues: string): string | null {
  const grid = clues.split('').map(Number)
  if (solveGrid(grid)) return grid.join('')
  return null
}

function solveGrid(grid: Grid): boolean {
  // Find the empty cell with fewest candidates (MRV heuristic)
  let minCandidates = 10
  let bestIdx = -1

  for (let i = 0; i < 81; i++) {
    if (grid[i] !== 0) continue
    const count = candidateCount(grid, i)
    if (count === 0) return false // dead end
    if (count < minCandidates) {
      minCandidates = count
      bestIdx = i
      if (count === 1) break // can't do better
    }
  }

  if (bestIdx === -1) return true // all cells filled

  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, bestIdx, num)) {
      grid[bestIdx] = num
      if (solveGrid(grid)) return true
      grid[bestIdx] = 0
    }
  }
  return false
}

function candidateCount(grid: Grid, idx: number): number {
  const used = new Set<number>()
  for (const p of peers(idx)) {
    if (grid[p] !== 0) used.add(grid[p])
  }
  return 9 - used.size
}

/** Returns candidates for a cell (the numbers 1-9 not ruled out by peers) */
export function getCandidates(grid: Grid, idx: number): number[] {
  const used = new Set<number>()
  for (const p of peers(idx)) {
    if (grid[p] !== 0) used.add(grid[p])
  }
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !used.has(n))
}

export interface Hint {
  cellIndex: number
  value: number
  technique: string
  explanation: string
  highlightCells: number[]
}

/** Returns the next logical hint, preferring simpler techniques */
export function getHint(cluesStr: string, boardStr: string): Hint | null {
  const board = boardStr.split('').map(Number)
  const clues  = cluesStr.split('').map(Number)

  // Try naked singles first
  for (let i = 0; i < 81; i++) {
    if (board[i] !== 0 || clues[i] !== 0) continue
    const candidates = getCandidates(board, i)
    if (candidates.length === 1) {
      return {
        cellIndex: i,
        value: candidates[0],
        technique: 'Naked Single',
        explanation: `Only ${candidates[0]} can go in this cell — all other numbers are already in the same row, column, or box.`,
        highlightCells: peers(i).filter(p => board[p] !== 0),
      }
    }
  }

  // Try hidden singles in rows, cols, boxes
  const units = buildUnits()
  for (const unit of units) {
    const hint = findHiddenSingle(board, clues, unit)
    if (hint) return hint
  }

  // Fall back: just give the solution value for the easiest empty cell
  const solved = cluesStr !== boardStr ? solve(boardStr) : solve(cluesStr)
  if (!solved) return null

  for (let i = 0; i < 81; i++) {
    if (board[i] === 0) {
      return {
        cellIndex: i,
        value: Number(solved[i]),
        technique: 'Hint',
        explanation: `This cell must be ${solved[i]}.`,
        highlightCells: [],
      }
    }
  }
  return null
}

function findHiddenSingle(board: Grid, clues: Grid, unit: number[]): Hint | null {
  for (let num = 1; num <= 9; num++) {
    const possibleCells = unit.filter(i =>
      board[i] === 0 && clues[i] === 0 && isValidPlacement(board, i, num)
    )
    if (possibleCells.length === 1) {
      const idx = possibleCells[0]
      return {
        cellIndex: idx,
        value: num,
        technique: 'Hidden Single',
        explanation: `${num} can only go in this cell within this unit — every other cell in the row, column, or box already has ${num} ruled out.`,
        highlightCells: unit.filter(i => i !== idx),
      }
    }
  }
  return null
}

function buildUnits(): number[][] {
  const units: number[][] = []
  // rows
  for (let r = 0; r < 9; r++) {
    units.push(Array.from({ length: 9 }, (_, c) => r * 9 + c))
  }
  // cols
  for (let c = 0; c < 9; c++) {
    units.push(Array.from({ length: 9 }, (_, r) => r * 9 + c))
  }
  // boxes
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const box: number[] = []
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          box.push((br * 3 + r) * 9 + (bc * 3 + c))
        }
      }
      units.push(box)
    }
  }
  return units
}
