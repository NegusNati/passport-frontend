import axios, { type AxiosError } from 'axios'

import { env } from '@/shared/lib/env'

export type ApiError = AxiosError & { retryAfterSeconds?: number }

export const AUTH_TOKEN_STORAGE_KEY = 'auth-token'

let authToken: string | null = null

export const api = axios.create({
  baseURL:  env.API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: false,
  timeout: 20_000,
})

export function setAuthToken(token: string | null) {
  authToken = token
}

export function getAuthToken() {
  return authToken
}

export function clearAuthToken() {
  authToken = null
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  }
}

export function restoreAuthTokenFromStorage() {
  if (typeof window === 'undefined') return null
  const persisted = sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  if (persisted) {
    authToken = persisted
  }
  return persisted
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const axiosError = error as ApiError
    if (axiosError.response?.status === 429) {
      const retryAfter = axiosError.response.headers?.['retry-after']
      const parsed = Number(retryAfter)
      axiosError.retryAfterSeconds = Number.isFinite(parsed) ? parsed : undefined
    }
    return Promise.reject(axiosError)
  },
)
