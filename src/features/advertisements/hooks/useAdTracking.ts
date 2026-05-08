import { useCallback, useMemo, useRef } from 'react'

import { trackClick } from '../api/track-click'
import { trackImpression } from '../api/track-impression'

type TrackingOptions = {
  impressionUrl?: string
  clickUrl?: string
}

function getAdSessionId() {
  if (typeof window === 'undefined') return undefined

  const key = 'passport:ad-session-id'
  const next =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`

  try {
    const current = window.localStorage.getItem(key)

    if (current) return current

    window.localStorage.setItem(key, next)
  } catch {
    return next
  }

  return next
}

function readViewport(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  return window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop'
}

export function useAdTracking(
  adId: number | undefined,
  placement: string,
  options: TrackingOptions = {},
) {
  const impressionTracked = useRef(false)
  const impressionTimer = useRef<number | null>(null)

  const basePayload = useMemo(
    () => ({
      session_id: getAdSessionId(),
      pathname: typeof window !== 'undefined' ? window.location.pathname : undefined,
      viewport: readViewport(),
      language: typeof document !== 'undefined' ? document.documentElement.lang : undefined,
    }),
    [],
  )

  const impressionRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node) {
        if (impressionTimer.current !== null) {
          window.clearTimeout(impressionTimer.current)
          impressionTimer.current = null
        }
        return
      }

      if (!adId || impressionTracked.current) return

      if (typeof IntersectionObserver === 'undefined') {
        impressionTracked.current = true
        void trackImpression(
          { ...basePayload, ad_id: adId, placement, slot_code: placement },
          options.impressionUrl,
        )
        return
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (impressionTimer.current !== null) return

            impressionTimer.current = window.setTimeout(() => {
              impressionTracked.current = true
              observer.disconnect()
              void trackImpression(
                { ...basePayload, ad_id: adId, placement, slot_code: placement },
                options.impressionUrl,
              )
            }, 1000)
            return
          }

          if (impressionTimer.current !== null) {
            window.clearTimeout(impressionTimer.current)
            impressionTimer.current = null
          }
        },
        { threshold: [0, 0.5, 1] },
      )

      observer.observe(node)
    },
    [adId, basePayload, options.impressionUrl, placement],
  )

  // Track click handler
  const handleClick = useCallback(() => {
    if (adId) {
      trackClick({ ...basePayload, ad_id: adId, placement, slot_code: placement }, options.clickUrl)
    }
  }, [adId, basePayload, options.clickUrl, placement])

  return { handleClick, impressionRef }
}
