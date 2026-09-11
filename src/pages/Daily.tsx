// Today's puzzle — same puzzle for the whole day, difficulty grows with the player's
// own history. Fully local: no backend, no leaderboard. Launch logic lives in useDailyLaunch.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../components/ui/PageShell'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ConfirmSheet } from '../components/ui/ConfirmSheet'
import { SparkIcon, CheckIcon } from '../components/ui/icons'
import { useGameStore } from '../store/gameStore'
import { useStatsStore } from '../store/statsStore'
import { useDailyLaunch } from '../hooks/useDailyLaunch'
import { formatTime } from '../hooks/useTimer'
import { generatePuzzle } from '../lib/sudoku/generator'
import { DIFFICULTY_LABEL } from '../lib/difficulty'

export function Daily() {
  const navigate      = useNavigate()
  const daily         = useDailyLaunch()
  const startGame     = useGameStore(s => s.startGame)
  const gameStatus    = useGameStore(s => s.gameStatus)
  const history       = useStatsStore(s => s.history)
  const currentStreak = useStatsStore(s => s.currentStreak)

  const [practiceConfirm, setPracticeConfirm] = useState(false)
  const inProgress = gameStatus === 'playing' || gameStatus === 'paused'
  const dateLine = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  if (daily.state === 'loading' || !daily.puzzle) {
    return (
      <PageShell center>
        <p className="text-sm text-ink-3">Preparing today's puzzle…</p>
      </PageShell>
    )
  }

  const label = DIFFICULTY_LABEL[daily.puzzle.difficulty]

  // ── Solved ───────────────────────────────────────────────────────────────────
  if (daily.state === 'done') {
    const todayStr = new Date().toDateString()
    const record = [...history].reverse().find(
      r => r.difficulty === daily.completedDifficulty && r.date === todayStr,
    )
    const practiceTier = daily.completedDifficulty ?? daily.puzzle.difficulty

    function practice() {
      if (inProgress) { setPracticeConfirm(true); return }
      startGame(generatePuzzle(practiceTier))
      navigate('/game')
    }

    return (
      <PageShell>
        <header className="mb-6">
          <h1 className="font-display text-[28px] font-bold leading-none text-ink">Daily</h1>
          <p className="text-sm text-ink-3 mt-1.5">{dateLine}</p>
        </header>

        <Card variant="glass" className="text-center py-7">
          <span className="mx-auto w-14 h-14 rounded-full bg-aha grid place-items-center shadow-glow">
            <CheckIcon className="w-7 h-7 text-[#1A1200]" />
          </span>
          <h2 className="font-display text-xl font-bold text-ink mt-3">Solved</h2>
          {record && (
            <p className="text-[15px] font-semibold text-ink tabular mt-1">
              {formatTime(record.timeSeconds)} · {DIFFICULTY_LABEL[record.difficulty]} · <span className="text-aha-ink">{'★'.repeat(record.stars)}</span>
            </p>
          )}
          {currentStreak > 0 && (
            <p className="inline-flex items-center gap-1 text-sm font-semibold text-aha-ink tabular mt-2">
              <SparkIcon className="w-4 h-4 text-aha" />
              {currentStreak}-day streak
            </p>
          )}
          <p className="text-xs text-ink-3 mt-4">Next puzzle at midnight.</p>
        </Card>

        <div className="flex gap-3 mt-4">
          <Button variant="glass" size="lg" className="flex-1" onClick={() => navigate('/stats')}>Stats</Button>
          <Button variant="glass" size="lg" className="flex-1" onClick={practice}>Practice {DIFFICULTY_LABEL[practiceTier]}</Button>
        </div>

        <ConfirmSheet
          open={practiceConfirm}
          onClose={() => setPracticeConfirm(false)}
          title="Abandon current puzzle?"
          body="Your current puzzle will be lost. This can't be undone."
          confirmLabel={`Start ${DIFFICULTY_LABEL[practiceTier]}`}
          cancelLabel="Keep playing"
          onConfirm={() => { setPracticeConfirm(false); startGame(generatePuzzle(practiceTier)); navigate('/game') }}
        />
      </PageShell>
    )
  }

  // ── Not yet played / resume ──────────────────────────────────────────────────
  return (
    <PageShell center>
      <div className="w-full max-w-xs text-center">
        <h1 className="font-display text-[28px] font-bold leading-none text-ink">Today's Puzzle</h1>
        <p className="text-sm text-ink-2 mt-2">{label} · one puzzle a day</p>
        <p className="text-xs text-ink-3 mt-1">{dateLine}</p>
        <Button size="lg" className="w-full mt-6" onClick={daily.launch}>
          {daily.state === 'resume' ? 'Resume' : 'Start'}
        </Button>
      </div>

      <ConfirmSheet
        open={daily.confirmOpen}
        onClose={daily.closeConfirm}
        title="Abandon current puzzle?"
        body="Your current puzzle will be lost. This can't be undone."
        confirmLabel="Start today's puzzle"
        cancelLabel="Keep playing"
        onConfirm={daily.confirmAbandon}
      />
    </PageShell>
  )
}
