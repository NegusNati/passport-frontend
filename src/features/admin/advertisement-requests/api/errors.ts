import type { AxiosError } from 'axios'

export function extractAdminAdvertisementRequestErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>
    const data = axiosError.response?.data
    if (data?.message) return data.message
    if (data?.errors) {
      const firstError = Object.values(data.errors)[0]
      if (firstError && firstError[0]) return firstError[0]
    }
  }
  return fallback
}
