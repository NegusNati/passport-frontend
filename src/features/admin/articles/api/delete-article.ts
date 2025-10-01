import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

export async function deleteAdminArticle(slug: string) {
  await api.delete(`/api/v1/articles/${slug}`)
}

export function useDeleteAdminArticleMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAdminArticle,
    onSuccess: async (_, slug) => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.articles.all() })
      await queryClient.invalidateQueries({ queryKey: adminKeys.articles.detail(slug) })
    },
  })
}
