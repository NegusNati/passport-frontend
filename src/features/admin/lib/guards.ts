import { redirect } from '@tanstack/react-router'

import { queryClient } from '@/api/queryClient'
import { authKeys, fetchMe } from '@/features/auth/api'
import type { User } from '@/features/auth/schemas/user'

export type AdminCandidate =
  | (User & {
      role?: string | null
      roles?: string[] | null
      permissions?: string[] | null
    })
  | null
  | undefined

export function isAdminUser(candidate: AdminCandidate): candidate is User {
  if (!candidate) return false
  if (candidate.is_admin === true) return true

  const roles = Array.isArray(candidate.roles)
    ? candidate.roles.map((value) => value.toLowerCase())
    : []
  if (roles.includes('admin') || roles.includes('superadmin')) {
    return true
  }

  const legacyRole = typeof candidate.role === 'string' ? candidate.role.toLowerCase() : null
  if (legacyRole === 'admin' || legacyRole === 'superadmin') {
    return true
  }

  return false
}

export function hasPermission(candidate: AdminCandidate, permission: string) {
  if (!candidate) return false
  return Array.isArray(candidate.permissions) ? candidate.permissions.includes(permission) : false
}

export function ensureAdmin(options: {
  user: AdminCandidate
  redirectTo?: string
  loginRedirect?: string
  requiredPermission?: string
}) {
  const { user, redirectTo = '/', loginRedirect = '/admin', requiredPermission } = options
  if (!user) {
    throw redirect({
      to: '/login',
      search: { redirect: loginRedirect },
    })
  }

  if (!isAdminUser(user)) {
    if (requiredPermission && hasPermission(user, requiredPermission)) {
      return user
    }
    throw redirect({ to: redirectTo })
  }

  return user
}

export async function loadAdminUser(options?: {
  redirectTo?: string
  loginRedirect?: string
  requiredPermission?: string
}) {
  const user = await queryClient.ensureQueryData({
    queryKey: authKeys.user(),
    queryFn: fetchMe,
  })

  return ensureAdmin({
    user,
    redirectTo: options?.redirectTo,
    loginRedirect: options?.loginRedirect ?? '/admin',
    requiredPermission: options?.requiredPermission,
  })
}
