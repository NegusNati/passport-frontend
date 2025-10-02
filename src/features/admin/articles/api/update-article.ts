import { useMutation, useQueryClient } from '@tanstack/react-query'

import { api } from '@/api/client'
import { adminKeys } from '@/features/admin/lib/keys'

import { AdminArticleDetailResponseSchema } from '../schemas/article'
import {
  type AdminArticleUpdatePayload,
  AdminArticleUpdateSchema,
} from '../schemas/create'
import { extractAdminArticleErrorMessage } from './errors'

export type UpdateAdminArticleInput = {
  articleId: string
  payload: AdminArticleUpdatePayload
  etag?: string
}

export type UpdateAdminArticleVariables = {
  payload: AdminArticleUpdatePayload
  etag?: string
}

function buildFormDataFromUpdate(input: AdminArticleUpdatePayload) {
  const { featured_image, og_image, remove_featured_image, remove_og_image, ...rest } = input
  const parsed = AdminArticleUpdateSchema.parse(rest)
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
  // removal flags
  if (remove_featured_image) form.append('remove_featured_image', 'true')
  if (remove_og_image) form.append('remove_og_image', 'true')
  // files
  if (featured_image) form.append('featured_image', featured_image)
  if (og_image) form.append('og_image', og_image)
  return form
}

export async function updateAdminArticle({ articleId, payload, etag }: UpdateAdminArticleInput) {
  const form = buildFormDataFromUpdate(payload)
  try {
    const response = await api.patch(`/api/v1/admin/articles/${articleId}`, form, {
      headers: etag ? { 'If-Match': etag } : undefined,
    })
    return AdminArticleDetailResponseSchema.parse(response.data).data
  } catch (error) {
    throw new Error(
      extractAdminArticleErrorMessage(error, 'Failed to update article. Please review the form and try again.'),
    )
  }
}

export function useUpdateAdminArticleMutation(articleId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ payload, etag }: UpdateAdminArticleVariables) =>
      updateAdminArticle({ articleId, payload, etag }),
    onSuccess: async (article) => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.articles.all() })
      await queryClient.invalidateQueries({ queryKey: adminKeys.articles.detail(articleId) })
      if (article.slug && article.slug !== articleId) {
        await queryClient.invalidateQueries({ queryKey: adminKeys.articles.detail(article.slug) })
      }
      return article
    },
  })
}
