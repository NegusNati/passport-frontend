import { keepPreviousData, type QueryKey, useQuery } from '@tanstack/react-query'

import { fetchLocations, fetchPassportById, fetchPassports, type ListParams } from './PassportsApi'

export const passportsKeys = {
  all: ['passports'] as const,
  list: (params: Partial<ListParams> = {}) => [...passportsKeys.all, 'list', params] as const,
  detail: (id: string) => [...passportsKeys.all, 'detail', id] as const,
  locations: () => [...passportsKeys.all, 'locations'] as const,
}

export function usePassportsQuery(params: ListParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: passportsKeys.list(params) as QueryKey,
    queryFn: () => fetchPassports(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    enabled: options?.enabled ?? true,
  })
}

export function usePassportQuery(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: passportsKeys.detail(id) as QueryKey,
    queryFn: () => fetchPassportById(id),
    staleTime: 60_000,
    enabled: (options?.enabled ?? true) && !!id,
  })
}

export function useLocationsQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: passportsKeys.locations() as QueryKey,
    queryFn: () => fetchLocations(),
    staleTime: 5 * 60_000, // server caches 5 minutes
    enabled: options?.enabled ?? true,
  })
}
