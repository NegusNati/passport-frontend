import type { QueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import * as React from 'react'
import { z } from 'zod'

import { NotFound } from '@/features/misc/components/NotFound'
import { PassportsByLocationPage } from '@/features/passports/components/PassportsByLocationPage'
import { matchLocationFromSlug } from '@/features/passports/lib/location-slug'
import { fetchLocations, fetchPassports, type ListParams } from '@/features/passports/lib/PassportsApi'
import { passportsKeys, useLocationsQuery } from '@/features/passports/lib/PassportsQuery'

type RouterContext = { queryClient: QueryClient }

const paramsSchema = z.object({
  locationSlug: z.string(),
})

export const Route = createFileRoute('/locations/$locationSlug')({
  parseParams: (params) => paramsSchema.parse(params),
  loader: async ({ context, params }) => {
    const { queryClient } = context as RouterContext

    const locationsResponse = await queryClient.ensureQueryData({
      queryKey: passportsKeys.locations(),
      queryFn: fetchLocations,
      staleTime: 5 * 60_000,
    })

    const locationName = matchLocationFromSlug(params.locationSlug, locationsResponse.data ?? [])

    if (locationName) {
      const listParams: Partial<ListParams> = {
        location: locationName,
        page: 1,
        page_size: 10,
      }

      await queryClient.prefetchQuery({
        queryKey: passportsKeys.list(listParams),
        queryFn: () => fetchPassports(listParams),
        staleTime: 30_000,
      })
    }
  },
  component: LocationPassportsRouteComponent,
})

function LocationPassportsRouteComponent() {
  const { locationSlug } = Route.useParams()
  const locationsQuery = useLocationsQuery()

  const locations = locationsQuery.data?.data
  const locationName = React.useMemo(
    () => matchLocationFromSlug(locationSlug, locations ?? []),
    [locationSlug, locations],
  )

  if (locationsQuery.isLoading && !locations) {
    return (
      <div className="min-h-screen">
        <div className="text-muted-foreground flex h-full items-center justify-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading branch details…</span>
        </div>
      </div>
    )
  }

  if (locationsQuery.isError && !locations) {
    return (
      <div className="min-h-screen">
        <div className="text-destructive flex h-full items-center justify-center text-sm">
          Failed to load branch offices.
        </div>
      </div>
    )
  }

  if (!locationName) {
    return <NotFound />
  }

  return <PassportsByLocationPage locationName={locationName} />
}
