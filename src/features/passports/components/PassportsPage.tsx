import * as React from 'react'

import { AdSlot } from '@/shared/ui/ad-slot'

import { type PassportSearchByName, type PassportSearchByNumber } from '../schemas/passport'
import { PassportSearchForm } from './PassportSearchForm'
import { PassportsTable } from './PassportsTable'

export function PassportsPage() {
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [searchMode, setSearchMode] = React.useState<'number' | 'name'>('number')

  const handleSearch = (
    data: PassportSearchByNumber | PassportSearchByName,
    mode: 'number' | 'name',
  ) => {
    setSearchMode(mode)

    if (mode === 'number') {
      const numberData = data as PassportSearchByNumber
      setSearchQuery(numberData.requestNumber)
    } else {
      const nameData = data as PassportSearchByName
      setSearchQuery(`${nameData.firstName} ${nameData.lastName}`)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Search Form Section */}
      <PassportSearchForm onSearch={handleSearch} />

      {/* Ad Banner Section */}
      <section className="bg-background py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <AdSlot preset="sponsored" orientation="horizontal" className="rounded-lg" />
        </div>
      </section>

      {/* Passports Table Section */}
      <PassportsTable searchQuery={searchQuery} searchMode={searchMode} />
    </div>
  )
}
