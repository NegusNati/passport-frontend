import { api } from '@/api/client'

export async function getJSON<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await api.get<T>(url, { params })
  return response.data
}

export async function postJSON<T, B = unknown>(url: string, body?: B): Promise<T> {
  const response = await api.post<T>(url, body)
  return response.data
}
