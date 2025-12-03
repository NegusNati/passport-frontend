import { useForm } from '@tanstack/react-form'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

import { useLogin } from '../hooks'
import { type LoginInput, LoginSchema } from '../schemas/login'
import type { User } from '../schemas/user'

type LoginFormProps = {
  onSuccess?: (user: User) => void
}

type FieldErrors = Partial<Record<keyof Pick<LoginInput, 'phoneNumber' | 'password'>, string>>

type ApiValidation = {
  status?: string
  code?: string
  message?: string
  errors?: Record<string, string[]>
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation('auth')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  function mapServerErrors(data?: ApiValidation) {
    const errors: FieldErrors = {}
    if (data?.errors) {
      if (data.errors.phone_number?.[0]) errors.phoneNumber = data.errors.phone_number[0]
      if (data.errors.password?.[0]) errors.password = data.errors.password[0]
    }
    const message =
      data?.code === 'invalid_credentials'
        ? t('login.validation.invalidCredentials')
        : data?.message
    return { fieldErrors: errors, message }
  }

  function sanitizePhone(value: string) {
    return value.replace(/\D/g, '')
  }

  function validatePhone(value: string) {
    const sanitized = sanitizePhone(value)
    const result = LoginSchema.shape.phoneNumber.safeParse(sanitized)
    return result.success ? undefined : t('login.validation.phoneInvalid')
  }

  function validatePassword(value: string) {
    const result = LoginSchema.shape.password.safeParse(value)
    return result.success ? undefined : t('login.validation.passwordMinLength')
  }

  const loginMutation = useLogin({
    onSuccess: async (user, _variables, _context) => {
      setFieldErrors({})
      setFormError(null)
      setRetryAfterSeconds(null)
      if (onSuccess) {
        await onSuccess(user)
      }
    },
    onError: (error) => {
      if (!error.response) {
        setFieldErrors({})
        setFormError(t('login.validation.networkError'))
        return
      }

      const status = error.response.status
      if (status === 429) {
        setFormError(t('login.validation.tooManyAttempts'))
        setRetryAfterSeconds(error.retryAfterSeconds ?? null)
        return
      }

      const { fieldErrors: apiFieldErrors, message } = mapServerErrors(
        error.response?.data as ApiValidation | undefined,
      )
      setFieldErrors(apiFieldErrors)
      const fallback =
        message ??
        (Object.keys(apiFieldErrors).length > 0
          ? null
          : t('login.validation.invalidCredentials'))
      setFormError(fallback)
    },
  })

  const form = useForm({
    defaultValues: {
      phoneNumber: '',
      password: '',
      deviceName: 'web-spa',
    } satisfies LoginInput,
    onSubmit: async ({ value }) => {
      setFormError(null)
      setFieldErrors({})
      setRetryAfterSeconds(null)

      const sanitized: LoginInput = {
        phoneNumber: sanitizePhone(value.phoneNumber),
        password: value.password,
        deviceName: value.deviceName?.trim() ? value.deviceName.trim() : undefined,
      }

      try {
        await loginMutation.mutateAsync(sanitized)
      } catch {
        /* mutation onError handles state */
      }
    },
  })

  return (
    <form
      className="space-y-6"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className="space-y-4">
        <form.Field
          name="phoneNumber"
          validators={{
            onChange: ({ value }) => validatePhone(value ?? ''),
            onSubmit: ({ value }) => validatePhone(value ?? ''),
          }}
        >
          {(field) => {
            const error = field.state.meta.errors[0] ?? fieldErrors.phoneNumber
            return (
              <div className="grid gap-2">
                <Label htmlFor="phone-number">{t('login.form.phoneNumber')}</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={t('login.form.phoneNumberPlaceholder')}
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(event) => {
                    const nextValue = event.target.value
                    if (fieldErrors.phoneNumber) {
                      setFieldErrors((prev) => ({ ...prev, phoneNumber: undefined }))
                    }
                    if (formError) {
                      setFormError(null)
                    }
                    loginMutation.reset()
                    field.handleChange(nextValue)
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby="phone-number-error"
                />
                {error ? (
                  <p id="phone-number-error" className="text-destructive text-sm">
                    {error}
                  </p>
                ) : null}
              </div>
            )
          }}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => validatePassword(value ?? ''),
            onSubmit: ({ value }) => validatePassword(value ?? ''),
          }}
        >
          {(field) => {
            const error = field.state.meta.errors[0] ?? fieldErrors.password
            return (
              <div className="grid gap-2">
                <Label htmlFor="password">{t('login.form.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder={t('login.form.passwordPlaceholder')}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      const nextValue = event.target.value
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({ ...prev, password: undefined }))
                      }
                      if (formError) {
                        setFormError(null)
                      }
                      loginMutation.reset()
                      field.handleChange(nextValue)
                    }}
                    aria-invalid={Boolean(error)}
                    aria-describedby="password-error"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-2 inline-flex items-center"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden />
                    )}
                  </button>
                </div>
                {error ? (
                  <p id="password-error" className="text-destructive text-sm">
                    {error}
                  </p>
                ) : null}
              </div>
            )
          }}
        </form.Field>
      </div>

      {formError ? <p className="text-destructive text-sm">{formError}</p> : null}
      {retryAfterSeconds !== null ? (
        <p className="text-muted-foreground text-sm">
          You can try again in approximately {retryAfterSeconds} second
          {retryAfterSeconds === 1 ? '' : 's'}.
        </p>
      ) : null}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || isSubmitting || loginMutation.isPending}
          >
            {loginMutation.isPending ? t('login.form.submitting') : t('login.form.submit')}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}

export default LoginForm
