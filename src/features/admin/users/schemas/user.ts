import { z } from 'zod'

export const AdminUserSchema = z.object({
  id: z.number().int(),
  first_name: z.string(),
  last_name: z.string(),
  middle_name: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone_number: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  is_admin: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
})

export type AdminUser = z.infer<typeof AdminUserSchema>

export const AdminUsersMetaSchema = z.object({
  current_page: z.number().int().min(1),
  last_page: z.number().int().min(1),
  per_page: z.number().int().min(1).optional(),
  page_size: z.number().int().min(1).optional(),
  total: z.number().int().nonnegative(),
  has_more: z.boolean().optional(),
  links: z.any().optional(),
})

export const AdminUsersListResponseSchema = z.object({
  data: z.array(AdminUserSchema),
  meta: AdminUsersMetaSchema,
})

export const AdminUserDetailResponseSchema = z.object({
  data: AdminUserSchema,
})

export type AdminUsersMeta = z.infer<typeof AdminUsersMetaSchema>
export type AdminUsersListResponse = z.infer<typeof AdminUsersListResponseSchema>
