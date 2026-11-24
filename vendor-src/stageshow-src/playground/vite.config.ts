import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2022',
    outDir: '../../../site/demos/stageshow-demo',
    emptyOutDir: true,
  },
  resolve: { dedupe: ['react', 'react-dom'] },
})
