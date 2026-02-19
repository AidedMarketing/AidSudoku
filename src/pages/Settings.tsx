import { useSettingsStore } from '../store/settingsStore'

interface ToggleRowProps {
  label: string
  description?: string
  value: boolean
  onChange: (v: boolean) => void
}

function ToggleRow({ label, description, value, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={value}
        className={`w-12 h-6 rounded-full transition-colors ${value ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'}`}
        onClick={() => onChange(!value)}
      >
        <span
          className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${value ? 'translate-x-6' : 'translate-x-0'}`}
        />
      </button>
    </div>
  )
}

export function Settings() {
  const settings = useSettingsStore()

  return (
    <div className="px-5 pt-10 pb-28 min-h-screen bg-white dark:bg-[#121212]">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      <section className="mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Appearance</p>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl px-4">
          <ToggleRow
            label="Dark Mode"
            value={settings.isDarkMode}
            onChange={settings.setDarkMode}
          />
        </div>
      </section>

      <section className="mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Gameplay</p>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl px-4">
          <ToggleRow
            label="Show Timer"
            value={settings.showTimer}
            onChange={settings.setShowTimer}
          />
          <ToggleRow
            label="Highlight Errors"
            description="Show conflicts in red"
            value={settings.showErrors}
            onChange={settings.setShowErrors}
          />
          <ToggleRow
            label="Auto-remove Notes"
            description="Clear candidates when a number is placed"
            value={settings.autoRemoveNotes}
            onChange={settings.setAutoRemoveNotes}
          />
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Feedback</p>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl px-4">
          <ToggleRow
            label="Sound Effects"
            value={settings.soundEnabled}
            onChange={settings.setSoundEnabled}
          />
        </div>
      </section>
    </div>
  )
}
