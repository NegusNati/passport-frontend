import { z } from 'zod'

import { AdvertisementRequestItem } from '@/features/advertisement-requests/schemas/advertisement-request'

// Helper to handle backend bug where values come as arrays
const normalizeValue = <T>(val: T | T[]): T => (Array.isArray(val) ? val[0] : val)

// Helper for nullable string values that might be arrays
const normalizeNullableString = (
  val: string | (string | null)[] | null | undefined,
): string | null => {
  if (val === null || val === undefined) return null
  if (Array.isArray(val)) {
    // Handle arrays of nulls or strings
    const firstNonNull = val.find((v) => v !== null)
    return firstNonNull ?? null
  }
  return val
}

const normalizeNullableNumber = (
  val: number | (number | null)[] | null | undefined,
): number | null => {
  if (val === null || val === undefined) return null
  if (Array.isArray(val)) {
    const firstNumber = val.find((v): v is number => typeof v === 'number')
    return firstNumber ?? null
  }
  return val
}

const normalizeOptionalNumber = (
  val: number | (number | null)[] | null | undefined,
): number | undefined => {
  const normalized = normalizeNullableNumber(val)
  return normalized ?? undefined
}

// Pagination helpers (handle both single values and arrays due to backend issue)
export const PaginationLinks = z
  .object({
    first: z.union([z.string(), z.array(z.string().nullable())]).nullable().optional(),
    last: z.union([z.string(), z.array(z.string().nullable())]).nullable().optional(),
    prev: z.union([z.string(), z.array(z.string().nullable())]).nullable().optional(),
    next: z.union([z.string(), z.array(z.string().nullable())]).nullable().optional(),
  })
  .transform((links) => ({
    first: normalizeNullableString(links.first),
    last: normalizeNullableString(links.last),
    prev: normalizeNullableString(links.prev),
    next: normalizeNullableString(links.next),
  }))

export const PaginationMeta = z
  .object({
    current_page: z.union([z.number().int().min(1), z.array(z.number().int().min(1))]),
    per_page: z.union([z.number().int().min(1), z.array(z.number().int().min(1))]),
    total: z.union([z.number().int().nonnegative(), z.array(z.number().int().nonnegative())]),
    last_page: z.union([z.number().int().min(1), z.array(z.number().int().min(1))]),
    has_more: z.boolean(),
    from: z
      .union([
        z.number().int(),
        z.array(z.number().int().nullable()),
        z.null(),
      ])
      .optional(),
    to: z
      .union([
        z.number().int(),
        z.array(z.number().int().nullable()),
        z.null(),
      ])
      .optional(),
  })
  .transform((meta) => ({
    current_page: normalizeValue(meta.current_page),
    per_page: normalizeValue(meta.per_page),
    total: normalizeValue(meta.total),
    last_page: normalizeValue(meta.last_page),
    has_more: meta.has_more,
    from: normalizeOptionalNumber(meta.from),
    to: normalizeOptionalNumber(meta.to),
  }))

// Admin response includes admin_notes
export const AdminAdvertisementRequestItem = AdvertisementRequestItem.extend({
  admin_notes: z.string().nullable(),
})

export type AdminAdvertisementRequestItem = z.infer<typeof AdminAdvertisementRequestItem>

export const AdminAdvertisementRequestDetailResponse = z.object({
  data: AdminAdvertisementRequestItem,
})

export type AdminAdvertisementRequestDetailResponse = z.infer<
  typeof AdminAdvertisementRequestDetailResponse
>

export const AdminAdvertisementRequestListResponse = z.object({
  data: z.array(AdminAdvertisementRequestItem),
  links: PaginationLinks.optional(),
  meta: PaginationMeta,
  filters: z.unknown().optional(),
})

export type AdminAdvertisementRequestListResponse = z.infer<
  typeof AdminAdvertisementRequestListResponse
>

// Update payload
export const AdminAdvertisementRequestUpdate = z.object({
  status: z.enum(['pending', 'contacted', 'approved', 'rejected']).nullable().optional(),
  admin_notes: z.string().max(5000, 'Notes too long').optional().or(z.literal('')),
  contacted_at: z.string().optional().or(z.literal('')), // ISO date or YYYY-MM-DD
})

export type AdminAdvertisementRequestUpdatePayload = z.infer<
  typeof AdminAdvertisementRequestUpdate
>
