// Thin page wrapper — reads :technique from URL params and renders the lesson.

import { useParams } from 'react-router-dom'
import { TechniqueDetail } from '../components/learn/TechniqueDetail'
import type { TechniqueName } from '../types'
import { ALL_TECHNIQUES } from '../types'

export function Lesson() {
  const { technique } = useParams<{ technique: string }>()

  if (!technique || !ALL_TECHNIQUES.includes(technique as TechniqueName)) {
    return (
      <div className="px-5 pt-10 text-gray-400 dark:text-gray-500 text-sm">
        Technique not found.
      </div>
    )
  }

  return <TechniqueDetail technique={technique as TechniqueName} />
}
