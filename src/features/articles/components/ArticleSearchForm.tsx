import { useForm } from '@tanstack/react-form'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Container } from '@/shared/ui/container'
import { ArticleSearch, type ArticleSearch as ArticleSearchType } from '../schemas/article'

interface ArticleSearchFormProps {
  onSearch: (data: ArticleSearchType) => void
  initialQuery?: string
}

export function ArticleSearchForm({ onSearch, initialQuery = '' }: ArticleSearchFormProps) {
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
    <section className="bg-background py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          {/* Header */}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Search for Articles
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
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
              <form.Field
                name="query"
                validators={{
                  onChange: ({ value }) => {
                    if (!value || value.trim() === '') return 'Search query is required'
                    return undefined
                  },
                }}
              >
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
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className="flex-1 text-base"
                        aria-invalid={field.state.meta.errors.length > 0}
                      />
                      <Button 
                        type="submit" 
                        className="bg-foreground hover:bg-foreground/90 px-6"
                        disabled={!field.state.value.trim()}
                      >
                        Search Article
                      </Button>
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
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
