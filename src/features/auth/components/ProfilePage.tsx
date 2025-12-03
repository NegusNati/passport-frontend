import { Link } from '@tanstack/react-router'
import { AlertCircle, BadgeCheck, BadgeInfo, LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Seo } from '@/shared/ui/Seo'

import { useAuthUser, useLogout } from '../hooks'
import type { User } from '../schemas/user'

type ProfilePageProps = {
  initialUser: User
  onSignedOut?: () => void
}

export function ProfilePage({ initialUser, onSignedOut }: ProfilePageProps) {
  const { t, i18n } = useTranslation('auth')
  const { data: user } = useAuthUser({ initialData: initialUser })
  const currentUser = user ?? initialUser

  function formatDate(value: string) {
    try {
      return new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' }).format(
        new Date(value),
      )
    } catch {
      return value
    }
  }

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

  const verifiedLabel = currentUser.email_verified_at
    ? t('profile.personalDetails.verified')
    : t('profile.personalDetails.notVerified')
  const verifiedAt = currentUser.email_verified_at
    ? formatDate(currentUser.email_verified_at)
    : t('profile.personalDetails.pendingVerification')

  return (
    <main className="container mx-auto max-w-3xl space-y-8 p-4">
      <Seo
        title={t('profile.seo.title')}
        description={t('profile.seo.description')}
        path="/profile"
        noindex
      />
      <header className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{t('profile.title')}</h1>
            <p className="text-muted-foreground text-sm">{t('profile.subtitle')}</p>
          </div>
          {isAdmin || isEditor ? (
            <Link
              to="/admin"
              preload="intent"
              className="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors"
            >
              {t('profile.goToDashboard')}
            </Link>
          ) : null}
        </div>
      </header>

      <section className="bg-card grid gap-6 rounded-lg border p-6 shadow-sm">
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold">{t('profile.personalDetails.title')}</h2>
          <p className="text-muted-foreground text-sm">{t('profile.personalDetails.subtitle')}</p>
        </div>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">{t('profile.personalDetails.fullName')}</dt>
            <dd className="font-medium">
              {currentUser.first_name} {currentUser.last_name}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t('profile.personalDetails.phoneNumber')}</dt>
            <dd className="font-medium">{currentUser.phone_number}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t('profile.personalDetails.email')}</dt>
            <dd className="font-medium">{currentUser.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t('profile.personalDetails.plan')}</dt>
            <dd className="font-medium">
              {currentUser.plan_type ?? t('profile.personalDetails.freeTier')}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t('profile.personalDetails.emailStatus')}</dt>
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
            <dt className="text-muted-foreground">{t('profile.personalDetails.verifiedOn')}</dt>
            <dd className="font-medium">{verifiedAt}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t('profile.personalDetails.roles')}</dt>
            <dd className="font-medium">{currentUser.roles?.join(', ') || '—'}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t('profile.personalDetails.permissions')}</dt>
            <dd className="font-medium">
              {currentUser.permissions && currentUser.permissions.length > 0
                ? currentUser.permissions.join(', ')
                : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t('profile.personalDetails.memberSince')}</dt>
            <dd className="font-medium">{formatDate(currentUser.created_at)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t('profile.personalDetails.lastUpdated')}</dt>
            <dd className="font-medium">{formatDate(currentUser.updated_at)}</dd>
          </div>
        </dl>
      </section>

      <section className="border-destructive/40 bg-destructive/5 flex flex-col gap-4 rounded-lg border p-6">
        <div className="flex items-start gap-3">
          <BadgeInfo className="text-destructive mt-0.5 h-5 w-5" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="text-base font-semibold">{t('profile.signOut.title')}</h2>
            <p className="text-muted-foreground text-sm">{t('profile.signOut.description')}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            className="flex flex-row items-center gap-2"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              t('profile.signOut.signingOut')
            ) : (
              <div className="flex flex-row items-center gap-2">
                {' '}
                <LogOut className="h-4 w-4" aria-hidden="true" /> {t('profile.signOut.button')}{' '}
              </div>
            )}
          </Button>
          {logoutMutation.isError ? (
            <p className="text-destructive text-sm">{t('profile.signOut.error')}</p>
          ) : null}
        </div>
        {hasUploadPermission && !(isAdmin || isEditor) ? (
          <p className="text-muted-foreground text-xs">
            {t('profile.pdfUploadHint')}{' '}
            <Link to="/admin/pdf-import" preload="intent" className="underline">
              {t('profile.pdfImportDashboard')}
            </Link>
            .
          </p>
        ) : null}
      </section>
    </main>
  )
}
