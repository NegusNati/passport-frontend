import { useQuery } from '@tanstack/react-query'

import { getJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import {
  PublicAdvertisementResponse,
  PublicAdvertisementsBySlotResponse,
} from '../schemas/public-advertisement'

export const advertisementKeys = {
  all: ['advertisements'] as const,
  slots: (codes: string[]) => [
    ...advertisementKeys.all,
    'slots',
    [...new Set(codes.filter(Boolean))].sort(),
  ],
  slot: (code: string) => [...advertisementKeys.all, 'slot', code] as const,
}

export async function fetchAdsBySlots(codes: string[]) {
  const uniqueCodes = [...new Set(codes.filter(Boolean))]

  if (!uniqueCodes.length) {
    return {}
  }

  try {
    const data = await getJSON<unknown>(API_ENDPOINTS.V1.ADVERTISEMENTS.SLOTS, {
      codes: uniqueCodes,
    })
    const parsed = PublicAdvertisementsBySlotResponse.safeParse(data)

    if (!parsed.success) {
      console.error('Failed to parse advertisements response:', parsed.error)
      return {}
    }

    return parsed.data.data
  } catch (error) {
    console.error('Error fetching advertisements:', error)
    return {}
  }
}

export async function fetchAdBySlot(code: string) {
  try {
    const data = await getJSON<unknown>(API_ENDPOINTS.V1.ADVERTISEMENTS.SLOT_BY_CODE(code))
    const parsed = PublicAdvertisementResponse.safeParse(data)

    if (!parsed.success) {
      console.error('Failed to parse advertisement response:', parsed.error)
      return null
    }

    return parsed.data.data
  } catch (error) {
    console.error('Error fetching advertisement:', error)
    return null
  }
}

export function fetchAdByPlacement(placement: string) {
  return fetchAdBySlot(placement)
}

export function useAdsQuery(codes: string[], enabled = true) {
  const stableCodes = [...new Set(codes.filter(Boolean))].sort()

  return useQuery({
    queryKey: advertisementKeys.slots(stableCodes),
    queryFn: () => fetchAdsBySlots(stableCodes),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && stableCodes.length > 0,
  })
}

export function useAdQuery(code: string, enabled = true) {
  return useQuery({
    queryKey: advertisementKeys.slot(code),
    queryFn: () => fetchAdBySlot(code),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: enabled && Boolean(code),
  })
}
