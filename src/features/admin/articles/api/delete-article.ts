import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

import { extractAdminArticleErrorMessage } from './errors'

export async function deleteAdminArticle(articleId: string) {
  try {
    await api.delete(`/api/v1/admin/articles/${articleId}`)
  } catch (error) {
    throw new Error(extractAdminArticleErrorMessage(error, 'Failed to delete article.'))
  }
}

export function useDeleteAdminArticleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAdminArticle,
    onSuccess: async (_, articleId) => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.articles.all() })
      if (articleId) {
        await queryClient.invalidateQueries({ queryKey: adminKeys.articles.detail(articleId) })
      }
    },
  })
}
