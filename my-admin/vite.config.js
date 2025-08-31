import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Frontend'te /api ile başlayan istekleri, backend'e yönlendir
      '/api': {
        target: 'http://localhost:3000', // Express.js adresin
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''), // /api önekini kaldır -> backend /projects görür
      },
    },
  },
})