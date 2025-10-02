import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys, hashParams } from '@/features/admin/lib/keys'

import type { UsersSearchParams } from '../schemas/filters'
import { sanitizeUsersQuery } from '../schemas/filters'
import {
  type AdminUsersListResponse,
  AdminUsersListResponseSchema,
} from '../schemas/user'

export async function fetchAdminUsers(params: UsersSearchParams) {
  const response = await api.get('/api/v1/admin/users', {
    params: sanitizeUsersQuery(params),
  })

  return AdminUsersListResponseSchema.parse(response.data)
}

export function useAdminUsersQuery(params: UsersSearchParams) {
  const paramsHash = hashParams(sanitizeUsersQuery(params))

  return useQuery<AdminUsersListResponse>({
    queryKey: adminKeys.users.list(paramsHash),
    queryFn: () => fetchAdminUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}
