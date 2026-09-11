import type { Config } from 'tailwindcss'

/** Token colors are RGB channel triplets defined in src/index.css (light on :root, dark on .dark),
 *  wrapped so Tailwind's alpha modifier works: bg-aha/20, border-line/60, text-ink/70. */
const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Grounds and text
        paper: token('paper'),
        'paper-2': token('paper-2'),
        ink: token('ink'),
        'ink-2': token('ink-2'),
        'ink-3': token('ink-3'),
        line: token('line'),

        // Meaning: gold = insight earned, teal = guidance given
        aha: token('aha'),
        'aha-ink': token('aha-ink'),
        guide: token('guide'),
        'guide-ink': token('guide-ink'),

        // Semantic, never competing with the accent
        hint: token('hint'),
        signal: token('signal'),

        // The board is the one surface that stays crisp and opaque
        board: token('board'),
        'board-line': token('board-line'),
        'board-box': token('board-box'),

        // Legacy aliases so every screen keeps building during the overhaul — removed in the final sweep
        accent: token('aha'),
        'accent-dim': token('aha-ink'),
        error: token('signal'),
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', '"SF Pro Display"', '-apple-system', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans Variable"', '"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: 'var(--glass-shadow)',
        glow: '0 8px 22px var(--aha-glow)',
        board: '0 14px 34px rgb(22 24 29 / 0.14)',
      },
    },
  },
  plugins: [],
} satisfies Config
