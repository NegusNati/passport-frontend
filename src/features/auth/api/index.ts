import {
  api,
  type ApiError,
  AUTH_TOKEN_STORAGE_KEY,
  clearAuthToken,
  setAuthToken,
} from '@/api/client'
import { queryClient } from '@/api/queryClient'

import type { LoginInput } from '../schemas/login'
import type { RegisterInput } from '../schemas/register'
import { AuthTokenResponseSchema, MeResponseSchema } from '../schemas/session'
import type { User } from '../schemas/user'

export const authKeys = {
  all: ['auth'] as const,
  user: () => ['auth', 'user'] as const,
}

function persistToken(token: string) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
}

export async function login(payload: LoginInput) {
  const deviceName = payload.deviceName?.trim()
  const phoneNumber = payload.phoneNumber.replace(/\D/g, '')
  const response = await api.post('/api/v1/auth/login', {
    phone_number: phoneNumber,
    password: payload.password,
    ...(deviceName ? { device_name: deviceName } : {}),
  })

  const parsed = AuthTokenResponseSchema.parse(response.data)
  setAuthToken(parsed.token)
  persistToken(parsed.token)
  queryClient.setQueryData(authKeys.user(), parsed.user)
  return parsed.user
}

export async function register(payload: RegisterInput) {
  const deviceName = payload.deviceName?.trim()
  const phoneNumber = payload.phoneNumber.replace(/\D/g, '')
  const response = await api.post('/api/v1/auth/register', {
    first_name: payload.firstName,
    last_name: payload.lastName,
    phone_number: phoneNumber,
    email: payload.email,
    password: payload.password,
    password_confirmation: payload.passwordConfirmation,
    ...(deviceName ? { device_name: deviceName } : {}),
  })

  const parsed = AuthTokenResponseSchema.parse(response.data)
  setAuthToken(parsed.token)
  persistToken(parsed.token)
  queryClient.setQueryData(authKeys.user(), parsed.user)
  return parsed.user
}

export async function fetchMe(): Promise<User> {
  const response = await api.get('/api/v1/auth/me')
  const parsed = MeResponseSchema.parse(response.data)
  return parsed.data
}

export async function logout() {
  await api.post('/api/v1/auth/logout')
  clearAuthToken()
  queryClient.removeQueries({ queryKey: authKeys.all })
}

export type { ApiError }
