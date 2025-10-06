import type { EthiopicDate, GregorianDate } from 'negus-ethiopic-gregorian'
import {
  ethiopicDaysInMonth as pkgEthiopicDaysInMonth,
  ethiopicToJdn,
  isEthiopicLeapYear as pkgIsEthiopicLeapYear,
  toEthiopic as convertToEthiopic,
  toGregorian as convertToGregorian,
  weekdayFromJdn,
} from 'negus-ethiopic-gregorian'

export type { EthiopicDate, GregorianDate }

export const ETHIOPIAN_MONTHS = [
  { number: 1, english: 'Meskerem', amharic: 'መስከረም' },
  { number: 2, english: 'Tikimt', amharic: 'ጥቅምት' },
  { number: 3, english: 'Hidar', amharic: 'ህዳር' },
  { number: 4, english: 'Tahsas', amharic: 'ታህሳስ' },
  { number: 5, english: 'Tir', amharic: 'ጥር' },
  { number: 6, english: 'Yekatit', amharic: 'የካቲት' },
  { number: 7, english: 'Megabit', amharic: 'መጋቢት' },
  { number: 8, english: 'Miyazya', amharic: 'ሚያዝያ' },
  { number: 9, english: 'Ginbot', amharic: 'ግንቦት' },
  { number: 10, english: 'Sene', amharic: 'ሰኔ' },
  { number: 11, english: 'Hamle', amharic: 'ሃምሌ' },
  { number: 12, english: 'Nehasse', amharic: 'ነሐሴ' },
  { number: 13, english: 'Pagume', amharic: 'ጳጉሜ' },
] as const

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export const toGregorian = convertToGregorian

export function toEthiopian(date: Date): EthiopicDate {
  return convertToEthiopic({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  })
}

export function isEthiopianLeapYear(year: number) {
  return pkgIsEthiopicLeapYear(year)
}

export function getDaysInEthiopianMonth(year: number, month: number) {
  return pkgEthiopicDaysInMonth(year, month)
}

const ETHIOPIC_UNITS = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱']
const ETHIOPIC_TENS = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺']
const HUNDRED = '፻'
const TEN_THOUSAND = '፼'

export function toGeezNumeral(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return ''

  if (value >= 10000) {
    const tenThousands = Math.floor(value / 10000)
    const remainder = value % 10000
    const prefix = tenThousands > 1 ? toGeezNumeral(tenThousands) : ''
    return `${prefix}${TEN_THOUSAND}${remainder ? toGeezNumeral(remainder) : ''}`
  }

  if (value >= 100) {
    const hundreds = Math.floor(value / 100)
    const remainder = value % 100
    const prefix = hundreds === 1 ? HUNDRED : `${toGeezNumeral(hundreds)}${HUNDRED}`
    return `${prefix}${remainder ? toGeezNumeral(remainder) : ''}`
  }

  if (value >= 10) {
    const tens = Math.floor(value / 10)
    const remainder = value % 10
    return `${ETHIOPIC_TENS[tens]}${remainder ? ETHIOPIC_UNITS[remainder] : ''}`
  }

  return ETHIOPIC_UNITS[value]
}

export function formatEthiopianDate(date: EthiopicDate, useGeezDigits: boolean) {
  const monthData = ETHIOPIAN_MONTHS[date.month - 1]
  const day = useGeezDigits ? toGeezNumeral(date.day) : String(date.day)
  return `${monthData?.english ?? ''} ${day}, ${useGeezDigits ? toGeezNumeral(date.year) : date.year}`
}

export function formatGregorianDate({ year, month, day }: GregorianDate) {
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

export function getCalendarMatrix(year: number, month: number) {
  const daysInMonth = getDaysInEthiopianMonth(year, month)
  const firstJd = ethiopicToJdn(year, month, 1)
  const firstWeekday = (weekdayFromJdn(firstJd) + 6) % 7

  const cells: Array<{
    date: EthiopicDate
    gregorian: GregorianDate
    isCurrentMonth: boolean
  }> = []

  const prevMonth = month === 1 ? 13 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  const nextMonth = month === 13 ? 1 : month + 1
  const nextYear = month === 13 ? year + 1 : year

  const prevMonthDays = getDaysInEthiopianMonth(prevYear, prevMonth)

  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    const day = prevMonthDays - i
    const date = { year: prevYear, month: prevMonth, day }
    cells.push({ date, gregorian: toGregorian(date), isCurrentMonth: false })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = { year, month, day }
    cells.push({ date, gregorian: toGregorian(date), isCurrentMonth: true })
  }

  let nextDay = 1
  while (cells.length % 7 !== 0) {
    const date = { year: nextYear, month: nextMonth, day: nextDay }
    cells.push({ date, gregorian: toGregorian(date), isCurrentMonth: false })
    nextDay += 1
  }

  return cells
}

export const GEEZ_NUMERAL_TABLE = [
  { value: 1, symbol: '፩', name: 'አንድ (ānd)' },
  { value: 2, symbol: '፪', name: 'ሁለት (hulät)' },
  { value: 3, symbol: '፫', name: 'ሶስት (sost)' },
  { value: 4, symbol: '፬', name: 'አራት (ärat)' },
  { value: 5, symbol: '፭', name: 'አምስት (ämǝst)' },
  { value: 6, symbol: '፮', name: 'ስድስት (sǝdǝst)' },
  { value: 7, symbol: '፯', name: 'ሰባት (sabat)' },
  { value: 8, symbol: '፰', name: 'ስምንት (sǝmnǝt)' },
  { value: 9, symbol: '፱', name: 'ዘጠኝ (zäṭäñ)' },
  { value: 10, symbol: '፲', name: 'አስር (āśǝr)' },
  { value: 20, symbol: '፳', name: 'አስራ ሁለት (āsra hulät)' },
  { value: 30, symbol: '፴', name: 'ሰላሳ (sälasa)' },
  { value: 40, symbol: '፵', name: 'አርባ (ärba)' },
  { value: 50, symbol: '፶', name: 'ሃምሳ (hamsa)' },
  { value: 60, symbol: '፷', name: 'ስልሳ (sǝlisa)' },
  { value: 70, symbol: '፸', name: 'ሰባ (säba)' },
  { value: 80, symbol: '፹', name: 'ሰማኒያ (sämanya)' },
  { value: 90, symbol: '፺', name: 'ዘጠና (zäṭäna)' },
  { value: 100, symbol: '፻', name: 'መቶ (mäto)' },
  { value: 200, symbol: '፪፻', name: 'ሁለት መቶ (hulät mäto)' },
  { value: 300, symbol: '፫፻', name: 'ሶስት መቶ (sost mäto)' },
  { value: 400, symbol: '፬፻', name: 'አራት መቶ (ärat mäto)' },
  { value: 500, symbol: '፭፻', name: 'አምስት መቶ (ämǝst mäto)' },
  { value: 600, symbol: '፮፻', name: 'ስድስት መቶ (sǝdǝst mäto)' },
  { value: 700, symbol: '፯፻', name: 'ሰባት መቶ (sabat mäto)' },
  { value: 800, symbol: '፰፻', name: 'ስምንት መቶ (sǝmnǝt mäto)' },
  { value: 900, symbol: '፱፻', name: 'ዘጠኝ መቶ (zäṭäñ mäto)' },
  { value: 1000, symbol: '፲፻', name: 'ሺህ (ših)' },
  { value: 10000, symbol: '፼', name: 'አሥር ሺህ (āsǝr ših)' },
]
