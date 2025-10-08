import { useQuery } from '@tanstack/react-query'

import { getJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'
import { adminKeys } from '@/features/admin/lib/keys'

import { AdvertisementDetailResponse } from '../schemas/advertisement'

export async function fetchAdvertisement(id: number) {
  try {
    const data = await getJSON<unknown>(API_ENDPOINTS.V1.ADVERTISEMENTS.ADMIN_BY_ID(id))
    const parsed = AdvertisementDetailResponse.safeParse(data)

    if (!parsed.success) {
      console.error('Failed to parse advertisement detail response:', parsed.error)
      throw new Error('Failed to parse response from server')
    }

    return parsed.data.data
  } catch (error) {
    console.error('Error fetching advertisement:', error)
    throw error
  }
}

export function useAdvertisementQuery(id: number) {
  return useQuery({
    queryKey: adminKeys.advertisements.detail(id),
    queryFn: () => fetchAdvertisement(id),
    staleTime: 30_000,
  })
}
