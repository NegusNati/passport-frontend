import { useRouter } from '@tanstack/react-router'
import * as React from 'react'

import { usePassportQuery } from '@/features/passports/lib/PassportsQuery'
import type { PassportApiItem } from '@/features/passports/lib/PassportsSchema'
import type { Passport } from '@/features/passports/schemas/passport'
import { AdSlot } from '@/shared/ui/ad-slot'

import { PassportDetailCard } from './PassportDetailCard'
import { PassportsTable } from './PassportsTable'

interface PassportDetailPageProps {
  passportId?: string
  requestNumber?: string
}

export function PassportDetailPage({ passportId, requestNumber }: PassportDetailPageProps) {
  const router = useRouter()

  const idIsNumeric = passportId && /^\d+$/.test(passportId)
  const { data, isLoading, isError } = usePassportQuery(passportId ?? '', {
    enabled: Boolean(idIsNumeric),
  })

  const mapToUi = React.useCallback((p: PassportApiItem): Passport => {
    return {
      id: String(p.id),
      name: p.full_name,
      date: formatDisplayDate(p.date_of_publish),
      requestNumber: p.request_number,
      status: 'pending',
      city: p.location,
    }
  }, [])

  const uiPassport = data?.data ? mapToUi(data.data) : null

  const handleCheckAnother = React.useCallback(() => {
    router.navigate({ to: '/passports' })
  }, [router])

  if (requestNumber && !idIsNumeric) {
    // Detail by request number is not directly supported by API; guide user to search
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-foreground text-2xl font-bold">Passport Lookup</h1>
        <p className="text-muted-foreground mt-4">
          Please use the search to look up request number {requestNumber}.
        </p>
        <button
          onClick={handleCheckAnother}
          className="bg-primary text-primary-foreground mt-6 rounded-md px-6 py-2 hover:opacity-90"
        >
          Back to Search
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (isError || !uiPassport) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-foreground text-2xl font-bold">Passport Not Found</h1>
        <p className="text-muted-foreground mt-4">
          The requested passport could not be found. Please check the ID and try again.
        </p>
        <button
          onClick={handleCheckAnother}
          className="bg-primary text-primary-foreground mt-6 rounded-md px-6 py-2 hover:opacity-90"
        >
          Back to Search
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PassportDetailCard passport={uiPassport} onCheckAnother={handleCheckAnother} />

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
