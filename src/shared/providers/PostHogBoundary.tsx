import { type ReactNode, useEffect, useState } from 'react'

import { analytics } from '@/shared/lib/analytics'

type PostHogModule = typeof import('posthog-js/react')

interface PostHogBoundaryProps {
  enabled: boolean
  apiKey: string
  options: Record<string, unknown>
  children: ReactNode
}

/**
 * Defer a callback using requestIdleCallback (with setTimeout fallback)
 * This ensures analytics doesn't compete with critical rendering
 */
function deferToIdle(callback: () => void, timeout = 3000): () => void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout })
    return () => window.cancelIdleCallback(id)
  } else if (typeof window !== 'undefined') {
    const id = setTimeout(callback, timeout)
    return () => clearTimeout(id)
  }
  // SSR fallback - just don't run
  return () => {}
}

export function PostHogBoundary({ enabled, apiKey, options, children }: PostHogBoundaryProps) {
  const [Provider, setProvider] = useState<PostHogModule['PostHogProvider'] | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    let cancelled = false

    // Defer PostHog loading to idle time to not compete with LCP
    const cleanup = deferToIdle(() => {
      if (cancelled) return

      void import('posthog-js/react')
        .then((mod) => {
          if (cancelled) return

          const PostHogProvider = mod.PostHogProvider
          if (!PostHogProvider) return

          setProvider(() => PostHogProvider)
        })
        .catch((error) => {
          if (import.meta.env.DEV) {
            console.warn('[PostHog] Failed to load PostHogProvider lazily:', error)
          }
        })
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      analytics.initialize(null)
    }
  }, [enabled])

  if (!enabled || !Provider) {
    return <>{children}</>
  }

  return (
    <Provider apiKey={apiKey} options={options}>
      {children}
    </Provider>
  )
}
