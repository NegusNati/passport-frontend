import { z } from 'zod'

import { getJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import { LocationsResponse, PassportDetailResponse, PassportListResponse } from './PassportsSchema'

// Query params must match API v1 exactly
const yyyyMmDd = /^\d{4}-\d{2}-\d{2}$/

const pageSizeSchema = z.number().int().min(1).max(200)

const ListParamsBase = z.object({
  request_number: z.string().optional(),
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  name: z.string().optional(),
  query: z.string().optional(),
  location: z.string().optional(),
  published_after: z.string().regex(yyyyMmDd, 'YYYY-MM-DD').optional(),
  published_before: z.string().regex(yyyyMmDd, 'YYYY-MM-DD').optional(),
  limit: pageSizeSchema.optional(),
  per_page: pageSizeSchema.optional(),
  page_size: pageSizeSchema.optional(),
  page: z.number().int().min(1).optional().default(1),
  sort: z
    .enum(['dateOfPublish', 'requestNumber', 'created_at'])
    .optional()
    .default('dateOfPublish'),
  sort_dir: z.enum(['asc', 'desc']).optional().default('desc'),
})

export const ListParams = ListParamsBase.transform((value) => {
  const pageSize = value.page_size ?? value.per_page ?? 25
  const { per_page: _per, page_size: _ps, ...rest } = value

  return {
    ...rest,
    page_size: pageSize,
  }
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
