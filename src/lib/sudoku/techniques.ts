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

// ─── Naked Triples ─────────────────────────────────────────────────────────
// Three cells whose combined candidates use only three numbers total (each
// cell may hold 2 or 3 of them — not every cell needs all three).

export function findNakedTriple(grid: Grid): TechniqueStep | null {
  for (const unit of UNITS) {
    const emptyCells = unit.filter(i => grid[i] === 0)
    const eligible = emptyCells.filter(i => {
      const n = getCandidates(grid, i).length
      return n === 2 || n === 3
    })
    for (let a = 0; a < eligible.length - 2; a++) {
      for (let b = a + 1; b < eligible.length - 1; b++) {
        for (let c = b + 1; c < eligible.length; c++) {
          const idxA = eligible[a], idxB = eligible[b], idxC = eligible[c]
          const ca = getCandidates(grid, idxA)
          const cb = getCandidates(grid, idxB)
          const cc = getCandidates(grid, idxC)
          const union = Array.from(new Set([...ca, ...cb, ...cc])).sort((x, y) => x - y)
          if (union.length !== 3) continue

          const tripleCells = [idxA, idxB, idxC]
          let changed = false
          for (const cell of emptyCells) {
            if (tripleCells.includes(cell)) continue
            if (getCandidates(grid, cell).some(v => union.includes(v))) { changed = true; break }
          }
          if (!changed) continue

          return {
            technique: 'naked_triples',
            cellIndex: idxA,
            value: 0,
            explanation: `Cells r${rowOf(idxA) + 1}c${colOf(idxA) + 1}, r${rowOf(idxB) + 1}c${colOf(idxB) + 1}, and r${rowOf(idxC) + 1}c${colOf(idxC) + 1} form a Naked Triple on {${union.join(',')}}. No other cell in ${unitLabel(unit)} can contain ${union.join(', ')}.`,
            highlightCells: [...tripleCells, ...unit.filter(i => grid[i] === 0 && !tripleCells.includes(i))],
            patternCells: tripleCells,
          }
        }
      }
    }
  }
  return null
}

// ─── Hidden Triples ────────────────────────────────────────────────────────
// Three numbers confined, between them, to exactly three cells in a unit.

export function findHiddenTriple(grid: Grid): TechniqueStep | null {
  for (const unit of UNITS) {
    const emptyCells = unit.filter(i => grid[i] === 0)
    if (emptyCells.length < 3) continue
    for (let v1 = 1; v1 <= 7; v1++) {
      for (let v2 = v1 + 1; v2 <= 8; v2++) {
        for (let v3 = v2 + 1; v3 <= 9; v3++) {
          const cellsFor = (v: number) => emptyCells.filter(i => getCandidates(grid, i).includes(v))
          const c1 = cellsFor(v1), c2 = cellsFor(v2), c3 = cellsFor(v3)
          if (c1.length === 0 || c1.length > 3) continue
          if (c2.length === 0 || c2.length > 3) continue
          if (c3.length === 0 || c3.length > 3) continue

          const tripleCells = Array.from(new Set([...c1, ...c2, ...c3])).sort((a, b) => a - b)
          if (tripleCells.length !== 3) continue

          const isHidden = tripleCells.some(i =>
            getCandidates(grid, i).some(v => v !== v1 && v !== v2 && v !== v3)
          )
          if (!isHidden) continue

          const [idxA, idxB, idxC] = tripleCells
          return {
            technique: 'hidden_triples',
            cellIndex: idxA,
            value: 0,
            explanation: `Only r${rowOf(idxA) + 1}c${colOf(idxA) + 1}, r${rowOf(idxB) + 1}c${colOf(idxB) + 1}, and r${rowOf(idxC) + 1}c${colOf(idxC) + 1} in ${unitLabel(unit)} can contain ${v1}, ${v2}, or ${v3}. This Hidden Triple eliminates all other candidates from those three cells.`,
            highlightCells: tripleCells,
            patternCells: tripleCells,
          }
        }
      }
    }
  }
  return null
}

// ─── Pointing Pairs (/ Triples) ────────────────────────────────────────────
// A candidate confined within a box to a single row or column can be
// eliminated from the rest of that row/column outside the box.

export function findPointingPair(grid: Grid): TechniqueStep | null {
  for (let b = 0; b < 9; b++) {
    const box = UNITS[18 + b]
    for (let value = 1; value <= 9; value++) {
      const cellsInBox = box.filter(i => grid[i] === 0 && getCandidates(grid, i).includes(value))
      if (cellsInBox.length < 2 || cellsInBox.length > 3) continue

      const sameRow = cellsInBox.every(i => rowOf(i) === rowOf(cellsInBox[0]))
      const sameCol = cellsInBox.every(i => colOf(i) === colOf(cellsInBox[0]))
      if (!sameRow && !sameCol) continue

      const lineUnit = sameRow
        ? UNITS[rowOf(cellsInBox[0])]
        : UNITS[9 + colOf(cellsInBox[0])]

      const outsideCells = lineUnit.filter(i =>
        boxOf(i) !== b && grid[i] === 0 && getCandidates(grid, i).includes(value)
      )
      if (outsideCells.length === 0) continue

      return {
        technique: 'pointing_pairs',
        cellIndex: cellsInBox[0],
        value: 0,
        explanation: `In this box, ${value} only fits in ${unitLabel(lineUnit)} (${cellsInBox.map(i => `r${rowOf(i) + 1}c${colOf(i) + 1}`).join(', ')}). Since ${value} must go in this box somewhere on that line, it can be eliminated from the rest of ${unitLabel(lineUnit)} outside the box.`,
        highlightCells: [...cellsInBox, ...outsideCells],
        patternCells: cellsInBox,
      }
    }
  }
  return null
}

// ─── Box/Line Reduction ────────────────────────────────────────────────────
// The mirror of a Pointing Pair: a candidate confined within a row/column to
// a single box can be eliminated from the rest of that box.

export function findBoxLineReduction(grid: Grid): TechniqueStep | null {
  for (const line of UNITS.slice(0, 18)) { // rows (0-8) + cols (9-17), boxes excluded
    for (let value = 1; value <= 9; value++) {
      const cellsInLine = line.filter(i => grid[i] === 0 && getCandidates(grid, i).includes(value))
      if (cellsInLine.length < 2) continue

      const b = boxOf(cellsInLine[0])
      if (!cellsInLine.every(i => boxOf(i) === b)) continue

      const boxUnit = UNITS[18 + b]
      const outsideCells = boxUnit.filter(i =>
        !line.includes(i) && grid[i] === 0 && getCandidates(grid, i).includes(value)
      )
      if (outsideCells.length === 0) continue

      return {
        technique: 'box_line_reduction',
        cellIndex: cellsInLine[0],
        value: 0,
        explanation: `In ${unitLabel(line)}, ${value} only fits inside this box (${cellsInLine.map(i => `r${rowOf(i) + 1}c${colOf(i) + 1}`).join(', ')}). Since ${value} must go in this box somewhere on that line, it can be eliminated from the rest of the box outside ${unitLabel(line)}.`,
        highlightCells: [...cellsInLine, ...outsideCells],
        patternCells: cellsInLine,
      }
    }
  }
  return null
}

// ─── X-Wing ────────────────────────────────────────────────────────────────
// A candidate confined to the same two cells in each of two rows (or
// columns), aligned on the same two columns (or rows) — a rectangle where
// the candidate must occupy two diagonal corners.

export function findXWing(grid: Grid): TechniqueStep | null {
  for (let value = 1; value <= 9; value++) {
    // Row-based
    for (let r1 = 0; r1 < 9; r1++) {
      const cellsR1 = UNITS[r1].filter(i => grid[i] === 0 && getCandidates(grid, i).includes(value))
      if (cellsR1.length !== 2) continue
      for (let r2 = r1 + 1; r2 < 9; r2++) {
        const cellsR2 = UNITS[r2].filter(i => grid[i] === 0 && getCandidates(grid, i).includes(value))
        if (cellsR2.length !== 2) continue

        const cols1 = cellsR1.map(colOf).sort((a, b) => a - b)
        const cols2 = cellsR2.map(colOf).sort((a, b) => a - b)
        if (cols1[0] !== cols2[0] || cols1[1] !== cols2[1]) continue

        const patternCells = [...cellsR1, ...cellsR2]
        const outsideCells = [...UNITS[9 + cols1[0]], ...UNITS[9 + cols1[1]]].filter(i =>
          rowOf(i) !== r1 && rowOf(i) !== r2 && grid[i] === 0 && getCandidates(grid, i).includes(value)
        )
        if (outsideCells.length === 0) continue

        return {
          technique: 'x_wing',
          cellIndex: patternCells[0],
          value: 0,
          explanation: `${value} appears in exactly two cells in row ${r1 + 1} and row ${r2 + 1}, and both pairs sit in columns ${cols1[0] + 1} and ${cols1[1] + 1}. This X-Wing means ${value} can be eliminated from the rest of columns ${cols1[0] + 1} and ${cols1[1] + 1}.`,
          highlightCells: [...patternCells, ...outsideCells],
          patternCells,
        }
      }
    }

    // Column-based mirror
    for (let c1 = 0; c1 < 9; c1++) {
      const cellsC1 = UNITS[9 + c1].filter(i => grid[i] === 0 && getCandidates(grid, i).includes(value))
      if (cellsC1.length !== 2) continue
      for (let c2 = c1 + 1; c2 < 9; c2++) {
        const cellsC2 = UNITS[9 + c2].filter(i => grid[i] === 0 && getCandidates(grid, i).includes(value))
        if (cellsC2.length !== 2) continue

        const rows1 = cellsC1.map(rowOf).sort((a, b) => a - b)
        const rows2 = cellsC2.map(rowOf).sort((a, b) => a - b)
        if (rows1[0] !== rows2[0] || rows1[1] !== rows2[1]) continue

        const patternCells = [...cellsC1, ...cellsC2]
        const outsideCells = [...UNITS[rows1[0]], ...UNITS[rows1[1]]].filter(i =>
          colOf(i) !== c1 && colOf(i) !== c2 && grid[i] === 0 && getCandidates(grid, i).includes(value)
        )
        if (outsideCells.length === 0) continue

        return {
          technique: 'x_wing',
          cellIndex: patternCells[0],
          value: 0,
          explanation: `${value} appears in exactly two cells in column ${c1 + 1} and column ${c2 + 1}, and both pairs sit in rows ${rows1[0] + 1} and ${rows1[1] + 1}. This X-Wing means ${value} can be eliminated from the rest of rows ${rows1[0] + 1} and ${rows1[1] + 1}.`,
          highlightCells: [...patternCells, ...outsideCells],
          patternCells,
        }
      }
    }
  }
  return null
}

// ─── Y-Wing (XY-Wing) ──────────────────────────────────────────────────────
// A pivot cell with candidates {a,b} plus two pincer cells sharing a unit
// with the pivot, holding {a,c} and {b,c}. Any cell seeing both pincers
// cannot contain c. Strict 3-distinct-value form only (never XYZ-Wing).

function sees(i: number, j: number): boolean {
  return rowOf(i) === rowOf(j) || colOf(i) === colOf(j) || boxOf(i) === boxOf(j)
}

export function findYWing(grid: Grid): TechniqueStep | null {
  for (let pivot = 0; pivot < 81; pivot++) {
    if (grid[pivot] !== 0) continue
    const pivotCands = getCandidates(grid, pivot)
    if (pivotCands.length !== 2) continue
    const [a, b] = pivotCands

    const peersList: number[] = []
    for (let i = 0; i < 81; i++) {
      if (i === pivot || grid[i] !== 0) continue
      if (!sees(i, pivot)) continue
      if (getCandidates(grid, i).length !== 2) continue
      peersList.push(i)
    }

    for (let m = 0; m < peersList.length; m++) {
      for (let n = m + 1; n < peersList.length; n++) {
        const q1 = peersList[m], q2 = peersList[n]
        const c1 = getCandidates(grid, q1)
        const c2 = getCandidates(grid, q2)

        const inside1 = c1.filter(v => v === a || v === b)
        const inside2 = c2.filter(v => v === a || v === b)
        if (inside1.length !== 1 || inside2.length !== 1) continue
        if (inside1[0] === inside2[0]) continue

        const outside1 = c1.find(v => v !== a && v !== b)
        const outside2 = c2.find(v => v !== a && v !== b)
        if (outside1 === undefined || outside2 === undefined) continue
        if (outside1 !== outside2) continue

        const wingValue = outside1

        const eliminationCells: number[] = []
        for (let z = 0; z < 81; z++) {
          if (z === pivot || z === q1 || z === q2 || grid[z] !== 0) continue
          if (!sees(z, q1) || !sees(z, q2)) continue
          if (getCandidates(grid, z).includes(wingValue)) eliminationCells.push(z)
        }
        if (eliminationCells.length === 0) continue

        return {
          technique: 'y_wing',
          cellIndex: pivot,
          value: 0,
          explanation: `r${rowOf(pivot) + 1}c${colOf(pivot) + 1} is a Y-Wing pivot with candidates {${a},${b}}. r${rowOf(q1) + 1}c${colOf(q1) + 1} has {${c1.join(',')}} and r${rowOf(q2) + 1}c${colOf(q2) + 1} has {${c2.join(',')}} — both share ${wingValue}. Any cell that sees both of those cells cannot contain ${wingValue}.`,
          highlightCells: [pivot, q1, q2, ...eliminationCells],
          patternCells: [pivot, q1, q2],
        }
      }
    }
  }
  return null
}

// ─── Swordfish ─────────────────────────────────────────────────────────────
// X-Wing generalized to three rows/columns: a candidate confined to 2–3
// cells in each of three rows, all within the same three columns.

export function findSwordfish(grid: Grid): TechniqueStep | null {
  for (let value = 1; value <= 9; value++) {
    // Row-based
    const rowCandCells = Array.from({ length: 9 }, (_, r) =>
      UNITS[r].filter(i => grid[i] === 0 && getCandidates(grid, i).includes(value))
    )
    const candidateRows = [...Array(9).keys()].filter(r =>
      rowCandCells[r].length === 2 || rowCandCells[r].length === 3
    )
    for (let x = 0; x < candidateRows.length - 2; x++) {
      for (let y = x + 1; y < candidateRows.length - 1; y++) {
        for (let z = y + 1; z < candidateRows.length; z++) {
          const [r1, r2, r3] = [candidateRows[x], candidateRows[y], candidateRows[z]]
          const cells = [...rowCandCells[r1], ...rowCandCells[r2], ...rowCandCells[r3]]
          const cols = Array.from(new Set(cells.map(colOf))).sort((a, b) => a - b)
          if (cols.length !== 3) continue

          const outsideCells = [...UNITS[9 + cols[0]], ...UNITS[9 + cols[1]], ...UNITS[9 + cols[2]]].filter(i =>
            rowOf(i) !== r1 && rowOf(i) !== r2 && rowOf(i) !== r3 &&
            grid[i] === 0 && getCandidates(grid, i).includes(value)
          )
          if (outsideCells.length === 0) continue

          return {
            technique: 'swordfish',
            cellIndex: cells[0],
            value: 0,
            explanation: `${value} is confined to columns ${cols.map(c => c + 1).join(', ')} across rows ${r1 + 1}, ${r2 + 1}, and ${r3 + 1}. This Swordfish means ${value} can be eliminated from the rest of those columns.`,
            highlightCells: [...cells, ...outsideCells],
            patternCells: cells,
          }
        }
      }
    }

    // Column-based mirror
    const colCandCells = Array.from({ length: 9 }, (_, c) =>
      UNITS[9 + c].filter(i => grid[i] === 0 && getCandidates(grid, i).includes(value))
    )
    const candidateCols = [...Array(9).keys()].filter(c =>
      colCandCells[c].length === 2 || colCandCells[c].length === 3
    )
    for (let x = 0; x < candidateCols.length - 2; x++) {
      for (let y = x + 1; y < candidateCols.length - 1; y++) {
        for (let z = y + 1; z < candidateCols.length; z++) {
          const [c1, c2, c3] = [candidateCols[x], candidateCols[y], candidateCols[z]]
          const cells = [...colCandCells[c1], ...colCandCells[c2], ...colCandCells[c3]]
          const rows = Array.from(new Set(cells.map(rowOf))).sort((a, b) => a - b)
          if (rows.length !== 3) continue

          const outsideCells = [...UNITS[rows[0]], ...UNITS[rows[1]], ...UNITS[rows[2]]].filter(i =>
            colOf(i) !== c1 && colOf(i) !== c2 && colOf(i) !== c3 &&
            grid[i] === 0 && getCandidates(grid, i).includes(value)
          )
          if (outsideCells.length === 0) continue

          return {
            technique: 'swordfish',
            cellIndex: cells[0],
            value: 0,
            explanation: `${value} is confined to rows ${rows.map(r => r + 1).join(', ')} across columns ${c1 + 1}, ${c2 + 1}, and ${c3 + 1}. This Swordfish means ${value} can be eliminated from the rest of those rows.`,
            highlightCells: [...cells, ...outsideCells],
            patternCells: cells,
          }
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
    findNakedTriple(grid) ??
    findHiddenPairStep(grid) ??
    findHiddenTriple(grid) ??
    findPointingPair(grid) ??
    findBoxLineReduction(grid) ??
    findXWing(grid) ??
    findYWing(grid) ??
    findSwordfish(grid)
  )
}
