import type { GregorianDate } from 'negus-ethiopic-gregorian'
import { toEthiopic } from 'negus-ethiopic-gregorian'

const ETHIOPIAN_MONTHS_AMHARIC = [
  'መስከረም',
  'ጥቅምት',
  'ህዳር',
  'ታህሳስ',
  'ጥር',
  'የካቲት',
  'መጋቢት',
  'ሚያዝያ',
  'ግንቦት',
  'ሰኔ',
  'ሃምሌ',
  'ነሐሴ',
  'ጳጉሜ',
] as const

type EthiopianDateFormatOptions = {
  includeEra?: boolean
  fallback?: string
  showGregorianInParentheses?: boolean
}

export function formatGregorianApiDateAsEthiopian(
  value: string,
  options?: EthiopianDateFormatOptions,
): string {
  const parsed = parseGregorianDate(value)
  if (!parsed) return options?.fallback ?? value

  const ethiopic = toEthiopic(parsed)
  const monthLabel = ETHIOPIAN_MONTHS_AMHARIC[ethiopic.month - 1]
  if (!monthLabel) return options?.fallback ?? value

  const era = options?.includeEra === false ? '' : ' ዓ.ም'
  const ethiopianValue = `${monthLabel} ${ethiopic.day}, ${ethiopic.year}${era}`

  if (options?.showGregorianInParentheses) {
    return `${ethiopianValue} (${toDmy(parsed.day, parsed.month, parsed.year)})`
  }

  return ethiopianValue
}

function parseGregorianDate(value: string): GregorianDate | null {
  const trimmed = value.trim()
  const ymdMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed)
  if (ymdMatch) {
    const year = Number(ymdMatch[1])
    const month = Number(ymdMatch[2])
    const day = Number(ymdMatch[3])
    if (
      Number.isFinite(year) &&
      Number.isFinite(month) &&
      Number.isFinite(day) &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31
    ) {
      const utc = new Date(Date.UTC(year, month - 1, day))
      if (
        utc.getUTCFullYear() === year &&
        utc.getUTCMonth() + 1 === month &&
        utc.getUTCDate() === day
      ) {
        return { year, month, day }
      }
    }

    return null
  }

  const date = new Date(trimmed)
  if (Number.isNaN(date.getTime())) return null

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

function toDmy(day: number, month: number, year: number) {
  const dd = String(day).padStart(2, '0')
  const mm = String(month).padStart(2, '0')
  const yyyy = String(year).padStart(4, '0')
  return `${dd}/${mm}/${yyyy}`
}
