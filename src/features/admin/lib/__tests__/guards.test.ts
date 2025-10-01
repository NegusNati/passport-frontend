import { describe, expect, it } from 'vitest'

import { hasPermission, isAdminUser } from '../guards'

const baseUser = {
  id: 1,
  first_name: 'Admin',
  last_name: 'User',
  phone_number: '0911000000',
  email: 'admin@example.com',
  email_verified_at: null,
  plan_type: null,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  is_admin: false,
  roles: [] as string[],
  permissions: [] as string[],
}

describe('isAdminUser', () => {
  it('returns true when is_admin flag is true', () => {
    expect(isAdminUser({ ...baseUser, is_admin: true })).toBe(true)
  })

  it('returns true when roles array includes admin', () => {
    expect(isAdminUser({ ...baseUser, roles: ['editor', 'admin'] })).toBe(true)
  })

  it('returns true when legacy role is admin', () => {
    expect(isAdminUser({ ...baseUser, role: 'admin' })).toBe(true)
  })

  it('returns false for non-admin users', () => {
    expect(isAdminUser({ ...baseUser, role: 'user', is_admin: false })).toBe(false)
  })

  it('returns false when user is null', () => {
    expect(isAdminUser(null)).toBe(false)
  })
})

describe('hasPermission', () => {
  it('detects permission membership', () => {
    expect(hasPermission({ ...baseUser, permissions: ['upload-files'] }, 'upload-files')).toBe(true)
  })

  it('returns false when permission missing', () => {
    expect(hasPermission({ ...baseUser, permissions: [] }, 'upload-files')).toBe(false)
  })
})
