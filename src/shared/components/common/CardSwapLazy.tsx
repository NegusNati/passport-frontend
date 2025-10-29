import { lazy, Suspense, useEffect, useState } from 'react'

import type { CardSwapProps } from './CardSwap'

// Lazy load the heavy GSAP-based CardSwap component
const CardSwap = lazy(() => import('./CardSwap'))

// Static placeholder that shows the first card without animation
function CardSwapPlaceholder({ children, width, height }: CardSwapProps) {
  const firstChild = Array.isArray(children) ? children[0] : children

  return (
    <div
      className="relative"
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {firstChild}
      </div>
    </div>
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
        { timeout: 2000 },
      )
      return () => cancelIdleCallback(handle)
    } else {
      // Fallback for browsers without requestIdleCallback (Safari)
      const timer = setTimeout(() => setShouldLoad(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  // Show static placeholder until we're ready to hydrate
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
