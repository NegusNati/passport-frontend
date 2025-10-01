import {
  useMutation,
  type UseMutationOptions,
  useQuery,
  type UseQueryOptions,
} from '@tanstack/react-query'

import { queryClient } from '@/api/queryClient'

import {
  type ApiError,
  authKeys,
  fetchMe,
  login,
  logout,
  register,
} from '../api'
import type { LoginInput } from '../schemas/login'
import type { RegisterInput } from '../schemas/register'
import type { User } from '../schemas/user'

type AuthUserQueryKey = ReturnType<typeof authKeys.user>

type UseAuthUserOptions<TData> = Omit<
  UseQueryOptions<User, ApiError, TData, AuthUserQueryKey>,
  'queryKey' | 'queryFn'
>

export function useAuthUser<TData = User>(options?: UseAuthUserOptions<TData>) {
  return useQuery<User, ApiError, TData, AuthUserQueryKey>({
    queryKey: authKeys.user(),
    queryFn: fetchMe,
    ...(options ?? {}),
  })
}

type LoginMutationOptions = UseMutationOptions<User, ApiError, LoginInput, unknown>
type RegisterMutationOptions = UseMutationOptions<User, ApiError, RegisterInput, unknown>
type LogoutMutationOptions = UseMutationOptions<void, ApiError, void, unknown>

export function useLogin(options?: LoginMutationOptions) {
  return useMutation({
    mutationFn: login,
    ...(options ?? {}),
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: authKeys.user() })
      await options?.onSuccess?.(data, variables, context, mutation)
    },
  })
}

export function useRegister(options?: RegisterMutationOptions) {
  return useMutation({
    mutationFn: register,
    ...(options ?? {}),
    onSuccess: async (data, variables, context, mutation) => {
      await queryClient.invalidateQueries({ queryKey: authKeys.user() })
      await options?.onSuccess?.(data, variables, context, mutation)
    },
  })
}

export function useLogout(options?: LogoutMutationOptions) {
  return useMutation({
    mutationFn: logout,
    ...(options ?? {}),
    onSuccess: async (data, variables, context, mutation) => {
      await options?.onSuccess?.(data, variables, context, mutation)
    },
  })
}
