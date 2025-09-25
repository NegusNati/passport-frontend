import { z } from 'zod'

export const Author = z.object({ id: z.number().int(), name: z.string() })
export const Taxonomy = z.object({ id: z.number().int(), name: z.string(), slug: z.string() })

export const ArticleApiItem = z.object({
  id: z.number().int(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  featured_image_url: z.string().url().nullable().optional(),
  canonical_url: z.string().url().nullable().optional(),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
  og_image_url: z.string().url().nullable().optional(),
  status: z.string(),
  published_at: z.string().nullable().optional(),
  reading_time: z.number().int().nullable().optional(),
  word_count: z.number().int().nullable().optional(),
  author: Author.nullable().optional(),
  tags: z.array(Taxonomy).default([]),
  categories: z.array(Taxonomy).default([]),
  created_at: z.string(),
  updated_at: z.string(),
})
export type ArticleApiItem = z.infer<typeof ArticleApiItem>

export const PaginationLinks = z.object({
  first: z.string().nullable().optional(),
  last: z.string().nullable().optional(),
  prev: z.string().nullable().optional(),
  next: z.string().nullable().optional(),
})

export const PaginationMeta = z.object({
  current_page: z.number().int().min(1),
  per_page: z.number().int().min(1),
  total: z.number().int().nonnegative(),
  last_page: z.number().int().min(1),
  has_more: z.boolean(),
})

export const ArticleListResponse = z.object({
  data: z.array(ArticleApiItem),
  links: PaginationLinks.optional(),
  meta: PaginationMeta,
  filters: z
    .object({
      q: z.string().nullable().optional(),
      category: z.string().nullable().optional(),
      tag: z.string().nullable().optional(),
    })
    .optional(),
})
export type ArticleListResponse = z.infer<typeof ArticleListResponse>

export const ArticleDetailResponse = z.object({ data: ArticleApiItem })
export type ArticleDetailResponse = z.infer<typeof ArticleDetailResponse>

export const CategoriesResponse = z.object({
  data: z.array(Taxonomy.extend({ articles_count: z.number().int().optional() })),
  meta: z.object({ count: z.number().int().optional() }).optional(),
})
export type CategoriesResponse = z.infer<typeof CategoriesResponse>

export const TagsResponse = z.object({
  data: z.array(Taxonomy.extend({ articles_count: z.number().int().optional() })),
  meta: z.object({ count: z.number().int().optional() }).optional(),
})
export type TagsResponse = z.infer<typeof TagsResponse>
