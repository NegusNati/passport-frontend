import { Link } from '@tanstack/react-router'
import { AlertCircle, BadgeCheck, BadgeInfo, LogOut } from 'lucide-react'

import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Seo } from '@/shared/ui/Seo'

import { useAuthUser, useLogout } from '../hooks'
import type { User } from '../schemas/user'

type ProfilePageProps = {
  initialUser: User
  onSignedOut?: () => void
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value))
  } catch (error) {
    return value
  }
}

export function ProfilePage({ initialUser, onSignedOut }: ProfilePageProps) {
  const { data: user } = useAuthUser({ initialData: initialUser })
  const currentUser = user ?? initialUser

  const logoutMutation = useLogout({
    onSuccess: async () => {
      if (onSignedOut) {
        await onSignedOut()
      }
    },
  })

  const roles = currentUser.roles?.map((role) => role.toLowerCase()) ?? []
  const isAdmin = Boolean(
    currentUser.is_admin || roles.includes('admin') || roles.includes('superadmin'),
  )
  const isEditor = roles.includes('editor')
  const hasUploadPermission = currentUser.permissions?.includes('upload-files') ?? false

  const verifiedLabel = currentUser.email_verified_at ? 'Verified' : 'Not verified'
  const verifiedAt = currentUser.email_verified_at
    ? formatDate(currentUser.email_verified_at)
    : 'Pending verification'

  return (
    <main className="container mx-auto max-w-3xl space-y-8 p-4">
      <Seo title="My profile" description="Manage your account and subscription." path="/profile" noindex />
      <header className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Account overview</h1>
            <p className="text-muted-foreground text-sm">
              Keep your contact details up to date so we can reach you about passport updates.
            </p>
          </div>
          {isAdmin || isEditor ? (
            <Link
              to="/admin"
              preload="intent"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Go to dashboard
            </Link>
          ) : null}
        </div>
      </header>

      <section className="grid gap-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold">Personal details</h2>
          <p className="text-sm text-muted-foreground">
            Information pulled directly from your account record.
          </p>
        </div>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Full name</dt>
            <dd className="font-medium">
              {currentUser.first_name} {currentUser.last_name}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Phone number</dt>
            <dd className="font-medium">{currentUser.phone_number}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{currentUser.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Plan</dt>
            <dd className="font-medium">{currentUser.plan_type ?? 'Free tier'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email status</dt>
            <dd>
              <Badge
                variant={currentUser.email_verified_at ? 'secondary' : 'outline'}
                className="inline-flex items-center gap-1"
              >
                {currentUser.email_verified_at ? (
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {verifiedLabel}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Verified on</dt>
            <dd className="font-medium">{verifiedAt}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Roles</dt>
            <dd className="font-medium">{currentUser.roles?.join(', ') || '—'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Permissions</dt>
            <dd className="font-medium">
              {currentUser.permissions && currentUser.permissions.length > 0
                ? currentUser.permissions.join(', ')
                : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Member since</dt>
            <dd className="font-medium">{formatDate(currentUser.created_at)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Last updated</dt>
            <dd className="font-medium">{formatDate(currentUser.updated_at)}</dd>
          </div>
        </dl>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-destructive/40 bg-destructive/5 p-6">
        <div className="flex items-start gap-3">
          <BadgeInfo className="mt-0.5 h-5 w-5 text-destructive" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="text-base font-semibold">Sign out on shared devices</h2>
            <p className="text-sm text-muted-foreground">
              Logging out revokes this device&apos;s personal access token immediately.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            className="flex flex-row items-center gap-2"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
          
            {logoutMutation.isPending ? 'Signing out…' : <div className='flex flex-row items-center gap-2 '>  <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out </div>}
          </Button>
          {logoutMutation.isError ? (
            <p className="text-sm text-destructive">
              Could not sign you out. Please try again.
            </p>
          ) : null}
        </div>
        {hasUploadPermission && !(isAdmin || isEditor) ? (
          <p className="text-xs text-muted-foreground">
            You can upload passport PDFs from the{' '}
            <Link to="/admin/pdf-import" preload="intent" className="underline">
              PDF import dashboard
            </Link>
            .
          </p>
        ) : null}
      </section>
    </main>
  )
}


