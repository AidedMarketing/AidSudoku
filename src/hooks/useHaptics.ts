// Thin abstraction over Capacitor Haptics for Phase 5.
// On web, this is a no-op. Capacitor is not installed yet in Phase 1.

import { useSettingsStore } from '../store/settingsStore'

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

export function useHaptics() {
  const soundEnabled = useSettingsStore(s => s.soundEnabled)

  function vibrate(style: HapticStyle) {
    // Web fallback — navigator.vibrate is limited but available on Android Chrome
    if (!soundEnabled || !navigator.vibrate) return
    const patterns: Record<HapticStyle, number | number[]> = {
      light:   [10],
      medium:  [20],
      heavy:   [40],
      success: [10, 50, 10],
      warning: [30, 30, 30],
      error:   [50, 30, 50],
    }
    navigator.vibrate(patterns[style])
  }

  return { vibrate }
}
