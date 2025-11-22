import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import * as React from 'react'

import HabeshaFace from '@/assets/landingImages/habesha_face.svg'
import { Container } from '@/shared/ui/container'
import { Seo } from '@/shared/ui/Seo'

import { toLocationSlug } from '../lib/location-slug'
import { useLocationsQuery } from '../lib/PassportsQuery'

export function LocationsDirectoryPage() {
  const locationsQuery = useLocationsQuery()

  const locations = React.useMemo(() => {
    const items = locationsQuery.data?.data ?? []
    return [...items].sort((a, b) => a.localeCompare(b))
  }, [locationsQuery.data])

  const hasError = locationsQuery.isError && locations.length === 0
  const error =
    locationsQuery.error instanceof Error
      ? locationsQuery.error
      : new Error('Failed to load locations.')

  return (
    <div className="min-h-screen">
      <Seo
        title="ICS Branch Offices Directory - Ethiopian Passport Locations"
        description="Directory of ICS branch offices across Ethiopia. Find your nearest location and check passport releases for urgent and regular applications."
        path="/locations"
      />

      <section className="mx-2 py-12 md:py-16">
        <Container className="border-border/60 rounded-2xl border bg-transparent p-6 text-center shadow-sm backdrop-blur-lg supports-[backdrop-filter]:bg-transparent">
          <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Official Immigration and Citizenship Services (ICS) branch offices
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Pick a branch office to see the most recent passports released in that location.
          </p>
        </Container>
      </section>

      <div className="absolute top-[15rem] left-[-10rem] z-[-110] ml-2 opacity-90">
        <img src={HabeshaFace} alt="Habesha Face" className="h-150 w-150" />
      </div>

      <section className="py-12">
        <Container>
          <div className="rounded-lg border bg-transparent/80 p-6 shadow-sm backdrop-blur">
            {locationsQuery.isLoading ? (
              <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading branch offices…</span>
              </div>
            ) : hasError ? (
              <div className="text-destructive text-center text-sm">{error.message}</div>
            ) : locations.length === 0 ? (
              <div className="text-muted-foreground text-center text-sm">
                No branch offices available right now.
              </div>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {locations.map((location) => {
                  const slug = toLocationSlug(location)
                  if (!slug) return null
                  return (
                    <li key={location} className="list-none">
                      <Link
                        to="/locations/$locationSlug"
                        params={{ locationSlug: slug }}
                        preload="intent"
                        className="border-border/60 hover:border-border hover:bg-background/90 focus-visible:ring-ring bg-background/70 block rounded-xl border p-4 text-left text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        <span className="text-lg leading-tight font-semibold">{location}</span>
                        <span className="text-muted-foreground mt-1 block text-sm">
                          View latest passports from this branch
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </Container>
      </section>
    </div>
  )
}
