import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import mesh from '@/assets/landingImages/mesh.svg'
import { Seo } from '@/shared/ui/Seo'

import type { User } from '../schemas/user'
import { LoginForm } from './LoginForm'

type LoginPageProps = {
  onSuccess: (user: User) => void
  redirectPath?: string | null
}

export function LoginPage({ onSuccess, redirectPath }: LoginPageProps) {
  const { t } = useTranslation('auth')

  return (
    <main className="bg-background flex min-h-screen flex-col md:flex-row">
      <Seo
        title={t('login.seo.title')}
        description={t('login.seo.description')}
        path="/login"
        noindex
      />

      {/* Branding Section */}
      <section className="relative flex items-center justify-center bg-[#0B2218] md:w-1/2">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `url("${mesh}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(1.4)',
          }}
        />
        <div className="relative flex w-full max-w-sm flex-col items-center gap-4 px-6 py-16 text-center text-white sm:max-w-md sm:py-20">
          <div className="flex h-32 w-32 items-center justify-center bg-transparent shadow-transparent"></div>
          <div className="space-y-2 pb-8">
            <h1 className="text-foreground/90 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('login.branding.title')}
            </h1>
            <p className="text-sm text-emerald-100 sm:text-base">
              {t('login.branding.tagline')}
            </p>
          </div>
        </div>
      </section>

      <div className="border-border bg-card translate-y-[-20px] rounded-t-3xl border-t px-6 py-8 sm:px-8 sm:py-12 md:hidden">
        <header className="space-y-2 text-center">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            {t('login.title')}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t('login.subtitle')}
          </p>
        </header>

        <div className="mt-8 space-y-6">
          <LoginForm onSuccess={onSuccess} />

          <p className="text-muted-foreground text-center text-sm">
            {t('login.noAccount')}{' '}
            <Link
              to="/register"
              search={(prev) => ({ ...prev, redirect: redirectPath ?? prev.redirect })}
              className="text-primary font-semibold hover:underline"
            >
              {t('login.signUp')}
            </Link>
          </p>
        </div>
      </div>
      {/* Form Section */}
      <section className="hidden flex-1 items-center justify-center px-5 py-10 sm:px-8 md:flex md:w-1/2 md:py-16">
        <div className="w-full max-w-md">
          <div className="bg-card px-6 py-8 sm:px-8 sm:py-10">
            <header className="space-y-2 text-center">
              <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
                {t('login.title')}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t('login.subtitle')}
              </p>
            </header>

            <div className="mt-8 space-y-6">
              <LoginForm onSuccess={onSuccess} />

              <p className="text-muted-foreground text-center text-sm">
                {t('login.noAccount')}{' '}
                <Link
                  to="/register"
                  search={(prev) => ({ ...prev, redirect: redirectPath ?? prev.redirect })}
                  className="text-primary font-semibold hover:underline"
                >
                  {t('login.signUp')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
