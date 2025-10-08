import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import { extractAdminAdvertisementRequestErrorMessage } from './errors'

export async function deleteAdminAdvertisementRequest(id: number | string) {
  try {
    await api.delete(API_ENDPOINTS.V1.ADVERTISEMENT_REQUESTS.ADMIN_BY_ID(id))
  } catch (error) {
    throw new Error(
      extractAdminAdvertisementRequestErrorMessage(
        error,
        'Failed to delete request. Please try again.',
      ),
    )
  }
}

export function useDeleteAdminAdvertisementRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAdminAdvertisementRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.advertisementRequests.all() })
    },
  })
}
