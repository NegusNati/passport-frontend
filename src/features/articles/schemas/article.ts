import { z } from 'zod'

// Article search form schema
export const ArticleSearch = z.object({
  query: z.string().min(1, 'Search query is required'),
})

export type ArticleSearch = z.infer<typeof ArticleSearch>

// Article data schema
export const Article = z.object({
  id: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string().optional(),
  author: z.string(),
  publishedDate: z.string(),
  imageUrl: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  readTime: z.number().min(1), // in minutes
  featured: z.boolean().default(false),
})

export type Article = z.infer<typeof Article>

// Filter schemas
export const ArticleFilters = z.object({
  category: z.string().default('all'),
  tag: z.string().default('all'),
  dateRange: z.string().default('all'),
})

export type ArticleFilters = z.infer<typeof ArticleFilters>

// Pagination schema
export const PaginationParams = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(50).default(12),
})

export type PaginationParams = z.infer<typeof PaginationParams>

// Category and tag enums for filtering
export const ARTICLE_CATEGORIES = [
  'Travel',
  'Passport', 
  'Visa',
  'Immigration',
  'Documentation',
  'Tips',
] as const

export const ARTICLE_TAGS = [
  'urgent',
  'renewal',
  'first-time',
  'international',
  'domestic',
  'requirements',
  'processing-time',
  'fees',
  'documents',
  'appointment',
] as const

export type ArticleCategory = typeof ARTICLE_CATEGORIES[number]
export type ArticleTag = typeof ARTICLE_TAGS[number]
