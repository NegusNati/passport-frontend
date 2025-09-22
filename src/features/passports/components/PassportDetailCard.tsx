import Barcode from 'react-barcode'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { type Passport } from '../schemas/passport'

interface PassportDetailCardProps {
  passport: Passport
  onCheckAnother?: () => void
}

export function PassportDetailCard({ passport, onCheckAnother }: PassportDetailCardProps) {
  // Extract names from the full name (assuming "FirstName LastName" format)
  const nameParts = passport.name.split(' ')
  const givenName = nameParts.slice(0, -1).join(' ')
  const surname = nameParts[nameParts.length - 1]

  return (
    <section className="bg-muted/30 py-12 md:py-16">
      <Container>
        <div className="mx-auto max-w-4xl">
          {/* Passport Document */}
          <div className="relative overflow-hidden rounded-lg bg-card text-card-foreground p-8 shadow-2xl md:p-12">
            {/* Ethiopian Seal Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <div className="h-96 w-96 rounded-full border-8 border-current">
                {/* Ethiopian Star */}
                <div className="flex h-full w-full items-center justify-center">
                  <div className="relative h-32 w-32">
                    <div className="absolute inset-0 rotate-0">
                      <div className="h-full w-full bg-current" style={{
                        clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="relative z-10 mb-8 text-center">
              <h1 className="mb-2 text-xl font-bold text-foreground md:text-2xl">
                የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ
              </h1>
              <h2 className="text-lg font-semibold text-primary md:text-xl">
                FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA
              </h2>
            </div>

            {/* Passport Content */}
            <div className="relative z-10 grid gap-8 md:grid-cols-2">
              {/* Left Side - Personal Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Surname
                  </label>
                  <div className="mt-1 text-lg font-semibold text-foreground">
                    {surname}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Given Name
                  </label>
                  <div className="mt-1 text-lg font-semibold text-foreground">
                    {givenName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    You Can Receive After
                  </label>
                  <div className="mt-1 text-lg font-semibold text-primary">
                    {passport.date} G.C
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Day of The Week
                  </label>
                  <div className="mt-1 text-lg font-semibold text-foreground">
                    Thursday, Saturday
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground">
                    Exact Time
                  </label>
                  <div className="mt-1 text-lg font-semibold text-foreground">
                    3:00 - 9:00 LT
                  </div>
                </div>
              </div>

              {/* Right Side - Barcode and Actions */}
              <div className="flex flex-col items-center justify-center space-y-6">
                {/* Barcode */}
                <div className="rounded border-2 border-border bg-card p-4">
                  <Barcode
                    value={passport.requestNumber}
                    width={2}
                    height={80}
                    fontSize={14}
                    background="transparent"
                    lineColor="#000"
                  />
                </div>

                {/* Request Number */}
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    Request Number
                  </div>
                  <div className="mt-1 font-mono text-lg font-bold text-foreground">
                    {passport.requestNumber}
                  </div>
                </div>

                {/* Check Another Passport Button */}
                <Button
                  onClick={onCheckAnother}
                  className=""
                >
                  Check Another Passport
                </Button>
              </div>
            </div>

            {/* Bottom decorative border */}
            <div className="mt-8 border-t-2 border-red-200"></div>
          </div>
        </div>
      </Container>
    </section>
  )
}
