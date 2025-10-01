import { z } from 'zod'

const isoDate = /^\d{4}-\d{2}-\d{2}$/

export const ArticlesSearchSchema = z
  .object({
    q: z.string().trim().optional().nullable(),
    status: z.enum(['draft', 'published', 'scheduled', 'archived']).optional().nullable(),
    category: z.string().trim().optional().nullable(),
    tag: z.string().trim().optional().nullable(),
    author_id: z.coerce.number().int().optional().nullable(),
    published_after: z.string().regex(isoDate).optional().nullable(),
    published_before: z.string().regex(isoDate).optional().nullable(),
    page: z.coerce.number().int().min(1).default(1),
    page_size: z.coerce.number().int().min(1).max(200).default(20),
    sort: z.enum(['published_at', 'created_at', 'updated_at', 'title']).optional().nullable(),
    sort_dir: z.enum(['asc', 'desc']).optional().nullable(),
  })
  .transform((value) => ({
    ...value,
    q: value.q ?? undefined,
    status: value.status ?? undefined,
    category: value.category ?? undefined,
    tag: value.tag ?? undefined,
    author_id: value.author_id ?? undefined,
    published_after: value.published_after ?? undefined,
    published_before: value.published_before ?? undefined,
    sort: value.sort ?? 'published_at',
    sort_dir: value.sort_dir ?? 'desc',
  }))

export type ArticlesSearchParams = z.infer<typeof ArticlesSearchSchema>

export function sanitizeArticlesQuery(params: ArticlesSearchParams) {
  return {
    page: params.page,
    per_page: params.page_size,
    q: params.q,
    status: params.status,
    category: params.category,
    tag: params.tag,
    author_id: params.author_id,
    published_after: params.published_after,
    published_before: params.published_before,
    sort: params.sort,
    sort_dir: params.sort_dir,
  }
}
