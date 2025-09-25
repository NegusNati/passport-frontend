import axios, { AxiosError } from 'axios'

import { env } from '@/shared/lib/env'

// Centralized Axios instance with sane defaults and interceptors
export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // You may configure timeout as needed
  timeout: 20_000,
})

// Attach Authorization header if a token exists (adjust storage strategy as needed)
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  if (token) {
    config.headers = config.headers ?? {}
    ;(config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Normalize errors
export type ApiErrorPayload = {
  message?: string
  code?: string | number
  details?: unknown
}

export class ApiError extends Error {
  status?: number
  payload?: ApiErrorPayload
  constructor(message: string, opts?: { status?: number; payload?: ApiErrorPayload }) {
    super(message)
    this.name = 'ApiError'
    this.status = opts?.status
    this.payload = opts?.payload
  }
}

apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const status = err.response?.status
    const payload = err.response?.data as ApiErrorPayload | undefined
    const message = payload?.message ?? err.message ?? 'Request failed'
    return Promise.reject(new ApiError(message, { status, payload }))
  },
)

// Small helper for GET with typed response
export async function getJSON<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await apiClient.get<T>(url, { params })
  return res.data
}

// Small helper for POST with typed response
export async function postJSON<T, B = unknown>(url: string, body?: B): Promise<T> {
  const res = await apiClient.post<T>(url, body)
  return res.data
}
