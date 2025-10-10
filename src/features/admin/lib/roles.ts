import type { User } from '@/features/auth/schemas/user'

import type { AdminUser } from '../users/schemas/user'

export const ADMIN_PRIMARY_ROLES = ['admin', 'editor'] as const
export type AdminPrimaryRole = (typeof ADMIN_PRIMARY_ROLES)[number] | 'user'

type RoleCandidate =
  | (AdminUser & { role?: string | null })
  | (User & { role?: string | null })
  | null
  | undefined

export function resolveAdminPrimaryRole(user: RoleCandidate): AdminPrimaryRole {
  if (!user) return 'user'

  const normalizedRoles = Array.isArray(user.roles)
    ? user.roles.map((role) => role.toLowerCase())
    : []

  if (user.is_admin || normalizedRoles.includes('admin')) {
    return 'admin'
  }

  if (normalizedRoles.includes('editor')) {
    return 'editor'
  }

  const legacyRole = typeof user.role === 'string' ? user.role.toLowerCase() : null
  if (legacyRole === 'admin') return 'admin'
  if (legacyRole === 'editor') return 'editor'

  return 'user'
}
