import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Container } from '@/shared/ui/container'
import { 
  PassportSearchByNumber, 
  PassportSearchByName,
  type PassportSearchByNumber as PassportSearchByNumberType,
  type PassportSearchByName as PassportSearchByNameType 
} from '../schemas/passport'
import { SAMPLE_REQUEST_NUMBERS, DUMMY_PASSPORTS } from '../lib/dummy-data'

type SearchMode = 'number' | 'name'

interface PassportSearchFormProps {
  onSearch: (data: PassportSearchByNumberType | PassportSearchByNameType, mode: SearchMode) => void
}

export function PassportSearchForm({ onSearch }: PassportSearchFormProps) {
  const router = useRouter()
  const [searchMode, setSearchMode] = React.useState<SearchMode>('number')

  const numberForm = useForm({
    defaultValues: {
      requestNumber: '',
    } as PassportSearchByNumberType,
    onSubmit: async ({ value }) => {
      try {
        const validatedData = PassportSearchByNumber.parse(value)
        
        // Check if a specific passport is found
        const foundPassport = DUMMY_PASSPORTS.find(p => 
          p.requestNumber.toLowerCase() === validatedData.requestNumber.toLowerCase()
        )
        
        if (foundPassport) {
          // Navigate to detail page
          router.navigate({ 
            to: '/passports/$passportId', 
            params: { passportId: foundPassport.id } 
          })
        } else {
          // Use existing search functionality for partial matches
          onSearch(validatedData, 'number')
        }
      } catch (error) {
        console.error('Validation error:', error)
      }
    },
  })

  const nameForm = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    } as PassportSearchByNameType,
    onSubmit: async ({ value }) => {
      try {
        const validatedData = PassportSearchByName.parse(value)
        
        // Check if a specific passport is found by name
        const searchName = `${validatedData.firstName} ${validatedData.lastName}`.toLowerCase()
        const foundPassport = DUMMY_PASSPORTS.find(p => 
          p.name.toLowerCase() === searchName
        )
        
        if (foundPassport) {
          // Navigate to detail page
          router.navigate({ 
            to: '/passports/$passportId', 
            params: { passportId: foundPassport.id } 
          })
        } else {
          // Use existing search functionality for partial matches
          onSearch(validatedData, 'name')
        }
      } catch (error) {
        console.error('Validation error:', error)
      }
    },
  })

  const handleToggleMode = () => {
    setSearchMode(searchMode === 'number' ? 'name' : 'number')
  }

  return (
    <section className="bg-background py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          {/* Header */}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Check your passport
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Search with your reference number or name and get real-time updates—no more repeated trips to the office.
          </p>

          {/* Search Form */}
          <div className="mt-8">
            {searchMode === 'number' ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  numberForm.handleSubmit()
                }}
                className="space-y-4"
              >
                <numberForm.Field
                  name="requestNumber"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value || value.trim() === '') return 'Request number is required'
                      return undefined
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="requestNumber" className="sr-only">
                        Request Number
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="requestNumber"
                          type="text"
                          placeholder="Enter request number"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="flex-1"
                          aria-invalid={field.state.meta.errors.length > 0}
                        />
                        <Button 
                          type="submit" 
                          className="bg-foreground hover:bg-foreground/90"
                          disabled={!field.state.value.trim()}
                        >
                          Check Passport
                        </Button>
                      </div>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
                  )}
                </numberForm.Field>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  nameForm.handleSubmit()
                }}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <nameForm.Field
                    name="firstName"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value || value.trim() === '') return 'First name is required'
                        return undefined
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="firstName">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Enter first name"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={field.state.meta.errors.length > 0}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-destructive">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </nameForm.Field>

                  <nameForm.Field
                    name="lastName"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value || value.trim() === '') return 'Last name is required'
                        return undefined
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="lastName">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Enter last name"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          aria-invalid={field.state.meta.errors.length > 0}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-destructive">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </nameForm.Field>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-foreground hover:bg-foreground/90"
                >
                  Check Passport
                </Button>
              </form>
            )}

            {/* Toggle Mode Button */}
            <button
              type="button"
              onClick={handleToggleMode}
              className="mt-4 text-sm text-primary underline underline-offset-4 hover:no-underline"
            >
              {searchMode === 'number' ? 'Use name instead' : 'Use request number instead'}
            </button>

            {/* Sample Request Numbers (only shown in number mode) */}
            {searchMode === 'number' && (
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                {SAMPLE_REQUEST_NUMBERS.map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => {
                      numberForm.setFieldValue('requestNumber', number)
                    }}
                    className="rounded-md border border-border bg-muted/50 px-3 py-1 text-xs hover:bg-muted"
                  >
                    {number}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
