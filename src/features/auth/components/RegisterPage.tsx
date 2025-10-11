import { Link } from '@tanstack/react-router'

import mesh from '@/assets/landingImages/mesh.svg'
import { Seo } from '@/shared/ui/Seo'

import type { User } from '../schemas/user'
import { RegisterForm } from './RegisterForm'

type RegisterPageProps = {
  onSuccess: (user: User) => void
  redirectPath?: string | null
}

export function RegisterPage({ onSuccess, redirectPath }: RegisterPageProps) {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <Seo
        title="Create an account"
        description="Register to manage your digital passports and profile."
        path="/register"
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

      {/* Form Section - White Background */}

      <div className="border-border bg-card translate-y-[-20px] rounded-t-3xl border-t px-6 py-8 sm:px-8 sm:py-10 md:hidden">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Create your account</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Fill in your details to access passport services.
          </p>
        </header>

        <div className="space-y-6">
          <RegisterForm onSuccess={onSuccess} />

          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              search={(prev) => ({ ...prev, redirect: redirectPath ?? prev.redirect })}
              className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <section className="bg-background hidden flex-1 items-center justify-center p-6 md:flex md:w-1/2 md:p-12">
        <div className="bg-card px-6 py-8 sm:px-8 sm:py-10">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Create your account
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Fill in your details to access passport services.
            </p>
          </header>

          <div className="space-y-6">
            <RegisterForm onSuccess={onSuccess} />

            <p className="text-muted-foreground text-center text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                search={(prev) => ({ ...prev, redirect: redirectPath ?? prev.redirect })}
                className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage
