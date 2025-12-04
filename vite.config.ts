import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig, type PluginOption } from 'vite'

type CriticalCssOptions = {
  preload?: 'none' | 'js' | 'css' | 'media' | 'swap' | string
  pruneSource?: boolean
  reduceInlineStyles?: boolean
  logLevel?: 'info' | 'warn' | 'error' | 'silent'
  path?: string
  publicPath?: string
}

type CriticalCssConstructor = new (options: CriticalCssOptions) => {
  process(html: string): Promise<string>
}

async function loadCriticalCssPlugin(): Promise<PluginOption | null> {
  // Allow explicit disable via env var
  if (process.env.VITE_DISABLE_CRITICAL_CSS === 'true') {
    return null
  }

  // Enable by default in production builds (no env var needed)
  // This improves FCP by inlining above-the-fold CSS
  try {
    const BeastiesClass = await resolveCriticalCssConstructor()
    if (!BeastiesClass) {
      throw new Error('No critical CSS inliner (beasties) is installed')
    }

    return {
      name: 'passport-critical-css',
      enforce: 'post',
      apply: 'build',
      // Use writeBundle (runs after files are written to disk)
      // instead of generateBundle (runs before files exist on disk)
      async writeBundle(options) {
        const outDir = options.dir || 'dist'
        const htmlPath = resolve(outDir, 'index.html')

        if (!existsSync(htmlPath)) {
          console.warn('[critical-css] index.html not found in', outDir)
          return
        }

        const beasties = new BeastiesClass({
          preload: 'swap',
          pruneSource: false,
          reduceInlineStyles: false,
          logLevel: 'info',
          path: outDir,
          publicPath: '/',
        })

        try {
          const html = readFileSync(htmlPath, 'utf-8')
          const inlined = await beasties.process(html)
          writeFileSync(htmlPath, inlined)
          console.log('[critical-css] Inlined above-the-fold CSS into index.html')
        } catch (error) {
          console.warn(`[critical-css] Failed to inline: ${(error as Error).message}`)
        }
      },
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const reason = (error as Error)?.message ?? 'unknown error'
      console.warn(
        `[perf] Critical CSS inlining skipped (${reason}). Install "beasties" to enable.`,
      )
    }
    return null
  }
}

async function resolveCriticalCssConstructor(): Promise<CriticalCssConstructor | null> {
  try {
    const mod = (await import('beasties')) as
      | CriticalCssConstructor
      | { default?: CriticalCssConstructor }
    const ctor = typeof mod === 'function' ? mod : mod.default
    if (typeof ctor === 'function') {
      return ctor
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production' && process.env.PERF_DEBUG === 'true') {
      console.info(`[perf] Critical CSS inliner missing: ${(error as Error).message}`)
    }
  }

  return null
}

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const plugins: PluginOption[] = [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ]

  const criticalCssPlugin = await loadCriticalCssPlugin()
  if (criticalCssPlugin) {
    plugins.push(criticalCssPlugin)
  }

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
