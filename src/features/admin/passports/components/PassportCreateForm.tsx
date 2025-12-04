import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'

import { type AdminPassportCreateInput, AdminPassportCreateSchema } from '../schemas/create'

const locations = ['ICS branch office, Jimma', 'Addis Ababa', 'Dire Dawa']

type PassportCreateFormProps = {
  onSubmit: (values: AdminPassportCreateInput) => Promise<void> | void
  isSubmitting?: boolean
  errorMessage?: string | null
}

export function PassportCreateForm({
  onSubmit,
  isSubmitting,
  errorMessage,
}: PassportCreateFormProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      request_number: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      location: locations[0] ?? '',
      date_of_publish: '',
    } satisfies AdminPassportCreateInput,
    onSubmit: async ({ value }) => {
      setFormError(null)
      const parsed = AdminPassportCreateSchema.safeParse({
        ...value,
        middle_name: value.middle_name?.trim() ? value.middle_name.trim() : undefined,
      })

      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message ?? 'Invalid form data.')
        return
      }

      try {
        await onSubmit(parsed.data)
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : 'Failed to create passport. Please try again.',
        )
      }
    },
  })

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <form.Field name="request_number">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="request_number">Request number</Label>
              <Input
                id="request_number"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="e.g. JIL7421187"
                required
              />
            </div>
          )}
        </form.Field>

        <form.Field name="location">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
              >
                <SelectTrigger
                  id="location"
                  className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </form.Field>

        <form.Field name="first_name">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="first_name">First name</Label>
              <Input
                id="first_name"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                required
              />
            </div>
          )}
        </form.Field>

        <form.Field name="middle_name">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="middle_name">Middle name</Label>
              <Input
                id="middle_name"
                value={field.state.value ?? ''}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Optional"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="last_name">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="last_name">Last name</Label>
              <Input
                id="last_name"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                required
              />
            </div>
          )}
        </form.Field>

        <form.Field name="date_of_publish">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="date_of_publish">Date of publish</Label>
              <Input
                id="date_of_publish"
                type="date"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                required
              />
            </div>
          )}
        </form.Field>
      </div>

      {formError ? <p className="text-destructive text-sm">{formError}</p> : null}
      {errorMessage ? <p className="text-destructive text-sm">{errorMessage}</p> : null}

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create passport'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
