import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // This physically overwrites the variable with your exact backend string during the build process
    'import.meta.env.VITE_API_URL': JSON.stringify('hhttps://productify-zos97.sevalla.app')
  }
})
