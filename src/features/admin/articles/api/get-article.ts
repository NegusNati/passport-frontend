import { useQuery } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

import { AdminArticleDetailResponseSchema } from '../schemas/article'

export async function fetchAdminArticle(slug: string) {
  const response = await api.get(`/api/v1/articles/${slug}`)
  return AdminArticleDetailResponseSchema.parse(response.data)
}

export function useAdminArticleQuery(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: adminKeys.articles.detail(slug),
    queryFn: () => fetchAdminArticle(slug),
    enabled: (options?.enabled ?? true) && Boolean(slug),
    staleTime: 30_000,
  })
}
