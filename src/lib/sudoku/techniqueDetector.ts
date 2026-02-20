// After a player makes a valid move, analyse the board state diff
// to determine which Sudoku technique the move most likely represents.
// Fires named technique events consumed by useAhaMoment + passportStore.

import type { TechniqueName } from '../../types'
import { getCandidates } from './solver'
import { rowOf, colOf } from './generator'

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

