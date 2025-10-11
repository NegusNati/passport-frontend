import { useForm } from '@tanstack/react-form'
import DOMPurify from 'isomorphic-dompurify'
import { useMemo, useState } from 'react'

import { useAdminUsersQuery } from '@/features/admin/users/api/get-users'
import { useCategoriesQuery, useTagsQuery } from '@/features/articles/lib/ArticlesQuery'
import { LexicalEditor } from '@/shared/components/rich-text/LexicalEditor'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

import type { AdminArticle } from '../schemas/article'
import {
  type AdminArticleCreatePayload,
  AdminArticleCreateSchema,
  type AdminArticleUpdatePayload,
} from '../schemas/create'

const statusOptions = ['draft', 'published', 'scheduled', 'archived'] as const

type ArticleFormValues = {
  title: string
  slug?: string | null
  excerpt?: string | null
  content?: string | null
  canonical_url?: string | null
  meta_title?: string | null
  meta_description?: string | null
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  published_at?: string | null
  tags?: string[]
  categories?: string[]
  tagsInput: string
  categoriesInput: string
  remove_featured_image?: boolean
  remove_og_image?: boolean
  author_id?: number | null
}

type ArticleFormProps = {
  article?: AdminArticle
  onSubmit: (values: AdminArticleCreatePayload | AdminArticleUpdatePayload) => Promise<void> | void
  isSubmitting?: boolean
  errorMessage?: string | null
}

export function ArticleForm({ article, onSubmit, isSubmitting, errorMessage }: ArticleFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const categoriesQuery = useCategoriesQuery()
  const tagsQuery = useTagsQuery()
  const [featuredFile, setFeaturedFile] = useState<File | null>(null)
  const [ogFile, setOgFile] = useState<File | null>(null)
  const [authorSearch, setAuthorSearch] = useState('')
  const debouncedAuthor = useDebouncedValue(authorSearch, 300)
  const usersQuery = useAdminUsersQuery({
    page: 1,
    page_size: 10,
    search: debouncedAuthor || undefined,
    role: undefined,
    is_admin: undefined,
    email_verified: undefined,
  })

  const featuredPreview = useMemo(() => {
    if (featuredFile) return URL.createObjectURL(featuredFile)
    return article?.featured_image_url ?? ''
  }, [featuredFile, article?.featured_image_url])

  const ogPreview = useMemo(() => {
    if (ogFile) return URL.createObjectURL(ogFile)
    return article?.og_image_url ?? ''
  }, [ogFile, article?.og_image_url])

  const form = useForm({
    defaultValues: {
      title: article?.title ?? '',
      slug: article?.slug ?? '',
      excerpt: article?.excerpt ?? '',
      content: article?.content ?? '',
      canonical_url: article?.canonical_url ?? '',
      meta_title: article?.meta_title ?? '',
      meta_description: article?.meta_description ?? '',
      status: article?.status ?? 'draft',
      published_at: article?.published_at ?? '',
      tagsInput: article?.tags?.map((tag) => tag.slug ?? tag.name).join(', ') ?? '',
      categoriesInput: article?.categories?.map((cat) => cat.slug ?? cat.name).join(', ') ?? '',
      remove_featured_image: false as boolean,
      remove_og_image: false as boolean,
      author_id: article?.author?.id ?? null,
    } satisfies ArticleFormValues,
    onSubmit: async ({ value }) => {
      setFormError(null)
      const textOnly = {
        title: value.title.trim(),
        slug: value.slug?.trim() || undefined,
        excerpt: value.excerpt?.trim() || undefined,
        content: sanitizeAndNormalizeContent(value.content),
        canonical_url: value.canonical_url?.trim() || undefined,
        meta_title: value.meta_title?.trim() || undefined,
        meta_description: value.meta_description?.trim() || undefined,
        status: value.status,
        published_at: normalizeDateTime(value.published_at),
        tags: splitCommaSeparated(value.tagsInput),
        categories: splitCommaSeparated(value.categoriesInput),
      }

      const parsed = AdminArticleCreateSchema.safeParse(textOnly)
      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message ?? 'Invalid form data.')
        return
      }

      try {
        await onSubmit({
          ...textOnly,
          featured_image: featuredFile ?? undefined,
          og_image: ogFile ?? undefined,
          remove_featured_image: value.remove_featured_image || undefined,
          remove_og_image: value.remove_og_image || undefined,
          author_id:
            typeof value.author_id === 'number' && Number.isFinite(value.author_id)
              ? value.author_id
              : undefined,
        })
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
                className="border-input bg-background h-10 rounded-md border px-3 text-sm"
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(event.target.value as ArticleFormValues['status'])
                }
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
              className="border-input bg-background min-h-[120px] rounded-md border px-3 py-2 text-sm"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
          </div>
        )}
      </form.Field>

      <form.Field name="content">
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <LexicalEditor
              value={field.state.value ?? ''}
              onChange={(html) => field.handleChange(html)}
              placeholder="Write your article content here..."
            />
          </div>
        )}
      </form.Field>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Featured image upload */}
        <div className="grid gap-2">
          <Label htmlFor="featured_image">Featured image</Label>
          {featuredPreview ? (
            <img
              src={featuredPreview}
              alt="Featured preview"
              className="h-24 w-24 rounded-md border object-cover"
            />
          ) : null}
          <input
            id="featured_image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              const file = e.currentTarget.files?.[0] ?? null
              setFeaturedFile(file)
              if (file) {
                form.setFieldValue('remove_featured_image', false as const)
              }
            }}
          />
        </div>

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
                className="border-input bg-background min-h-[120px] rounded-md border px-3 py-2 text-sm"
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
                list="tags-list"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Comma separated tag slugs"
              />
              <datalist id="tags-list">
                {(tagsQuery.data?.data ?? []).map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name}
                  </option>
                ))}
              </datalist>
            </div>
          )}
        </form.Field>

        <form.Field name="categoriesInput">
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor="categories">Categories</Label>
              <Input
                id="categories"
                list="categories-list"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Comma separated category slugs"
              />
              <datalist id="categories-list">
                {(categoriesQuery.data?.data ?? []).map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </datalist>
            </div>
          )}
        </form.Field>
      </div>

      {/* Author selection */}
      <form.Field name="author_id">
        {(field) => (
          <div className="grid gap-2 md:max-w-xl">
            <Label htmlFor="author_search">Author</Label>
            <Input
              id="author_search"
              value={authorSearch}
              onChange={(e) => setAuthorSearch(e.target.value)}
              placeholder="Search users by name or email"
            />
            <select
              aria-label="Select author"
              className="border-input bg-background h-10 rounded-md border px-3 text-sm"
              value={field.state.value ?? ''}
              onChange={(e) =>
                field.handleChange(e.currentTarget.value ? Number(e.currentTarget.value) : null)
              }
            >
              <option value="">
                {article?.author ? `${article.author.name} (current)` : 'Select author (optional)'}
              </option>
              {field.state.value &&
              !(usersQuery.data?.data ?? []).some((u) => u.id === field.state.value) ? (
                <option value={field.state.value}>
                  {article?.author?.name ? `${article.author.name}` : `User #${field.state.value}`}
                </option>
              ) : null}
              {(usersQuery.data?.data ?? []).map((u) => (
                <option key={u.id} value={u.id}>
                  {`${u.first_name} ${u.last_name}`}
                </option>
              ))}
            </select>
            <p className="text-muted-foreground text-xs">
              {usersQuery.isFetching
                ? 'Searching…'
                : debouncedAuthor
                  ? `Results for "${debouncedAuthor}"`
                  : 'Type to search'}
            </p>
          </div>
        )}
      </form.Field>

      {formError ? <p className="text-destructive text-sm">{formError}</p> : null}
      {errorMessage ? <p className="text-destructive text-sm">{errorMessage}</p> : null}

      {/* OG image upload row (placed after grid to avoid uneven columns on small screens) */}
      <div className="grid gap-2 md:max-w-md">
        <Label htmlFor="og_image">OG image</Label>
        {ogPreview ? (
          <img
            src={ogPreview}
            alt="OG preview"
            className="h-24 w-24 rounded-md border object-cover"
          />
        ) : null}
        <input
          id="og_image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0] ?? null
            setOgFile(file)
            if (file) {
              form.setFieldValue('remove_og_image', false as const)
            }
          }}
        />
      </div>

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

function sanitizeAndNormalizeContent(value?: string | null) {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const sanitized = DOMPurify.sanitize(trimmed, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'code',
      'pre',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'a',
      'blockquote',
      'img',
      'video',
      'source',
    ],
    ALLOWED_ATTR: ['href', 'rel', 'target', 'src', 'alt', 'width', 'height', 'controls', 'preload'],
    ALLOW_DATA_ATTR: false,
    ADD_URI_SAFE_ATTR: ['src'],
  })
  if (!sanitized || sanitized === '<p><br></p>' || sanitized === '<p></p>') {
    return undefined
  }
  return sanitized
}
