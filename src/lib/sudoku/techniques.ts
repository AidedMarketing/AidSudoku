// Proactive technique finder — used by Coach mode and practice boards.
// Given a board state, finds the next applicable logical step for a named technique.

import { getCandidates } from './solver'
import type { TechniqueName } from '../../types'

type Grid = number[]

export interface TechniqueStep {
  technique: TechniqueName
  cellIndex: number
  value: number
  explanation: string
  /** Cells to highlight to explain the logic */
  highlightCells: number[]
  /** The two-cell pair / triple involved (for pair techniques) */
  patternCells?: number[]
}

// ─── Unit builders ─────────────────────────────────────────────────────────

function buildUnits(): number[][] {
  const units: number[][] = []
  for (let r = 0; r < 9; r++)
    units.push(Array.from({ length: 9 }, (_, c) => r * 9 + c))
  for (let c = 0; c < 9; c++)
    units.push(Array.from({ length: 9 }, (_, r) => r * 9 + c))
  for (let br = 0; br < 3; br++)
    for (let bc = 0; bc < 3; bc++) {
      const box: number[] = []
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 3; c++)
          box.push((br * 3 + r) * 9 + (bc * 3 + c))
      units.push(box)
    }
  return units
}

const UNITS = buildUnits()

function rowOf(idx: number) { return Math.floor(idx / 9) }
function colOf(idx: number) { return idx % 9 }
function boxOf(idx: number) {
  return Math.floor(rowOf(idx) / 3) * 3 + Math.floor(colOf(idx) / 3)
}

function unitLabel(unit: number[]): string {
  // Determine whether this unit is a row, col, or box by inspecting its cells
  const r0 = rowOf(unit[0])
  if (unit.every(i => rowOf(i) === r0)) return `row ${r0 + 1}`
  const c0 = colOf(unit[0])
  if (unit.every(i => colOf(i) === c0)) return `column ${c0 + 1}`
  return `this box`
}

// ─── Naked Singles ─────────────────────────────────────────────────────────

export function findNakedSingle(grid: Grid): TechniqueStep | null {
  for (let i = 0; i < 81; i++) {
    if (grid[i] !== 0) continue
    const cands = getCandidates(grid, i)
    if (cands.length === 1) {
      const r = rowOf(i), c = colOf(i)
      const peers = [
        ...Array.from({ length: 9 }, (_, j) => r * 9 + j),
        ...Array.from({ length: 9 }, (_, j) => j * 9 + c),
        ...UNITS[18 + boxOf(i)],
      ].filter((p, idx, arr) => p !== i && arr.indexOf(p) === idx && grid[p] !== 0)
      return {
        technique: 'naked_singles',
        cellIndex: i,
        value: cands[0],
        explanation: `Only ${cands[0]} can go in r${r + 1}c${c + 1} — every other number already appears in its row, column, or box.`,
        highlightCells: peers,
      }
    }
  }
  return null
}

// ─── Hidden Singles ────────────────────────────────────────────────────────

export function findHiddenSingle(grid: Grid): TechniqueStep | null {
  for (const unit of UNITS) {
    for (let num = 1; num <= 9; num++) {
      const possibleCells = unit.filter(i => grid[i] === 0 && getCandidates(grid, i).includes(num))
      if (possibleCells.length === 1) {
        const idx = possibleCells[0]
        const r = rowOf(idx), c = colOf(idx)
        return {
          technique: 'hidden_singles',
          cellIndex: idx,
          value: num,
          explanation: `${num} can only fit in r${r + 1}c${c + 1} within ${unitLabel(unit)} — every other empty cell in that unit already has ${num} ruled out.`,
          highlightCells: unit.filter(i => i !== idx),
        }
      }
    }
  }
  return null
}

// ─── Naked Pairs ───────────────────────────────────────────────────────────
// A naked pair doesn't directly place a value, but it eliminates candidates
// from other cells in the unit, enabling subsequent moves.
// Returns the first cell that becomes solvable BECAUSE of a naked pair.

export function findNakedPairStep(grid: Grid): TechniqueStep | null {
  for (const unit of UNITS) {
    const emptyCells = unit.filter(i => grid[i] === 0)
    for (let a = 0; a < emptyCells.length - 1; a++) {
      for (let b = a + 1; b < emptyCells.length; b++) {
        const ca = getCandidates(grid, emptyCells[a])
        const cb = getCandidates(grid, emptyCells[b])
        if (ca.length !== 2 || cb.length !== 2) continue
        if (ca[0] !== cb[0] || ca[1] !== cb[1]) continue

        // Found a naked pair [ca[0], ca[1]] in cells [a, b]
        // Eliminate those values from every other cell in the unit
        const pairValues = ca
        const pairCells = [emptyCells[a], emptyCells[b]]
        const gridCopy = [...grid]
        // Simulate elimination: mark cells where candidates change
        let changed = false
        for (const cell of emptyCells) {
          if (pairCells.includes(cell)) continue
          const cands = getCandidates(gridCopy, cell)
          if (cands.some(v => pairValues.includes(v))) {
            changed = true
          }
        }
        if (!changed) continue

        // Return a TechniqueStep pointing to the pair itself (for highlighting)
        // with explanation — the actual next solve step will come from a naked single after elimination
        const idxA = emptyCells[a], idxB = emptyCells[b]
        return {
          technique: 'naked_pairs',
          cellIndex: idxA,  // highlight the first pair cell
          value: 0,          // no direct placement — this is a constraint step
          explanation: `Cells r${rowOf(idxA) + 1}c${colOf(idxA) + 1} and r${rowOf(idxB) + 1}c${colOf(idxB) + 1} form a Naked Pair on {${pairValues.join(',')}}. No other cell in ${unitLabel(unit)} can contain ${pairValues[0]} or ${pairValues[1]}.`,
          highlightCells: [...pairCells, ...unit.filter(i => grid[i] === 0 && !pairCells.includes(i))],
          patternCells: pairCells,
        }
      }
    }
  }
  return null
}

// ─── Hidden Pairs ──────────────────────────────────────────────────────────

export function findHiddenPairStep(grid: Grid): TechniqueStep | null {
  for (const unit of UNITS) {
    const emptyCells = unit.filter(i => grid[i] === 0)
    for (let v1 = 1; v1 <= 8; v1++) {
      for (let v2 = v1 + 1; v2 <= 9; v2++) {
        const cells1 = emptyCells.filter(i => getCandidates(grid, i).includes(v1))
        const cells2 = emptyCells.filter(i => getCandidates(grid, i).includes(v2))
        if (cells1.length !== 2 || cells2.length !== 2) continue
        if (cells1[0] !== cells2[0] || cells1[1] !== cells2[1]) continue

        const pairCells = cells1
        const idxA = pairCells[0], idxB = pairCells[1]

        // Verify it's hidden: at least one of the two cells has extra candidates
        const candsA = getCandidates(grid, idxA)
        const candsB = getCandidates(grid, idxB)
        const isHidden = candsA.some(v => v !== v1 && v !== v2) || candsB.some(v => v !== v1 && v !== v2)
        if (!isHidden) continue

        return {
          technique: 'hidden_pairs',
          cellIndex: idxA,
          value: 0,
          explanation: `Only r${rowOf(idxA) + 1}c${colOf(idxA) + 1} and r${rowOf(idxB) + 1}c${colOf(idxB) + 1} in ${unitLabel(unit)} can contain ${v1} or ${v2}. This Hidden Pair eliminates all other candidates from those two cells.`,
          highlightCells: pairCells,
          patternCells: pairCells,
        }
      }
    }
  }
  return null
}

// ─── Coach: next step ──────────────────────────────────────────────────────

/**
 * Returns the next logical step in the puzzle, preferring simpler techniques.
 * Used by Coach mode to guide the player step by step.
 */
export function getNextCoachStep(boardStr: string): TechniqueStep | null {
  const grid = boardStr.split('').map(Number)

  return (
    findNakedSingle(grid) ??
    findHiddenSingle(grid) ??
    findNakedPairStep(grid) ??
    findHiddenPairStep(grid)
  )
}
