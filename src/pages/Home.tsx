import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../components/ui/PageShell'
import { Card } from '../components/ui/Card'
import { Chip } from '../components/ui/Chip'
import { Button } from '../components/ui/Button'
import { SectionLabel } from '../components/ui/SectionLabel'
import { ConfirmSheet } from '../components/ui/ConfirmSheet'
import { SparkIcon, CheckIcon, ArrowRightIcon } from '../components/ui/icons'
import { useGameStore } from '../store/gameStore'
import { useStatsStore } from '../store/statsStore'
import { usePassportStore } from '../store/passportStore'
import { useDailyLaunch } from '../hooks/useDailyLaunch'
import { formatTime } from '../hooks/useTimer'
import { generatePuzzle } from '../lib/sudoku/generator'
import { DIFFICULTIES, DIFFICULTY_LABEL, nextTier } from '../lib/difficulty'
import { LESSONS } from '../data/lessonContent'
import { ALL_TECHNIQUES, TECHNIQUE_LABELS } from '../types'
import type { Difficulty } from '../types'

export function Home() {
  const navigate       = useNavigate()
  const startGame      = useGameStore(s => s.startGame)
  const gameStatus     = useGameStore(s => s.gameStatus)
  const currentStreak  = useStatsStore(s => s.currentStreak)
  const history        = useStatsStore(s => s.history)
  const getGamesPlayed = useStatsStore(s => s.getGamesPlayed)
  const passport       = usePassportStore(s => s.passport)
  const daily          = useDailyLaunch()

  const [pendingDifficulty, setPendingDifficulty] = useState<Difficulty | null>(null)
  const inProgress = gameStatus === 'playing' || gameStatus === 'paused'

  // ── Quick play (ad-hoc puzzles) ─────────────────────────────────────────────
  function tryStart(difficulty: Difficulty) {
    if (inProgress) { setPendingDifficulty(difficulty); return }
    startGame(generatePuzzle(difficulty))
    navigate('/game')
  }
  function confirmNewGame() {
    if (!pendingDifficulty) return
    const d = pendingDifficulty
    setPendingDifficulty(null)
    startGame(generatePuzzle(d))
    navigate('/game')
  }

  // ── Tonight ──────────────────────────────────────────────────────────────────
  const tier   = daily.puzzle?.difficulty
  const label  = tier ? DIFFICULTY_LABEL[tier] : ''
  const played = tier ? getGamesPlayed(tier) : 0
  const next   = tier ? nextTier(tier) : null
  const reason = !tier ? ''
    : next
      ? `Based on ${played} ${label} solve${played === 1 ? '' : 's'} · ${Math.min(getGamesPlayed(next), 5)}/5 ${DIFFICULTY_LABEL[next]} to move up`
      : `Based on ${played} ${label} solve${played === 1 ? '' : 's'} · top level`

  const todayStr = new Date().toDateString()
  const todayRecord = daily.state === 'done'
    ? [...history].reverse().find(r => r.date === todayStr && r.difficulty === daily.completedDifficulty)
    : undefined

  // ── Passport summary ─────────────────────────────────────────────────────────
  const mastered  = ALL_TECHNIQUES.filter(t => passport[t].status === 'mastered').length
  const learned   = ALL_TECHNIQUES.filter(t => passport[t].status !== 'locked').length
  const nextLesson = ALL_TECHNIQUES.find(t => passport[t].status === 'locked' && LESSONS[t] !== null) ?? null

  const dateLine = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <PageShell>
      {/* Wordmark */}
      <header className="mb-6">
        <h1 className="font-display text-[34px] font-extrabold leading-none tracking-[-0.03em] text-ink">
          Aid<span className="text-aha-ink">Sudoku</span>
        </h1>
        <p className="text-sm text-ink-3 mt-1.5">{dateLine}</p>
      </header>

      <div className="flex flex-col gap-4">
        {/* Tonight */}
        <Card variant="glass">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-ink">Tonight</h2>
            {currentStreak > 0 && (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-aha-ink tabular">
                <SparkIcon className="w-4 h-4 text-aha" />
                {currentStreak}-day streak
              </span>
            )}
          </div>

          {daily.state === 'loading' && (
            <p className="text-sm text-ink-3 mt-2">Preparing tonight's puzzle…</p>
          )}

          {(daily.state === 'start' || daily.state === 'resume') && (
            <>
              <p className="text-sm text-ink-2 mt-1">{label} · one puzzle a day</p>
              <p className="text-xs text-ink-3 mt-1">{reason}</p>
              <Button size="lg" className="w-full mt-4" onClick={daily.launch}>
                {daily.state === 'resume' ? "Resume tonight's puzzle" : "Start tonight's puzzle"}
              </Button>
            </>
          )}

          {daily.state === 'done' && (
            <>
              <div className="mt-3 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-aha grid place-items-center shadow-glow shrink-0">
                  <CheckIcon className="w-5 h-5 text-[#1A1200]" />
                </span>
                <div>
                  <p className="font-semibold text-ink">Solved</p>
                  <p className="text-xs text-ink-2 tabular">
                    {todayRecord
                      ? `${formatTime(todayRecord.timeSeconds)} · ${DIFFICULTY_LABEL[todayRecord.difficulty]} · ${'★'.repeat(todayRecord.stars)}`
                      : label}
                  </p>
                </div>
              </div>
              <p className="text-xs text-ink-3 mt-3">Come back tomorrow for a new puzzle.</p>
            </>
          )}
        </Card>

        {/* Some other game is mid-flight — don't let it get lost behind Tonight */}
        {daily.otherGameInProgress && (
          <Card variant="solid" onClick={() => navigate('/game')} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-ink">Puzzle in progress</p>
              <p className="text-xs text-ink-3">Tap to continue</p>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-ink-3" />
          </Card>
        )}

        {/* Quick play */}
        <div>
          <SectionLabel>Quick play</SectionLabel>
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map(d => (
              <Chip key={d} glass active={d === tier} onClick={() => tryStart(d)}>
                {DIFFICULTY_LABEL[d]}
              </Chip>
            ))}
          </div>
        </div>

        {/* Passport */}
        <Card variant="glass" onClick={() => navigate('/passport')} className="py-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Passport</h3>
            <span className="text-xs text-ink-3 tabular">{learned} of {ALL_TECHNIQUES.length} · {mastered} mastered</span>
          </div>
          <div className="flex gap-1.5 mt-3" aria-hidden="true">
            {ALL_TECHNIQUES.map(t => {
              const s = passport[t].status
              return <i key={t} className={`h-1.5 flex-1 rounded-full ${s === 'mastered' ? 'bg-aha' : s === 'learned' ? 'bg-guide' : 'bg-line'}`} />
            })}
          </div>
          {nextLesson ? (
            <p className="text-xs font-semibold text-guide-ink mt-3 inline-flex items-center gap-1">
              Next: {TECHNIQUE_LABELS[nextLesson]} <ArrowRightIcon className="w-3.5 h-3.5" />
            </p>
          ) : (
            <p className="text-xs text-ink-3 mt-3">Every technique learned.</p>
          )}
        </Card>
      </div>

      {/* Abandon confirmations */}
      <ConfirmSheet
        open={pendingDifficulty !== null}
        onClose={() => setPendingDifficulty(null)}
        title="Abandon current puzzle?"
        body="Your current puzzle will be lost. This can't be undone."
        confirmLabel={`Start ${pendingDifficulty ? DIFFICULTY_LABEL[pendingDifficulty] : ''}`}
        cancelLabel="Keep playing"
        onConfirm={confirmNewGame}
      />
      <ConfirmSheet
        open={daily.confirmOpen}
        onClose={daily.closeConfirm}
        title="Abandon current puzzle?"
        body="Your current puzzle will be lost. This can't be undone."
        confirmLabel="Start tonight's puzzle"
        cancelLabel="Keep playing"
        onConfirm={daily.confirmAbandon}
      />
    </PageShell>
  )
}
