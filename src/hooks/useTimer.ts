import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

/** Drives the in-game stopwatch. Pauses when the app is backgrounded. */
export function useTimer() {
  const tickTimer   = useGameStore(s => s.tickTimer)
  const pauseTimer  = useGameStore(s => s.pauseTimer)
  const resumeTimer = useGameStore(s => s.resumeTimer)
  const gameStatus  = useGameStore(s => s.gameStatus)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (gameStatus === 'playing') {
      intervalRef.current = setInterval(tickTimer, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [gameStatus, tickTimer])

  // Pause on visibility change (tab switch / phone lock)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) pauseTimer()
      else resumeTimer()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [pauseTimer, resumeTimer])
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
