import { keepPreviousData, type QueryKey, useQuery } from '@tanstack/react-query'

import {
  fetchArticleBySlug,
  fetchArticles,
  fetchCategories,
  fetchTags,
  type ListParams,
} from './ArticlesApi'

export const articlesKeys = {
  all: ['articles'] as const,
  list: (params: Partial<ListParams> = {}) => [...articlesKeys.all, 'list', params] as const,
  detail: (slug: string) => [...articlesKeys.all, 'detail', slug] as const,
  categories: () => [...articlesKeys.all, 'categories'] as const,
  tags: () => [...articlesKeys.all, 'tags'] as const,
}

export function useArticlesQuery(params: ListParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: articlesKeys.list(params) as QueryKey,
    queryFn: () => fetchArticles(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled: options?.enabled ?? true,
  })
}

export function useArticleQuery(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: articlesKeys.detail(slug) as QueryKey,
    queryFn: () => fetchArticleBySlug(slug),
    staleTime: 60_000,
    enabled: (options?.enabled ?? true) && !!slug,
  })
}

export function useCategoriesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: articlesKeys.categories() as QueryKey,
    queryFn: () => fetchCategories(),
    staleTime: 10 * 60_000,
    enabled: options?.enabled ?? true,
  })
}

export function useTagsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: articlesKeys.tags() as QueryKey,
    queryFn: () => fetchTags(),
    staleTime: 10 * 60_000,
    enabled: options?.enabled ?? true,
  })
}
