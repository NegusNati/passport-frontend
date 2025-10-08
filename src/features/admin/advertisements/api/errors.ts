import type { AxiosError } from 'axios'

type ErrorResponse = {
  message?: string
  errors?: Record<string, string[]>
}

export function extractAdvertisementErrorMessage(
  error: unknown,
  fallback = 'An error occurred',
): string {
  if (!error) return fallback

  const axiosError = error as AxiosError<ErrorResponse>

  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message
  }

  if (axiosError.response?.data?.errors) {
    const errors = axiosError.response.data.errors
    const firstError = Object.values(errors)[0]
    if (firstError && firstError.length > 0) {
      return firstError[0]
    }
  }

  if (axiosError.message) {
    return axiosError.message
  }

  return fallback
}
