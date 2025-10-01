import { useQuery } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

import { AdminUserDetailResponseSchema } from '../schemas/user'

export async function fetchAdminUser(userId: string | number) {
  const response = await api.get(`/api/v1/admin/users/${userId}`)
  return AdminUserDetailResponseSchema.parse(response.data)
}

export function useAdminUserQuery(userId: string | number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: adminKeys.users.detail(userId),
    queryFn: () => fetchAdminUser(userId),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
  })
}
