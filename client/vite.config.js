import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3001,
    open: true,
    proxy: {
      '/api': {
        target: 'process.env.PORT || 3001',
        secure: false,
        changeOrigin: true
      }
    }
  }
})
