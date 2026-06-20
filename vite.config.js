import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standalone static portfolio — no base path so it can be dropped on any host
// (GitHub Pages / Netlify / Vercel). Change `base` if deploying to a subpath.
export default defineConfig({
  plugins: [react()],
})
