import type { TechniqueName } from '../../types'
import { TECHNIQUE_LABELS } from '../../types'
import { usePassportStore } from '../../store/passportStore'
import { SectionLabel } from '../ui/SectionLabel'
import { Chip } from '../ui/Chip'

interface Props {
  techniques: TechniqueName[]
}

export function TechniqueBreakdown({ techniques }: Props) {
  const passport = usePassportStore(s => s.passport)

  if (techniques.length === 0) {
    return <p className="text-sm text-ink-3 text-center">No techniques detected in this solve.</p>
  }

  return (
    <div>
      <SectionLabel>Techniques used</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {techniques.map(t => (
          <Chip key={t} status={passport[t].status}>{TECHNIQUE_LABELS[t]}</Chip>
        ))}
      </div>
    </div>
  )
}
