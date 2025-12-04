import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig, type PluginOption } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const plugins: PluginOption[] = [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ]

  // Note: Critical CSS inlining (beasties) is now handled in postbuild
  // after prerendering, so the CSS is extracted from the prerendered HTML

  return {
    plugins,
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || 'dev'),
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined

            // Core React vendor - keep minimal
            if (
              id.includes('/node_modules/react/') ||
              id.includes('/node_modules/react-dom/') ||
              id.includes('/node_modules/scheduler/')
            ) {
              return 'react-vendor'
            }

            // Large ecosystem libraries
            if (id.includes('posthog-js')) return 'analytics'
            if (id.includes('sonner')) return 'ui-feedback'
            if (id.includes('lucide-react')) return 'icons'
            if (id.includes('@tanstack')) return 'tanstack'
            if (id.includes('zod')) return 'validation'
            if (id.includes('framer-motion')) return 'animation'

            // Let Vite handle the rest automatically
            return undefined
          },
        },
      },
    },
    server: {
      port: 3000,
      host: true,
      proxy: {
        // Use app.localhost for API in dev, api.passport.et in prod
        '/api': {
          target:
            process.env.NODE_ENV === 'production'
              ? 'http://api.passport.et'
              : 'http://api.passport.et',
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
  }
})
