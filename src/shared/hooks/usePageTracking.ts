import { useRouter } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

import { useAnalytics } from '@/shared/lib/analytics'

/**
 * Hook to track page views automatically
 * Add this to your root route or app shell component
 */
export function usePageTracking() {
  const router = useRouter()
  const { capturePageview } = useAnalytics()
  const previousPathRef = useRef<string>('')

  useEffect(() => {
    // Track initial page load if not already tracked
    const currentPath = router.state.location.pathname

    if (previousPathRef.current !== currentPath) {
      const searchParams = formatSearchParams(router.state.location.search || {})

      capturePageview(currentPath, {
        'search-params': searchParams,
        referrer: document.referrer || 'direct',
      })

      previousPathRef.current = currentPath
    }

    // Subscribe to route changes
    const unsubscribe = router.subscribe('onLoad', ({ toLocation }) => {
      const routePath = toLocation.pathname

      // Only track if path actually changed
      if (previousPathRef.current !== routePath) {
        const searchParamsFormatted = formatSearchParams(toLocation.search || {})

        capturePageview(routePath, {
          'search-params': searchParamsFormatted,
          'from-route': previousPathRef.current || 'direct',
        })

        previousPathRef.current = routePath
      }
    })

    return () => {
      unsubscribe()
    }
  }, [router, capturePageview])
}

/**
 * Format search parameters for analytics tracking
 * Includes ALL parameters for comprehensive analytics
 * Note: Only auth tokens/keys are excluded for security
 */
function formatSearchParams(searchParams: Record<string, unknown>): string {
  const securityKeys = ['token', 'key', 'secret', 'auth', 'session', 'bearer']

  const formatted: Record<string, string> = {}

  Object.entries(searchParams).forEach(([key, value]) => {
    const keyLower = key.toLowerCase()
    const isSecurityToken = securityKeys.some((token) => keyLower.includes(token))

    if (isSecurityToken) {
      // Only mask actual security tokens, not user data
      formatted[key] = '[SECURITY_TOKEN]'
    } else {
      // Include all user data (passport numbers, phone, etc.)
      formatted[key] = String(value)
    }
  })

  // Return as query string format
  const params = new URLSearchParams(formatted)
  return params.toString()
}
