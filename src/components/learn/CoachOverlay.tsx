// In-game Coach mode panel.
// Displays the next logical step with explanation and highlighted cells.
// Pure display component — parent computes the step and owns the AnimatePresence.

import { motion } from 'framer-motion'
import type { TechniqueStep } from '../../lib/sudoku/techniques'
import { TECHNIQUE_LABELS } from '../../types'
import { ArrowRightIcon } from '../ui/icons'

interface Props {
  step: TechniqueStep | null
  onApply: () => void
}

export function CoachOverlay({ step, onApply }: Props) {
  const isPairStep = step && step.value === 0
  const label = step ? TECHNIQUE_LABELS[step.technique] : null

  return (
    <motion.div
      key="coach-overlay"
      className="w-full max-w-[min(92vw,400px)] mx-auto bg-guide/10 border border-guide/30 rounded-2xl px-4 py-3 flex flex-col gap-1.5"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      {step ? (
        <>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-guide-ink">
              Coach · {label}
            </span>
            {!isPairStep && (
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold text-guide-ink active:opacity-60"
                onClick={onApply}
              >
                Apply <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-sm text-ink-2 leading-snug">{step.explanation}</p>
          {isPairStep && (
            <p className="text-xs text-ink-3">
              This pattern removes candidates — then look for the next naked or hidden single.
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-ink-2">
          No more logical steps found. Use Hint to place a number and continue.
        </p>
      )}
    </motion.div>
  )
}
