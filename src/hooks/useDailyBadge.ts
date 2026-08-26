// Syncs a reminder badge on the home-screen icon (iOS 16.4+ installed PWAs) when
// today's daily puzzle hasn't been solved yet. No backend, no permission prompt —
// silently no-ops wherever the Badging API isn't supported.

import { useEffect } from 'react'
import { useSettingsStore } from '../store/settingsStore'
import { useDailyStore } from '../store/dailyStore'

export function useDailyBadge() {
  const enabled = useSettingsStore(s => s.dailyBadgeEnabled)

  useEffect(() => {
    function sync() {
      if (!('setAppBadge' in navigator)) return

      if (!enabled) {
        navigator.clearAppBadge()
        return
      }

      useDailyStore.getState().ensureTodayPuzzle()
      if (useDailyStore.getState().completed) {
        navigator.clearAppBadge()
      } else {
        navigator.setAppBadge(1)
      }
    }

    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [enabled])
}
