import { describe, expect, it } from 'vitest'

import { formatGregorianApiDateAsEthiopian } from '../ethiopian-date'

describe('formatGregorianApiDateAsEthiopian', () => {
  it('formats YYYY-MM-DD using Ethiopian month name', () => {
    expect(formatGregorianApiDateAsEthiopian('2026-03-26')).toBe('መጋቢት 17, 2018 ዓ.ም')
  })

  it('formats ISO timestamps using the date portion', () => {
    expect(formatGregorianApiDateAsEthiopian('2026-03-26T10:05:00+00:00')).toBe('መጋቢት 17, 2018 ዓ.ም')
  })

  it('optionally appends Gregorian date in parentheses', () => {
    expect(
      formatGregorianApiDateAsEthiopian('2026-03-26', {
        showGregorianInParentheses: true,
      }),
    ).toBe('መጋቢት 17, 2018 ዓ.ም (26/03/2026)')
  })

  it('returns fallback on invalid input', () => {
    expect(
      formatGregorianApiDateAsEthiopian('invalid-date', {
        fallback: 'Invalid',
      }),
    ).toBe('Invalid')
  })

  it('returns fallback on invalid calendar day', () => {
    expect(
      formatGregorianApiDateAsEthiopian('2026-02-31', {
        fallback: 'Invalid',
      }),
    ).toBe('Invalid')
  })
})
