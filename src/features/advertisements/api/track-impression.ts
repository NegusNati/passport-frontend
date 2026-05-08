import { postJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'
import { env } from '@/shared/lib/env'

import type { ImpressionPayload } from '../schemas/public-advertisement'

function resolveTrackingUrl(endpoint?: string) {
  const url = endpoint || API_ENDPOINTS.V1.ADVERTISEMENTS.IMPRESSION
  if (/^https?:\/\//.test(url)) return url
  return `${env.API_BASE_URL.replace(/\/$/, '')}${url}`
}

function sendBeaconPayload(url: string, payload: ImpressionPayload) {
  if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') {
    return false
  }

  const body = new Blob([JSON.stringify(payload)], { type: 'application/json' })
  return navigator.sendBeacon(url, body)
}

export async function trackImpression(payload: ImpressionPayload, endpoint?: string) {
  try {
    const url = resolveTrackingUrl(endpoint)

    if (sendBeaconPayload(url, payload)) {
      return
    }

    if (endpoint) {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      })
      return
    }

    await postJSON(API_ENDPOINTS.V1.ADVERTISEMENTS.IMPRESSION, payload)
  } catch (error) {
    console.error('Failed to track impression:', error)
    // Don't throw - impressions are fire-and-forget
  }
}
