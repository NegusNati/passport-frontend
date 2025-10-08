import { z } from 'zod'

import { AdStatus } from './advertisement'

// Search/filter schema for admin list
export const AdvertisementsSearch = z.object({
  page: z.number().int().min(1).default(1),
  page_size: z.number().int().min(1).max(100).default(20),
  status: z.union([AdStatus, z.literal('all')]).optional(),
  search: z.string().optional(), // Search client_name or ad_title
  sort_by: z.enum(['created_at', 'ad_published_date', 'clicks_count', 'impressions_count', 'payment_amount']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
})

export type AdvertisementsSearch = z.infer<typeof AdvertisementsSearch>
