import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys, hashParams } from '@/features/admin/lib/keys'

import {
  type AdminArticlesListResponse,
  AdminArticlesListResponseSchema,
} from '../schemas/article'
import { type ArticlesSearchParams, sanitizeArticlesQuery } from '../schemas/filters'

export async function fetchAdminArticles(params: ArticlesSearchParams) {
  const response = await api.get('/api/v1/articles', {
    params: {
      include: 'author,tags,categories',
      ...sanitizeArticlesQuery(params),
    },
  })

  return AdminArticlesListResponseSchema.parse(response.data)
}

export function useAdminArticlesQuery(params: ArticlesSearchParams) {
  const paramsHash = hashParams(params)

  return useQuery<AdminArticlesListResponse>({
    queryKey: adminKeys.articles.list(paramsHash),
    queryFn: () => fetchAdminArticles(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}
