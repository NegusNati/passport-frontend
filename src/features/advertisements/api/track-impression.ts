import { postJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import type { ImpressionPayload } from '../schemas/public-advertisement'

export async function trackImpression(payload: ImpressionPayload) {
  try {
    await postJSON(API_ENDPOINTS.V1.ADVERTISEMENTS.IMPRESSION, payload)
  } catch (error) {
    console.error('Failed to track impression:', error)
    // Don't throw - impressions are fire-and-forget
  }
}
