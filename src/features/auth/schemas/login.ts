import { z } from 'zod'

const phoneNumberMessage = 'Enter a valid 10-digit number starting with 09 or 07'

export const LoginSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, phoneNumberMessage)
    .regex(/^0[79]\d{8}$/, phoneNumberMessage),
  password: z.string().min(8, 'Minimum 8 characters'),
  deviceName: z.string().optional(),
})

export type LoginInput = z.infer<typeof LoginSchema>
