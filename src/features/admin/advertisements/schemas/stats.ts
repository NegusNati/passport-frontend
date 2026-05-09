import { z } from 'zod'

const StatNumber = z.coerce.number().nonnegative()
const StatInteger = StatNumber.pipe(z.number().int())

export const AdvertisementTopPerformer = z.object({
  id: StatInteger,
  ad_title: z.string(),
  slot_code: z.string().nullable().optional(),
  status: z.string(),
  impressions_count: StatInteger,
  clicks_count: StatInteger,
  ctr: StatNumber,
  payment_amount: StatNumber,
})

export type AdvertisementTopPerformer = z.infer<typeof AdvertisementTopPerformer>

// Stats response matching actual API structure
export const AdvertisementStatsData = z.object({
  total_advertisements: StatInteger.default(0),
  total_active: StatInteger,
  total_draft: StatInteger.default(0),
  total_scheduled: StatInteger.default(0),
  total_paused: StatInteger.default(0),
  expiring_soon: StatInteger,
  expired_pending_renewal: StatInteger,
  paid_advertisements: StatInteger.default(0),
  pending_payment: StatInteger.default(0),
  total_impressions: StatInteger,
  total_clicks: StatInteger,
  avg_ctr: StatNumber,
  total_revenue: StatNumber.default(0),
  revenue_this_month: StatNumber,
  revenue_last_30_days: StatNumber.default(0),
  top_performers: z.array(AdvertisementTopPerformer).default([]),
})

export type AdvertisementStatsData = z.infer<typeof AdvertisementStatsData>

// Complete stats response
export const AdvertisementStatsResponse = z.object({
  data: AdvertisementStatsData,
})

export type AdvertisementStatsResponse = z.infer<typeof AdvertisementStatsResponse>
