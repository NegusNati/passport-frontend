import { z } from 'zod'

import { LoginSchema } from './login'

export const RegisterSchema = LoginSchema.extend({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Enter a valid email').optional(),
  passwordConfirmation: z.string().min(8, 'Minimum 8 characters'),
}).refine((value) => value.password === value.passwordConfirmation, {
  message: 'Passwords must match',
  path: ['passwordConfirmation'],
})

export type RegisterInput = z.infer<typeof RegisterSchema>
