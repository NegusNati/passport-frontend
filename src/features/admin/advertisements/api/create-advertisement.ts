import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import { AdvertisementDetailResponse } from '../schemas/advertisement'
import { type AdvertisementCreatePayload, AdvertisementCreateSchema } from '../schemas/create'
import { extractAdvertisementErrorMessage } from './errors'

function buildFormDataFromCreate(input: AdvertisementCreatePayload) {
  const { ad_desktop_asset, ad_mobile_asset, ...rest } = input
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

  return form
}

export async function createAdvertisement(input: AdvertisementCreatePayload) {
  const form = buildFormDataFromCreate(input)
  try {
    const response = await api.post(API_ENDPOINTS.V1.ADVERTISEMENTS.ADMIN, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return AdvertisementDetailResponse.parse(response.data).data
  } catch (error) {
    throw new Error(
      extractAdvertisementErrorMessage(
        error,
        'Failed to create advertisement. Please review the form and try again.',
      ),
    )
  }
}

export function useCreateAdvertisementMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAdvertisement,
    onSuccess: async (advertisement) => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.advertisements.all() })
      await queryClient.invalidateQueries({
        queryKey: adminKeys.advertisements.detail(advertisement.id),
      })
      return advertisement
    },
  })
}
