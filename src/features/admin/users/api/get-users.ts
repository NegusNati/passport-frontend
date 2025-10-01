import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys, hashParams } from '@/features/admin/lib/keys'

import {
  AdminUsersListResponseSchema,
  type AdminUsersListResponse,
} from '../schemas/user'
import type { UsersSearchParams } from '../schemas/filters'

export async function fetchAdminUsers(params: UsersSearchParams) {
  const response = await api.get('/api/v1/admin/users', {
    params: sanitizeParams(params),
  })

  return AdminUsersListResponseSchema.parse(response.data)
}

export function useAdminUsersQuery(params: UsersSearchParams) {
  const paramsHash = hashParams(sanitizeParams(params))

  return useQuery<AdminUsersListResponse>({
    queryKey: adminKeys.users.list(paramsHash),
    queryFn: () => fetchAdminUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

function sanitizeParams(params: UsersSearchParams) {
  const query: Record<string, unknown> = {
    page: params.page,
    per_page: params.page_size,
  }

  if (params.q) query.q = params.q
  if (params.role) query.role = params.role
  if (params.status) query.status = params.status

  return query
}
