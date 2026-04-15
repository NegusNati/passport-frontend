import { useReducedMotion } from 'framer-motion'
import * as React from 'react'
import { startTransition } from 'react'
import { useTranslation } from 'react-i18next'

import HabeshaFace from '@/assets/landingImages/habesha_face.svg'
import { useNetworkConditions } from '@/shared/hooks/useNetworkConditions'
import { Seo } from '@/shared/ui/Seo'

import type { PassportSearchFilters } from '../schemas/passport'
import { PassportSearchForm } from './PassportSearchForm'
import { PassportsTable } from './PassportsTable'
type SearchMode = 'number' | 'name'

export function PassportsPage() {
  const { t } = useTranslation('passports')
  const prefersReducedMotion = useReducedMotion()
  const network = useNetworkConditions()
  const [searchMode, setSearchMode] = React.useState<SearchMode>('name')
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
    tableRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [prefersReducedMotion])

  const updateFilters = React.useCallback(
    (filters: PassportSearchFilters, mode: SearchMode) => {
      startTransition(() => {
        setSearchMode(mode)
        setSearchFilters((prev) => (isSameFilters(prev, filters) ? prev : filters))
      })
    },
    [isSameFilters],
  )

  return (
    <div className="min-h-screen">
      <Seo
        title={t('search.seo.title')}
        description={t('search.seo.description')}
        path="/passports"
      />
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

      {!network.isConstrained ? (
        <div className="absolute top-[15rem] left-[-10rem] z-[-110] ml-2 opacity-90">
          <img
            src={HabeshaFace}
            alt=""
            aria-hidden="true"
            className="hidden h-150 w-150 lg:block"
            width="600"
            height="600"
            loading="lazy"
          />
        </div>
      ) : null}

      {/* Passports Table Section */}
      <PassportsTable ref={tableRef} searchFilters={searchFilters} searchMode={searchMode} />
    </div>
  )
}
