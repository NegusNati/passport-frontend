import { useQuery } from '@tanstack/react-query'

import { getJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import { PublicAdvertisementResponse } from '../schemas/public-advertisement'

export async function fetchAdByPlacement(placement: string) {
  try {
    const data = await getJSON<unknown>(API_ENDPOINTS.V1.ADVERTISEMENTS.BY_PLACEMENT, {
      placement,
    })
    const parsed = PublicAdvertisementResponse.safeParse(data)

    if (!parsed.success) {
      console.error('Failed to parse advertisement response:', parsed.error)
      return null
    }

    return parsed.data.data
  } catch (error) {
    console.error('Error fetching advertisement:', error)
    return null
  }
}

export function useAdQuery(placement: string, enabled = true) {
  return useQuery({
    queryKey: ['advertisements', 'placement', placement],
    queryFn: () => fetchAdByPlacement(placement),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled,
  })
}
