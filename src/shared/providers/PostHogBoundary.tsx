import { type ReactNode, useEffect, useState } from 'react'

import { analytics } from '@/shared/lib/analytics'

type PostHogModule = typeof import('posthog-js/react')

interface PostHogBoundaryProps {
  enabled: boolean
  apiKey: string
  options: Record<string, unknown>
  children: ReactNode
}

export function PostHogBoundary({ enabled, apiKey, options, children }: PostHogBoundaryProps) {
  const [Provider, setProvider] = useState<PostHogModule['PostHogProvider'] | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    let cancelled = false

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

    return () => {
      cancelled = true
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
