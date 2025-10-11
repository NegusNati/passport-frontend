import { z } from 'zod'

import { ArticleApiItem } from '../lib/ArticlesSchema'

const filterValue = z.union([z.literal('all'), z.string().min(1)])
const dateRangeValue = z.union([
  z.literal('all'),
  z.literal('7d'),
  z.literal('30d'),
  z.literal('90d'),
])

export const ArticleSearch = z.object({
  query: z.string().min(1, 'Search query is required').max(120, 'Please shorten your search query'),
})

export type ArticleSearch = z.infer<typeof ArticleSearch>

export const Article = ArticleApiItem
export type Article = z.infer<typeof Article>

export const ArticleSummary = z.object({
  id: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string().optional(),
  author: z.string(),
  publishedDate: z.string(),
  imageUrl: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  readTime: z.number().nonnegative(),
  featured: z.boolean().default(false),
})

export type ArticleSummary = z.infer<typeof ArticleSummary>

export const ArticleFilters = z.object({
  category: filterValue.default('all'),
  tag: filterValue.default('all'),
  dateRange: dateRangeValue.default('all'),
})

export type ArticleFilters = z.infer<typeof ArticleFilters>

export const PaginationParams = z.object({
  page: z.number().int().min(1).default(1),
  page_size: z.number().int().min(1).max(50).default(12),
})

export type PaginationParams = z.infer<typeof PaginationParams>
