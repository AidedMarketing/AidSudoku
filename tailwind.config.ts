import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#6AAD64',
        'accent-dim': '#4f8a4a',
        error: '#E57373',
        hint: '#5B9BD5',
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI',
          'Roboto', 'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config
