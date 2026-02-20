// Full lesson page for a single technique.
// Shows explanation, key points, example diagram, and an interactive PracticeBoard.

import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PracticeBoard } from './PracticeBoard'
import { LESSONS } from '../../data/lessonContent'
import { usePassportStore } from '../../store/passportStore'
import type { TechniqueName } from '../../types'
import { TECHNIQUE_LABELS } from '../../types'

interface Props {
  technique: TechniqueName
}

export function TechniqueDetail({ technique }: Props) {
  const navigate       = useNavigate()
  const unlockTechnique = usePassportStore(s => s.unlockTechnique)
  const passport        = usePassportStore(s => s.passport)
  const lesson          = LESSONS[technique]

  if (!lesson) {
    return (
      <div className="px-5 pt-10 pb-28 min-h-screen bg-white dark:bg-[#121212]">
        <button
          className="text-sm text-gray-400 mb-6 active:opacity-60 -mx-2 px-2 py-2"
          onClick={() => navigate('/learn')}
        >
          ← Learn
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {TECHNIQUE_LABELS[technique]}
        </h1>
        <p className="text-sm text-gray-400">Lesson coming soon in a future update.</p>
      </div>
    )
  }

  const status = passport[technique].status

  function handleLessonComplete() {
    unlockTechnique(technique)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] pb-28">
      {/* Header */}
      <div className="px-5 pt-10 pb-4">
        <button
          className="text-sm text-gray-400 mb-5 active:opacity-60 block -mx-2 px-2 py-2"
          onClick={() => navigate('/learn')}
        >
          ← Learn
        </button>

        <div className="flex items-start justify-between gap-2 mb-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            {lesson.title}
          </h1>
          {status !== 'locked' && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 mt-1 capitalize ${
              status === 'mastered'
                ? 'bg-accent/15 text-accent'
                : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
            }`}>
              {status}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{lesson.tagline}</p>
      </div>

      {/* Summary */}
      <div className="px-5 mb-6">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {lesson.summary}
        </p>
      </div>

      {/* Key points */}
      <div className="px-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
          Key Points
        </h2>
        <div className="flex flex-col gap-2">
          {lesson.keyPoints.map((point, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <span className="text-accent font-bold text-sm mt-px shrink-0">{i + 1}.</span>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Example diagram */}
      <div className="px-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
          Example
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl px-4 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-snug">
            {lesson.example.description}
          </p>
          {/* Visual row diagram */}
          <div className="flex justify-center gap-1">
            {lesson.example.givenRow.map((val, i) => {
              const isAnswer = i === lesson.example.answerIdx
              return (
                <div
                  key={i}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-semibold border ${
                    isAnswer
                      ? 'bg-accent/20 border-accent text-accent'
                      : val !== 0
                      ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
                      : 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-transparent'
                  }`}
                >
                  {isAnswer ? lesson.example.answerValue : val !== 0 ? val : '·'}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Practice board */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
            Practice
          </h2>
          {status === 'locked' && (
            <button
              className="text-xs text-accent font-semibold active:opacity-60"
              onClick={handleLessonComplete}
            >
              Mark as learned ✓
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Apply the technique in this {lesson.difficulty} puzzle. Use "Coach hint" if you get stuck.
        </p>
        <PracticeBoard
          technique={technique}
          difficulty={lesson.difficulty}
          onMastered={status === 'locked' ? handleLessonComplete : undefined}
        />
      </div>
    </div>
  )
}
