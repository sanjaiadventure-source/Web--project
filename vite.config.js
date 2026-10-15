import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // EXPERIMENT 2b: Code splitting for route-level components & vendor chunk separation
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          'vendor-icons': ['lucide-react'],
          'vendor-axios': ['axios']
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  // EXPERIMENT 1f: Jest & React Testing Library compatibility runner configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false
  }
})
