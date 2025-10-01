import { z } from 'zod'

export const AdminArticleCreateSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().max(255).optional().nullable(),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  featured_image_url: z.string().url().nullable().optional(),
  canonical_url: z.string().url().nullable().optional(),
  meta_title: z.string().max(255).nullable().optional(),
  meta_description: z.string().nullable().optional(),
  og_image_url: z.string().url().nullable().optional(),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']),
  published_at: z.string().datetime().nullable().optional(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
})

export type AdminArticleCreateInput = z.infer<typeof AdminArticleCreateSchema>
