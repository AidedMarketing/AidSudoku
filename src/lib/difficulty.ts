import type { Difficulty } from '../types'

export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard', 'expert']

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Expert',
}

export const DIFFICULTY_BLURB: Record<Difficulty, string> = {
  easy:   '36+ clues — simpler deduction chains',
  medium: '27–35 clues — mixed techniques needed',
  hard:   '22–26 clues — advanced logic required',
  expert: '17–21 clues — minimal givens, maximum depth',
}

/** The tier above this one, or null at the top. */
export function nextTier(d: Difficulty): Difficulty | null {
  const i = DIFFICULTIES.indexOf(d)
  return i >= 0 && i < DIFFICULTIES.length - 1 ? DIFFICULTIES[i + 1] : null
}
