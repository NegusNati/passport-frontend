import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'

import { queryClient } from '@/api/queryClient'
import { type ApiError, authKeys, fetchMe } from '@/features/auth/api'
import { ProfilePage } from '@/features/auth/components/ProfilePage'
import { loadI18nNamespaces } from '@/i18n/loader'

export const Route = createFileRoute('/profile')({
  loader: async ({ location }) => {
    await loadI18nNamespaces(['auth'])
    try {
      return await queryClient.ensureQueryData({
        queryKey: authKeys.user(),
        queryFn: fetchMe,
      })
    } catch (error) {
      if (isRedirect(error)) {
        throw error
      }
      const status = (error as ApiError | undefined)?.response?.status
      if (status === 401) {
        const target = location.href ?? location.pathname
        throw redirect({ to: '/login', search: { redirect: target } })
      }
      throw error
    }
  },
  component: ProfileRouteComponent,
})

function ProfileRouteComponent() {
  const navigate = Route.useNavigate()
  const user = Route.useLoaderData()

  return (
    <ProfilePage
      initialUser={user}
      onSignedOut={async () => {
        await navigate({ to: '/login', replace: true })
      }}
    />
  )
}
