import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import { extractAdvertisementErrorMessage } from './errors'

export async function deleteAdvertisement(id: number) {
  try {
    await api.delete(API_ENDPOINTS.V1.ADVERTISEMENTS.ADMIN_BY_ID(id))
    return { id }
  } catch (error) {
    throw new Error(extractAdvertisementErrorMessage(error, 'Failed to delete advertisement'))
  }
}

export function useDeleteAdvertisementMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAdvertisement,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.advertisements.all() })
    },
  })
}
