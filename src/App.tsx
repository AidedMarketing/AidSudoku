import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { Tabs } from './components/ui/Tabs'
import { Home } from './pages/Home'
import { Game } from './pages/Game'
import { Daily } from './pages/Daily'
import { Passport } from './pages/Passport'
import { Stats } from './pages/Stats'
import { Learn } from './pages/Learn'
import { Lesson } from './pages/Lesson'
import { Settings } from './pages/Settings'
import { useSettingsStore } from './store/settingsStore'
import { useDailyStore } from './store/dailyStore'
import { useDailyBadge } from './hooks/useDailyBadge'

export default function App() {
  const isDarkMode = useSettingsStore(s => s.isDarkMode)

  // Sync dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  // Generate/cache today's puzzle as early as possible, before the user opens Daily
  useEffect(() => {
    useDailyStore.getState().ensureTodayPuzzle()
  }, [])

  useDailyBadge()

  return (
    <div className="max-w-md mx-auto relative min-h-screen">
      <Routes>
        {/* Full-screen pages — no tab bar */}
        <Route path="/game" element={<Game />} />
        <Route path="/learn/:technique" element={<Lesson />} />

        {/* Tab-bar pages */}
        <Route
          path="/*"
          element={
            <>
              <Routes>
                <Route path="/"         element={<Home />} />
                <Route path="/daily"    element={<Daily />} />
                <Route path="/passport" element={<Passport />} />
                <Route path="/learn"    element={<Learn />} />
                <Route path="/stats"    element={<Stats />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
              <Tabs />
            </>
          }
        />
      </Routes>
    </div>
  )
}
