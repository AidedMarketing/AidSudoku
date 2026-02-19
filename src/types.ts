export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type TechniqueName =
  | 'naked_singles'
  | 'hidden_singles'
  | 'naked_pairs'
  | 'naked_triples'
  | 'hidden_pairs'
  | 'hidden_triples'
  | 'pointing_pairs'
  | 'box_line_reduction'
  | 'x_wing'
  | 'y_wing'
  | 'swordfish'

export type PassportStatus = 'locked' | 'learned' | 'mastered'

export type GameStatus = 'idle' | 'playing' | 'won' | 'paused'

export interface PuzzleData {
  clues: string      // 81-char, '0' = empty
  solution: string   // 81-char, full answer
  difficulty: Difficulty
}

export interface SolveReportData {
  timeSeconds: number
  techniquesUsed: TechniqueName[]
  hintsUsed: number
  errorsMode: boolean
  stars: 1 | 2 | 3
  difficulty: Difficulty
}

export const TECHNIQUE_LABELS: Record<TechniqueName, string> = {
  naked_singles:    'Naked Singles',
  hidden_singles:   'Hidden Singles',
  naked_pairs:      'Naked Pairs',
  naked_triples:    'Naked Triples',
  hidden_pairs:     'Hidden Pairs',
  hidden_triples:   'Hidden Triples',
  pointing_pairs:   'Pointing Pairs',
  box_line_reduction: 'Box/Line Reduction',
  x_wing:           'X-Wing',
  y_wing:           'Y-Wing',
  swordfish:        'Swordfish',
}

export const ALL_TECHNIQUES: TechniqueName[] = [
  'naked_singles',
  'hidden_singles',
  'naked_pairs',
  'naked_triples',
  'hidden_pairs',
  'hidden_triples',
  'pointing_pairs',
  'box_line_reduction',
  'x_wing',
  'y_wing',
  'swordfish',
]
