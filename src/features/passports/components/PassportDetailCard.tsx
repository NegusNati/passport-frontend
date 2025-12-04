import { Download } from 'lucide-react'
import { useRef } from 'react'
import Barcode from 'react-barcode'
import { useTranslation } from 'react-i18next'

import star from '@/assets/landingImages/star.svg'
import { ETHIOPIAN_MONTHS, toEthiopian } from '@/features/calendar/lib/calendar-utils'
import type { SupportedLanguage } from '@/i18n/config'
import { ShareButton } from '@/shared/components/ShareButton'
import { usePdfDownload } from '@/shared/hooks/usePdfDownload'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'

import { type Passport } from '../schemas/passport'

const CARD_DOWNLOAD_ID = 'passport-detail-card'

type WeekdayId = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

const WEEKDAY_LABELS: Record<WeekdayId, Record<SupportedLanguage, string>> = {
  monday: {
    en: 'Monday',
    am: 'ሰኞ',
    om: 'Wiixata',
    ti: 'ሰኑይ',
  },
  tuesday: {
    en: 'Tuesday',
    am: 'ማክሰኞ',
    om: 'Kibxata',
    ti: 'ሰሉስ',
  },
  wednesday: {
    en: 'Wednesday',
    am: 'ረቡዕ',
    om: 'Roobii',
    ti: 'ረቡዕ',
  },
  thursday: {
    en: 'Thursday',
    am: 'ሐሙስ',
    om: 'Kamisa',
    ti: 'ሓሙስ',
  },
  friday: {
    en: 'Friday',
    am: 'አርብ',
    om: 'Jimaata',
    ti: 'ዓርቢ',
  },
  saturday: {
    en: 'Saturday',
    am: 'ቅዳሜ',
    om: 'Sanbata',
    ti: 'ቀዳም',
  },
  sunday: {
    en: 'Sunday',
    am: 'እሑድ',
    om: 'Dilbata',
    ti: 'ሰንበት',
  },
}

function localizeWeekdays(
  weekdays: WeekdayId[],
  lang: string | undefined,
  fallbackText: string,
): string {
  if (weekdays.length === 0) return fallbackText

  const baseLang = (lang?.split('-')[0] ?? 'en') as SupportedLanguage
  const supported: SupportedLanguage[] = ['en', 'am', 'om', 'ti']
  const effectiveLang = supported.includes(baseLang) ? baseLang : 'en'

  return weekdays.map((day) => WEEKDAY_LABELS[day][effectiveLang]).join(', ')
}

function getDayOfWeek(firstName: string | undefined, fallbackText: string, lang?: string) {
  const normalized = firstName?.trim()
  if (!normalized) {
    return fallbackText
  }

  const letter = normalized.charAt(0).toLowerCase()
  const days: WeekdayId[] = []

  if (['a', 'b', 'c', 'd', 'e', 'f', 'g'].includes(letter)) days.push('monday')
  if (['m', 'n', 'o', 'p', 'q', 'r', 'h', 'i', 'j', 'k', 'l'].includes(letter)) days.push('tuesday')
  if (['a', 'b', 'c', 'd', 'e', 't'].includes(letter)) days.push('wednesday')
  if (['m', 'i', 'j', 'k', 'l', 's', 'u', 'v', 'w', 'x', 'y', 'z'].includes(letter))
    days.push('thursday')
  if (['a', 'f', 'g', 'h', 'n', 'o', 'p', 'q', 'r'].includes(letter)) days.push('friday')
  if (['m', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].includes(letter)) days.push('saturday')

  return localizeWeekdays(days, lang, fallbackText)
}

interface PassportDetailCardProps {
  passport: Passport
  onCheckAnother?: () => void
}

export function PassportDetailCard({ passport, onCheckAnother }: PassportDetailCardProps) {
  const { t, i18n } = useTranslation('passports')
  // Extract names from the full name (assuming "FirstName LastName" format)
  const nameParts = passport.name.split(' ')
  const givenName = nameParts.slice(0, -1).join(' ')
  const surname = nameParts[nameParts.length - 1]
  const firstName = passport.firstName ?? nameParts[0] ?? ''
  const dayOfWeek = getDayOfWeek(firstName, t('detail.card.checkSchedule'), i18n.language)
  const cardRef = useRef<HTMLDivElement>(null)

  const isEnglish = (i18n.language?.split('-')[0] ?? 'en') === 'en'

  const receiveAfterLabel = (() => {
    if (!passport.dateRaw || isEnglish) {
      // Default: show formatted Gregorian date when language is English
      return `${passport.date} G.C`
    }

    const raw = passport.dateRaw
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw)
    if (!match) {
      return `${passport.date} G.C`
    }

    const [, yStr, mStr, dStr] = match
    const year = Number(yStr)
    const month = Number(mStr)
    const day = Number(dStr)
    if (
      !Number.isFinite(year) ||
      !Number.isFinite(month) ||
      !Number.isFinite(day) ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      return `${passport.date} G.C`
    }

    const gregDate = new Date(Date.UTC(year, month - 1, day))
    const et = toEthiopian(gregDate)
    const monthData = ETHIOPIAN_MONTHS.find((m) => m.number === et.month)
    if (!monthData) {
      return `${passport.date} G.C`
    }

    const baseLang = (i18n.language?.split('-')[0] ?? 'en') as SupportedLanguage
    const monthLabel = baseLang === 'am' ? monthData.amharic : monthData.english

    return `${monthLabel} ${et.day}, ${et.year} E.C`
  })()

  const { download, isDownloading } = usePdfDownload({
    elementRef: cardRef,
    filename: `passport_et_${passport.name}`,
    scale: 3,
  })

  return (
    <section className="relative py-12 md:py-16">
      {/* Green gradient background */}
      <div className="absolute inset-0" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl">
          {/* Passport Document */}
          <div
            ref={cardRef}
            id={CARD_DOWNLOAD_ID}
            className="border-primary relative overflow-hidden rounded-lg border-2 p-8 shadow-2xl backdrop-blur-md md:p-12"
          >
            {/* Ethiopian Seal Background - Prominent Yellow Star */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
              <img
                src={star}
                alt="Ethiopian Star"
                className="h-64 w-64 md:h-80 md:w-80"
                width="320"
                height="320"
              />
            </div>

            {/* Header */}
            <div className="relative z-10 mb-8 text-center text-[#8D2041]">
              <h1 className="mb-1 text-xl font-bold text-red-900 md:text-2xl">
                {t('detail.card.ethTitle')}
              </h1>
              <h2 className="font-gotham text-lg font-semibold text-red-800 md:text-xl">
                {t('detail.card.engTitle')}
              </h2>
            </div>

            {/* Passport Content */}
            <div className="relative z-10 space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-gray-600">
                    {t('detail.card.surname')}
                  </div>
                  <div className="mt-0.5 text-lg font-semibold text-gray-900">{surname}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-600">
                    {t('detail.card.givenName')}
                  </div>
                  <div className="mt-0.5 text-lg font-semibold text-gray-900">{givenName}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-600">
                    {t('detail.card.location')}
                  </div>
                  <div className="mt-0.5 flex items-center pb-1">
                    <div className="text-lg font-semibold text-gray-900">{passport.city}</div>
                  </div>
                </div>
              </div>

              {/* Date and Time Info - Horizontal Layout */}
              <div className="flex flex-wrap items-start gap-x-8 gap-y-4 pt-2">
                <div>
                  <div className="text-xs font-medium text-gray-600">
                    {t('detail.card.receiveAfter')}
                  </div>
                  <div className="mt-0.5 text-base font-semibold text-gray-900">
                    {receiveAfterLabel}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-600">
                    {t('detail.card.dayOfWeek')}
                  </div>
                  <div className="mt-0.5 text-base font-semibold text-gray-900">{dayOfWeek}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-600">
                    {t('detail.card.exactTime')}
                  </div>
                  <div className="mt-0.5 text-base font-semibold text-gray-900">
                    {t('detail.card.timeRange')}
                  </div>
                </div>
              </div>

              {/* Barcode Section */}
              <div className="flex flex-col items-center pt-6">
                <div className="rounded border-2 border-gray-300 bg-white p-2">
                  <Barcode
                    value={passport.requestNumber}
                    width={2}
                    height={70}
                    fontSize={12}
                    background="transparent"
                    lineColor="#000000"
                  />
                </div>
              </div>
              <div className="text-primary flex flex-col items-center gap-3">
                <div className="text-md font-bold">www.passport.et</div>
              </div>
            </div>
          </div>

          {/* Actions below card */}
          <div className="z-10 mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ShareButton
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={`Passport ready for ${passport.name} - ${passport.city}`}
              resultType="ready"
              size="lg"
            />
            <Button
              onClick={download}
              variant="outline"
              className="w-full sm:w-auto"
              size="lg"
              disabled={isDownloading}
              leftIcon={<Download className="h-5 w-5" aria-hidden="true" />}
            >
              {isDownloading ? t('detail.actions.downloading') : t('detail.actions.download')}
            </Button>

            <Button
              onClick={onCheckAnother}
              className="w-full bg-emerald-600 hover:bg-emerald-700 sm:w-auto"
              size="lg"
            >
              {t('detail.actions.checkAnother')}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
