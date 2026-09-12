import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// SignBridge AI frontend build config.
// VITE_API_BASE_URL (see .env.example) configures where the real
// ISL recognition / text-to-sign / auth backend lives. Nothing about
// the build itself needs to change when that backend is connected.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  }
})
