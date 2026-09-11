// Full lesson page for a single technique.
// Shows explanation, key points, example diagram, and an interactive PracticeBoard.

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PracticeBoard } from './PracticeBoard'
import { PageShell } from '../ui/PageShell'
import { SectionLabel } from '../ui/SectionLabel'
import { Chip } from '../ui/Chip'
import { BackIcon, CheckIcon } from '../ui/icons'
import { LESSONS } from '../../data/lessonContent'
import { usePassportStore } from '../../store/passportStore'
import { useMotionSafe } from '../../lib/motion'
import { DIFFICULTY_LABEL } from '../../lib/difficulty'
import type { TechniqueName } from '../../types'
import { TECHNIQUE_LABELS } from '../../types'

interface Props {
  technique: TechniqueName
}

function BackToLearn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-0.5 -ml-2 px-2 py-2 mb-4 text-[15px] font-semibold text-ink-2 active:opacity-60"
      onClick={onClick}
    >
      <BackIcon className="w-5 h-5" /> Learn
    </button>
  )
}

export function TechniqueDetail({ technique }: Props) {
  const navigate        = useNavigate()
  const unlockTechnique = usePassportStore(s => s.unlockTechnique)
  const passport        = usePassportStore(s => s.passport)
  const lesson          = LESSONS[technique]
  const { reduced }     = useMotionSafe()

  if (!lesson) {
    return (
      <PageShell fullscreen>
        <BackToLearn onClick={() => navigate('/learn')} />
        <h1 className="font-display text-[28px] font-bold leading-none text-ink mb-2">{TECHNIQUE_LABELS[technique]}</h1>
        <p className="text-sm text-ink-3">Lesson coming soon in a future update.</p>
      </PageShell>
    )
  }

  const status = passport[technique].status

  function handleLessonComplete() {
    unlockTechnique(technique)
  }

  return (
    <PageShell fullscreen>
      <BackToLearn onClick={() => navigate('/learn')} />

      {/* Header */}
      <header className="mb-5">
        <div className="flex items-start justify-between gap-3">
          <h1 className="font-display text-[28px] font-bold leading-tight text-ink text-balance">{lesson.title}</h1>
          {status !== 'locked' && (
            <Chip status={status} className="shrink-0 mt-1">{status === 'mastered' ? 'Mastered' : 'Learned'}</Chip>
          )}
        </div>
        <p className="text-sm text-ink-2 mt-1.5">{lesson.tagline}</p>
      </header>

      {/* Summary — read closely, so solid paper, never glass */}
      <p className="text-[15px] text-ink-2 leading-relaxed mb-7">{lesson.summary}</p>

      {/* Key points */}
      <section className="mb-7">
        <SectionLabel>Key points</SectionLabel>
        <div className="flex flex-col gap-2">
          {lesson.keyPoints.map((point, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-3 bg-paper-2 border border-line rounded-2xl px-4 py-3"
              initial={reduced ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: reduced ? 0 : i * 0.05 }}
            >
              <span className="font-display text-aha-ink font-bold text-sm mt-px shrink-0 tabular">{i + 1}</span>
              <p className="text-sm text-ink-2 leading-snug">{point}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Example diagram */}
      <section className="mb-7">
        <SectionLabel>Example</SectionLabel>
        <div className="bg-paper-2 border border-line rounded-2xl px-4 py-4">
          <p className="text-sm text-ink-2 mb-4 leading-snug">{lesson.example.description}</p>
          <div className="flex justify-center gap-1">
            {lesson.example.givenRow.map((val, i) => {
              const isAnswer = i === lesson.example.answerIdx
              return (
                <div
                  key={i}
                  className={`w-8 h-8 grid place-items-center rounded-md text-sm font-semibold tabular border ${
                    isAnswer
                      ? 'bg-aha/20 border-aha text-aha-ink'
                      : val !== 0
                      ? 'bg-board border-board-line text-ink'
                      : 'bg-paper border-line text-transparent'
                  }`}
                >
                  {isAnswer ? lesson.example.answerValue : val !== 0 ? val : '·'}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Practice board */}
      <section>
        <SectionLabel
          aside={status === 'locked' ? (
            <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-guide-ink active:opacity-60" onClick={handleLessonComplete}>
              Mark as learned <CheckIcon className="w-3.5 h-3.5" />
            </button>
          ) : undefined}
        >
          Practice
        </SectionLabel>
        <p className="text-xs text-ink-3 mb-4">
          Apply the technique in this {DIFFICULTY_LABEL[lesson.difficulty]} puzzle. Use Coach hint if you get stuck.
        </p>
        <PracticeBoard
          technique={technique}
          difficulty={lesson.difficulty}
          practicePuzzle={lesson.practicePuzzle}
          onMastered={status === 'locked' ? handleLessonComplete : undefined}
        />
      </section>
    </PageShell>
  )
}
