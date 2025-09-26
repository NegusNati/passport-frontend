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
      const q = [nameData.firstName, nameData.middleName?.trim(), nameData.lastName]
        .filter(Boolean)
        .join(' ')
      setSearchQuery(q)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Search Form Section */}
      <PassportSearchForm
        onSearch={handleSearch}
        onQueryChange={(q, mode) => {
          setSearchMode(mode)
          setSearchQuery(q)
        }}
      />

      {/* Ad Banner Section */}
      <section className="bg-background py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <AdSlot preset="sponsored" orientation="horizontal" />
        </div>
      </section>

      {/* Passports Table Section */}
      <PassportsTable searchQuery={searchQuery} searchMode={searchMode} />
    </div>
  )
}
