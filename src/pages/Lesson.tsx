// Thin page wrapper — reads :technique from URL params and renders the lesson.

import { useParams } from 'react-router-dom'
import { PageShell } from '../components/ui/PageShell'
import { TechniqueDetail } from '../components/learn/TechniqueDetail'
import type { TechniqueName } from '../types'
import { ALL_TECHNIQUES } from '../types'

export function Lesson() {
  const { technique } = useParams<{ technique: string }>()

  if (!technique || !ALL_TECHNIQUES.includes(technique as TechniqueName)) {
    return (
      <PageShell fullscreen center>
        <p className="text-sm text-ink-3">Technique not found.</p>
      </PageShell>
    )
  }

  return <TechniqueDetail technique={technique as TechniqueName} />
}
