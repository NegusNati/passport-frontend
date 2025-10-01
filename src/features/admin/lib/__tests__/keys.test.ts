import { describe, expect, it } from 'vitest'

import { hashParams } from '../keys'

describe('hashParams', () => {
  it('produces consistent hash for same params regardless of order', () => {
    const a = hashParams({ page: 1, q: 'foo', status: 'active' })
    const b = hashParams({ status: 'active', q: 'foo', page: 1 })
    expect(a).toEqual(b)
  })

  it('ignores undefined and null values', () => {
    const a = hashParams({ page: 1, q: undefined })
    const b = hashParams({ page: 1 })
    expect(a).toEqual(b)
  })

  it('stringifies object values deterministically', () => {
    const a = hashParams({ filters: { role: 'admin' } })
    const b = hashParams({ filters: { role: 'admin' } })
    expect(a).toEqual(b)
  })
})
