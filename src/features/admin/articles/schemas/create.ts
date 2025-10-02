import { z } from 'zod'

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const AdminArticleBaseSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(160),
  slug: z
    .string()
    .trim()
    .regex(slugRegex, 'Slug can only include lowercase letters, numbers, and hyphens')
    .max(160)
    .optional()
    .nullable(),
  excerpt: z.string().trim().max(280).optional().nullable(),
  content: z
    .string()
    .trim()
    .min(10, 'Content must be at least 10 characters')
    .optional()
    .nullable(),
  // Backend now accepts either a remote URL or a stored relative path; allow any non-empty string
  featured_image_url: z.string().trim().min(1).nullable().optional(),
  canonical_url: z.string().trim().url().nullable().optional(),
  meta_title: z.string().trim().max(160).nullable().optional(),
  meta_description: z.string().trim().nullable().optional(),
  og_image_url: z.string().trim().min(1).nullable().optional(),
  // allow selecting author explicitly; backend falls back to current user
  author_id: z.coerce.number().int().optional(),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']).default('draft'),
  published_at: z.string().datetime().nullable().optional(),
  tags: z.array(z.string().trim().min(2).max(64)).optional(),
  categories: z.array(z.string().trim().min(2).max(64)).optional(),
})

export const AdminArticleCreateSchema = AdminArticleBaseSchema.superRefine((data, ctx) => {
  const requiresPublishDate = data.status === 'published' || data.status === 'scheduled'
  if (requiresPublishDate && !data.published_at) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['published_at'],
      message: 'Published articles require a publish date',
    })
  }

  const content = typeof data.content === 'string' ? data.content.trim() : ''
  if (!content) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['content'],
      message: 'Content is required',
    })
  }
})

export const AdminArticleUpdateSchema = AdminArticleBaseSchema.partial().superRefine((data, ctx) => {
  if (!data.status) return
  const requiresPublishDate = data.status === 'published' || data.status === 'scheduled'
  if (requiresPublishDate && data.published_at === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['published_at'],
      message: 'Provide a publish date when publishing or scheduling an article',
    })
  }
})

export type AdminArticleCreateInput = z.infer<typeof AdminArticleCreateSchema>
export type AdminArticleUpdateInput = z.infer<typeof AdminArticleUpdateSchema>

// Frontend payload types for multipart support
export type AdminArticleCreatePayload = AdminArticleCreateInput & {
  featured_image?: File | null
  og_image?: File | null
}

export type AdminArticleUpdatePayload = AdminArticleUpdateInput & {
  featured_image?: File | null
  og_image?: File | null
  remove_featured_image?: boolean
  remove_og_image?: boolean
}
