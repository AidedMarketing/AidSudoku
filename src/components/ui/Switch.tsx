interface SwitchProps {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 shrink-0 rounded-full transition-colors ${checked ? 'bg-aha' : 'bg-line'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-paper-2 shadow-sm transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

interface ToggleRowProps {
  label: string
  description?: string
  value: boolean
  onChange: (v: boolean) => void
}

/** A labelled switch row for settings groups; rows divide with a hairline, the last one has none. */
export function ToggleRow({ label, description, value, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-line last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        {description && <p className="text-xs text-ink-3 mt-0.5">{description}</p>}
      </div>
      <Switch checked={value} onChange={onChange} label={label} />
    </div>
  )
}
