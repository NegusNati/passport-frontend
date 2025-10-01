import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

import { AdminArticleDetailResponseSchema } from '../schemas/article'
import { type AdminArticleCreateInput,AdminArticleCreateSchema } from '../schemas/create'

export async function createAdminArticle(input: AdminArticleCreateInput) {
  const payload = AdminArticleCreateSchema.parse(input)
  const response = await api.post('/api/v1/articles', payload)
  return AdminArticleDetailResponseSchema.parse(response.data).data
}

export function useCreateAdminArticleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createAdminArticle,
    onSuccess: async (article) => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.articles.all() })
      await queryClient.invalidateQueries({ queryKey: adminKeys.articles.detail(article.slug) })
      return article
    },
  })
}
