import { keepPreviousData, type QueryClient, type QueryKey, useQuery } from '@tanstack/react-query'

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

const LIST_STALE_TIME = 60_000
const DETAIL_STALE_TIME = 5 * 60_000
const CACHE_TIME = 30 * 60_000

export function getArticlesListQueryOptions(params: ListParams) {
  return {
    queryKey: articlesKeys.list(params) as QueryKey,
    queryFn: () => fetchArticles(params),
    placeholderData: keepPreviousData,
    staleTime: LIST_STALE_TIME,
    gcTime: CACHE_TIME,
    networkMode: 'offlineFirst' as const,
  }
}

export function getArticleQueryOptions(slug: string) {
  return {
    queryKey: articlesKeys.detail(slug) as QueryKey,
    queryFn: () => fetchArticleBySlug(slug),
    staleTime: DETAIL_STALE_TIME,
    gcTime: CACHE_TIME,
    networkMode: 'offlineFirst' as const,
  }
}

export function getCategoriesQueryOptions() {
  return {
    queryKey: articlesKeys.categories() as QueryKey,
    queryFn: () => fetchCategories(),
    staleTime: 10 * 60_000,
    gcTime: CACHE_TIME,
    networkMode: 'offlineFirst' as const,
  }
}

export function getTagsQueryOptions() {
  return {
    queryKey: articlesKeys.tags() as QueryKey,
    queryFn: () => fetchTags(),
    staleTime: 10 * 60_000,
    gcTime: CACHE_TIME,
    networkMode: 'offlineFirst' as const,
  }
}

export function useArticlesQuery(params: ListParams, options?: { enabled?: boolean }) {
  return useQuery({
    ...getArticlesListQueryOptions(params),
    enabled: options?.enabled ?? true,
  })
}

export function useArticleQuery(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    ...getArticleQueryOptions(slug),
    enabled: (options?.enabled ?? true) && !!slug,
  })
}

export function useCategoriesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    ...getCategoriesQueryOptions(),
    enabled: options?.enabled ?? true,
  })
}

export function useTagsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    ...getTagsQueryOptions(),
    enabled: options?.enabled ?? true,
  })
}

export function prefetchArticleDetail(queryClient: QueryClient, slug: string) {
  return queryClient.prefetchQuery(getArticleQueryOptions(slug))
}
