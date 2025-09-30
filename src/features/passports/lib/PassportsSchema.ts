import { z } from 'zod'

// API v1 response shapes (raw from server)

export const PassportApiItem = z.object({
  id: z.number().int(),
  request_number: z.string(),
  first_name: z.string(),
  middle_name: z.string().nullable().optional(),
  last_name: z.string(),
  full_name: z.string(),
  location: z.string(),
  date_of_publish: z.string(), // YYYY-MM-DD
  created_at: z.string(), // ISO string
  updated_at: z.string().nullable().optional(), // can be null
})
export type PassportApiItem = z.infer<typeof PassportApiItem>

export const PaginationLinks = z.object({
  first: z.string().nullable().optional(),
  last: z.string().nullable().optional(),
  prev: z.string().nullable().optional(),
  next: z.string().nullable().optional(),
})

export const PaginationMeta = z.object({
  current_page: z.number().int().min(1),
  per_page: z.number().int().min(1).optional(),
  page_size: z.number().int().min(1).optional(),
  page_size_options: z.array(z.number().int().min(1)).optional(),
  total: z.number().int().nonnegative(),
  last_page: z.number().int().min(1),
  has_more: z.boolean(),
})

// Some deployments return an empty array for filters; accept any shape
export const SearchFilters = z.unknown().optional()

export const PassportListResponse = z.object({
  data: z.array(PassportApiItem),
  links: PaginationLinks.optional(),
  meta: PaginationMeta,
  filters: SearchFilters.optional(),
})
export type PassportListResponse = z.infer<typeof PassportListResponse>

export const PassportDetailResponse = z.object({
  data: PassportApiItem,
})
export type PassportDetailResponse = z.infer<typeof PassportDetailResponse>

export const LocationsResponse = z.object({
  data: z.array(z.string()),
  meta: z.object({ count: z.number().int().nonnegative() }).optional(),
})
export type LocationsResponse = z.infer<typeof LocationsResponse>
