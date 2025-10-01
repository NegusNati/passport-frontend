import { useForm } from '@tanstack/react-form'
import { useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

import type { AdminArticle } from '../schemas/article'
import {
  type AdminArticleCreateInput,
  AdminArticleCreateSchema,
} from '../schemas/create'

const statusOptions: AdminArticleCreateInput['status'][] = [
  'draft',
  'published',
  'scheduled',
  'archived',
]

type ArticleFormValues = AdminArticleCreateInput & {
  tagsInput: string
  categoriesInput: string
}

type ArticleFormProps = {
  article?: AdminArticle
  onSubmit: (values: AdminArticleCreateInput) => Promise<void> | void
  isSubmitting?: boolean
  errorMessage?: string | null
}

export function ArticleForm({ article, onSubmit, isSubmitting, errorMessage }: ArticleFormProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      title: article?.title ?? '',
      slug: article?.slug ?? '',
      excerpt: article?.excerpt ?? '',
      content: article?.content ?? '',
      featured_image_url: article?.featured_image_url ?? '',
      canonical_url: article?.canonical_url ?? '',
      meta_title: article?.meta_title ?? '',
      meta_description: article?.meta_description ?? '',
      og_image_url: article?.og_image_url ?? '',
      status: article?.status ?? 'draft',
      published_at: article?.published_at ?? '',
      tagsInput: article?.tags?.map((tag) => tag.slug ?? tag.name).join(', ') ?? '',
      categoriesInput: article?.categories?.map((cat) => cat.slug ?? cat.name).join(', ') ?? '',
    } satisfies ArticleFormValues,
    onSubmit: async ({ value }) => {
      setFormError(null)
      const payload: AdminArticleCreateInput = {
        title: value.title.trim(),
        slug: value.slug?.trim() || undefined,
        excerpt: value.excerpt?.trim() || undefined,
        content: value.content?.trim() || undefined,
        featured_image_url: value.featured_image_url?.trim() || undefined,
        canonical_url: value.canonical_url?.trim() || undefined,
        meta_title: value.meta_title?.trim() || undefined,
        meta_description: value.meta_description?.trim() || undefined,
        og_image_url: value.og_image_url?.trim() || undefined,
        status: value.status,
        published_at: normalizeDateTime(value.published_at),
        tags: splitCommaSeparated(value.tagsInput),
        categories: splitCommaSeparated(value.categoriesInput),
      }

      const parsed = AdminArticleCreateSchema.safeParse(payload)
      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message ?? 'Invalid form data.')
        return
      }

      try {
        await onSubmit(parsed.data)
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : 'Failed to save article. Please try again.',
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
        <form.Field name="title">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                required
              />
            </div>
          )}
        </form.Field>

        <form.Field name="slug">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Auto-generated when left blank"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="status">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value as AdminArticleCreateInput['status'])}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>

        <form.Field name="published_at">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="published_at">Published at</Label>
              <Input
                id="published_at"
                type="datetime-local"
                value={toLocalInputValue(field.state.value)}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </div>
          )}
        </form.Field>
      </div>

      <form.Field name="excerpt">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <textarea
              id="excerpt"
              className="min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="content">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="content">Content (HTML)</Label>
            <textarea
              id="content"
              className="min-h-[240px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </div>
        )}
      </form.Field>

      <div className="grid gap-4 md:grid-cols-2">
        <form.Field name="featured_image_url">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="featured_image_url">Featured image URL</Label>
              <Input
                id="featured_image_url"
                type="url"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="canonical_url">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="canonical_url">Canonical URL</Label>
              <Input
                id="canonical_url"
                type="url"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="meta_title">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="meta_title">Meta title</Label>
              <Input
                id="meta_title"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="meta_description">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="meta_description">Meta description</Label>
              <textarea
                id="meta_description"
                className="min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="og_image_url">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="og_image_url">OG image URL</Label>
              <Input
                id="og_image_url"
                type="url"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="tagsInput">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Comma separated tag slugs"
              />
            </div>
          )}
        </form.Field>

        <form.Field name="categoriesInput">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="categories">Categories</Label>
              <Input
                id="categories"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Comma separated category slugs"
              />
            </div>
          )}
        </form.Field>
      </div>

      {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
      {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}

      <form.Subscribe selector={(state) => state.canSubmit}>
        {(canSubmit) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save article'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}

function splitCommaSeparated(input?: string) {
  if (!input) return undefined
  const values = input
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  return values.length > 0 ? values : undefined
}

function toLocalInputValue(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const pad = (n: number) => String(n).padStart(2, '0')
  const yyyy = date.getFullYear()
  const mm = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const hh = pad(date.getHours())
  const min = pad(date.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`
}

function normalizeDateTime(value?: string | null) {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const date = new Date(trimmed)
  if (Number.isNaN(date.getTime())) {
    return trimmed
  }
  return date.toISOString()
}
