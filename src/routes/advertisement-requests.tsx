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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
      <Seo
        title="Advertisement Request"
        description="Submit your advertisement request and our team will get back to you shortly."
        path="/advertisement-requests"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-24 hidden h-[480px] w-[480px] rounded-[120px] border border-primary/20 bg-primary/20 blur-3xl lg:block"
      />

      <Container>
        <div className="grid items-center gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:py-24">
          <div className="relative z-10 space-y-6">
            <div className="max-w-lg space-y-4">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                Advertise with Passport Alerts
              </span>
              <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                Advertisement Request
              </h1>
              <p className="text-muted-foreground text-lg">
                Submit your advertisement inquiry and we&apos;ll contact you within 1-2 business days to
                discuss the next steps.
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <p>Fast response · Tailored packages · Dedicated support</p>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="rounded-2xl border border-border/60 bg-card/90 p-6 shadow-lg backdrop-blur lg:p-8">
              {!submitted ? (
                <AdvertisementRequestForm
                  onSubmit={handleSubmit}
                  isSubmitting={mutation.isPending}
                  errorMessage={
                    mutation.error instanceof Error ? mutation.error.message : null
                  }
                />
              ) : (
                <AdvertisementRequestSuccess onSubmitAnother={handleSubmitAnother} />
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
