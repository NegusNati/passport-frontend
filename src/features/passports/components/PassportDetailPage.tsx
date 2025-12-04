import { useRouter } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import HabeshaFace from '@/assets/landingImages/habesha_face.svg'
import { usePassportQuery } from '@/features/passports/lib/PassportsQuery'
import type { PassportApiItem } from '@/features/passports/lib/PassportsSchema'
import type { Passport } from '@/features/passports/schemas/passport'
import { AdSlot } from '@/shared/ui/ad-slot'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Confetti } from '@/shared/ui/confetti'
import { PassportDetailSkeleton } from '@/shared/ui/skeleton'

import { PassportDetailCard } from './PassportDetailCard'
import { PassportsTable } from './PassportsTable'

interface PassportDetailPageProps {
  passportId?: string
  requestNumber?: string
}

export function PassportDetailPage({ passportId, requestNumber }: PassportDetailPageProps) {
  const { t } = useTranslation('passports')
  const router = useRouter()

  const idIsNumeric = passportId && /^\d+$/.test(passportId)
  const { data, isLoading, isError } = usePassportQuery(passportId ?? '', {
    enabled: Boolean(idIsNumeric),
  })

  const mapToUi = React.useCallback((p: PassportApiItem): Passport => {
    return {
      id: String(p.id),
      name: p.full_name,
      firstName: p.first_name,
      date: formatDisplayDate(p.date_of_publish),
      dateRaw: p.date_of_publish,
      requestNumber: p.request_number,
      status: 'pending',
      city: p.location,
    }
  }, [])

  const uiPassport = data?.data ? mapToUi(data.data) : null

  const [showBanner, setShowBanner] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false)
    }, 7000)
    return () => clearTimeout(timer)
  }, [])

  const handleCheckAnother = React.useCallback(() => {
    router.navigate({ to: '/passports' })
  }, [router])

  if (requestNumber && !idIsNumeric) {
    // Detail by request number is not directly supported by API; guide user to search
    return (
      <div className="container mx-auto py-12">
        <Card className="mx-auto max-w-md">
          <CardContent className="space-y-4 pt-6 text-center">
            <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="text-primary h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
            <h1 className="text-foreground text-2xl font-bold">{t('detail.lookup.title')}</h1>
            <p className="text-muted-foreground">
              {t('detail.lookup.description', { requestNumber })}
            </p>
            <Button onClick={handleCheckAnother} className="w-full sm:w-auto">
              {t('detail.lookup.backToSearch')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <PassportDetailSkeleton />
        <section className="py-8">
          <div className="container mx-auto max-w-6xl px-4">
            <AdSlot preset="sponsored" orientation="horizontal" className="rounded-lg" />
          </div>
        </section>
        <PassportsTable />
      </div>
    )
  }

  if (isError || !uiPassport) {
    return (
      <div className="container mx-auto py-12">
        <Card className="border-destructive/50 mx-auto max-w-md">
          <CardContent className="space-y-4 pt-6 text-center">
            <div className="bg-destructive/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="text-destructive h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
            <h1 className="text-foreground text-2xl font-bold">{t('detail.notFound.title')}</h1>
            <p className="text-muted-foreground">{t('detail.notFound.description')}</p>
            <Button onClick={handleCheckAnother} className="w-full sm:w-auto">
              {t('detail.notFound.backToSearch')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {showBanner && <Confetti />}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 1.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-emerald-600 text-white"
          >
            <div className="container mx-auto px-4 py-4 text-center text-lg font-medium">
              {t('detail.banner.congratulations', { city: uiPassport.city })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div layout transition={{ duration: 1.3, ease: 'easeInOut' }}>
        <PassportDetailCard passport={uiPassport} onCheckAnother={handleCheckAnother} />
      </motion.div>
      <div className="absolute top-[15rem] left-[-10rem] z-[-110] ml-2 opacity-90">
        <img
          src={HabeshaFace}
          alt="Habesha Face"
          className="h-150 w-150"
          width="600"
          height="600"
        />
      </div>
      <section className="py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <AdSlot preset="sponsored" orientation="horizontal" className="rounded-lg" />
        </div>
      </section>

      <PassportsTable />
    </div>
  )
}

function formatDisplayDate(value: string) {
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dt)
}
