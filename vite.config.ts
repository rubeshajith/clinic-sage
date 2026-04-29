import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      manifest: {
        name: 'Clinic Sage',
        short_name: 'ClinicSage',
        theme_color: '#1B3A2E',
        background_color: '#F4F7F4',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      injectManifest: {
        swSrc: 'src/sw.ts',
        swDest: 'dist/sw.js'
      }
    })
  ]
})
