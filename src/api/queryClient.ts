import { QueryClient } from '@tanstack/react-query'

import type { ApiError } from './client'

function shouldRetryQuery(failureCount: number, error: unknown) {
  const status = (error as ApiError | undefined)?.response?.status
  if (status === 401 || status === 422) {
    return false
  }
  if (status === 429) {
    return failureCount < 1
  }
  return failureCount < 2
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: shouldRetryQuery,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})
