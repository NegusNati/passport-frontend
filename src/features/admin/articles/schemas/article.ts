import { z } from 'zod'

const AuthorSchema = z.object({
  id: z.number().int(),
  name: z.string(),
})

const TagSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
})

const CategorySchema = TagSchema

export const AdminArticleSchema = z.object({
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
  status: z.enum(['draft', 'published', 'scheduled', 'archived']),
  published_at: z.string().nullable().optional(),
  reading_time: z.number().int().nullable().optional(),
  word_count: z.number().int().nullable().optional(),
  author: AuthorSchema.nullable().optional(),
  tags: z.array(TagSchema).optional().default([]),
  categories: z.array(CategorySchema).optional().default([]),
  created_at: z.string(),
  updated_at: z.string(),
})

export type AdminArticle = z.infer<typeof AdminArticleSchema>

export const AdminArticlesMetaSchema = z.object({
  current_page: z.number().int().min(1),
  last_page: z.number().int().min(1),
  per_page: z.number().int().min(1).optional(),
  page_size: z.number().int().min(1).optional(),
  total: z.number().int().nonnegative(),
  has_more: z.boolean().optional(),
})

export const AdminArticlesListResponseSchema = z.object({
  data: z.array(AdminArticleSchema),
  meta: AdminArticlesMetaSchema,
  filters: z.unknown().optional(),
})

const AdminArticleMetaSchema = z
  .object({
    etag: z.string().optional(),
  })
  .passthrough()

export const AdminArticleDetailResponseSchema = z.object({
  data: AdminArticleSchema,
  meta: AdminArticleMetaSchema.optional(),
})

export type AdminArticlesListResponse = z.infer<typeof AdminArticlesListResponseSchema>
export type AdminArticlesMeta = z.infer<typeof AdminArticlesMetaSchema>
