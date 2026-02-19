// Phase 4 — this screen is a placeholder until Supabase is connected.
// Daily puzzle design: one Hard puzzle per day, upfront mode-selection (Plan §Phase 4).

export function Daily() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5 pb-28 bg-white dark:bg-[#121212]">
      <div className="text-center max-w-xs">
        <p className="text-4xl mb-4">📅</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Daily Puzzle
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Coming in Phase 4 — one Hard puzzle per day with a real-time leaderboard.
        </p>
      </div>
    </div>
  )
}
