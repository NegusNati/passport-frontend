import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

import type { AdminUser, AdminUsersListResponse } from '../schemas/user'
import { AdminUserDetailResponseSchema } from '../schemas/user'

export type UpdateUserRoleInput = {
  userId: number | string
  role: 'admin' | 'user'
}

export async function updateUserRole({ userId, role }: UpdateUserRoleInput) {
  const response = await api.patch(`/api/v1/admin/users/${userId}/role`, { role })
  return AdminUserDetailResponseSchema.parse(response.data).data
}

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: async (data, variables) => {
      const userId = variables.userId

      queryClient.setQueryData(adminKeys.users.detail(userId), { data })

      queryClient.setQueriesData({ queryKey: adminKeys.users.all(), exact: false }, (cached) => {
        if (!cached || typeof cached !== 'object') return cached

        const maybeList = cached as AdminUsersListResponse
        if (Array.isArray(maybeList.data)) {
          return {
            ...maybeList,
            data: maybeList.data.map((user) => (user.id === data.id ? data : user)),
          }
        }

        const maybeDetail = cached as { data?: AdminUser }
        if (maybeDetail.data && typeof maybeDetail.data === 'object' && 'id' in maybeDetail.data) {
          return { ...maybeDetail, data }
        }

        return cached
      })

      await queryClient.invalidateQueries({ queryKey: adminKeys.users.all(), exact: false })

      return data
    },
  })
}
