import * as React from 'react'

import type { PassportSearchFilters } from '../schemas/passport'
import { PassportSearchForm } from './PassportSearchForm'
import { PassportsTable } from './PassportsTable'

type SearchMode = 'number' | 'name'

export function PassportsPage() {
  const [searchMode, setSearchMode] = React.useState<SearchMode>('number')
  const [searchFilters, setSearchFilters] = React.useState<PassportSearchFilters>({})

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
      />

    

      {/* Passports Table Section */}
      <PassportsTable searchFilters={searchFilters} searchMode={searchMode} />
    </div>
  )
}
