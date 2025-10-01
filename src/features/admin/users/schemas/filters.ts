import { z } from 'zod'

export const UsersSearchSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    page_size: z.coerce.number().int().min(1).max(200).default(20),
    q: z.string().trim().optional().nullable().transform((val) => (val ? val : undefined)),
    role: z.string().trim().optional().nullable().transform((val) => (val ? val : undefined)),
    status: z.string().trim().optional().nullable().transform((val) => (val ? val : undefined)),
  })
  .transform((value) => ({
    ...value,
    q: value.q ?? undefined,
    role: value.role ?? undefined,
    status: value.status ?? undefined,
  }))

type UsersSearch = z.infer<typeof UsersSearchSchema>

export type UsersSearchParams = UsersSearch

export function sanitizeUsersQuery(params: UsersSearchParams) {
  return {
    page: params.page,
    per_page: params.page_size,
    q: params.q,
    role: params.role,
    status: params.status,
  }
}
