import { useMemo } from 'react'

/** How many of each digit are still to be placed on an 81-char board (9 minus placed). */
export function useDigitCounts(board: string): Record<number, number> {
  return useMemo(() => {
    const placed: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }
    for (const ch of board) {
      const n = Number(ch)
      if (n >= 1 && n <= 9) placed[n]++
    }
    const remaining: Record<number, number> = {}
    for (let n = 1; n <= 9; n++) remaining[n] = Math.max(0, 9 - placed[n])
    return remaining
  }, [board])
}
