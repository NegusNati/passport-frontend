import { z } from 'zod'

// Search form schemas
export const PassportSearchByNumber = z.object({
  requestNumber: z
    .string()
    .trim()
    .min(3, 'Enter at least 3 characters')
    .max(255, 'Keep the request number under 255 characters'),
})

export const PassportSearchByName = z.object({
  firstName: z.string().trim().optional().default(''),
  middleName: z.string().trim().optional().default(''),
  lastName: z.string().trim().optional().default(''),
}).refine(
  (values) =>
    [values.firstName, values.middleName, values.lastName]
      .filter(Boolean)
      .some((value) => !!value && value.trim().length >= 3),
  {
    message: 'Enter at least one name with 3 or more characters',
    path: ['firstName'],
  },
)

export type PassportSearchByNumber = z.infer<typeof PassportSearchByNumber>
export type PassportSearchByName = z.infer<typeof PassportSearchByName>

export const PassportSearchFilters = z.object({
  request_number: z.string().optional(),
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  name: z.string().optional(),
  query: z.string().optional(),
})

export type PassportSearchFilters = z.infer<typeof PassportSearchFilters>

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
