import { z } from 'zod'

import { getJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import { LocationsResponse, PassportDetailResponse, PassportListResponse } from './PassportsSchema'

// Query params must match API v1 exactly
const yyyyMmDd = /^\d{4}-\d{2}-\d{2}$/

const pageSizeSchema = z.number().int().min(1).max(200)

export const ListParams = z.object({
  request_number: z.string().optional(),
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  location: z.string().optional(),
  published_after: z.string().regex(yyyyMmDd, 'YYYY-MM-DD').optional(),
  published_before: z.string().regex(yyyyMmDd, 'YYYY-MM-DD').optional(),
  page_size: pageSizeSchema.default(25),
  page: z.number().int().min(1).optional().default(1),
  sort: z
    .enum(['dateOfPublish', 'requestNumber', 'created_at'])
    .optional()
    .default('dateOfPublish'),
  sort_dir: z.enum(['asc', 'desc']).optional().default('desc'),
})

export type ListParams = z.infer<typeof ListParams>

export async function fetchPassports(params: Partial<ListParams> = {}) {
  const parsed = ListParams.parse(params)
  const data = await getJSON<unknown>(API_ENDPOINTS.V1.PASSPORTS.ROOT, parsed)
  return PassportListResponse.parse(data)
}

export async function fetchPassportById(id: string | number) {
  const data = await getJSON<unknown>(API_ENDPOINTS.V1.PASSPORTS.BY_ID(id))
  return PassportDetailResponse.parse(data)
}

export async function fetchLocations() {
  const data = await getJSON<unknown>(API_ENDPOINTS.V1.LOCATIONS)
  return LocationsResponse.parse(data)
}
