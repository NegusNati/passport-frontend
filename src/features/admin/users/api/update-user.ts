import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

import { AdminUserDetailResponseSchema } from '../schemas/user'

export type UpdateAdminUserInput = {
  userId: string | number
  payload: Record<string, unknown>
}

export async function updateAdminUser({ userId, payload }: UpdateAdminUserInput) {
  const response = await api.patch(`/api/v1/admin/users/${userId}`, payload)
  return AdminUserDetailResponseSchema.parse(response.data).data
}

export function useUpdateAdminUserMutation(userId: string | number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => updateAdminUser({ userId, payload }),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.users.all() })
      await queryClient.invalidateQueries({ queryKey: adminKeys.users.detail(userId) })
      return data
    },
  })
}
