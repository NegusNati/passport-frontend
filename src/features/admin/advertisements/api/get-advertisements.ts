import { keepPreviousData, type QueryKey, useQuery } from '@tanstack/react-query'

import { adminKeys, hashParams } from '@/features/admin/lib/keys'
import { getJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import { AdvertisementListResponse } from '../schemas/advertisement'
import type { AdvertisementsSearch } from '../schemas/filters'

export async function fetchAdvertisements(params: Partial<AdvertisementsSearch>) {
  const cleanParams = {
    ...params,
    status: params.status === 'all' ? undefined : params.status,
  }

  try {
    const data = await getJSON<unknown>(API_ENDPOINTS.V1.ADVERTISEMENTS.ADMIN, cleanParams)
    const parsed = AdvertisementListResponse.safeParse(data)

    if (!parsed.success) {
      console.error('Failed to parse advertisements response:', parsed.error)
      console.error('Raw data:', data)
      throw new Error('Failed to parse response from server')
    }

    return parsed.data
  } catch (error) {
    console.error('Error fetching advertisements:', error)
    throw error
  }
}

export function useAdvertisementsQuery(params: AdvertisementsSearch) {
  return useQuery({
    queryKey: adminKeys.advertisements.list(hashParams(params)) as QueryKey,
    queryFn: () => fetchAdvertisements(params),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  })
}
