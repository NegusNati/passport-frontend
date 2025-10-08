import { api } from '@/api/client'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import { AdvertisementRequestCreateResponse } from '../schemas/advertisement-request'
import type { AdvertisementRequestCreatePayload } from '../schemas/create'

export async function submitAdvertisementRequest(payload: AdvertisementRequestCreatePayload) {
  const { file, ...data } = payload
  const form = new FormData()

  // Append text fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      form.append(key, String(value))
    }
  })

  // Append file if provided
  if (file) {
    form.append('file', file)
  }

  try {
    const response = await api.post(API_ENDPOINTS.V1.ADVERTISEMENT_REQUESTS.ROOT, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    // Parse and validate the response
    const parsed = AdvertisementRequestCreateResponse.safeParse(response.data)
    
    if (!parsed.success) {
      console.error('Response validation failed:', parsed.error)
      // Still return the data even if parsing fails, so the user sees success
      // The validation error is logged for debugging
      return response.data as { data: any }
    }
    
    return parsed.data
  } catch (error) {
    // Re-throw network/API errors
    throw error
  }
}
