import { type QueryKey, useQuery } from '@tanstack/react-query'

import { adminKeys } from '@/features/admin/lib/keys'
import { getJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import { AdminAdvertisementRequestDetailResponse } from '../schemas/admin-advertisement-request'

export async function fetchAdminAdvertisementRequest(id: number | string) {
  const data = await getJSON<unknown>(API_ENDPOINTS.V1.ADVERTISEMENT_REQUESTS.ADMIN_BY_ID(id))
  return AdminAdvertisementRequestDetailResponse.parse(data)
}

export function useAdminAdvertisementRequestQuery(
  id: number | string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: adminKeys.advertisementRequests.detail(id) as QueryKey,
    queryFn: () => fetchAdminAdvertisementRequest(id),
    staleTime: 30_000,
    enabled: (options?.enabled ?? true) && !!id,
  })
}
