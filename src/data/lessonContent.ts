// Lesson content for all 11 techniques.
// Practice puzzles are generated at runtime at the appropriate difficulty,
// except X-Wing/Y-Wing/Swordfish which are too rare to reliably appear in a
// random puzzle — those use a curated practicePuzzle verified to require the
// technique (see scratchpad/find-advanced-puzzles.ts).

import type { TechniqueName, Difficulty, PuzzleData } from '../types'
import { ALL_TECHNIQUES } from '../types'

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
  /** Curated puzzle guaranteed to require this technique — used instead of a
   *  generated puzzle for techniques too rare to reliably appear at random. */
  practicePuzzle?: PuzzleData
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

  naked_triples: {
    technique: 'naked_triples',
    title: 'Naked Triples',
    tagline: 'Three cells, three candidates shared between them.',
    difficulty: 'hard',
    summary:
      'A Naked Triple is three cells in a unit whose candidates, combined, use only three numbers total — even if no single cell shows all three. Those three numbers must occupy those three cells, so they can be eliminated from every other cell in the unit.',
    keyPoints: [
      'Find three cells in the same row, column, or box that use only three numbers between them.',
      'Each cell can have two or three candidates — {2,5}, {2,9}, and {5,9} still form a Naked Triple on {2,5,9}.',
      'Eliminate those three numbers from every other cell in the shared unit — this often reveals a Naked or Hidden Single.',
    ],
    example: {
      description:
        'Three cells in this box share only the candidates 3, 5, and 7 between them. Neither number can appear anywhere else in the box, which leaves this cell as the only place for 4.',
      givenRow: [1, 2, 0, 6, 8, 0, 9, 0, 0],
      answerIdx: 8,
      answerValue: 4,
    },
  },
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

  hidden_triples: {
    technique: 'hidden_triples',
    title: 'Hidden Triples',
    tagline: 'Three numbers that can only live in three cells.',
    difficulty: 'hard',
    summary:
      'A Hidden Triple is when three numbers can only appear, between them, in three cells within a unit. Even if those cells have other candidates too, you can eliminate everything except the three triple values — narrowing them down often reveals a Naked Pair or Single.',
    keyPoints: [
      'Find three numbers that only appear as candidates in three cells within a row, column, or box.',
      'Those three cells form a Hidden Triple — strip every other candidate from them, keeping only the triple values.',
      'This frequently collapses into a Naked Pair or Single on a later pass.',
    ],
    example: {
      description:
        'Only three cells in this column can contain 2, 6, or 8. Every other candidate in those cells can be eliminated, which leaves this cell as 6.',
      givenRow: [0, 3, 0, 5, 0, 7, 9, 1, 4],
      answerIdx: 0,
      answerValue: 6,
    },
  },

  pointing_pairs: {
    technique: 'pointing_pairs',
    title: 'Pointing Pairs',
    tagline: 'When a candidate is trapped in one line inside a box.',
    difficulty: 'hard',
    summary:
      'A Pointing Pair (or Triple) is when a candidate inside a box only appears in cells that share a single row or column. Since that number must go somewhere in the box, it can be eliminated from the rest of that row or column outside the box.',
    keyPoints: [
      'Look inside a box for a candidate that only appears in one row or column of that box.',
      'That number must be placed somewhere in the box along that line, so it can\'t also appear elsewhere on the same line outside the box.',
      'Eliminate the candidate from the rest of the row or column beyond the box.',
    ],
    example: {
      description:
        'Within this box, 5 only appears as a candidate in one row. It must go in that box on that row, so 5 can be eliminated everywhere else in the row, isolating it to this cell.',
      givenRow: [2, 0, 4, 6, 8, 1, 9, 3, 0],
      answerIdx: 8,
      answerValue: 5,
    },
  },

  box_line_reduction: {
    technique: 'box_line_reduction',
    title: 'Box/Line Reduction',
    tagline: 'The mirror of Pointing Pairs — a line locks a box.',
    difficulty: 'hard',
    summary:
      'Box/Line Reduction is the reverse of a Pointing Pair: when a candidate in a row or column only appears within a single box, it must be placed somewhere in that box, so it can be eliminated from the rest of the box outside that row or column.',
    keyPoints: [
      'Look along a row or column for a candidate that only appears within one box.',
      'That number must be placed somewhere in the box on that line, so it can\'t also appear elsewhere in the box.',
      'Eliminate the candidate from the rest of the box outside the row or column.',
    ],
    example: {
      description:
        'In this row, 7 only appears as a candidate inside one box. It must go there, so 7 can be eliminated from the rest of that box, leaving this cell as 7.',
      givenRow: [3, 0, 5, 8, 2, 0, 1, 4, 0],
      answerIdx: 8,
      answerValue: 7,
    },
  },

  x_wing: {
    technique: 'x_wing',
    title: 'X-Wing',
    tagline: 'A candidate locked into a rectangle across two lines.',
    difficulty: 'expert',
    summary:
      'An X-Wing appears when a candidate is confined to exactly two cells in each of two rows, and those cells line up in the same two columns (or the mirror with columns and rows swapped). That forms a rectangle where the candidate must occupy two diagonal corners, so it can be eliminated from the rest of those two columns.',
    keyPoints: [
      'Find a candidate that appears in exactly two cells in each of two different rows.',
      'If those four cells line up in exactly two columns, you have an X-Wing.',
      'Eliminate the candidate from the rest of those two columns (outside the two rows) — the mirror works the same way with rows and columns swapped.',
    ],
    example: {
      description:
        '9 appears in exactly two cells in row 2 and row 7, and in both rows those cells sit in the same two columns. Wherever else 9 appears in those columns can be eliminated — including this cell, which resolves to 4.',
      givenRow: [6, 0, 3, 1, 0, 8, 2, 9, 0],
      answerIdx: 8,
      answerValue: 4,
    },
  },

  y_wing: {
    technique: 'y_wing',
    title: 'Y-Wing',
    tagline: 'Three two-candidate cells that trap a shared number.',
    difficulty: 'expert',
    summary:
      'A Y-Wing uses three cells that each hold exactly two candidates. A "pivot" cell with candidates {a,b} connects to two "pincer" cells — one with {a,c} and one with {b,c} — each sharing a unit with the pivot. Whichever of a or b the pivot turns out to be, one pincer will resolve to c, so any cell that sees both pincers can have c eliminated.',
    keyPoints: [
      'Find a pivot cell with exactly two candidates, {a,b}.',
      'Find two pincer cells, each sharing a row/column/box with the pivot, with candidates {a,c} and {b,c}.',
      'Any cell that sees both pincers can have candidate c eliminated, even though the pivot itself doesn\'t hold c.',
    ],
    example: {
      description:
        'The pivot cell has candidates {2,7}. One pincer has {2,5}, the other has {7,5} — both share 5. Any cell seeing both pincers loses 5 as a candidate, which resolves this cell to 3.',
      givenRow: [8, 1, 0, 6, 4, 9, 0, 2, 0],
      answerIdx: 8,
      answerValue: 3,
    },
  },

  swordfish: {
    technique: 'swordfish',
    title: 'Swordfish',
    tagline: 'X-Wing stretched across three lines instead of two.',
    difficulty: 'expert',
    summary:
      'A Swordfish generalizes the X-Wing to three rows (or columns): a candidate appears in two or three cells in each of three rows, and all those cells fall within the same three columns. The candidate must occupy three of those nine intersections, so it can be eliminated from the rest of the three columns.',
    keyPoints: [
      'Find a candidate confined to two or three cells in each of three different rows.',
      'If those cells all fall within the same three columns, you have a Swordfish.',
      'Eliminate the candidate from the rest of those three columns — the mirror works the same way with rows and columns swapped.',
    ],
    example: {
      description:
        '6 is confined to the same three columns across three separate rows. It can be eliminated from the rest of those columns, which resolves this cell to 8.',
      givenRow: [4, 0, 1, 9, 3, 0, 5, 0, 2],
      answerIdx: 7,
      answerValue: 8,
    },
  },
}

/** All techniques that currently have a lesson — drives Learn.tsx's list and
 *  SolveReport.tsx's "learn this technique" CTA. No longer a monetisation
 *  gate (personal app), just "has a lesson." */
export const FREE_TECHNIQUES: TechniqueName[] = ALL_TECHNIQUES.filter(t => LESSONS[t] !== null)
