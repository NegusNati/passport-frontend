import { z } from 'zod'

export const AdminPassportSchema = z.object({
  id: z.number().int(),
  request_number: z.string(),
  first_name: z.string(),
  middle_name: z.string().nullable().optional(),
  last_name: z.string(),
  full_name: z.string(),
  location: z.string(),
  date_of_publish: z.string(),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
})

export type AdminPassport = z.infer<typeof AdminPassportSchema>

export const AdminPassportsMetaSchema = z.object({
  current_page: z.number().int().min(1),
  last_page: z.number().int().min(1),
  page_size: z.number().int().min(1).optional(),
  per_page: z.number().int().min(1).optional(),
  total: z.number().int().nonnegative(),
  has_more: z.boolean().optional(),
})

export const AdminPassportsListResponseSchema = z.object({
  data: z.array(AdminPassportSchema),
  meta: AdminPassportsMetaSchema,
})

export type AdminPassportsListResponse = z.infer<typeof AdminPassportsListResponseSchema>
export type AdminPassportsMeta = z.infer<typeof AdminPassportsMetaSchema>
