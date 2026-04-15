import { lazy, Suspense, useEffect, useState } from 'react'

import type { CardSwapProps } from './CardSwap'
import { CardSwapShell } from './CardSwapShell'

// Lazy load the heavy GSAP-based CardSwap component
const CardSwap = lazy(() => import('./CardSwap'))

// Static placeholder that preserves the final stack geometry without animation
function CardSwapPlaceholder({
  children,
  width,
  height,
  cardDistance,
  verticalDistance,
  skewAmount,
}: CardSwapProps) {
  return (
    <CardSwapShell
      width={width}
      height={height}
      cardDistance={cardDistance}
      verticalDistance={verticalDistance}
      skewAmount={skewAmount}
    >
      {children}
    </CardSwapShell>
  )
}

/**
 * Lazy-loaded CardSwap wrapper that defers animation library loading
 * until after initial page render to improve FCP/LCP
 */
export function CardSwapLazy(props: CardSwapProps) {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // Defer loading GSAP and animations until browser is idle
    // This prevents blocking the critical rendering path
    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(
        () => {
          setShouldLoad(true)
        },
        { timeout: 1200 },
      )
      return () => cancelIdleCallback(handle)
    } else {
      // Fallback for browsers without requestIdleCallback (Safari)
      const timer = setTimeout(() => setShouldLoad(true), 900)
      return () => clearTimeout(timer)
    }
  }, [])

  // Keep the prerendered shell stable until the animated version is ready.
  if (!shouldLoad) {
    return <CardSwapPlaceholder {...props} />
  }

  return (
    <Suspense fallback={<CardSwapPlaceholder {...props} />}>
      <CardSwap {...props} />
    </Suspense>
  )
}

export default CardSwapLazy
