import { Link } from '@tanstack/react-router'

import { Seo } from '@/shared/ui/Seo'

import type { User } from '../schemas/user'
import { RegisterForm } from './RegisterForm'

type RegisterPageProps = {
  onSuccess: (user: User) => void
  redirectPath?: string | null
}

export function RegisterPage({ onSuccess, redirectPath }: RegisterPageProps) {
  return (
    <main className="container mx-auto flex min-h-[calc(100vh-8rem)] max-w-2xl flex-col justify-center gap-8 p-4">
      <Seo
        title="Create an account"
        description="Register to manage your digital passports and profile."
        path="/register"
        noindex
      />
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Fill in your details to access passport services and personalized content.
        </p>
      </header>
      <section className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <RegisterForm onSuccess={onSuccess} />
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            search={(prev) => ({ ...prev, redirect: redirectPath ?? prev.redirect })}
            className="font-medium text-primary hover:underline"
          >
            Sign in instead
          </Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage
