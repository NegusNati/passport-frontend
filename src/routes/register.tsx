import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { queryClient } from '@/api/queryClient'
import { type ApiError, authKeys, fetchMe } from '@/features/auth/api'
import { RegisterPage } from '@/features/auth/components/RegisterPage'
import { loadI18nNamespaces } from '@/i18n/loader'

const SearchSchema = z.object({
  redirect: z
    .string()
    .trim()
    .refine((value) => value.startsWith('/'), { message: 'Redirect must be a relative path' })
    .optional(),
})

export const Route = createFileRoute('/register')({
  validateSearch: SearchSchema.parse,
  loader: async ({ location }) => {
    await loadI18nNamespaces(['auth'])
    const parsed = SearchSchema.safeParse(location.search)
    const redirectTo = parsed.success ? parsed.data.redirect : undefined
    try {
      await queryClient.ensureQueryData({ queryKey: authKeys.user(), queryFn: fetchMe })
      throw redirect({ to: redirectTo ?? '/profile' })
    } catch (error) {
      if (isRedirect(error)) {
        throw error
      }
      const status = (error as ApiError | undefined)?.response?.status
      if (status === 401) {
        return null
      }
      throw error
    }
  },
  component: RegisterRouteComponent,
})

function RegisterRouteComponent() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const redirectPath = search.redirect ?? null

  return (
    <RegisterPage
      redirectPath={redirectPath}
      onSuccess={async () => {
        await navigate({ to: redirectPath ?? '/profile', replace: true })
      }}
    />
  )
}
