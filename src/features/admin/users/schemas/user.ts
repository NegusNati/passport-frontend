import { z } from 'zod'

export const AdminUserSchema = z.object({
  id: z.number().int(),
  first_name: z.string(),
  last_name: z.string(),
  middle_name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone_number: z.string().nullable().optional(),
  email_verified_at: z.string().nullable().optional(),
  plan_type: z.string().nullable().optional(),
  is_admin: z.boolean().optional().default(false),
  roles: z.array(z.string()).optional().default([]),
  permissions: z.array(z.string()).optional().default([]),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
})

export type AdminUser = z.infer<typeof AdminUserSchema>

const PaginationLinks = z.object({
  first: z.string().nullable().optional(),
  last: z.string().nullable().optional(),
  prev: z.string().nullable().optional(),
  next: z.string().nullable().optional(),
})

const MetaLinkItem = z.object({
  url: z.string().nullable(),
  label: z.string(),
  active: z.boolean(),
})

export const AdminUsersMetaSchema = z.object({
  current_page: z.number().int().min(1).optional(),
  from: z.number().int().optional(),
  last_page: z.number().int().min(1).optional(),
  links: z.array(MetaLinkItem).optional(),
  path: z.string().optional(),
  per_page: z.number().int().min(1).optional(),
  to: z.number().int().optional(),
  total: z.union([z.number().int(), z.tuple([z.number().int(), z.number().int()])]).optional(),
  page_size_options: z.array(z.number().int()).optional(),
  has_more: z.boolean().optional(),
  page_size: z.number().int().optional(),
}).passthrough()

export const AdminUsersListResponseSchema = z.object({
  data: z.array(AdminUserSchema),
  links: PaginationLinks.optional(),
  meta: AdminUsersMetaSchema,
  filters: z.unknown().optional(),
  sort: z
    .object({ column: z.string().optional(), direction: z.string().optional() })
    .optional(),
})

export const AdminUserDetailResponseSchema = z.object({
  data: AdminUserSchema,
})

export type AdminUsersMeta = z.infer<typeof AdminUsersMetaSchema>
export type AdminUsersListResponse = z.infer<typeof AdminUsersListResponseSchema>
