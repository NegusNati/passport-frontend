import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { type ColumnDef, type PaginationState, type Table } from '@tanstack/react-table'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import type { ListParams } from '@/features/passports/lib/PassportsApi'
import {
  prefetchPassportDetail,
  useLocationsQuery,
  usePassportsQuery,
} from '@/features/passports/lib/PassportsQuery'
import type { PassportApiItem } from '@/features/passports/lib/PassportsSchema'
import { DataTable } from '@/features/table/DataTable'
import { DataTableColumnHeader } from '@/features/table/DataTableColumnHeader'
import type { PassportsTranslationKey } from '@/i18n/types'
import { useNetworkConditions } from '@/shared/hooks/useNetworkConditions'
import { useAnalytics } from '@/shared/lib/analytics'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { toast } from '@/shared/ui/sonner'
import { SuccessPopup } from '@/shared/ui/success-popup'

import { type PassportFilters, type PassportSearchFilters } from '../schemas/passport'

type PassportsTableProps = {
  searchFilters?: PassportSearchFilters
  searchMode?: 'number' | 'name'
  defaultCity?: string
  tableTitle?: string
  lockCity?: boolean
}

type FilterOption = { value: string; label: string }

type DatePreset = { value: string; labelKey: PassportsTranslationKey }

type PassportsTableToolbarProps<TData> = {
  title: string
  subtitle: string
  filters: PassportFilters
  onFilterChange: (key: keyof PassportFilters, value: string) => void
  dateOptions: FilterOption[]
  locationOptions: FilterOption[]
  isLoadingLocations: boolean
  isCitySelectDisabled?: boolean
  filterByLabel: string
  allLocationsLabel: string
  loadingLocationsLabel: string
} & Pick<
  PassportsTableToolbarBaseProps<TData>,
  'table' | 'filterableColumns' | 'searchKey' | 'onAction' | 'actionTitle' | 'onExport'
>

type PassportsTableToolbarBaseProps<TData> = {
  table: Table<TData>
  filterableColumns: {
    id: string
    title: string
    options: FilterOption[]
  }[]
  searchKey?: string
  onAction?: () => void
  actionTitle?: string
  onExport?: () => void
}

const DATE_PRESETS: DatePreset[] = [
  { value: 'all', labelKey: 'table.filters.allDates' },
  { value: 'last_7', labelKey: 'table.filters.last7Days' },
  { value: 'last_30', labelKey: 'table.filters.last30Days' },
  { value: 'this_year', labelKey: 'table.filters.thisYear' },
]

const DEFAULT_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
}
const SUCCESS_POPUP_DURATION_MS = 7000

export const PassportsTable = React.forwardRef<HTMLDivElement, PassportsTableProps>(
  ({ searchFilters = {}, searchMode, defaultCity, tableTitle, lockCity = false }, ref) => {
    const { t } = useTranslation('passports')
    const router = useRouter()
    const queryClient = useQueryClient()
    const network = useNetworkConditions()
    const { capture } = useAnalytics()
    const [filters, setFilters] = React.useState<PassportFilters>(() => ({
      date: 'all',
      city: defaultCity ?? 'all',
    }))
    const [pagination, setPagination] = React.useState<PaginationState>(DEFAULT_PAGINATION)
    const [hasSearchInteraction, setHasSearchInteraction] = React.useState(false)
    const [hasTableFilterInteraction, setHasTableFilterInteraction] = React.useState(false)
    const searchStartTimeRef = React.useRef<number>(Date.now())

    const locationsQuery = useLocationsQuery()
    const locationOptions = React.useMemo<FilterOption[]>(() => {
      const items = locationsQuery.data?.data ?? []
      const options = items.map((value) => ({ value, label: value }))
      if (defaultCity && defaultCity !== 'all' && !items.includes(defaultCity)) {
        options.unshift({ value: defaultCity, label: defaultCity })
      }
      return options
    }, [defaultCity, locationsQuery.data])

    const lastDefaultCityRef = React.useRef<string | undefined>(defaultCity)

    React.useEffect(() => {
      if (defaultCity !== undefined) {
        setFilters((prev) => (prev.city === defaultCity ? prev : { ...prev, city: defaultCity }))
      } else if (lastDefaultCityRef.current !== undefined) {
        setFilters((prev) => (prev.city === 'all' ? prev : { ...prev, city: 'all' }))
      }
      lastDefaultCityRef.current = defaultCity
    }, [defaultCity])

    React.useEffect(() => {
      setPagination((prev) => (prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }))
    }, [searchFilters, searchMode])

    const searchFiltersKey = React.useMemo(() => JSON.stringify(searchFilters), [searchFilters])
    const previousSearchFiltersKeyRef = React.useRef(searchFiltersKey)

    React.useEffect(() => {
      if (previousSearchFiltersKeyRef.current !== searchFiltersKey) {
        setHasSearchInteraction(true)
        previousSearchFiltersKeyRef.current = searchFiltersKey
      }
    }, [searchFiltersKey])

    const listParams = React.useMemo<Partial<ListParams>>(
      () =>
        buildListParams({
          searchFilters,
          filters,
          pagination,
        }),
      [searchFilters, filters, pagination],
    )

    const passportsQuery = usePassportsQuery(listParams)
    const { data, isLoading, isError, error } = passportsQuery
    const isQueryTransitioning = passportsQuery.fetchStatus === 'fetching'
    const hasPlaceholderRows = passportsQuery.isPlaceholderData

    const rows = React.useMemo<PassportApiItem[]>(() => {
      if (!data?.data) return []
      return [...data.data]
    }, [data?.data])

    const listParamsKey = React.useMemo(() => JSON.stringify(listParams), [listParams])
    const lastToastKeyRef = React.useRef<string | null>(null)
    const lastSuccessKeyRef = React.useRef<string | null>(null)
    const [successPopup, setSuccessPopup] = React.useState<{ key: string; count: number } | null>(
      null,
    )
    const successPopupTimerRef = React.useRef<number | null>(null)
    const hasUserIntent = React.useMemo(() => {
      const hasSearchFilters = Object.keys(searchFilters ?? {}).length > 0
      const hasTableFilters = filters.city !== 'all' || filters.date !== 'all'
      return (
        (hasSearchFilters && hasSearchInteraction) ||
        (hasTableFilters && hasTableFilterInteraction)
      )
    }, [filters.city, filters.date, hasSearchInteraction, hasTableFilterInteraction, searchFilters])

    const dismissSuccessPopup = React.useCallback(() => {
      setSuccessPopup(null)
    }, [])

    const handleOpenFirstResult = React.useCallback(() => {
      const first = rows[0]
      if (!first) return
      dismissSuccessPopup()
      void prefetchPassportDetail(queryClient, String(first.id))
      router.navigate({
        to: '/passports/$passportId',
        params: { passportId: String(first.id) },
      })
    }, [dismissSuccessPopup, queryClient, router, rows])

    // Track search results
    React.useEffect(() => {
      searchStartTimeRef.current = Date.now()
    }, [listParamsKey])

    React.useEffect(() => {
      if (isLoading || isQueryTransitioning || hasPlaceholderRows) {
        return
      }
      const hasSearchFilters = Object.keys(searchFilters).length > 0
      if (!hasSearchFilters) return

      const latency = Date.now() - searchStartTimeRef.current

      if (isError) {
        // Track error
        capture('passport_status_result_error', {
          'error-code': error instanceof Error ? error.message : 'unknown',
          'latency-ms': latency,
          retryable: true,
          'search-mode': searchMode || 'unknown',
        })
      } else if (data) {
        // Track success
        const resultCount = data.data?.length || 0
        const resultType = resultCount > 0 ? 'found' : 'not-found'

        capture('passport_status_result_success', {
          'latency-ms': latency,
          'result-type': resultType,
          'result-count': resultCount,
          retries: 0,
          'search-mode': searchMode || 'unknown',
          'total-available': data.meta?.total || 0,
        })
      }
    }, [
      capture,
      data,
      error,
      hasPlaceholderRows,
      isError,
      isLoading,
      isQueryTransitioning,
      searchFilters,
      searchMode,
    ])

    React.useEffect(() => {
      if (isLoading || isQueryTransitioning || hasPlaceholderRows) {
        dismissSuccessPopup()
        return
      }
      if (isError) {
        dismissSuccessPopup()
        return
      }
      if (!hasUserIntent) {
        lastToastKeyRef.current = null
        lastSuccessKeyRef.current = null
        dismissSuccessPopup()
        return
      }

      const resultCount = data?.data?.length ?? 0
      if (resultCount === 0) {
        setSuccessPopup(null)
        const toastKey = `${passportsQuery.dataUpdatedAt}-${listParamsKey}`
        if (lastToastKeyRef.current !== toastKey) {
          toast(t('table.empty.toastTitle'), {
            description: t('table.empty.toastDescription'),
          })
          lastToastKeyRef.current = toastKey
        }
        lastSuccessKeyRef.current = null
      } else {
        lastToastKeyRef.current = null
        const successKey = `${passportsQuery.dataUpdatedAt}-${listParamsKey}-${resultCount}`
        if (lastSuccessKeyRef.current !== successKey) {
          setSuccessPopup({ key: successKey, count: resultCount })
          lastSuccessKeyRef.current = successKey
        }
      }
    }, [
      data?.data?.length,
      dismissSuccessPopup,
      hasUserIntent,
      hasPlaceholderRows,
      isError,
      isLoading,
      isQueryTransitioning,
      listParamsKey,
      passportsQuery.dataUpdatedAt,
      t,
    ])

    React.useEffect(() => {
      if (!network.allowsPrefetch || network.prefetchBudget === 0) return

      rows.slice(0, network.prefetchBudget).forEach((passport) => {
        void prefetchPassportDetail(queryClient, String(passport.id))
      })
    }, [network.allowsPrefetch, network.prefetchBudget, queryClient, rows])

    React.useEffect(() => {
      if (successPopupTimerRef.current !== null) {
        window.clearTimeout(successPopupTimerRef.current)
        successPopupTimerRef.current = null
      }

      if (!successPopup) {
        return
      }

      successPopupTimerRef.current = window.setTimeout(() => {
        setSuccessPopup(null)
      }, SUCCESS_POPUP_DURATION_MS)

      return () => {
        if (successPopupTimerRef.current !== null) {
          window.clearTimeout(successPopupTimerRef.current)
          successPopupTimerRef.current = null
        }
      }
    }, [successPopup])

    const meta = data?.meta
    const total = meta?.total ?? 0
    const currentPage = meta?.current_page ?? pagination.pageIndex + 1
    const pageCount = meta?.last_page ?? 1
    const pageSizeFromMeta = meta?.page_size ?? meta?.per_page
    const effectivePageSize = pageSizeFromMeta ?? pagination.pageSize
    const from = total ? (currentPage - 1) * effectivePageSize + 1 : 0
    const to = Math.min(currentPage * effectivePageSize, total)

    const handlePageChange = React.useCallback((pageNumber: number) => {
      React.startTransition(() => {
        setPagination((prev) => ({ ...prev, pageIndex: Math.max(0, pageNumber - 1) }))
      })
    }, [])

    const handlePageSizeChange = React.useCallback((size: number) => {
      React.startTransition(() => {
        setPagination({ pageIndex: 0, pageSize: size })
      })
    }, [])

    const handleFilterChange = React.useCallback(
      (key: keyof PassportFilters, value: string) => {
        if (lockCity && key === 'city') return
        setHasTableFilterInteraction(true)
        React.startTransition(() => {
          setFilters((prev) => ({ ...prev, [key]: value }))
          setPagination((prev) => ({ ...prev, pageIndex: 0 }))
        })
      },
      [lockCity],
    )

    const columns = React.useMemo<ColumnDef<PassportApiItem>[]>(() => {
      return [
        {
          accessorKey: 'full_name',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('table.columns.name')} />
          ),
          cell: ({ row }) => (
            <span className="text-foreground text-sm font-semibold">{row.original.full_name}</span>
          ),
          enableSorting: false,
          meta: { label: t('table.columns.name') },
        },
        {
          accessorKey: 'location',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('table.columns.location')} />
          ),
          cell: ({ row }) => (
            <span className="text-muted-foreground text-sm leading-6">{row.original.location}</span>
          ),
          enableSorting: false,
          meta: { label: t('table.columns.location') },
        },
        {
          accessorKey: 'date_of_publish',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('table.columns.published')} />
          ),
          cell: ({ row }) => (
            <span className="text-muted-foreground text-sm">
              {formatDisplayDate(row.original.date_of_publish)}
            </span>
          ),
          enableSorting: false,
          meta: { label: t('table.columns.published') },
        },
        {
          accessorKey: 'request_number',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t('table.columns.requestNumber')} />
          ),
          cell: ({ row }) => (
            <span className="font-mono text-xs tracking-tight uppercase">
              {row.original.request_number}
            </span>
          ),
          enableSorting: false,
          meta: { label: t('table.columns.requestNumber') },
        },
        {
          id: 'actions',
          header: '',
          enableHiding: false,
          cell: ({ row }) => (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex"
              onClick={() => {
                void prefetchPassportDetail(queryClient, String(row.original.id))
                router.navigate({
                  to: '/passports/$passportId',
                  params: { passportId: String(row.original.id) },
                })
              }}
            >
              {t('table.actions.detail')}
            </Button>
          ),
        },
      ]
    }, [queryClient, router, t])

    const toolbarComponent = React.useMemo(() => {
      const localizedDateOptions = DATE_PRESETS.map((opt) => ({
        value: opt.value,
        label: t(opt.labelKey) as string,
      }))
      return function Toolbar<TData>(props: PassportsTableToolbarProps<TData>) {
        return (
          <PassportsTableToolbar
            {...props}
            title={tableTitle ?? t('table.title')}
            subtitle={t('table.subtitle')}
            filters={filters}
            onFilterChange={handleFilterChange}
            dateOptions={localizedDateOptions}
            locationOptions={locationOptions}
            isLoadingLocations={locationsQuery.isLoading}
            isCitySelectDisabled={lockCity}
            filterByLabel={t('table.filters.filterBy')}
            allLocationsLabel={t('table.filters.allLocations')}
            loadingLocationsLabel={t('table.filters.loadingLocations')}
          />
        )
      }
    }, [
      filters,
      handleFilterChange,
      locationOptions,
      locationsQuery.isLoading,
      lockCity,
      tableTitle,
      t,
    ])

    const derivedError = isError
      ? error instanceof Error
        ? error
        : new Error('Failed to load passports.')
      : null

    const emptyInlineMessage = t(
      'table.empty.inlineMessage',
      'Your passport is not ready yet. Our team is still processing it—please check back tomorrow for an update.',
    )

    return (
      <section ref={ref} className="py-12">
        <SuccessPopup
          open={successPopup !== null}
          contextLabel={t('table.successPopup.eyebrow')}
          title={t('table.successPopup.title', { count: successPopup?.count ?? 0 })}
          description={t('table.successPopup.description')}
          actionLabel={rows.length > 0 ? t('table.successPopup.action') : undefined}
          dismissText={t('table.successPopup.dismissText')}
          onAction={rows.length > 0 ? handleOpenFirstResult : undefined}
          dismissLabel={t('table.successPopup.dismissAriaLabel')}
          durationMs={SUCCESS_POPUP_DURATION_MS}
          onDismiss={dismissSuccessPopup}
        />
        <Container>
          <div className="flex flex-col gap-6">
            <div className="border-border/70 rounded-xl border bg-transparent/80 p-6 shadow-sm backdrop-blur">
              <DataTable
                tableTitle={tableTitle ?? t('table.title')}
                columns={columns}
                data={rows}
                isLoading={isLoading}
                isError={isError}
                error={derivedError}
                pagination={{
                  pageCount,
                  pageIndex: pagination.pageIndex,
                  pageSize: pagination.pageSize,
                  onPageChange: handlePageChange,
                  onPageSizeChange: handlePageSizeChange,
                }}
                toolbar={toolbarComponent}
                emptyState={
                  <span className="inline-flex items-center justify-center text-center leading-relaxed font-semibold">
                    <span role="img" aria-label="sad" className="mr-2">
                      😔
                    </span>
                    {emptyInlineMessage}
                  </span>
                }
                onRowClick={(passport) => {
                  void prefetchPassportDetail(queryClient, String(passport.id))
                  router.navigate({
                    to: '/passports/$passportId',
                    params: { passportId: String(passport.id) },
                  })
                }}
              />
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-sm leading-6">
              {isLoading ? (
                <span>{t('table.pagination.loadingSummary')}</span>
              ) : total > 0 ? (
                <span>{t('table.pagination.showing', { from, to, total })}</span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </Container>
      </section>
    )
  },
)

PassportsTable.displayName = 'PassportsTable'

function PassportsTableToolbar<TData>(props: PassportsTableToolbarProps<TData>) {
  const {
    title,
    subtitle,
    filters,
    onFilterChange,
    dateOptions,
    locationOptions,
    isLoadingLocations,
    isCitySelectDisabled,
    filterByLabel,
    allLocationsLabel,
    loadingLocationsLabel,
  } = props

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{subtitle}</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <span className="text-muted-foreground text-[11px] font-medium tracking-[0.08em] uppercase">
          {filterByLabel}
        </span>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={filters.date} onValueChange={(value) => onFilterChange('date', value)}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder={dateOptions[0]?.label} />
            </SelectTrigger>
            <SelectContent>
              {dateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.city}
            onValueChange={(value) => onFilterChange('city', value)}
            disabled={isCitySelectDisabled}
          >
            <SelectTrigger className="w-full sm:w-48" disabled={isCitySelectDisabled}>
              <SelectValue placeholder={allLocationsLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{allLocationsLabel}</SelectItem>
              {isLoadingLocations ? (
                <SelectItem value="__loading" disabled>
                  {loadingLocationsLabel}
                </SelectItem>
              ) : (
                locationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

type BuildParamsArgs = {
  searchFilters?: PassportSearchFilters
  filters: PassportFilters
  pagination: PaginationState
}

function buildListParams({ searchFilters = {}, filters, pagination }: BuildParamsArgs) {
  const params: Partial<ListParams> = {
    page_size: pagination.pageSize,
    page: pagination.pageIndex + 1,
    sort: 'dateOfPublish',
    sort_dir: 'desc',
  }

  for (const [key, value] of Object.entries(searchFilters)) {
    if (value && typeof value === 'string' && value.trim().length > 0) {
      ;(params as Record<string, string>)[key] = value.trim()
    }
  }

  if (filters.city && filters.city !== 'all') {
    params.location = filters.city
  }

  const now = new Date()
  switch (filters.date) {
    case 'last_7': {
      const start = new Date(now)
      start.setDate(now.getDate() - 7)
      params.published_after = toYmd(start)
      params.published_before = toYmd(now)
      break
    }
    case 'last_30': {
      const start = new Date(now)
      start.setDate(now.getDate() - 30)
      params.published_after = toYmd(start)
      params.published_before = toYmd(now)
      break
    }
    case 'this_year': {
      const start = new Date(now.getFullYear(), 0, 1)
      params.published_after = toYmd(start)
      params.published_before = toYmd(now)
      break
    }
    default: {
      if (filters.date && filters.date !== 'all' && /^\d{4}-\d{2}-\d{2}$/.test(filters.date)) {
        params.published_after = filters.date
        params.published_before = filters.date
      }
    }
  }

  return params
}

function toYmd(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
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
