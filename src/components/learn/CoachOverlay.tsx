// In-game Coach mode panel.
// Displays the next logical step with explanation and highlighted cells.
// Pure display component — parent computes the step.

import { motion, AnimatePresence } from 'framer-motion'
import type { TechniqueStep } from '../../lib/sudoku/techniques'
import { TECHNIQUE_LABELS } from '../../types'

interface Props {
  step: TechniqueStep | null
  onApply: () => void
}

export function CoachOverlay({ step, onApply }: Props) {
  const isPairStep = step && step.value === 0
  const label = step ? TECHNIQUE_LABELS[step.technique] : null

  return (
    <AnimatePresence>
      <motion.div
        key="coach-overlay"
        className="w-full max-w-[min(92vw,400px)] mx-auto bg-[#6AAD64]/10 dark:bg-[#6AAD64]/15 border border-[#6AAD64]/40 rounded-2xl px-4 py-3 flex flex-col gap-2"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        {step ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6AAD64] uppercase tracking-wide">
                Coach · {label}
              </span>
              {!isPairStep && (
                <button
                  className="text-xs text-[#6AAD64] font-semibold active:opacity-60"
                  onClick={onApply}
                >
                  Apply →
                </button>
              )}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
              {step.explanation}
            </p>
            {isPairStep && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                This pattern removes candidates — then look for the next naked or hidden single.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No more logical steps found — try the Hint button or think deeper.
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
