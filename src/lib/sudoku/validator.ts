import { rowOf, colOf, boxOf } from './generator'

/** True if placing `num` at `idx` in `board` doesn't conflict with any given/existing value */
export function isCellValid(board: string, idx: number, num: number): boolean {
  const r = rowOf(idx), c = colOf(idx), b = boxOf(idx)
  for (let i = 0; i < 81; i++) {
    if (i === idx) continue
    const v = Number(board[i])
    if (v !== num) continue
    if (rowOf(i) === r || colOf(i) === c || boxOf(i) === b) return false
  }
  return true
}

/** True if the board matches the known solution at every filled cell */
export function isBoardCorrect(board: string, solution: string): boolean {
  for (let i = 0; i < 81; i++) {
    if (board[i] !== '0' && board[i] !== solution[i]) return false
  }
  return true
}

/** True if every cell is filled and the board is a valid complete solution */
export function isBoardComplete(board: string): boolean {
  if (board.includes('0')) return false
  for (let i = 0; i < 81; i++) {
    const num = Number(board[i])
    for (let j = 0; j < 81; j++) {
      if (i === j) continue
      if (Number(board[j]) !== num) continue
      if (rowOf(j) === rowOf(i) || colOf(j) === colOf(i) || boxOf(j) === boxOf(i)) return false
    }
  }
  return true
}

/** Returns the set of cell indices that are in conflict with index `idx` */
export function getConflicts(board: string, idx: number): Set<number> {
  const conflicts = new Set<number>()
  const num = Number(board[idx])
  if (num === 0) return conflicts

  const r = rowOf(idx), c = colOf(idx), b = boxOf(idx)
  for (let i = 0; i < 81; i++) {
    if (i === idx) continue
    if (Number(board[i]) !== num) continue
    if (rowOf(i) === r || colOf(i) === c || boxOf(i) === b) {
      conflicts.add(i)
    }
  }
  return conflicts
}
