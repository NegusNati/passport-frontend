import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

import { AdminArticleDetailResponseSchema } from '../schemas/article'
import { type AdminArticleCreateInput,AdminArticleCreateSchema } from '../schemas/create'

export type UpdateAdminArticleInput = {
  slug: string
  payload: Partial<AdminArticleCreateInput>
}

export async function updateAdminArticle({ slug, payload }: UpdateAdminArticleInput) {
  const parsed = AdminArticleCreateSchema.partial().parse(payload)
  const response = await api.patch(`/api/v1/articles/${slug}`, parsed)
  return AdminArticleDetailResponseSchema.parse(response.data).data
}

export function useUpdateAdminArticleMutation(slug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<AdminArticleCreateInput>) => updateAdminArticle({ slug, payload }),
    onSuccess: async (article) => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.articles.all() })
      await queryClient.invalidateQueries({ queryKey: adminKeys.articles.detail(slug) })
      return article
    },
  })
}
