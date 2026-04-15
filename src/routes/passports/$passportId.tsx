import type { QueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { PassportDetailPage } from '@/features/passports/components/PassportDetailPage'
import { getPassportQueryOptions } from '@/features/passports/lib/PassportsQuery'
import { loadI18nNamespaces } from '@/i18n/loader'

const searchSchema = z.object({
  requestNumber: z.string().optional(),
})

function PassportDetailRouteComponent() {
  const { passportId } = Route.useParams()
  const { requestNumber } = Route.useSearch()

  // Treat alphanumeric starting with letters as a request number
  const isRequestNumber = /^[A-Za-z]{2,}/.test(passportId)

  return (
    <PassportDetailPage
      passportId={isRequestNumber ? undefined : passportId}
      requestNumber={isRequestNumber ? passportId : requestNumber}
    />
  )
}

export const Route = createFileRoute('/passports/$passportId')({
  validateSearch: searchSchema,
  loader: ({ context, params }) => {
    const { queryClient } = context as { queryClient: QueryClient }

    loadI18nNamespaces(['passports'])

    if (/^\d+$/.test(params.passportId)) {
      void queryClient.prefetchQuery(getPassportQueryOptions(params.passportId))
    }
  },
  component: PassportDetailRouteComponent,
})
