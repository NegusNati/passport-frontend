import { z } from 'zod'

const yyyyMmDd = /^\d{4}-\d{2}-\d{2}$/

export const AdminAdvertisementRequestsSearch = z.object({
  status: z.enum(['pending', 'contacted', 'approved', 'rejected', 'all']).default('all'),
  full_name: z.string().optional(),
  company_name: z.string().optional(),
  phone_number: z.string().optional(),
  created_after: z.string().regex(yyyyMmDd, 'YYYY-MM-DD').optional(),
  created_before: z.string().regex(yyyyMmDd, 'YYYY-MM-DD').optional(),
  sort: z.enum(['created_at', 'status', 'full_name']).default('created_at'),
  sort_dir: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().int().min(1).default(1),
  per_page: z.number().int().min(1).max(100).default(20),
})

export type AdminAdvertisementRequestsSearch = z.infer<typeof AdminAdvertisementRequestsSearch>
