import { BottomSheet } from './BottomSheet'
import { Button } from './Button'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  body: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
}

/** A two-choice sheet for actions that lose something (abandoning a puzzle). The safe choice is always the second, quieter button. */
export function ConfirmSheet({ open, onClose, title, body, confirmLabel, cancelLabel = 'Cancel', onConfirm }: Props) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <p className="text-sm text-ink-2 mb-5 text-center">{body}</p>
      <div className="flex flex-col gap-3">
        <Button size="lg" className="w-full" onClick={onConfirm}>{confirmLabel}</Button>
        <Button variant="secondary" size="lg" className="w-full" onClick={onClose}>{cancelLabel}</Button>
      </div>
    </BottomSheet>
  )
}
