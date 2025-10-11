import { Link } from '@tanstack/react-router'

import mesh from '@/assets/landingImages/mesh.svg'
import { Seo } from '@/shared/ui/Seo'

import type { User } from '../schemas/user'
import { LoginForm } from './LoginForm'

type LoginPageProps = {
  onSuccess: (user: User) => void
  redirectPath?: string | null
}

export function LoginPage({ onSuccess, redirectPath }: LoginPageProps) {
  return (
    <main className="bg-background flex min-h-screen flex-col md:flex-row">
      <Seo
        title="Sign in"
        description="Access your digital passports dashboard."
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
              Passport.ET
            </h1>
            <p className="text-sm text-emerald-100 sm:text-base">
              Instantly know if your Ethiopian passport is ready.
            </p>
          </div>
        </div>
      </section>

      <div className="border-border bg-card translate-y-[-20px] rounded-t-3xl border-t px-6 py-8 sm:px-8 sm:py-12 md:hidden">
        <header className="space-y-2 text-center">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            Sign in to your account
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Welcome back! Please enter your details.
          </p>
        </header>

        <div className="mt-8 space-y-6">
          <LoginForm onSuccess={onSuccess} />

          <p className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              search={(prev) => ({ ...prev, redirect: redirectPath ?? prev.redirect })}
              className="text-primary font-semibold hover:underline"
            >
              Sign Up
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
                Sign in to your account
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Welcome back! Please enter your details.
              </p>
            </header>

            <div className="mt-8 space-y-6">
              <LoginForm onSuccess={onSuccess} />

              <p className="text-muted-foreground text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  search={(prev) => ({ ...prev, redirect: redirectPath ?? prev.redirect })}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign Up
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
