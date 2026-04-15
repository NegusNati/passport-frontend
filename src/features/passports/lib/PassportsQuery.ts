import { keepPreviousData, type QueryClient, type QueryKey, useQuery } from '@tanstack/react-query'

import { fetchLocations, fetchPassportById, fetchPassports, type ListParams } from './PassportsApi'

const LIST_STALE_TIME = 60_000
const DETAIL_STALE_TIME = 5 * 60_000
const CACHE_TIME = 30 * 60_000

export const passportsKeys = {
  all: ['passports'] as const,
  list: (params: Partial<ListParams> = {}) => [...passportsKeys.all, 'list', params] as const,
  detail: (id: string) => [...passportsKeys.all, 'detail', id] as const,
  locations: () => [...passportsKeys.all, 'locations'] as const,
}

export function getPassportsListQueryOptions(params: Partial<ListParams>) {
  return {
    queryKey: passportsKeys.list(params) as QueryKey,
    queryFn: () => fetchPassports(params),
    placeholderData: keepPreviousData,
    staleTime: LIST_STALE_TIME,
    gcTime: CACHE_TIME,
    networkMode: 'offlineFirst' as const,
  }
}

export function getPassportQueryOptions(id: string) {
  return {
    queryKey: passportsKeys.detail(id) as QueryKey,
    queryFn: () => fetchPassportById(id),
    staleTime: DETAIL_STALE_TIME,
    gcTime: CACHE_TIME,
    networkMode: 'offlineFirst' as const,
  }
}

export function getLocationsQueryOptions() {
  return {
    queryKey: passportsKeys.locations() as QueryKey,
    queryFn: () => fetchLocations(),
    staleTime: 5 * 60_000,
    gcTime: CACHE_TIME,
    networkMode: 'offlineFirst' as const,
  }
}

export function usePassportsQuery(params: Partial<ListParams>, options?: { enabled?: boolean }) {
  return useQuery({
    ...getPassportsListQueryOptions(params),
    enabled: options?.enabled ?? true,
  })
}

export function usePassportQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    ...getPassportQueryOptions(id),
    enabled: (options?.enabled ?? true) && !!id,
  })
}

export function useLocationsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    ...getLocationsQueryOptions(),
    enabled: options?.enabled ?? true,
  })
}

export function prefetchPassportDetail(queryClient: QueryClient, id: string) {
  return queryClient.prefetchQuery(getPassportQueryOptions(id))
}
