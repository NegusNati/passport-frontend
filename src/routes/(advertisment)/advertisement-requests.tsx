import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { AdvertisementRequestForm } from '@/features/advertisement-requests/components/AdvertisementRequestForm'
import { AdvertisementRequestSuccess } from '@/features/advertisement-requests/components/AdvertisementRequestSuccess'
import { useSubmitAdvertisementRequestMutation } from '@/features/advertisement-requests/lib/queries'
import type { AdvertisementRequestCreatePayload } from '@/features/advertisement-requests/schemas/create'
import { Container } from '@/shared/ui/container'
import { Seo } from '@/shared/ui/Seo'

export const Route = createFileRoute('/(advertisment)/advertisement-requests')({
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
    <div className="from-primary/10 via-background to-background relative min-h-screen overflow-hidden bg-gradient-to-b">
      <Seo
        title="Advertisement Request"
        description="Submit your advertisement request and our team will get back to you shortly."
        path="/advertisement-requests"
      />
      <h1 className="sr-only">Submit Advertisement Request</h1>

      <div
        aria-hidden="true"
        className="border-primary/20 bg-primary/20 pointer-events-none absolute top-24 -left-40 hidden h-[480px] w-[480px] rounded-[120px] border blur-3xl lg:block"
      />

      <Container>
        <div className="grid items-center gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:py-24">
          <div className="relative z-10 space-y-6">
            <div className="max-w-lg space-y-4">
              <span className="text-primary text-sm font-semibold tracking-wide uppercase">
                Advertise with Passport Alerts
              </span>
              <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                Advertisement Request
              </h1>
              <p className="text-muted-foreground text-lg">
                Submit your advertisement inquiry and we&apos;ll contact you within 1-2 business
                days to discuss the next steps.
              </p>
            </div>

            <div className="text-muted-foreground flex items-center gap-6 text-sm">
              <div className="bg-border h-px flex-1" />
              <p>Fast response · Tailored packages · Dedicated support</p>
              <div className="bg-border h-px flex-1" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="border-border/60 bg-card/90 rounded-2xl border p-6 shadow-lg backdrop-blur lg:p-8">
              {!submitted ? (
                <AdvertisementRequestForm
                  onSubmit={handleSubmit}
                  isSubmitting={mutation.isPending}
                  errorMessage={mutation.error instanceof Error ? mutation.error.message : null}
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
