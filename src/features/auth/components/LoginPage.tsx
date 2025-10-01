import { Link } from '@tanstack/react-router'

import { Seo } from '@/shared/ui/Seo'

import type { User } from '../schemas/user'
import { LoginForm } from './LoginForm'

type LoginPageProps = {
  onSuccess: (user: User) => void
  redirectPath?: string | null
}

export function LoginPage({ onSuccess, redirectPath }: LoginPageProps) {
  return (
    <main className="container mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center gap-8 p-4">
      <Seo title="Sign in" description="Access your digital passports dashboard." path="/login" noindex />
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with the phone number you used when creating your account.
        </p>
      </header>
      <section className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <LoginForm onSuccess={onSuccess} />
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            search={(prev) => ({ ...prev, redirect: redirectPath ?? prev.redirect })}
            className="font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage
