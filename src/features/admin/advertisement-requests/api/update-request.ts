import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'
import { adminKeys } from '@/features/admin/lib/keys'

import {
  AdminAdvertisementRequestDetailResponse,
  type AdminAdvertisementRequestUpdatePayload,
} from '../schemas/admin-advertisement-request'
import { extractAdminAdvertisementRequestErrorMessage } from './errors'

export type UpdateAdminAdvertisementRequestInput = {
  id: number | string
  payload: AdminAdvertisementRequestUpdatePayload
}

export async function updateAdminAdvertisementRequest({
  id,
  payload,
}: UpdateAdminAdvertisementRequestInput) {
  try {
    const response = await api.patch(
      API_ENDPOINTS.V1.ADVERTISEMENT_REQUESTS.ADMIN_BY_ID(id),
      payload,
    )
    return AdminAdvertisementRequestDetailResponse.parse(response.data).data
  } catch (error) {
    throw new Error(
      extractAdminAdvertisementRequestErrorMessage(
        error,
        'Failed to update request. Please try again.',
      ),
    )
  }
}

export function useUpdateAdminAdvertisementRequestMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAdminAdvertisementRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.advertisementRequests.all() })
    },
  })
}
