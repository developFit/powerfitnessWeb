import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite sin proxy. Las llamadas a la API deben usar la URL
// especificada en `VITE_API_BASE_URL`.
export default defineConfig(({ mode }) => {
  loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()]
  }
})
