import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { AdvertisementRequestForm } from '@/features/advertisement-requests/components/AdvertisementRequestForm'
import { AdvertisementRequestSuccess } from '@/features/advertisement-requests/components/AdvertisementRequestSuccess'
import { useSubmitAdvertisementRequestMutation } from '@/features/advertisement-requests/lib/queries'
import type { AdvertisementRequestCreatePayload } from '@/features/advertisement-requests/schemas/create'
import { Container } from '@/shared/ui/container'
import { Seo } from '@/shared/ui/Seo'

export const Route = createFileRoute('/advertisement-requests')({
  component: AdvertisementRequestPage,
})

function AdvertisementRequestPage() {
  const [submitted, setSubmitted] = useState(false)
  const mutation = useSubmitAdvertisementRequestMutation()

  const handleSubmit = async (values: AdvertisementRequestCreatePayload) => {
    try {
      await mutation.mutateAsync(values)
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit advertisement request:', error)
    }
  }

  const handleSubmitAnother = () => {
    setSubmitted(false)
    mutation.reset()
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <Seo
        title="Advertisement Request"
        description="Submit your advertisement request and our team will get back to you shortly."
        path="/advertisement-requests"
      />

      <Container>
        <div className="mx-auto max-w-2xl">
          {!submitted ? (
            <>
              <div className="mb-8 space-y-2 text-center">
                <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                  Advertisement Request
                </h1>
                <p className="text-muted-foreground text-lg">
                  Submit your advertisement inquiry and we&apos;ll contact you shortly
                </p>
              </div>

              <div className="bg-card rounded-lg border p-6 shadow-sm sm:p-8">
                <AdvertisementRequestForm
                  onSubmit={handleSubmit}
                  isSubmitting={mutation.isPending}
                  errorMessage={mutation.error instanceof Error ? mutation.error.message : null}
                />
              </div>
            </>
          ) : (
            <AdvertisementRequestSuccess onSubmitAnother={handleSubmitAnother} />
          )}
        </div>
      </Container>
    </div>
  )
}
