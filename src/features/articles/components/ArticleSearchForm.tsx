import { useForm } from '@tanstack/react-form'

import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

import { ArticleSearch, type ArticleSearch as ArticleSearchType } from '../schemas/article'

interface ArticleSearchFormProps {
  onSearch: (data: ArticleSearchType) => void
  initialQuery?: string
  onQueryChange?: (value: string) => void
}

export function ArticleSearchForm({ onSearch, initialQuery = '', onQueryChange }: ArticleSearchFormProps) {
  const form = useForm({
    defaultValues: {
      query: initialQuery,
    } as ArticleSearchType,
    onSubmit: async ({ value }) => {
      try {
        const validatedData = ArticleSearch.parse(value)
        onSearch(validatedData)
      } catch (error) {
        console.error('Validation error:', error)
      }
    },
  })

  return (
    <section className="py-12 md:py-16">
      <Container className='border-border/60 bg-transparent supports-[backdrop-filter]:bg-transparent backdrop-blur-lg rounded-2xl border p-6 shadow-sm' >
        <div className="mx-auto max-w-2xl text-center">
          {/* Header */}
          <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Search for Articles
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Search for article post by article title
          </p>

          {/* Search Form */}
          <div className="mt-8">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="space-y-4"
            >
              <form.Field name="query">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="articleQuery" className="sr-only">
                      Enter article title
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="articleQuery"
                        type="text"
                        placeholder="Enter article title"
                        value={field.state.value}
                        onChange={(e) => {
                          const v = e.target.value
                          field.handleChange(v)
                          onQueryChange?.(v)
                        }}
                        onBlur={field.handleBlur}
                        className="flex-1 text-base"
                        aria-invalid={false}
                      />
                      <Button type="submit" className="px-6" disabled={!field.state.value.trim()}>
                        Search Article
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Tip: Start typing to search (min 3 characters)
                    </p>
                  </div>
                )}
              </form.Field>
            </form>
          </div>
        </div>
      </Container>
    </section>
  )
}
