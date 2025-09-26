import { useForm } from '@tanstack/react-form'
import { useRouter } from '@tanstack/react-router'
import { useEffect,useMemo, useState } from 'react'

import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

import { DUMMY_PASSPORTS, SAMPLE_REQUEST_NUMBERS } from '../lib/dummy-data'
import {
  PassportSearchByName,
  type PassportSearchByName as PassportSearchByNameType,
  PassportSearchByNumber,
  type PassportSearchByNumber as PassportSearchByNumberType,
} from '../schemas/passport'

type SearchMode = 'number' | 'name'

interface PassportSearchFormProps {
  onSearch: (data: PassportSearchByNumberType | PassportSearchByNameType, mode: SearchMode) => void
  onQueryChange?: (query: string, mode: SearchMode) => void
}

export function PassportSearchForm({ onSearch, onQueryChange }: PassportSearchFormProps) {
  const router = useRouter()
  const [searchMode, setSearchMode] = useState<SearchMode>('number')
  // Local inputs for debounced interactive search
  const [numberInput, setNumberInput] = useState('')
  const [firstInput, setFirstInput] = useState('')
  const [middleInput, setMiddleInput] = useState('')
  const [lastInput, setLastInput] = useState('')

  const debouncedNumber = useDebouncedValue(numberInput, 300)
  const nameQueryRaw = useMemo(
    () => [firstInput, middleInput, lastInput].filter(Boolean).join(' ').trim(),
    [firstInput, middleInput, lastInput],
  )
  const debouncedName = useDebouncedValue(nameQueryRaw, 300)

  const numberForm = useForm({
    defaultValues: {
      requestNumber: '',
    } as PassportSearchByNumberType,
    onSubmit: async ({ value }) => {
      try {
        const validatedData = PassportSearchByNumber.parse(value)

        // Check if a specific passport is found
        const foundPassport = DUMMY_PASSPORTS.find(
          (p) => p.requestNumber.toLowerCase() === validatedData.requestNumber.toLowerCase(),
        )

        if (foundPassport) {
          // Navigate to detail page
          router.navigate({
            to: '/passports/$passportId',
            params: { passportId: foundPassport.id },
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
      middleName: '',
      lastName: '',
    } as PassportSearchByNameType,
    onSubmit: async ({ value }) => {
      try {
        const validatedData = PassportSearchByName.parse(value)

        // Check if a specific passport is found by name
        const searchName = [
          validatedData.firstName,
          validatedData.middleName?.trim(),
          validatedData.lastName,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        const foundPassport = DUMMY_PASSPORTS.find((p) => p.name.toLowerCase() === searchName)

        if (foundPassport) {
          // Navigate to detail page
          router.navigate({
            to: '/passports/$passportId',
            params: { passportId: foundPassport.id },
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
    const next = searchMode === 'number' ? 'name' : 'number'
    setSearchMode(next)
    onQueryChange?.('', next)
  }

  // Debounced interactive search: trigger after >=3 characters
  useEffect(() => {
    if (searchMode !== 'number') return
    const q = debouncedNumber.trim()
    onQueryChange?.(q.length >= 3 ? q : '', 'number')
  }, [debouncedNumber, searchMode, onQueryChange])

  useEffect(() => {
    if (searchMode !== 'name') return
    const q = debouncedName.trim()
    onQueryChange?.(q.length >= 3 ? q : '', 'name')
  }, [debouncedName, searchMode, onQueryChange])

  return (
    <section className="bg-background py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          {/* Header */}
          <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Check your passport
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Search with your reference number or name and get real-time updates—no more repeated
            trips to the office.
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
                <numberForm.Field name="requestNumber">
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
                          onChange={(e) => {
                            const v = e.target.value
                            field.handleChange(v)
                            setNumberInput(v)
                          }}
                          onBlur={field.handleBlur}
                          className="flex-1"
                          aria-invalid={field.state.meta.errors.length > 0}
                        />
                        <Button type="submit" className="bg-foreground hover:bg-foreground/90">
                          Check Passport
                        </Button>
                      </div>
                      <p className="text-muted-foreground text-xs">Type at least 3 characters to search</p>
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
                <div className="grid gap-4 sm:grid-cols-3">
                  <nameForm.Field name="firstName">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Enter first name"
                          value={field.state.value}
                          onChange={(e) => {
                            const v = e.target.value
                            field.handleChange(v)
                            setFirstInput(v)
                          }}
                          onBlur={field.handleBlur}
                          aria-invalid={false}
                        />
                      </div>
                    )}
                  </nameForm.Field>

                  {/* Middle Name (optional) */}
                  <nameForm.Field name="middleName">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="middleName">Middle Name (optional)</Label>
                        <Input
                          id="middleName"
                          type="text"
                          placeholder="Enter middle name"
                          value={field.state.value}
                          onChange={(e) => {
                            const v = e.target.value
                            field.handleChange(v)
                            setMiddleInput(v)
                          }}
                          onBlur={field.handleBlur}
                          aria-invalid={false}
                        />
                      </div>
                    )}
                  </nameForm.Field>

                  <nameForm.Field name="lastName">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Enter last name"
                          value={field.state.value}
                          onChange={(e) => {
                            const v = e.target.value
                            field.handleChange(v)
                            setLastInput(v)
                          }}
                          onBlur={field.handleBlur}
                          aria-invalid={false}
                        />
                      </div>
                    )}
                  </nameForm.Field>
                </div>

                <Button type="submit" className="bg-foreground hover:bg-foreground/90 w-full">
                  Check Passport
                </Button>
                <p className="text-muted-foreground text-xs">Type at least 3 characters in any name field to search</p>
              </form>
            )}

            {/* Toggle Mode Button */}
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-primary mt-4 text-sm underline underline-offset-4 hover:no-underline"
            >
              {searchMode === 'number' ? 'Use name instead' : 'Use request number instead'}
            </button>

            {/* Sample Request Numbers (only shown in number mode) */}
            {searchMode === 'number' && (
              <div className="text-muted-foreground mt-6 flex flex-wrap justify-center gap-2 text-sm">
                {SAMPLE_REQUEST_NUMBERS.map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => {
                      numberForm.setFieldValue('requestNumber', number)
                      // ensure debounced live search is triggered
                      setNumberInput(number)
                    }}
                    className="border-border bg-muted/50 hover:bg-muted rounded-md border px-3 py-1 text-xs"
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
