import { useQuery } from '@tanstack/react-query'

import { adminKeys } from '@/features/admin/lib/keys'
import { getJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import { AdSlotListResponse } from '../schemas/ad-slot'

export async function getAdSlots() {
  const data = await getJSON<unknown>(API_ENDPOINTS.V1.ADVERTISEMENTS.ADMIN_SLOTS)
  return AdSlotListResponse.parse(data).data
}

export function useAdSlotsQuery() {
  return useQuery({
    queryKey: adminKeys.advertisements.slots(),
    queryFn: getAdSlots,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
