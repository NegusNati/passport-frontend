import { z } from 'zod'

import { UserSchema } from './user'

export const AuthTokenResponseSchema = z.object({
  token_type: z.literal('Bearer'),
  token: z.string().min(1),
  user: UserSchema,
})

export const MeResponseSchema = z.object({
  data: UserSchema,
})

export type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>
