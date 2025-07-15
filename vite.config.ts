import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite. Durante el desarrollo se configura un proxy que
// redirige las llamadas a "/api" al backend indicado en `VITE_API_BASE_URL`.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true
        }
      }
    }
  }
})
