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
          <div className="bg-card text-card-foreground relative overflow-hidden rounded-lg p-8 shadow-2xl md:p-12">
            {/* Ethiopian Seal Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <div className="h-96 w-96 rounded-full border-8 border-current">
                {/* Ethiopian Star */}
                <div className="flex h-full w-full items-center justify-center">
                  <div className="relative h-32 w-32">
                    <div className="absolute inset-0 rotate-0">
                      <div
                        className="h-full w-full bg-current"
                        style={{
                          clipPath:
                            'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="relative z-10 mb-8 text-center">
              <h1 className="text-foreground mb-2 text-xl font-bold md:text-2xl">
                የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ
              </h1>
              <h2 className="text-primary text-lg font-semibold md:text-xl">
                FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA
              </h2>
            </div>

            {/* Passport Content */}
            <div className="relative z-10 grid gap-8 md:grid-cols-2">
              {/* Left Side - Personal Info */}
              <div className="space-y-6">
                <div>
                  <div className="text-muted-foreground block text-sm font-medium">Surname</div>
                  <div className="text-foreground mt-1 text-lg font-semibold">{surname}</div>
                </div>

                <div>
                  <div className="text-muted-foreground block text-sm font-medium">Given Name</div>
                  <div className="text-foreground mt-1 text-lg font-semibold">{givenName}</div>
                </div>

                <div>
                  <div className="text-muted-foreground block text-sm font-medium">
                    You Can Receive After
                  </div>
                  <div className="text-primary mt-1 text-lg font-semibold">{passport.date} G.C</div>
                </div>

                <div>
                  <div className="text-muted-foreground block text-sm font-medium">
                    Day of The Week
                  </div>
                  <div className="text-foreground mt-1 text-lg font-semibold">
                    Thursday, Saturday
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground block text-sm font-medium">Exact Time</div>
                  <div className="text-foreground mt-1 text-lg font-semibold">3:00 - 9:00 LT</div>
                </div>
              </div>

              {/* Right Side - Barcode and Actions */}
              <div className="flex flex-col items-center justify-center space-y-6">
                {/* Barcode */}
                <div className="border-border bg-card rounded border-2 p-4 text-foreground">
                  <Barcode
                    value={passport.requestNumber}
                    width={2}
                    height={80}
                    fontSize={14}
                    background="transparent"
                    lineColor={`hsl(var(--foreground))`}
                  />
                </div>

                {/* Request Number */}
                <div className="text-center">
                  <div className="text-muted-foreground text-sm font-medium">Request Number</div>
                  <div className="text-foreground mt-1 font-mono text-lg font-bold">
                    {passport.requestNumber}
                  </div>
                </div>

                {/* Check Another Passport Button */}
                <Button onClick={onCheckAnother} className="">
                  Check Another Passport
                </Button>
              </div>
            </div>

            {/* Bottom decorative border */}
            <div className="mt-8 border-t-2 border-destructive/20"></div>
          </div>
        </div>
      </Container>
    </section>
  )
}
