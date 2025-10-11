import { keepPreviousData, type QueryKey, useQuery } from '@tanstack/react-query'

import { adminKeys, hashParams } from '@/features/admin/lib/keys'
import { getJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import { AdminAdvertisementRequestListResponse } from '../schemas/admin-advertisement-request'
import type { AdminAdvertisementRequestsSearch } from '../schemas/filters'

export async function fetchAdminAdvertisementRequests(
  params: Partial<AdminAdvertisementRequestsSearch>,
) {
  const cleanParams = {
    ...params,
    status: params.status === 'all' ? undefined : params.status,
  }

  try {
    const data = await getJSON<unknown>(API_ENDPOINTS.V1.ADVERTISEMENT_REQUESTS.ADMIN, cleanParams)
    const parsed = AdminAdvertisementRequestListResponse.safeParse(data)

    if (!parsed.success) {
      console.error('Failed to parse admin advertisement requests response:', parsed.error)
      console.error('Raw data:', data)
      throw new Error('Failed to parse response from server')
    }

    return parsed.data
  } catch (error) {
    console.error('Error fetching admin advertisement requests:', error)
    throw error
  }
}

export function useAdminAdvertisementRequestsQuery(params: AdminAdvertisementRequestsSearch) {
  return useQuery({
    queryKey: adminKeys.advertisementRequests.list(hashParams(params)) as QueryKey,
    queryFn: () => fetchAdminAdvertisementRequests(params),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  })
}
