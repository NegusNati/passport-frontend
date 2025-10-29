import type { Metric } from 'web-vitals'

import { analytics } from '@/shared/lib/analytics'

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    const sendToAnalytics = (metric: Metric) => {
      // Send to PostHog for real-user monitoring
      analytics.capture('web_vitals_reported', {
        'metric-name': metric.name,
        'metric-value': metric.value,
        'metric-rating': metric.rating,
        'metric-delta': metric.delta,
        'metric-id': metric.id,
        'navigation-type': metric.navigationType,
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
