import type { ReactNode } from 'react'
import { PageShell } from '../components/ui/PageShell'
import { SectionLabel } from '../components/ui/SectionLabel'
import { ToggleRow } from '../components/ui/Switch'
import { useSettingsStore } from '../store/settingsStore'

function Group({ children }: { children: ReactNode }) {
  return <div className="bg-paper-2 border border-line rounded-2xl px-4">{children}</div>
}

export function Settings() {
  const s = useSettingsStore()

  return (
    <PageShell>
      <h1 className="font-display text-[28px] font-bold leading-none text-ink mb-6">Settings</h1>

      <div className="flex flex-col gap-6">
        <section>
          <SectionLabel>Appearance</SectionLabel>
          <Group>
            <ToggleRow label="Dark Mode" value={s.isDarkMode} onChange={s.setDarkMode} />
            <ToggleRow
              label="Reduce Transparency"
              description="Turn the glass surfaces solid"
              value={s.reduceTransparency}
              onChange={s.setReduceTransparency}
            />
          </Group>
        </section>

        <section>
          <SectionLabel>Gameplay</SectionLabel>
          <Group>
            <ToggleRow label="Show Timer" value={s.showTimer} onChange={s.setShowTimer} />
            <ToggleRow
              label="Highlight Errors"
              description="Show conflicts in red"
              value={s.showErrors}
              onChange={s.setShowErrors}
            />
            <ToggleRow
              label="Auto-remove Notes"
              description="Clear candidates when a number is placed"
              value={s.autoRemoveNotes}
              onChange={s.setAutoRemoveNotes}
            />
          </Group>
        </section>

        <section>
          <SectionLabel>Daily Puzzle</SectionLabel>
          <Group>
            <ToggleRow
              label="Home Screen Badge"
              description="Show a reminder badge on the app icon when today's puzzle is unplayed"
              value={s.dailyBadgeEnabled}
              onChange={s.setDailyBadgeEnabled}
            />
          </Group>
        </section>

        <section>
          <SectionLabel>Feedback</SectionLabel>
          <Group>
            <ToggleRow label="Sound Effects" value={s.soundEnabled} onChange={s.setSoundEnabled} />
          </Group>
        </section>
      </div>
    </PageShell>
  )
}
