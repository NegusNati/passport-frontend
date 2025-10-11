import { useEffect, useState } from 'react'

import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

import type { AdminAdvertisementRequestsSearch } from '../schemas/filters'

type FilterState = Pick<
  AdminAdvertisementRequestsSearch,
  'status' | 'full_name' | 'company_name' | 'phone_number'
>

type AdminRequestsFiltersProps = {
  filters: FilterState
  onFilterChange: (updates: Partial<FilterState>) => void
}

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export function AdminRequestsFilters({ filters, onFilterChange }: AdminRequestsFiltersProps) {
  // Local state for input values (for immediate UI updates)
  const [fullNameInput, setFullNameInput] = useState(filters.full_name ?? '')
  const [companyNameInput, setCompanyNameInput] = useState(filters.company_name ?? '')
  const [phoneNumberInput, setPhoneNumberInput] = useState(filters.phone_number ?? '')

  // Debounced values (for API calls)
  const debouncedFullName = useDebouncedValue(fullNameInput, 350)
  const debouncedCompanyName = useDebouncedValue(companyNameInput, 350)
  const debouncedPhoneNumber = useDebouncedValue(phoneNumberInput, 350)

  // Sync local state with props when filters change externally
  useEffect(() => {
    setFullNameInput(filters.full_name ?? '')
  }, [filters.full_name])

  useEffect(() => {
    setCompanyNameInput(filters.company_name ?? '')
  }, [filters.company_name])

  useEffect(() => {
    setPhoneNumberInput(filters.phone_number ?? '')
  }, [filters.phone_number])

  // Trigger filter change when debounced values change
  useEffect(() => {
    if (debouncedFullName !== filters.full_name) {
      onFilterChange({ full_name: debouncedFullName || undefined })
    }
  }, [debouncedFullName, filters.full_name, onFilterChange])

  useEffect(() => {
    if (debouncedCompanyName !== filters.company_name) {
      onFilterChange({ company_name: debouncedCompanyName || undefined })
    }
  }, [debouncedCompanyName, filters.company_name, onFilterChange])

  useEffect(() => {
    if (debouncedPhoneNumber !== filters.phone_number) {
      onFilterChange({ phone_number: debouncedPhoneNumber || undefined })
    }
  }, [debouncedPhoneNumber, filters.phone_number, onFilterChange])

  return (
    <div className="bg-background grid gap-4 rounded-lg border p-4 md:grid-cols-4">
      <div className="grid gap-2">
        <Label htmlFor="filter-status">Status</Label>
        <Select
          value={filters.status ?? 'all'}
          onValueChange={(value) =>
            onFilterChange({
              status: value === 'all' ? 'all' : (value as FilterState['status']),
            })
          }
        >
          <SelectTrigger id="filter-status">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="filter-full-name">Full Name</Label>
        <Input
          id="filter-full-name"
          value={fullNameInput}
          onChange={(e) => setFullNameInput(e.target.value)}
          placeholder="Search by name"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="filter-company-name">Company Name</Label>
        <Input
          id="filter-company-name"
          value={companyNameInput}
          onChange={(e) => setCompanyNameInput(e.target.value)}
          placeholder="Search by company"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="filter-phone-number">Phone Number</Label>
        <Input
          id="filter-phone-number"
          value={phoneNumberInput}
          onChange={(e) => setPhoneNumberInput(e.target.value)}
          placeholder="Search by phone"
        />
      </div>
    </div>
  )
}
