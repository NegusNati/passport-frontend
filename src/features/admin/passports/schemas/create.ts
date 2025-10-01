import { z } from 'zod'

export const AdminPassportCreateSchema = z.object({
  request_number: z.string().min(3).max(50),
  first_name: z.string().min(1),
  middle_name: z.string().nullable().optional(),
  last_name: z.string().min(1),
  location: z.string().min(2),
  date_of_publish: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export type AdminPassportCreateInput = z.infer<typeof AdminPassportCreateSchema>
