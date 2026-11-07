import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' makes the built site work from any path, including GitHub Pages project URLs
export default defineConfig({ base: './', plugins: [react(), tailwindcss()] })
