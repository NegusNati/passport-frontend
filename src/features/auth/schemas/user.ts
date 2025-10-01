import { z } from 'zod'

export const UserSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
  email: z.string().email().optional().nullable(),
  email_verified_at: z.string().datetime({ offset: true }).nullable(),
  plan_type: z.string().nullable(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
})

export type User = z.infer<typeof UserSchema>
