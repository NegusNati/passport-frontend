import { z } from 'zod'

// Stats response matching actual API structure
export const AdvertisementStatsData = z.object({
  total_active: z.number().int().nonnegative(),
  expiring_soon: z.number().int().nonnegative(),
  expired_pending_renewal: z.number().int().nonnegative(),
  total_impressions: z.number().int().nonnegative(),
  total_clicks: z.number().int().nonnegative(),
  avg_ctr: z.number().nonnegative(),
  revenue_this_month: z.number().nonnegative(),
})

export type AdvertisementStatsData = z.infer<typeof AdvertisementStatsData>

// Complete stats response
export const AdvertisementStatsResponse = z.object({
  data: AdvertisementStatsData,
})

export type AdvertisementStatsResponse = z.infer<typeof AdvertisementStatsResponse>
