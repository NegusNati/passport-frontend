import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

import { AdminArticleDetailResponseSchema } from '../schemas/article'
import {
  type AdminArticleCreatePayload,
  AdminArticleCreateSchema,
} from '../schemas/create'
import { extractAdminArticleErrorMessage } from './errors'

function buildFormDataFromCreate(input: AdminArticleCreatePayload) {
  const { featured_image, og_image, ...rest } = input
  const parsed = AdminArticleCreateSchema.parse(rest)
  const form = new FormData()
  // text fields
  Object.entries(parsed).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (Array.isArray(value)) {
      value.forEach((v) => form.append(`${key}[]`, String(v)))
    } else {
      form.append(key, String(value))
    }
  })
  // files
  if (featured_image) form.append('featured_image', featured_image)
  if (og_image) form.append('og_image', og_image)
  return form
}

export async function createAdminArticle(input: AdminArticleCreatePayload) {
  const form = buildFormDataFromCreate(input)
  try {
    const response = await api.post('/api/v1/admin/articles', form)
    return AdminArticleDetailResponseSchema.parse(response.data).data
  } catch (error) {
    throw new Error(
      extractAdminArticleErrorMessage(error, 'Failed to create article. Please review the form and try again.'),
    )
  }
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
