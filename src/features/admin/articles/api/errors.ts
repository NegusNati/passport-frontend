import type { ApiError } from '@/api/client'

type ErrorPayload = {
  message?: string
  code?: string
  details?: Record<string, unknown>
  errors?: Record<string, unknown>
}

type DetailSource = Record<string, unknown> | undefined

function extractDetailMessage(source: DetailSource) {
  if (!source || typeof source !== 'object') return undefined
  const [firstValue] = Object.values(source)
  if (Array.isArray(firstValue)) {
    const [firstItem] = firstValue
    if (typeof firstItem === 'string' && firstItem.trim().length > 0) {
      return firstItem
    }
  }
  if (typeof firstValue === 'string' && firstValue.trim().length > 0) {
    return firstValue
  }
  return undefined
}

export function extractAdminArticleErrorMessage(error: unknown, fallback: string) {
  const apiError = error as ApiError | undefined
  const payload = apiError?.response?.data as ErrorPayload | undefined

  const detailMessage =
    extractDetailMessage(payload?.details) ?? extractDetailMessage(payload?.errors)

  const message =
    (typeof payload?.message === 'string' && payload.message.trim().length > 0
      ? payload.message
      : undefined) ??
    detailMessage ??
    (typeof apiError?.message === 'string' && apiError.message.trim().length > 0
      ? apiError.message
      : undefined)

  return message ?? fallback
}
