import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys, hashParams } from '@/features/admin/lib/keys'

import {
  type AdminPassportsListResponse,
  AdminPassportsListResponseSchema,
} from '../schemas/passport'

export type AdminPassportListParams = {
  page: number
  page_size: number
  location?: string
  request_number?: string
  first_name?: string
  middle_name?: string
  last_name?: string
}

export async function fetchAdminPassports(params: AdminPassportListParams) {
  const response = await api.get('/api/v1/passports', {
    params,
  })

  return AdminPassportsListResponseSchema.parse(response.data)
}

export function useAdminPassportsQuery(params: AdminPassportListParams) {
  const paramsHash = hashParams(params)

  return useQuery<AdminPassportsListResponse>({
    queryKey: adminKeys.passports.list(paramsHash),
    queryFn: () => fetchAdminPassports(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}
