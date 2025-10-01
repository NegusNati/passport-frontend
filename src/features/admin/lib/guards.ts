import { redirect } from '@tanstack/react-router'

import type { User } from '@/features/auth/schemas/user'

export type AdminCandidate = (User & { role?: string | null; is_admin?: boolean | null }) | null | undefined

export function isAdminUser(candidate: AdminCandidate): candidate is User {
  if (!candidate) return false
  const role = typeof candidate.role === 'string' ? candidate.role.toLowerCase() : null
  const flag = typeof candidate.is_admin === 'boolean' ? candidate.is_admin : null
  if (flag === true) return true
  if (role === 'admin' || role === 'superadmin') return true
  return false
}

export function ensureAdmin(options: {
  user: AdminCandidate
  redirectTo?: string
  loginRedirect?: string
}) {
  const { user, redirectTo = '/', loginRedirect = '/admin' } = options
  if (!user) {
    throw redirect({
      to: '/login',
      search: { redirect: loginRedirect },
    })
  }

  if (!isAdminUser(user)) {
    throw redirect({ to: redirectTo })
  }

  return user
}
