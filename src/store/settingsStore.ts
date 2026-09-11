import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  isDarkMode: boolean
  /** Turns every glass surface into solid paper — for readability or older devices. */
  reduceTransparency: boolean
  showTimer: boolean
  showErrors: boolean
  autoRemoveNotes: boolean
  soundEnabled: boolean
  dailyBadgeEnabled: boolean
  isPremium: boolean  // future monetisation gate

  setDarkMode: (v: boolean) => void
  setReduceTransparency: (v: boolean) => void
  setShowTimer: (v: boolean) => void
  setShowErrors: (v: boolean) => void
  setAutoRemoveNotes: (v: boolean) => void
  setSoundEnabled: (v: boolean) => void
  setDailyBadgeEnabled: (v: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      reduceTransparency: false,
      showTimer: true,
      showErrors: true,
      autoRemoveNotes: true,
      soundEnabled: false,
      dailyBadgeEnabled: true,
      isPremium: false,

      setDarkMode: v => set({ isDarkMode: v }),
      setReduceTransparency: v => set({ reduceTransparency: v }),
      setShowTimer: v => set({ showTimer: v }),
      setShowErrors: v => set({ showErrors: v }),
      setAutoRemoveNotes: v => set({ autoRemoveNotes: v }),
      setSoundEnabled: v => set({ soundEnabled: v }),
      setDailyBadgeEnabled: v => set({ dailyBadgeEnabled: v }),
    }),
    { name: 'aidsudoku-settings' },
  ),
)
