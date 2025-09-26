import { z } from 'zod'

import { getJSON } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/lib/API_ENDPOINTS'

import {
  ArticleDetailResponse,
  ArticleListResponse,
  CategoriesResponse,
  TagsResponse,
} from './ArticlesSchema'

const yyyyMmDd = /^\d{4}-\d{2}-\d{2}$/

export const ListParams = z.object({
  title: z.string().optional(),
  q: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  published_after: z.string().regex(yyyyMmDd, 'YYYY-MM-DD').optional(),
  published_before: z.string().regex(yyyyMmDd, 'YYYY-MM-DD').optional(),
  per_page: z.number().int().min(1).max(200).optional().default(20),
  page: z.number().int().min(1).optional().default(1),
  sort: z
    .enum(['published_at', 'created_at', 'updated_at', 'title'])
    .optional()
    .default('published_at'),
  sort_dir: z.enum(['asc', 'desc']).optional().default('desc'),
})

export type ListParams = z.infer<typeof ListParams>

export async function fetchArticles(params: Partial<ListParams> = {}) {
  const parsed = ListParams.parse(params)
  const data = await getJSON<unknown>(API_ENDPOINTS.V1.ARTICLES.ROOT, parsed)
  return ArticleListResponse.parse(data)
}

export async function fetchArticleBySlug(slug: string) {
  const data = await getJSON<unknown>(API_ENDPOINTS.V1.ARTICLES.BY_SLUG(slug))
  return ArticleDetailResponse.parse(data)
}

export async function fetchCategories() {
  const data = await getJSON<unknown>(API_ENDPOINTS.V1.CATEGORIES)
  return CategoriesResponse.parse(data)
}

export async function fetchTags() {
  const data = await getJSON<unknown>(API_ENDPOINTS.V1.TAGS)
  return TagsResponse.parse(data)
}
