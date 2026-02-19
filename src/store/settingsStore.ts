import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  isDarkMode: boolean
  showTimer: boolean
  showErrors: boolean
  autoRemoveNotes: boolean
  soundEnabled: boolean
  isPremium: boolean  // future monetisation gate

  setDarkMode: (v: boolean) => void
  setShowTimer: (v: boolean) => void
  setShowErrors: (v: boolean) => void
  setAutoRemoveNotes: (v: boolean) => void
  setSoundEnabled: (v: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      showTimer: true,
      showErrors: true,
      autoRemoveNotes: true,
      soundEnabled: false,
      isPremium: false,

      setDarkMode: v => set({ isDarkMode: v }),
      setShowTimer: v => set({ showTimer: v }),
      setShowErrors: v => set({ showErrors: v }),
      setAutoRemoveNotes: v => set({ autoRemoveNotes: v }),
      setSoundEnabled: v => set({ soundEnabled: v }),
    }),
    { name: 'aidsudoku-settings' },
  ),
)
