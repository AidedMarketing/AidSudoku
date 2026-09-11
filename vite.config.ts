import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // GitHub Pages serves project sites under /<repo>/, not the domain root.
  // Set unconditionally so local dev/preview exercise the same paths that ship.
  base: '/AidSudoku/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg'],
      manifest: {
        name: 'AidSudoku',
        short_name: 'AidSudoku',
        description: 'The Sudoku app that makes you better.',
        theme_color: '#6AAD64',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        // scope / start_url intentionally omitted — vite-plugin-pwa derives both from `base`
        icons: [
          {
            src: 'icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Cache all assets — Sudoku works fully offline after first load
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
