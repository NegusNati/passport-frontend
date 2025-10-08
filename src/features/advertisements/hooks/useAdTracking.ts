import { useCallback, useEffect, useRef } from 'react'

import { trackClick } from '../api/track-click'
import { trackImpression } from '../api/track-impression'

export function useAdTracking(adId: number | undefined, placement: string) {
  const impressionTracked = useRef(false)

  // Track impression on mount (once)
  useEffect(() => {
    if (adId && !impressionTracked.current) {
      impressionTracked.current = true
      trackImpression({ ad_id: adId, placement })
    }
  }, [adId, placement])

  // Track click handler
  const handleClick = useCallback(() => {
    if (adId) {
      trackClick({ ad_id: adId, placement })
    }
  }, [adId, placement])

  return { handleClick }
}
