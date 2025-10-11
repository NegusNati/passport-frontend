import * as React from 'react'

import HabeshaFace from "@/assets/landingImages/habesha_face.svg"

import type { PassportSearchFilters } from '../schemas/passport'
import { PassportSearchForm } from './PassportSearchForm'
import { PassportsTable } from './PassportsTable'
type SearchMode = 'number' | 'name'

export function PassportsPage() {
  const [searchMode, setSearchMode] = React.useState<SearchMode>('number')
  const [searchFilters, setSearchFilters] = React.useState<PassportSearchFilters>({})
  const tableRef = React.useRef<HTMLDivElement>(null)

  const isSameFilters = React.useCallback(
    (a: PassportSearchFilters, b: PassportSearchFilters) => {
      const keys = new Set([...Object.keys(a), ...Object.keys(b)])
      for (const key of keys) {
        if ((a as Record<string, string>)[key] !== (b as Record<string, string>)[key]) {
          return false
        }
      }
      return true
    },
    [],
  )

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

  return (
    <div className="min-h-screen">
      {/* Ad Banner Section */}
      {/* <section className="bg-background py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <AdSlot preset="sponsored" orientation="horizontal" />
        </div>
      </section> */}
      {/* Search Form Section */}
      <PassportSearchForm
        onSearch={updateFilters}
        onQueryChange={updateFilters}
        onScrollToResults={scrollToResults}
      />

      <div className="absolute left-[-10rem] top-[15rem] opacity-90  z-[-110]  ml-2 ">
        <img src={HabeshaFace} alt="Habesha Face" className="h-150 w-150 " />
      </div>



      {/* Passports Table Section */}
      <PassportsTable ref={tableRef} searchFilters={searchFilters} searchMode={searchMode} />
    </div>
  )
}
