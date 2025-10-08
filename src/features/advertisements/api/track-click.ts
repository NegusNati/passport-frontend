import { postJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import type { ClickPayload } from '../schemas/public-advertisement'

export async function trackClick(payload: ClickPayload) {
  try {
    await postJSON(API_ENDPOINTS.V1.ADVERTISEMENTS.CLICK, payload)
  } catch (error) {
    console.error('Failed to track click:', error)
    // Don't throw - clicks are fire-and-forget
  }
}
