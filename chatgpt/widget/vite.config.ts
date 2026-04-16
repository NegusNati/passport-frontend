import { resolve } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, '../dist/widget'),
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, './src/main.tsx'),
      formats: ['es'],
      fileName: () => 'passport-widget.js',
      cssFileName: 'passport-widget',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
