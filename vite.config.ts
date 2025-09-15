import path from "path"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    proxy: {
      // Any request starting with /api will be proxied
      '/api': {
        target: 'https://irisapi.brainfogagency.com', // Your FastAPI backend URL
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Can be false if your backend is HTTP
        rewrite: (path) => path.replace(/^\/api/, '/api'), // This is often default, but good to be explicit
      },
    }
  }
})
