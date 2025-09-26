import { z } from 'zod'

// Search form schemas
export const PassportSearchByNumber = z.object({
  requestNumber: z.string().optional().default(''),
})

export const PassportSearchByName = z.object({
  firstName: z.string().optional().default(''),
  middleName: z.string().optional().default(''),
  lastName: z.string().optional().default(''),
})

export type PassportSearchByNumber = z.infer<typeof PassportSearchByNumber>
export type PassportSearchByName = z.infer<typeof PassportSearchByName>

// Passport data schema
export const Passport = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  requestNumber: z.string(),
  status: z.enum(['pending', 'processing', 'ready', 'completed']).default('pending'),
  city: z.string().optional(),
})

export type Passport = z.infer<typeof Passport>

// Filter schemas
export const PassportFilters = z.object({
  date: z.string().default('all'),
  city: z.string().default('all'),
})

export type PassportFilters = z.infer<typeof PassportFilters>

// Pagination schema
export const PaginationParams = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
})

export type PaginationParams = z.infer<typeof PaginationParams>
