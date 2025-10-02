import { z } from 'zod'

export const UsersSearchSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    page_size: z.coerce.number().int().min(1).max(200).default(20),
    // accept both `q` and `search` from the URL; unify to `search`
    q: z.string().trim().optional().nullable().transform((val) => (val ? val : undefined)),
    search: z.string().trim().optional().nullable().transform((val) => (val ? val : undefined)),
    role: z.string().trim().optional().nullable().transform((val) => (val ? val : undefined)),
    // admin + email_verified flags
    is_admin: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((v) => (typeof v === 'string' ? (v === 'true' ? true : v === 'false' ? false : undefined) : v)),
    email_verified: z
      .union([z.boolean(), z.string()])
      .optional()
      .transform((v) => (typeof v === 'string' ? (v === 'true' ? true : v === 'false' ? false : undefined) : v)),
  })
  .transform((value) => ({
    page: value.page,
    page_size: value.page_size,
    search: value.search ?? value.q ?? undefined,
    role: value.role ?? undefined,
    is_admin: value.is_admin ?? undefined,
    email_verified: value.email_verified ?? undefined,
  }))

export type UsersSearchParams = z.infer<typeof UsersSearchSchema>

export function sanitizeUsersQuery(params: UsersSearchParams) {
  return {
    page: params.page,
    per_page: params.page_size,
    search: params.search,
    role: params.role,
    is_admin: params.is_admin,
    email_verified: params.email_verified,
  }
}
