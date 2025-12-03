import { useForm } from '@tanstack/react-form'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import type { AuthTranslationKey } from '@/i18n/types'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

import { useRegister } from '../hooks'
import { type RegisterInput, RegisterSchema } from '../schemas/register'
import type { User } from '../schemas/user'

type RegisterFormProps = {
  onSuccess?: (user: User) => void
}

type FieldErrors = Partial<
  Record<
    keyof Pick<
      RegisterInput,
      'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'password' | 'passwordConfirmation'
    >,
    string
  >
>

type ApiValidation = {
  status?: string
  code?: string
  message?: string
  errors?: Record<string, string[]>
}

function mapServerErrors(data?: ApiValidation) {
  const fieldErrors: FieldErrors = {}
  if (data?.errors) {
    if (data.errors.first_name?.[0]) fieldErrors.firstName = data.errors.first_name[0]
    if (data.errors.last_name?.[0]) fieldErrors.lastName = data.errors.last_name[0]
    if (data.errors.email?.[0]) fieldErrors.email = data.errors.email[0]
    if (data.errors.phone_number?.[0]) fieldErrors.phoneNumber = data.errors.phone_number[0]
    if (data.errors.password?.[0]) fieldErrors.password = data.errors.password[0]
    if (data.errors.password_confirmation?.[0]) {
      fieldErrors.passwordConfirmation = data.errors.password_confirmation[0]
    }
  }
  return { fieldErrors, message: data?.message }
}

function sanitizePhone(value: string) {
  return value.replace(/\D/g, '')
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { t } = useTranslation('auth')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

  // Validation helpers that need t() access
  function validateRequired(schema: z.ZodTypeAny, value: string, fallbackKey: AuthTranslationKey) {
    const result = schema.safeParse(value.trim())
    return result.success ? undefined : (result.error.issues[0]?.message ?? t(fallbackKey))
  }

  function validateEmail(value: string) {
    const trimmed = value.trim().toLowerCase()
    if (!trimmed) {
      return undefined
    }
    const result = RegisterSchema.shape.email.safeParse(trimmed)
    return result.success
      ? undefined
      : (result.error.issues[0]?.message ?? t('register.validation.emailInvalid'))
  }

  function validatePhone(value: string) {
    const sanitized = sanitizePhone(value)
    const result = RegisterSchema.shape.phoneNumber.safeParse(sanitized)
    return result.success
      ? undefined
      : (result.error.issues[0]?.message ?? t('register.validation.phoneInvalid'))
  }

  function validatePassword(value: string) {
    const result = RegisterSchema.shape.password.safeParse(value)
    return result.success
      ? undefined
      : (result.error.issues[0]?.message ?? t('register.validation.passwordMinLength'))
  }

  const registerMutation = useRegister({
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
        setFormError(t('register.validation.networkError'))
        return
      }

      const status = error.response.status
      if (status === 429) {
        setFieldErrors({})
        setFormError(t('register.validation.tooManyAttempts'))
        setRetryAfterSeconds(error.retryAfterSeconds ?? null)
        return
      }

      const { fieldErrors: apiFieldErrors, message } = mapServerErrors(
        error.response.data as ApiValidation | undefined,
      )
      setFieldErrors(apiFieldErrors)
      const fallback =
        message ??
        (Object.keys(apiFieldErrors).length > 0 ? null : t('register.validation.unableToCreate'))
      setFormError(fallback)
    },
  })

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      passwordConfirmation: '',
      deviceName: 'web-spa',
    } satisfies RegisterInput,
    onSubmit: async ({ value, formApi }) => {
      setFormError(null)
      setFieldErrors({})
      setRetryAfterSeconds(null)

      const trimmedEmail = value.email.trim().toLowerCase()
      const sanitized: RegisterInput = {
        firstName: value.firstName.trim(),
        lastName: value.lastName.trim(),
        email: trimmedEmail.length ? trimmedEmail : undefined,
        phoneNumber: sanitizePhone(value.phoneNumber),
        password: value.password,
        passwordConfirmation: value.passwordConfirmation,
        deviceName: value.deviceName?.trim() ? value.deviceName.trim() : undefined,
      }

      const result = RegisterSchema.safeParse(sanitized)
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          const path = issue.path[0]
          if (typeof path === 'string') {
            formApi.setFieldMeta(path as keyof RegisterInput, (prev) => ({
              ...prev,
              errorMap: { ...prev?.errorMap, onSubmit: issue.message },
              errorSourceMap: { ...prev?.errorSourceMap, onSubmit: 'field' },
            }))
          }
        })
        return
      }

      try {
        await registerMutation.mutateAsync(sanitized)
      } catch {
        /* handled in onError */
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
      <div className="grid gap-4">
        <div className="grid gap-2">
          <form.Field
            name="firstName"
            validators={{
              onChange: ({ value }) =>
                validateRequired(
                  RegisterSchema.shape.firstName,
                  value ?? '',
                  'register.validation.firstNameRequired',
                ),
              onSubmit: ({ value }) =>
                validateRequired(
                  RegisterSchema.shape.firstName,
                  value ?? '',
                  'register.validation.firstNameRequired',
                ),
            }}
          >
            {(field) => {
              const error = field.state.meta.errors[0] ?? fieldErrors.firstName
              return (
                <div className="grid gap-2">
                  <Label htmlFor="first-name">{t('register.form.firstName')}</Label>
                  <Input
                    id="first-name"
                    autoComplete="given-name"
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      const nextValue = event.target.value
                      if (fieldErrors.firstName) {
                        setFieldErrors((prev) => ({ ...prev, firstName: undefined }))
                      }
                      if (formError) {
                        setFormError(null)
                      }
                      registerMutation.reset()
                      field.handleChange(nextValue)
                    }}
                    aria-invalid={Boolean(error)}
                    aria-describedby="first-name-error"
                  />
                  {error ? (
                    <p id="first-name-error" className="text-destructive text-sm">
                      {error}
                    </p>
                  ) : null}
                </div>
              )
            }}
          </form.Field>
        </div>

        <div className="grid gap-2">
          <form.Field
            name="lastName"
            validators={{
              onChange: ({ value }) =>
                validateRequired(
                  RegisterSchema.shape.lastName,
                  value ?? '',
                  'register.validation.lastNameRequired',
                ),
              onSubmit: ({ value }) =>
                validateRequired(
                  RegisterSchema.shape.lastName,
                  value ?? '',
                  'register.validation.lastNameRequired',
                ),
            }}
          >
            {(field) => {
              const error = field.state.meta.errors[0] ?? fieldErrors.lastName
              return (
                <div className="grid gap-2">
                  <Label htmlFor="last-name">{t('register.form.lastName')}</Label>
                  <Input
                    id="last-name"
                    autoComplete="family-name"
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      const nextValue = event.target.value
                      if (fieldErrors.lastName) {
                        setFieldErrors((prev) => ({ ...prev, lastName: undefined }))
                      }
                      if (formError) {
                        setFormError(null)
                      }
                      registerMutation.reset()
                      field.handleChange(nextValue)
                    }}
                    aria-invalid={Boolean(error)}
                    aria-describedby="last-name-error"
                  />
                  {error ? (
                    <p id="last-name-error" className="text-destructive text-sm">
                      {error}
                    </p>
                  ) : null}
                </div>
              )
            }}
          </form.Field>
        </div>

        <div className="grid gap-2">
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => validateEmail(value ?? ''),
              onSubmit: ({ value }) => validateEmail(value ?? ''),
            }}
          >
            {(field) => {
              const error = field.state.meta.errors[0] ?? fieldErrors.email
              return (
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('register.form.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      const nextValue = event.target.value
                      if (fieldErrors.email) {
                        setFieldErrors((prev) => ({ ...prev, email: undefined }))
                      }
                      if (formError) {
                        setFormError(null)
                      }
                      registerMutation.reset()
                      field.handleChange(nextValue)
                    }}
                    aria-invalid={Boolean(error)}
                    aria-describedby="email-error"
                  />
                  {error ? (
                    <p id="email-error" className="text-destructive text-sm">
                      {error}
                    </p>
                  ) : null}
                </div>
              )
            }}
          </form.Field>
        </div>

        <div className="grid gap-2">
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
                  <Label htmlFor="register-phone">{t('register.form.phoneNumber')}</Label>
                  <Input
                    id="register-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
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
                      registerMutation.reset()
                      field.handleChange(nextValue)
                    }}
                    aria-invalid={Boolean(error)}
                    aria-describedby="register-phone-error"
                  />
                  {error ? (
                    <p id="register-phone-error" className="text-destructive text-sm">
                      {error}
                    </p>
                  ) : null}
                </div>
              )
            }}
          </form.Field>
        </div>

        <div className="grid gap-2">
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
                  <Label htmlFor="register-password">{t('register.form.password')}</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
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
                        registerMutation.reset()
                        field.handleChange(nextValue)
                      }}
                      aria-invalid={Boolean(error)}
                      aria-describedby="register-password-error"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-2 inline-flex items-center"
                      aria-label={
                        showPassword
                          ? t('register.aria.hidePassword')
                          : t('register.aria.showPassword')
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden />
                      )}
                    </button>
                  </div>
                  {error ? (
                    <p id="register-password-error" className="text-destructive text-sm">
                      {error}
                    </p>
                  ) : null}
                </div>
              )
            }}
          </form.Field>
        </div>

        <div className="grid gap-2">
          <form.Field
            name="passwordConfirmation"
            validators={{
              onChange: ({ value, fieldApi }) => {
                const password = fieldApi.form.getFieldValue('password') as string
                if (!value) {
                  return t('register.validation.confirmPasswordRequired')
                }
                if (value !== password) {
                  return t('register.validation.passwordMismatch')
                }
                return undefined
              },
              onSubmit: ({ value, fieldApi }) => {
                const password = fieldApi.form.getFieldValue('password') as string
                if (!value) {
                  return t('register.validation.confirmPasswordRequired')
                }
                if (value !== password) {
                  return t('register.validation.passwordMismatch')
                }
                return undefined
              },
            }}
          >
            {(field) => {
              const error = field.state.meta.errors[0] ?? fieldErrors.passwordConfirmation
              return (
                <div className="grid gap-2">
                  <Label htmlFor="password-confirmation">{t('register.form.confirmPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="password-confirmation"
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={field.state.value ?? ''}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        const nextValue = event.target.value
                        if (fieldErrors.passwordConfirmation) {
                          setFieldErrors((prev) => ({ ...prev, passwordConfirmation: undefined }))
                        }
                        if (formError) {
                          setFormError(null)
                        }
                        registerMutation.reset()
                        field.handleChange(nextValue)
                      }}
                      aria-invalid={Boolean(error)}
                      aria-describedby="password-confirmation-error"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                      className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-2 inline-flex items-center"
                      aria-label={
                        showPasswordConfirmation
                          ? t('register.aria.hidePasswordConfirmation')
                          : t('register.aria.showPasswordConfirmation')
                      }
                    >
                      {showPasswordConfirmation ? (
                        <EyeOff className="h-5 w-5" aria-hidden />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden />
                      )}
                    </button>
                  </div>
                  {error ? (
                    <p id="password-confirmation-error" className="text-destructive text-sm">
                      {error}
                    </p>
                  ) : null}
                </div>
              )
            }}
          </form.Field>
        </div>
      </div>

      {formError ? <p className="text-destructive text-sm">{formError}</p> : null}
      {retryAfterSeconds !== null ? (
        <p className="text-muted-foreground text-sm">
          {t(retryAfterSeconds === 1 ? 'register.retry.singular' : 'register.retry.plural', {
            seconds: retryAfterSeconds,
          })}
        </p>
      ) : null}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || isSubmitting || registerMutation.isPending}
          >
            {registerMutation.isPending
              ? t('register.form.submitting')
              : t('register.form.submit')}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}

export default RegisterForm
