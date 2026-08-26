// After a player makes a valid move, analyse the board state diff
// to determine which Sudoku technique the move most likely represents.
// Fires named technique events consumed by useAhaMoment + passportStore.

import type { TechniqueName } from '../../types'
import { getCandidates } from './solver'
import { rowOf, colOf, boxOf } from './generator'

type Grid = number[]

export interface DetectionResult {
  technique: TechniqueName
  confidence: 'high' | 'medium'
}

/**
 * Given the board BEFORE and AFTER a single cell is filled,
 * returns the technique that best explains the move.
 */
export function detectTechnique(
  before: string,
  after: string,
  cellIdx: number,
): DetectionResult | null {
  const gridBefore = before.split('').map(Number)
  const value = Number(after[cellIdx])

  if (value === 0) return null

  // ── Naked Single ──────────────────────────────────────────────────────────
  // Only one candidate was possible for this cell
  const candidates = getCandidates(gridBefore, cellIdx)
  if (candidates.length === 1 && candidates[0] === value) {
    return { technique: 'naked_singles', confidence: 'high' }
  }

  // ── Hidden Single ─────────────────────────────────────────────────────────
  // In at least one unit, this is the only cell where `value` can go
  if (isHiddenSingle(gridBefore, cellIdx, value)) {
    return { technique: 'hidden_singles', confidence: 'high' }
  }

  // ── Naked Pairs / Triples ─────────────────────────────────────────────────
  // Before the move, there was a naked pair/triple in the cell's units
  if (hadNakedPair(gridBefore, cellIdx)) {
    return { technique: 'naked_pairs', confidence: 'medium' }
  }
  if (hadNakedTriple(gridBefore, cellIdx)) {
    return { technique: 'naked_triples', confidence: 'medium' }
  }

  // ── Hidden Pairs / Triples ────────────────────────────────────────────────
  if (hadHiddenPair(gridBefore, cellIdx, value)) {
    return { technique: 'hidden_pairs', confidence: 'medium' }
  }
  if (hadHiddenTriple(gridBefore, cellIdx, value)) {
    return { technique: 'hidden_triples', confidence: 'medium' }
  }

  // ── Advanced (elimination) techniques ─────────────────────────────────────
  if (hadPointingPair(gridBefore, cellIdx)) {
    return { technique: 'pointing_pairs', confidence: 'medium' }
  }
  if (hadBoxLineReduction(gridBefore, cellIdx)) {
    return { technique: 'box_line_reduction', confidence: 'medium' }
  }
  if (hadXWing(gridBefore, cellIdx)) {
    return { technique: 'x_wing', confidence: 'medium' }
  }
  if (hadYWing(gridBefore, cellIdx)) {
    return { technique: 'y_wing', confidence: 'medium' }
  }
  if (hadSwordfish(gridBefore, cellIdx)) {
    return { technique: 'swordfish', confidence: 'medium' }
  }

  return null
}

// ─── Unit helpers ─────────────────────────────────────────────────────────────

function unitCells(type: 'row' | 'col' | 'box', idx: number): number[] {
  const r = rowOf(idx), c = colOf(idx)
  const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3

  if (type === 'row') return Array.from({ length: 9 }, (_, i) => r * 9 + i)
  if (type === 'col') return Array.from({ length: 9 }, (_, i) => i * 9 + c)
  // box
  const cells: number[] = []
  for (let dr = 0; dr < 3; dr++)
    for (let dc = 0; dc < 3; dc++)
      cells.push((br + dr) * 9 + (bc + dc))
  return cells
}

function getUnits(idx: number): number[][] {
  return [
    unitCells('row', idx),
    unitCells('col', idx),
    unitCells('box', idx),
  ]
}

// ─── Hidden Single ────────────────────────────────────────────────────────────

function isHiddenSingle(grid: Grid, idx: number, value: number): boolean {
  for (const unit of getUnits(idx)) {
    const emptyCellsWhereValueFits = unit.filter(
      i => grid[i] === 0 && getCandidates(grid, i).includes(value)
    )
    if (emptyCellsWhereValueFits.length === 1 && emptyCellsWhereValueFits[0] === idx) {
      return true
    }
  }
  return false
}

// ─── Naked Pair ───────────────────────────────────────────────────────────────

function hadNakedPair(grid: Grid, idx: number): boolean {
  for (const unit of getUnits(idx)) {
    const emptyCells = unit.filter(i => grid[i] === 0 && i !== idx)
    for (let a = 0; a < emptyCells.length - 1; a++) {
      for (let b = a + 1; b < emptyCells.length; b++) {
        const ca = getCandidates(grid, emptyCells[a])
        const cb = getCandidates(grid, emptyCells[b])
        if (ca.length === 2 && cb.length === 2 && ca[0] === cb[0] && ca[1] === cb[1]) {
          // Naked pair existed — the current move is likely enabled by it
          return true
        }
      }
    }
  }
  return false
}

// ─── Naked Triple ─────────────────────────────────────────────────────────────

function hadNakedTriple(grid: Grid, idx: number): boolean {
  for (const unit of getUnits(idx)) {
    const emptyCells = unit.filter(i => grid[i] === 0 && i !== idx)
    for (let a = 0; a < emptyCells.length - 2; a++) {
      for (let b = a + 1; b < emptyCells.length - 1; b++) {
        for (let c = b + 1; c < emptyCells.length; c++) {
          const ca = getCandidates(grid, emptyCells[a])
          const cb = getCandidates(grid, emptyCells[b])
          const cc = getCandidates(grid, emptyCells[c])
          const union = new Set([...ca, ...cb, ...cc])
          if (union.size === 3 && ca.length <= 3 && cb.length <= 3 && cc.length <= 3) {
            return true
          }
        }
      }
    }
  }
  return false
}

// ─── Hidden Pair ──────────────────────────────────────────────────────────────

function hadHiddenPair(grid: Grid, idx: number, value: number): boolean {
  for (const unit of getUnits(idx)) {
    const emptyCells = unit.filter(i => grid[i] === 0)
    for (let num2 = 1; num2 <= 9; num2++) {
      if (num2 === value) continue
      const pairCells = emptyCells.filter(i => {
        const cands = getCandidates(grid, i)
        return cands.includes(value) && cands.includes(num2)
      })
      if (pairCells.length === 2 && pairCells.includes(idx)) {
        const otherCells = emptyCells.filter(i => !pairCells.includes(i))
        const noneHaveValue = otherCells.every(i => !getCandidates(grid, i).includes(value))
        const noneHaveNum2  = otherCells.every(i => !getCandidates(grid, i).includes(num2))
        if (noneHaveValue && noneHaveNum2) return true
      }
    }
  }
  return false
}

// ─── Hidden Triple ────────────────────────────────────────────────────────────

function hadHiddenTriple(grid: Grid, idx: number, value: number): boolean {
  for (const unit of getUnits(idx)) {
    const emptyCells = unit.filter(i => grid[i] === 0)
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => n !== value)
    for (let a = 0; a < nums.length - 1; a++) {
      for (let b = a + 1; b < nums.length; b++) {
        const triple = [value, nums[a], nums[b]]
        const tripleCells = emptyCells.filter(i => {
          const cands = getCandidates(grid, i)
          return triple.some(n => cands.includes(n))
        })
        if (tripleCells.length === 3 && tripleCells.includes(idx)) {
          const otherCells = emptyCells.filter(i => !tripleCells.includes(i))
          const isolated = triple.every(n =>
            otherCells.every(i => !getCandidates(grid, i).includes(n))
          )
          if (isolated) return true
        }
      }
    }
  }
  return false
}

// ─── sees helper (used by Y-Wing) ──────────────────────────────────────────────

function sees(i: number, j: number): boolean {
  return rowOf(i) === rowOf(j) || colOf(i) === colOf(j) || boxOf(i) === boxOf(j)
}

// ─── Pointing Pair ──────────────────────────────────────────────────────────────
// Loose check: did idx's box hold a candidate confined to one row/column?

function hadPointingPair(grid: Grid, idx: number): boolean {
  const box = unitCells('box', idx)
  for (let v = 1; v <= 9; v++) {
    const cells = box.filter(i => grid[i] === 0 && getCandidates(grid, i).includes(v))
    if (cells.length < 2 || cells.length > 3) continue
    const sameRow = cells.every(i => rowOf(i) === rowOf(cells[0]))
    const sameCol = cells.every(i => colOf(i) === colOf(cells[0]))
    if (sameRow || sameCol) return true
  }
  return false
}

// ─── Box/Line Reduction ─────────────────────────────────────────────────────────
// Loose check: did idx's row or column hold a candidate confined to one box?

function hadBoxLineReduction(grid: Grid, idx: number): boolean {
  for (const line of [unitCells('row', idx), unitCells('col', idx)]) {
    for (let v = 1; v <= 9; v++) {
      const cells = line.filter(i => grid[i] === 0 && getCandidates(grid, i).includes(v))
      if (cells.length < 2 || cells.length > 3) continue
      if (cells.every(i => boxOf(i) === boxOf(cells[0]))) return true
    }
  }
  return false
}

// ─── X-Wing ─────────────────────────────────────────────────────────────────────
// Loose check: was idx's row or column one half of a matching X-Wing pair
// anywhere on the board?

function hadXWing(grid: Grid, idx: number): boolean {
  const r0 = rowOf(idx), c0 = colOf(idx)
  for (let v = 1; v <= 9; v++) {
    const rowCells = unitCells('row', idx).filter(i => grid[i] === 0 && getCandidates(grid, i).includes(v))
    if (rowCells.length === 2) {
      const cols = rowCells.map(colOf)
      for (let r2 = 0; r2 < 9; r2++) {
        if (r2 === r0) continue
        const other = Array.from({ length: 9 }, (_, c) => r2 * 9 + c)
          .filter(i => grid[i] === 0 && getCandidates(grid, i).includes(v))
        if (other.length === 2) {
          const cols2 = other.map(colOf)
          if (cols2.includes(cols[0]) && cols2.includes(cols[1])) return true
        }
      }
    }
    const colCells = unitCells('col', idx).filter(i => grid[i] === 0 && getCandidates(grid, i).includes(v))
    if (colCells.length === 2) {
      const rows = colCells.map(rowOf)
      for (let c2 = 0; c2 < 9; c2++) {
        if (c2 === c0) continue
        const other = Array.from({ length: 9 }, (_, r) => r * 9 + c2)
          .filter(i => grid[i] === 0 && getCandidates(grid, i).includes(v))
        if (other.length === 2) {
          const rows2 = other.map(rowOf)
          if (rows2.includes(rows[0]) && rows2.includes(rows[1])) return true
        }
      }
    }
  }
  return false
}

// ─── Y-Wing ─────────────────────────────────────────────────────────────────────
// Loose check: was idx itself a valid Y-Wing pivot before the move?

function hadYWing(grid: Grid, idx: number): boolean {
  const cands = getCandidates(grid, idx)
  if (cands.length !== 2) return false
  const [a, b] = cands
  const peersList: number[] = []
  for (let i = 0; i < 81; i++) {
    if (i === idx || grid[i] !== 0) continue
    if (!sees(i, idx)) continue
    if (getCandidates(grid, i).length === 2) peersList.push(i)
  }
  for (let m = 0; m < peersList.length; m++) {
    for (let n = m + 1; n < peersList.length; n++) {
      const c1 = getCandidates(grid, peersList[m])
      const c2 = getCandidates(grid, peersList[n])
      const in1 = c1.filter(v => v === a || v === b)
      const in2 = c2.filter(v => v === a || v === b)
      if (in1.length !== 1 || in2.length !== 1 || in1[0] === in2[0]) continue
      const out1 = c1.find(v => v !== a && v !== b)
      const out2 = c2.find(v => v !== a && v !== b)
      if (out1 !== undefined && out1 === out2) return true
    }
  }
  return false
}

// ─── Swordfish ──────────────────────────────────────────────────────────────────
// Loose check, anchored at idx's own row/column plus any two other rows/columns.

function hadSwordfish(grid: Grid, idx: number): boolean {
  const r0 = rowOf(idx), c0 = colOf(idx)
  for (let v = 1; v <= 9; v++) {
    const base = unitCells('row', idx).filter(i => grid[i] === 0 && getCandidates(grid, i).includes(v))
    if (base.length === 2 || base.length === 3) {
      const others = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(r => r !== r0)
      for (let x = 0; x < others.length - 1; x++) {
        for (let y = x + 1; y < others.length; y++) {
          const [rA, rB] = [others[x], others[y]]
          const cellsA = Array.from({ length: 9 }, (_, c) => rA * 9 + c).filter(i => grid[i] === 0 && getCandidates(grid, i).includes(v))
          const cellsB = Array.from({ length: 9 }, (_, c) => rB * 9 + c).filter(i => grid[i] === 0 && getCandidates(grid, i).includes(v))
          if (cellsA.length < 2 || cellsA.length > 3) continue
          if (cellsB.length < 2 || cellsB.length > 3) continue
          const cols = new Set([...base, ...cellsA, ...cellsB].map(colOf))
          if (cols.size === 3) return true
        }
      }
    }
    const baseCol = unitCells('col', idx).filter(i => grid[i] === 0 && getCandidates(grid, i).includes(v))
    if (baseCol.length === 2 || baseCol.length === 3) {
      const others = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(c => c !== c0)
      for (let x = 0; x < others.length - 1; x++) {
        for (let y = x + 1; y < others.length; y++) {
          const [cA, cB] = [others[x], others[y]]
          const cellsA = Array.from({ length: 9 }, (_, r) => r * 9 + cA).filter(i => grid[i] === 0 && getCandidates(grid, i).includes(v))
          const cellsB = Array.from({ length: 9 }, (_, r) => r * 9 + cB).filter(i => grid[i] === 0 && getCandidates(grid, i).includes(v))
          if (cellsA.length < 2 || cellsA.length > 3) continue
          if (cellsB.length < 2 || cellsB.length > 3) continue
          const rows = new Set([...baseCol, ...cellsA, ...cellsB].map(rowOf))
          if (rows.size === 3) return true
        }
      }
    }
  }
  return false
}

