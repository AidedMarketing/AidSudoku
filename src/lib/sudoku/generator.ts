import type { Difficulty, PuzzleData } from '../../types'

type Grid = number[] // 81-element, 0 = empty

/** Same contract as Math.random: returns a float in [0, 1). */
export type RNG = () => number

// ─── Clue counts per difficulty ──────────────────────────────────────────────

const CLUE_RANGES: Record<Difficulty, [number, number]> = {
  easy:   [36, 46],
  medium: [27, 35],
  hard:   [22, 26],
  expert: [17, 21],
}

// ─── Seeded PRNG ───────────────────────────────────────────────────────────────

/** FNV-1a 32-bit string hash — deterministic seed derivation from a string. */
export function hashStringToSeed(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Small, fast, deterministic PRNG — same output sequence for a given seed. */
export function mulberry32(seed: number): RNG {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[], rng: RNG): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
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

/** Picks the empty cell with the fewest legal candidates (minimum-remaining-
 *  values heuristic) — prunes the search tree drastically vs. always picking
 *  the first empty cell, which matters a lot once few clues remain. Returns
 *  idx = -1 when the grid is fully solved, or candidates = [] at a dead end. */
function pickMostConstrainedCell(grid: Grid): { idx: number; candidates: number[] } {
  let idx = -1
  let best: number[] = []
  let minCount = 10
  for (let i = 0; i < 81; i++) {
    if (grid[i] !== 0) continue
    const candidates: number[] = []
    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(grid, i, num)) candidates.push(num)
    }
    if (candidates.length === 0) return { idx: i, candidates: [] } // dead end
    if (candidates.length < minCount) {
      minCount = candidates.length
      best = candidates
      idx = i
      if (minCount === 1) break
    }
  }
  return { idx, candidates: best }
}

function fillGrid(grid: Grid, rng: RNG): boolean {
  const { idx, candidates } = pickMostConstrainedCell(grid)
  if (idx === -1) return true

  for (const num of shuffle(candidates, rng)) {
    grid[idx] = num
    if (fillGrid(grid, rng)) return true
    grid[idx] = 0
  }
  return false
}

// ─── Unique-solution checker ──────────────────────────────────────────────────

function countSolutions(grid: Grid, limit = 2): number {
  const { idx, candidates } = pickMostConstrainedCell(grid)
  if (idx === -1) return 1
  if (candidates.length === 0) return 0

  let count = 0
  for (const num of candidates) {
    grid[idx] = num
    count += countSolutions(grid, limit)
    grid[idx] = 0
    if (count >= limit) return count
  }
  return count
}

// ─── Puzzle creation (remove clues symmetrically) ────────────────────────────

function createPuzzle(solution: Grid, difficulty: Difficulty, rng: RNG): Grid {
  const [minClues, maxClues] = CLUE_RANGES[difficulty]
  const targetClues = minClues + Math.floor(rng() * (maxClues - minClues + 1))
  const targetRemovals = 81 - targetClues

  const puzzle = [...solution]
  const positions = shuffle([...Array(81).keys()], rng)
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

export function generatePuzzle(difficulty: Difficulty, rng: RNG = Math.random): PuzzleData {
  const solution: Grid = new Array(81).fill(0)
  fillGrid(solution, rng)

  const puzzle = createPuzzle(solution, difficulty, rng)

  return {
    clues:      puzzle.map(n => n === 0 ? '0' : String(n)).join(''),
    solution:   solution.map(String).join(''),
    difficulty,
  }
}

/** Deterministic puzzle for a given local date (YYYY-MM-DD) + difficulty — same
 *  inputs always produce the same puzzle, so "today's puzzle" stays consistent.
 *  createPuzzle's single-pass greedy clue removal is a local search that
 *  plateaus above the nominal clue-count target at low counts (most notably
 *  'expert': it consistently lands around 23-27 clues rather than 17-21, a
 *  pre-existing trait of the algorithm itself — see PLAN.md discussion —
 *  normally invisible since ad-hoc games just silently regenerate). Rather
 *  than chase an effectively unreachable target, try a handful of derived
 *  seeds and keep the sparsest (hardest) result found — still fully
 *  deterministic for a given (dateStr, difficulty). */
export function generateDailyPuzzle(dateStr: string, difficulty: Difficulty): PuzzleData {
  const [minClues, maxClues] = CLUE_RANGES[difficulty]
  const ATTEMPTS = 5

  let best: PuzzleData | null = null
  let bestClueCount = 82
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    const candidate = generatePuzzle(difficulty, mulberry32(hashStringToSeed(`${dateStr}:${difficulty}:${attempt}`)))
    const clueCount = candidate.clues.split('').filter(ch => ch !== '0').length
    if (clueCount >= minClues && clueCount <= maxClues) return candidate
    if (clueCount < bestClueCount) {
      bestClueCount = clueCount
      best = candidate
    }
  }
  return best as PuzzleData
}

export function gridFromString(s: string): Grid {
  return s.split('').map(Number)
}

export { rowOf, colOf, boxOf, peers, isValidPlacement }
