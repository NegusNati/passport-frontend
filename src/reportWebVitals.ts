import type { Metric } from 'web-vitals'

import { analytics } from '@/shared/lib/analytics'

type NavigatorConnection = {
  effectiveType?: string
  type?: string
}

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    const sendToAnalytics = (metric: Metric) => {
      const connection =
        'connection' in navigator
          ? (navigator as Navigator & { connection?: NavigatorConnection }).connection
          : undefined
      const pagePath = window.location?.pathname ?? ''
      const pageSearch = window.location?.search ?? ''
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const deviceClass =
        viewportWidth < 640 ? 'mobile' : viewportWidth < 1024 ? 'tablet' : 'desktop'
      const connectionType = connection?.effectiveType ?? connection?.type ?? 'unknown'

      // Send to PostHog for real-user monitoring
      analytics.capture('web_vitals_reported', {
        'metric-name': metric.name,
        'metric-value': metric.value,
        'metric-rating': metric.rating,
        'metric-delta': metric.delta,
        'metric-id': metric.id,
        'navigation-type': metric.navigationType,
        'page-path': pagePath,
        'page-search': pageSearch || null,
        'viewport-width': viewportWidth,
        'viewport-height': viewportHeight,
        'device-class': deviceClass,
        'connection-type': connectionType,
      })

      // Also call user-provided callback if present (e.g., console.log in dev)
      if (onPerfEntry && onPerfEntry instanceof Function) {
        onPerfEntry(metric)
      }
    }

    onCLS(sendToAnalytics)
    onINP(sendToAnalytics)
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  })
}

export default reportWebVitals
