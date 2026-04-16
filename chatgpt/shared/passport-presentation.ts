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

type WeekdayId = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

export type PassportPresentationInput = {
  id: string
  requestNumber: string
  fullName: string
  firstName: string
  middleName?: string
  lastName: string
  location: string
  publishedDate: string
  detailUrl: string
}

export type PassportPresentation = PassportPresentationInput & {
  surname: string
  givenName: string
  receiveAfterLabel: string
  pickupDays: string[]
  pickupDaysLabel: string
  pickupTimeLabel: string
  readyHeadline: string
  pickupNotice: string
  sourceLabel: string
}

const PICKUP_DAY_LABELS: Record<WeekdayId, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
}

const PICKUP_FALLBACK_TEXT = 'Please check the schedule or come Sunday'
const PICKUP_TIME_LABEL = '3:00 - 9:00 LT'
const READY_HEADLINE = 'Your Passport is READY!'

export function presentPassport(record: PassportPresentationInput): PassportPresentation {
  const { givenName, surname } = splitNames(record)
  const pickupDays = getPickupDays(record.firstName)
  const pickupDaysLabel =
    pickupDays.length > 0 ? pickupDays.map((day) => PICKUP_DAY_LABELS[day]).join(', ') : PICKUP_FALLBACK_TEXT
  const receiveAfterLabel = formatGregorianApiDateAsEthiopian(record.publishedDate, {
    fallback: record.publishedDate,
    showGregorianInParentheses: true,
  })
  const pickupNotice =
    pickupDays.length > 0
      ? `You can pick up your passport at ${record.location}, starting from ${receiveAfterLabel}, on ${pickupDaysLabel}.`
      : `You can pick up your passport at ${record.location}, starting from ${receiveAfterLabel}. ${PICKUP_FALLBACK_TEXT}.`

  return {
    ...record,
    surname,
    givenName,
    receiveAfterLabel,
    pickupDays: pickupDays.map((day) => PICKUP_DAY_LABELS[day]),
    pickupDaysLabel,
    pickupTimeLabel: PICKUP_TIME_LABEL,
    readyHeadline: READY_HEADLINE,
    pickupNotice,
    sourceLabel: 'Verified using www.passport.et',
  }
}

function splitNames(record: Pick<PassportPresentationInput, 'fullName' | 'firstName' | 'middleName' | 'lastName'>) {
  const fullNameParts = record.fullName.trim().split(/\s+/).filter(Boolean)
  const fallbackSurname = fullNameParts.at(-1) ?? record.lastName
  const fallbackGivenName = fullNameParts.slice(0, -1).join(' ') || record.firstName
  const surname = record.lastName?.trim() || fallbackSurname

  if (record.middleName?.trim()) {
    return {
      givenName: [record.firstName, record.middleName].filter(Boolean).join(' '),
      surname,
    }
  }

  return {
    givenName: fallbackGivenName,
    surname,
  }
}

function getPickupDays(firstName: string | undefined): WeekdayId[] {
  const normalized = firstName?.trim()
  if (!normalized) return []

  const letter = normalized.charAt(0).toLowerCase()
  const days: WeekdayId[] = []

  if (['a', 'b', 'c', 'd', 'e', 'f', 'g'].includes(letter)) days.push('monday')
  if (['m', 'n', 'o', 'p', 'q', 'r', 'h', 'i', 'j', 'k', 'l'].includes(letter)) days.push('tuesday')
  if (['a', 'b', 'c', 'd', 'e', 't'].includes(letter)) days.push('wednesday')
  if (['m', 'i', 'j', 'k', 'l', 's', 'u', 'v', 'w', 'x', 'y', 'z'].includes(letter)) days.push('thursday')
  if (['a', 'f', 'g', 'h', 'n', 'o', 'p', 'q', 'r'].includes(letter)) days.push('friday')
  if (['m', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].includes(letter)) days.push('saturday')

  return days
}

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

  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) return null

  return {
    year: parsed.getUTCFullYear(),
    month: parsed.getUTCMonth() + 1,
    day: parsed.getUTCDate(),
  }
}

function toDmy(day: number, month: number, year: number) {
  const dd = String(day).padStart(2, '0')
  const mm = String(month).padStart(2, '0')
  const yyyy = String(year).padStart(4, '0')
  return `${dd}/${mm}/${yyyy}`
}
