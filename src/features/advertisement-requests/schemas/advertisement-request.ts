import { z } from 'zod'

// API response item
export const AdvertisementRequestItem = z.object({
  id: z.number().int(),
  phone_number: z.string(),
  email: z.string().nullable(),
  full_name: z.string(),
  company_name: z.string().nullable(),
  description: z.string(),
  file_url: z.string().nullable(),
  status: z.enum(['pending', 'contacted', 'approved', 'rejected']).nullable(),
  contacted_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type AdvertisementRequestItem = z.infer<typeof AdvertisementRequestItem>

// Public submission form schema
export const AdvertisementRequestCreate = z.object({
  phone_number: z.string().min(1, 'Phone number is required').max(20, 'Phone number too long'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  full_name: z.string().min(1, 'Full name is required').max(255, 'Full name too long'),
  company_name: z.string().max(255, 'Company name too long').optional().or(z.literal('')),
  description: z
    .string()
    .min(10, 'Please provide at least 10 characters')
    .max(5000, 'Description too long (max 5000 characters)'),
})

export type AdvertisementRequestCreate = z.infer<typeof AdvertisementRequestCreate>

// Response from POST
export const AdvertisementRequestCreateResponse = z.object({
  data: AdvertisementRequestItem,
})

export type AdvertisementRequestCreateResponse = z.infer<typeof AdvertisementRequestCreateResponse>
