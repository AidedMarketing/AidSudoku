import { useGameStore } from '../store/gameStore'
import type { SolveReportData } from '../types'

export function useSolveReport(): SolveReportData | null {
  const gameStatus         = useGameStore(s => s.gameStatus)
  const timerSeconds       = useGameStore(s => s.timerSeconds)
  const techniquesDetected = useGameStore(s => s.techniquesDetected)
  const hintsUsed          = useGameStore(s => s.hintsUsed)
  const difficulty         = useGameStore(s => s.difficulty)

  if (gameStatus !== 'won') return null

  // Star rating: ⭐⭐⭐ = no hints + no errors out-of-range
  // For now score based on hints only (errors tracking added in Phase 2)
  const stars: 1 | 2 | 3 =
    hintsUsed === 0 ? 3 :
    hintsUsed <= 2  ? 2 : 1

  return {
    timeSeconds: timerSeconds,
    techniquesUsed: techniquesDetected,
    hintsUsed,
    errorsMode: true,
    stars,
    difficulty,
  }
}
