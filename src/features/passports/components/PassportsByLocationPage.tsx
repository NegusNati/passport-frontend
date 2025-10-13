import * as React from 'react'

import HabeshaFace from '@/assets/landingImages/habesha_face.svg'
import { Seo } from '@/shared/ui/Seo'

import { toLocationSlug } from '../lib/location-slug'
import type { PassportSearchFilters } from '../schemas/passport'
import { PassportSearchForm } from './PassportSearchForm'
import { PassportsTable } from './PassportsTable'

type SearchMode = 'number' | 'name'

type PassportsByLocationPageProps = {
  locationName: string
}

export function PassportsByLocationPage({ locationName }: PassportsByLocationPageProps) {
  const [searchMode, setSearchMode] = React.useState<SearchMode>('number')
  const [searchFilters, setSearchFilters] = React.useState<PassportSearchFilters>({})
  const tableRef = React.useRef<HTMLDivElement>(null)

  const isSameFilters = React.useCallback((a: PassportSearchFilters, b: PassportSearchFilters) => {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)])
    for (const key of keys) {
      if ((a as Record<string, string>)[key] !== (b as Record<string, string>)[key]) {
        return false
      }
    }
    return true
  }, [])

  const scrollToResults = React.useCallback(() => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const updateFilters = React.useCallback(
    (filters: PassportSearchFilters, mode: SearchMode) => {
      setSearchMode(mode)
      setSearchFilters((prev) => (isSameFilters(prev, filters) ? prev : filters))
    },
    [isSameFilters],
  )

  const slug = React.useMemo(() => toLocationSlug(locationName), [locationName])

  return (
    <div className="min-h-screen">
      <Seo
        title={`${locationName} passports`}
        description={`Check the latest passports released at the ${locationName} ICS branch.`}
        path={`/locations/${slug}`}
      />

      <PassportSearchForm
        onSearch={updateFilters}
        onQueryChange={updateFilters}
        onScrollToResults={scrollToResults}
      />

      <div className="absolute top-[15rem] left-[-10rem] z-[-110] ml-2 opacity-90">
        <img src={HabeshaFace} alt="Habesha Face" className="h-150 w-150" />
      </div>

      <PassportsTable
        ref={tableRef}
        searchFilters={searchFilters}
        searchMode={searchMode}
        defaultCity={locationName}
        tableTitle={locationName}
        lockCity
      />
    </div>
  )
}
