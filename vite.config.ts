import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig, type PluginOption } from 'vite'

type CrittersOptions = {
  preload?: 'none' | 'js' | 'css' | 'media' | 'swap' | string
  pruneSource?: boolean
  reduceInlineStyles?: boolean
  logLevel?: 'info' | 'warn' | 'error' | 'silent'
}

type CrittersConstructor = new (options: CrittersOptions) => {
  process(html: string): Promise<string>
}

async function loadCriticalCssPlugin(): Promise<PluginOption | null> {
  if (process.env.VITE_DISABLE_CRITICAL_CSS === 'true') {
    return null
  }

  try {
    const CrittersClass = await resolveCriticalCssConstructor()
    if (!CrittersClass) {
      throw new Error('No critical CSS inliner (beasties/critters) is installed')
    }

    return {
      name: 'passport-critical-css',
      enforce: 'post',
      apply: 'build',
      async generateBundle(_, bundle) {
        const critters = new CrittersClass({
          preload: 'swap',
          pruneSource: false,
          reduceInlineStyles: false,
          logLevel: 'info',
        })

        await Promise.all(
          Object.values(bundle).map(async (asset) => {
            if (asset.type !== 'asset') return
            if (typeof asset.source !== 'string') return
            if (!asset.fileName.endsWith('.html')) return

            const inlined = await critters.process(asset.source)
            asset.source = inlined
          }),
        )
      },
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const reason = (error as Error)?.message ?? 'unknown error'
      console.warn(
        `[perf] Critical CSS inlining skipped (${reason}). Install "beasties" (or "critters") to enable.`,
      )
    }
    return null
  }
}

async function resolveCriticalCssConstructor(): Promise<CrittersConstructor | null> {
  const candidates = ['beasties', 'critters'] as const

  for (const name of candidates) {
    try {
      const mod = (await import(name)) as CrittersConstructor | { default?: CrittersConstructor }
      const ctor = typeof mod === 'function' ? mod : mod.default
      if (typeof ctor === 'function') {
        return ctor
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production' && process.env.PERF_DEBUG === 'true') {
        console.info(
          `[perf] Critical CSS inliner "${name}" not available: ${(err as Error).message}`,
        )
      }
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
    server: {
      port: 3000,
      host: true,
      proxy: {
        // Use app.localhost for API in dev, api.passport.et in prod
        '/api': {
          target:
            process.env.NODE_ENV === 'production'
              ? 'http://api.passport.et'
              : 'http://app.localhost',
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
