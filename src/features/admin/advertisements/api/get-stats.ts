import { useQuery } from '@tanstack/react-query'

import { adminKeys } from '@/features/admin/lib/keys'
import { getJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import { AdvertisementStatsResponse } from '../schemas/stats'

export async function fetchAdvertisementStats() {
  try {
    const data = await getJSON<unknown>(API_ENDPOINTS.V1.ADVERTISEMENTS.ADMIN_STATS)
    const parsed = AdvertisementStatsResponse.safeParse(data)

    if (!parsed.success) {
      console.error('Failed to parse advertisement stats response:', parsed.error)
      throw new Error('Failed to parse response from server')
    }

    return parsed.data.data
  } catch (error) {
    console.error('Error fetching advertisement stats:', error)
    throw error
  }
}

export function useAdvertisementStatsQuery() {
  return useQuery({
    queryKey: adminKeys.advertisements.stats(),
    queryFn: fetchAdvertisementStats,
    staleTime: 60_000, // 1 minute
  })
}
