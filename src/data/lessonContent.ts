// Lesson content for the first 4 free techniques.
// Practice puzzles are generated at runtime at the appropriate difficulty.

import type { TechniqueName, Difficulty } from '../types'

export interface LessonContent {
  technique: TechniqueName
  title: string
  tagline: string
  difficulty: Difficulty  // recommended puzzle difficulty for practice
  summary: string
  keyPoints: string[]
  example: {
    description: string
    // A 9-char row to illustrate the technique visually (0 = blank)
    // Row shown in the lesson diagram
    givenRow: number[]
    // The cell index within the row that is the answer, and the answer value
    answerIdx: number
    answerValue: number
  }
}

export const LESSONS: Record<TechniqueName, LessonContent | null> = {
  naked_singles: {
    technique: 'naked_singles',
    title: 'Naked Singles',
    tagline: 'The most fundamental technique — only one number can fit.',
    difficulty: 'easy',
    summary:
      'A Naked Single is when only one candidate is left for a cell. Every other number (1–9) is already present in the same row, column, or box. The answer is obvious once you see it.',
    keyPoints: [
      'Look for nearly-complete rows, columns, or boxes.',
      'When 8 of the 9 numbers are placed in a unit, the 9th is the Naked Single.',
      'Most easy puzzles can be solved entirely with Naked Singles.',
    ],
    example: {
      description:
        'In this row, the numbers 1–8 are placed. Only 9 is missing — that cell must be 9.',
      givenRow: [1, 2, 3, 4, 5, 6, 7, 8, 0],
      answerIdx: 8,
      answerValue: 9,
    },
  },

  hidden_singles: {
    technique: 'hidden_singles',
    title: 'Hidden Singles',
    tagline: 'Only one cell in the group can hold a specific number.',
    difficulty: 'easy',
    summary:
      'A Hidden Single is when a particular number can only go in one cell within a row, column, or box — even if that cell has multiple candidates. The number is "hidden" among other candidates.',
    keyPoints: [
      'Scan each row, column, and box for numbers that appear only once as a candidate.',
      'Even if a cell has 3 or 4 candidates, it might be the only place for a specific number.',
      'Hidden Singles often unlock cells that were too open for Naked Singles.',
    ],
    example: {
      description:
        'The number 7 can only appear in one cell in this row — all other empty cells already have 7 ruled out by their column or box.',
      givenRow: [0, 2, 3, 0, 5, 6, 0, 8, 0],
      answerIdx: 0,
      answerValue: 7,
    },
  },

  naked_pairs: {
    technique: 'naked_pairs',
    title: 'Naked Pairs',
    tagline: 'Two cells, two candidates — a powerful elimination tool.',
    difficulty: 'medium',
    summary:
      'A Naked Pair is when exactly two cells in a unit both contain exactly the same two candidates. Those two numbers must go in those two cells (in some order), so they can be safely removed from every other cell in that unit.',
    keyPoints: [
      'Find two cells in the same row, column, or box that each have exactly two candidates — and the same two candidates.',
      'Eliminate those two numbers from all other cells in the shared unit.',
      'This often triggers Naked or Hidden Singles in other cells.',
    ],
    example: {
      description:
        'Two cells in the same box both have candidates {3,7}. Neither 3 nor 7 can go anywhere else in that box.',
      givenRow: [1, 2, 0, 4, 5, 0, 8, 9, 6],
      answerIdx: 2,
      answerValue: 3,
    },
  },

  naked_triples: null,
  hidden_pairs: {
    technique: 'hidden_pairs',
    title: 'Hidden Pairs',
    tagline: 'Two numbers that can only live in two cells.',
    difficulty: 'medium',
    summary:
      'A Hidden Pair is when two numbers can only appear in exactly two cells within a unit. Even though those cells may have other candidates, you can eliminate all other candidates from them — only those two numbers belong there.',
    keyPoints: [
      'Find two numbers that, within a row, column, or box, only appear as candidates in two cells.',
      'Those two cells form a Hidden Pair — you can safely remove all other candidates from them.',
      'After elimination, the pair often becomes a Naked Pair, directly placing both values.',
    ],
    example: {
      description:
        'Only two cells in this column can contain 4 or 6. All other candidates in those cells can be eliminated.',
      givenRow: [0, 2, 3, 0, 5, 0, 7, 8, 0],
      answerIdx: 0,
      answerValue: 4,
    },
  },

  hidden_triples: null,
  pointing_pairs: null,
  box_line_reduction: null,
  x_wing: null,
  y_wing: null,
  swordfish: null,
}

/** The 4 free-tier techniques that have lessons in Phase 2 */
export const FREE_TECHNIQUES: TechniqueName[] = [
  'naked_singles',
  'hidden_singles',
  'naked_pairs',
  'hidden_pairs',
]
