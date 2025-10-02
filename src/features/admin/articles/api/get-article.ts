import { useQuery } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

import { AdminArticleDetailResponseSchema } from '../schemas/article'

export async function fetchAdminArticle(articleId: string) {
  const response = await api.get(`/api/v1/articles/${articleId}`, {
    params: { include: 'author,tags,categories' },
  })
  return AdminArticleDetailResponseSchema.parse(response.data)
}

export function useAdminArticleQuery(articleId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: adminKeys.articles.detail(articleId),
    queryFn: () => fetchAdminArticle(articleId),
    enabled: (options?.enabled ?? true) && Boolean(articleId),
    staleTime: 30_000,
  })
}
