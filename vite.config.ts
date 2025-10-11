import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({ autoCodeSplitting: true }), viteReact(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      // Use app.localhost for API in dev, api.passport.et in prod
      '/api': {
        target:
          process.env.NODE_ENV === 'production' ? 'http://api.passport.et' : 'http://app.localhost',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
