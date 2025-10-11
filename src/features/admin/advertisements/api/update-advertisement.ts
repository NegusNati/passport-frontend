import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import { AdvertisementDetailResponse } from '../schemas/advertisement'
import { AdvertisementCreateSchema, type AdvertisementUpdatePayload } from '../schemas/create'
import { extractAdvertisementErrorMessage } from './errors'

function buildFormDataFromUpdate(_id: number, input: AdvertisementUpdatePayload) {
  const {
    ad_desktop_asset,
    ad_mobile_asset,
    remove_ad_desktop_asset,
    remove_ad_mobile_asset,
    ...rest
  } = input
  const parsed = AdvertisementCreateSchema.parse(rest)
  const form = new FormData()

  // Add text fields
  Object.entries(parsed).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (Array.isArray(value)) {
      value.forEach((v) => form.append(`${key}[]`, String(v)))
    } else {
      form.append(key, String(value))
    }
  })

  // Add files
  if (ad_desktop_asset) form.append('ad_desktop_asset', ad_desktop_asset)
  if (ad_mobile_asset) form.append('ad_mobile_asset', ad_mobile_asset)

  // Add removal flags
  if (remove_ad_desktop_asset) form.append('remove_ad_desktop_asset', '1')
  if (remove_ad_mobile_asset) form.append('remove_ad_mobile_asset', '1')

  // Laravel requires _method for PATCH with FormData
  form.append('_method', 'PATCH')

  return form
}

export async function updateAdvertisement(id: number, input: AdvertisementUpdatePayload) {
  const form = buildFormDataFromUpdate(id, input)
  try {
    const response = await api.post(API_ENDPOINTS.V1.ADVERTISEMENTS.ADMIN_BY_ID(id), form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return AdvertisementDetailResponse.parse(response.data).data
  } catch (error) {
    throw new Error(
      extractAdvertisementErrorMessage(
        error,
        'Failed to update advertisement. Please review the form and try again.',
      ),
    )
  }
}

export function useUpdateAdvertisementMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdvertisementUpdatePayload }) =>
      updateAdvertisement(id, data),
    onSuccess: async (advertisement) => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.advertisements.all() })
      await queryClient.invalidateQueries({
        queryKey: adminKeys.advertisements.detail(advertisement.id),
      })
      return advertisement
    },
  })
}
