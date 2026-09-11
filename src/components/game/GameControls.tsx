import type { ComponentType } from 'react'
import { useGame } from '../../hooks/useGame'
import { useGameStore } from '../../store/gameStore'
import { UndoIcon, EraseIcon, NotesIcon, HintIcon, CoachIcon } from '../ui/icons'

interface Control {
  label: string
  Icon: ComponentType<{ className?: string }>
  action: () => void
  active?: boolean
  /** Which meaning the active state carries: gold = your own mode, teal = guidance. */
  tone?: 'aha' | 'guide'
}

/** The floating control pill between the board and the keys. */
export function GameControls() {
  const {
    handleUndo, handleErase, handleHint,
    toggleNotesMode, isNotesMode,
  } = useGame()
  const coachMode       = useGameStore(s => s.coachMode)
  const toggleCoachMode = useGameStore(s => s.toggleCoachMode)

  const controls: Control[] = [
    { label: 'Undo',  Icon: UndoIcon,  action: handleUndo },
    { label: 'Erase', Icon: EraseIcon, action: handleErase },
    { label: 'Notes', Icon: NotesIcon, action: toggleNotesMode, active: isNotesMode, tone: 'aha' },
    { label: 'Hint',  Icon: HintIcon,  action: handleHint },
    { label: 'Coach', Icon: CoachIcon, action: toggleCoachMode, active: coachMode, tone: 'guide' },
  ]

  return (
    <div className="glass w-full max-w-[min(92vw,400px)] mx-auto h-[58px] rounded-full grid grid-cols-5 items-center px-1.5">
      {controls.map(({ label, Icon, action, active, tone }) => (
        <button
          key={label}
          type="button"
          onClick={action}
          aria-pressed={active}
          className={`h-[46px] mx-0.5 rounded-full flex flex-col items-center justify-center gap-0.5 select-none text-[10px] font-semibold transition-colors active:scale-95 ${
            active
              ? tone === 'guide' ? 'bg-guide/25 text-guide-ink' : 'bg-aha/25 text-ink'
              : 'text-ink-2'
          }`}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
