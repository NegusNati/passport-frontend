import { useRef } from 'react'
import Barcode from 'react-barcode'

import star from '@/assets/landingImages/star.svg'
import { ShareButton } from '@/shared/components/ShareButton'
import { usePdfDownload } from '@/shared/hooks/usePdfDownload'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'

import { type Passport } from '../schemas/passport'

const CARD_DOWNLOAD_ID = 'passport-detail-card'

function getDayOfWeek(firstName?: string) {
  const normalized = firstName?.trim()
  if (!normalized) {
    return 'Please check the schedule or come Sunday'
  }

  const letter = normalized.charAt(0).toLowerCase()
  const days: string[] = []

  if (['a', 'b', 'c', 'd', 'e', 'f', 'g'].includes(letter)) days.push('Monday')
  if (['m', 'n', 'o', 'p', 'q', 'r', 'h', 'i', 'j', 'k', 'l'].includes(letter)) days.push('Tuesday')
  if (['a', 'b', 'c', 'd', 'e', 't'].includes(letter)) days.push('Wednesday')
  if (['m', 'i', 'j', 'k', 'l', 's', 'u', 'v', 'w', 'x', 'y', 'z'].includes(letter))
    days.push('Thursday')
  if (['a', 'f', 'g', 'h', 'n', 'o', 'p', 'q', 'r'].includes(letter)) days.push('Friday')
  if (['m', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].includes(letter)) days.push('Saturday')

  if (days.length === 0) {
    return 'Please check the schedule or come Sunday'
  }
  return days.join(', ')
}

interface PassportDetailCardProps {
  passport: Passport
  onCheckAnother?: () => void
}

export function PassportDetailCard({ passport, onCheckAnother }: PassportDetailCardProps) {
  // Extract names from the full name (assuming "FirstName LastName" format)
  const nameParts = passport.name.split(' ')
  const givenName = nameParts.slice(0, -1).join(' ')
  const surname = nameParts[nameParts.length - 1]
  const firstName = passport.firstName ?? nameParts[0] ?? ''
  const dayOfWeek = getDayOfWeek(firstName)
  const cardRef = useRef<HTMLDivElement>(null)

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
              <img src={star} alt="Ethiopian Star" className="h-64 w-64 md:h-80 md:w-80" />
            </div>

            {/* Header */}
            <div className="relative z-10 mb-8 text-center">
              <h1 className="mb-1 text-xl font-bold text-red-900 md:text-2xl">
                የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ
              </h1>
              <h2 className="font-gotham text-lg font-semibold text-red-800 md:text-xl">
                FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA
              </h2>
            </div>

            {/* Passport Content */}
            <div className="relative z-10 space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-gray-600">Surname</div>
                  <div className="mt-0.5 text-lg font-semibold text-gray-900">{surname}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-600">Given Name</div>
                  <div className="mt-0.5 text-lg font-semibold text-gray-900">{givenName}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-600">Location</div>
                  <div className="mt-0.5 flex items-center pb-1">
                    <div className="text-lg font-semibold text-gray-900">{passport.city}</div>
                  </div>
                </div>
              </div>

              {/* Date and Time Info - Horizontal Layout */}
              <div className="flex flex-wrap items-start gap-x-8 gap-y-4 pt-2">
                <div>
                  <div className="text-xs font-medium text-gray-600">You Can Receive After</div>
                  <div className="mt-0.5 text-base font-semibold text-gray-900">
                    {passport.date} G.C
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-600">Day of The Week</div>
                  <div className="mt-0.5 text-base font-semibold text-gray-900">{dayOfWeek}</div>
                </div>

                <div>
                  <div className="text-xs font-medium text-gray-600">Exact Time</div>
                  <div className="mt-0.5 text-base font-semibold text-gray-900">3:00 - 9:00 LT</div>
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
            >
              {isDownloading ? 'Preparing…' : 'Download'}
            </Button>

            <Button
              onClick={onCheckAnother}
              className="w-full bg-emerald-600 hover:bg-emerald-700 sm:w-auto"
              size="lg"
            >
              Check Another Passport
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
