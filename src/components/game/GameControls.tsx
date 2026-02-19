import { useGame } from '../../hooks/useGame'

interface ControlBtn {
  label: string
  icon: string
  action: () => void
  active?: boolean
}

export function GameControls() {
  const {
    handleUndo, handleErase, handleHint,
    toggleNotesMode, isNotesMode,
  } = useGame()

  const controls: ControlBtn[] = [
    { label: 'Undo',  icon: '↩',  action: handleUndo },
    { label: 'Erase', icon: '⌫',  action: handleErase },
    { label: 'Notes', icon: '✏️', action: toggleNotesMode, active: isNotesMode },
    { label: 'Hint',  icon: '💡', action: handleHint },
  ]

  return (
    <div className="flex justify-around w-full max-w-[min(92vw,400px)] mx-auto py-1">
      {controls.map(c => (
        <button
          key={c.label}
          onClick={c.action}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors select-none ${
            c.active
              ? 'bg-accent text-white'
              : 'text-gray-500 dark:text-gray-400 active:bg-gray-100 dark:active:bg-gray-800'
          }`}
        >
          <span className="text-2xl leading-none">{c.icon}</span>
          <span className="text-[10px] font-medium">{c.label}</span>
        </button>
      ))}
    </div>
  )
}
