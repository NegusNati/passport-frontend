import { describe, expect, it } from 'vitest'

import { UsersSearchSchema } from '../filters'

describe('UsersSearchSchema', () => {
  it('applies defaults when values are missing', () => {
    const parsed = UsersSearchSchema.parse({})
    expect(parsed.page).toBe(1)
    expect(parsed.page_size).toBe(20)
    expect(parsed.search).toBeUndefined()
  })

  it('coerces values from strings and trims text', () => {
    const parsed = UsersSearchSchema.parse({ page: '2', page_size: '50', q: ' test ' })
    expect(parsed.page).toBe(2)
    expect(parsed.page_size).toBe(50)
    expect(parsed.search).toBe('test')
  })
})
