import { z } from 'zod'

// Placement types for ads
export const AdPlacement = z.enum([
  'home-hero',
  'sidebar',
  'article-bottom',
  'dashboard',
  'calendar',
])

export type AdPlacement = z.infer<typeof AdPlacement>

// Status types
export const AdStatus = z.enum(['active', 'paused', 'scheduled', 'expired'])

export type AdStatus = z.infer<typeof AdStatus>

// Payment status types
export const PaymentStatus = z.enum(['pending', 'paid', 'failed', 'refunded'])

export type PaymentStatus = z.infer<typeof PaymentStatus>

// Package types
export const PackageType = z.enum(['weekly', 'monthly', 'yearly'])

export type PackageType = z.infer<typeof PackageType>

// Core Advertisement schema (matches API response)
export const Advertisement = z
  .object({
    id: z.number().int().positive(),
    ad_slot_number: z.string().min(1),
    ad_title: z.string().min(1).max(255),
    ad_desc: z.string().nullable(),
    ad_excerpt: z.string().nullable(),
    ad_desktop_asset: z.string().nullable(),
    ad_mobile_asset: z.string().nullable(),
    ad_client_link: z.string().nullable(),
    status: AdStatus,
    package_type: PackageType,
    ad_published_date: z.string(),
    ad_ending_date: z.string().nullable(),
    payment_status: PaymentStatus,
    payment_amount: z.string(), // API returns string like "2000.00"
    client_name: z.string().min(1).max(255),
    impressions_count: z.number().int().nonnegative().nullable().default(0),
    clicks_count: z.number().int().nonnegative().nullable().default(0),
    priority: z.number().nullable().default(0),
    created_at: z.string(),
    updated_at: z.string(),
    admin_notes: z.string().nullable(),
    expiry_notification_sent: z.boolean().nullable(),
    days_until_expiry: z.number().nullable(),
    is_active: z.boolean(),
    is_expired: z.boolean(),
    advertisement_request_id: z.number().nullable(),
  })
  .transform((data) => ({
    ...data,
    // Add computed fields for compatibility
    desktop_asset_url: data.ad_desktop_asset || '',
    mobile_asset_url: data.ad_mobile_asset || '',
    client_link: data.ad_client_link || '',
    start_date: data.ad_published_date,
    end_date: data.ad_ending_date,
    title: data.ad_title,
    impressions: data.impressions_count || 0,
    clicks: data.clicks_count || 0,
    ctr:
      data.clicks_count && data.impressions_count && data.impressions_count > 0
        ? (data.clicks_count / data.impressions_count) * 100
        : 0,
    payment_amount_number: parseFloat(data.payment_amount) || 0,
  }))

export type Advertisement = z.infer<typeof Advertisement>

// Detail response (single ad)
export const AdvertisementDetailResponse = z.object({
  data: Advertisement,
})

export type AdvertisementDetailResponse = z.infer<typeof AdvertisementDetailResponse>

// Helper to normalize array values (backend bug workaround)
const normalizeValue = <T>(val: T | T[]): T => (Array.isArray(val) ? val[0] : val)

const normalizeNullableString = (
  val: string | (string | null)[] | null | undefined,
): string | null => {
  if (val === null || val === undefined) return null
  if (Array.isArray(val)) {
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

// Pagination schemas
export const PaginationLinks = z
  .object({
    first: z
      .union([z.string(), z.array(z.string().nullable())])
      .nullable()
      .optional(),
    last: z
      .union([z.string(), z.array(z.string().nullable())])
      .nullable()
      .optional(),
    prev: z
      .union([z.string(), z.array(z.string().nullable())])
      .nullable()
      .optional(),
    next: z
      .union([z.string(), z.array(z.string().nullable())])
      .nullable()
      .optional(),
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
    from: z.union([z.number().int(), z.array(z.number().int().nullable()), z.null()]).optional(),
    to: z.union([z.number().int(), z.array(z.number().int().nullable()), z.null()]).optional(),
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

// List response
export const AdvertisementListResponse = z.object({
  data: z.array(Advertisement),
  links: PaginationLinks.optional(),
  meta: PaginationMeta,
  filters: z.unknown().optional(),
})

export type AdvertisementListResponse = z.infer<typeof AdvertisementListResponse>
