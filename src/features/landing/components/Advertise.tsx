import { Container } from '@/shared/ui/container'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'

export function AdvertiseSection() {
  return (
    <section id="advertise" className="py-14 sm:py-16">
      <Container>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div className="space-y-3">
                <div className="h-40 w-full rounded-lg bg-neutral-100" />
                <h3 className="text-lg font-semibold tracking-tight">Advertise with Passport.ET</h3>
                <p className="text-sm text-neutral-600">
                  Reach millions of Ethiopian citizens and travelers through our highly visited platform—clean placement and premium design tailored to your brand.
                </p>
              </div>
              <div className="pt-4">
                <Button rightIcon={<ArrowRightIcon />}>Contact Us Now</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div className="space-y-3">
                <div className="h-40 w-full rounded-lg bg-neutral-100" />
                <h3 className="text-lg font-semibold tracking-tight">Ad Graphics Design Included</h3>
                <p className="text-sm text-neutral-600">
                  Every plan includes professionally designed ad graphics—static or animated—along with clear CTAs.
                </p>
              </div>
              <div className="pt-4">
                <Button variant="outline">Get a Quote</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div className="space-y-3">
                <div className="h-40 w-full rounded-lg bg-neutral-100" />
                <h3 className="text-lg font-semibold tracking-tight">Premium Placements</h3>
                <p className="text-sm text-neutral-600">
                  Get brand visibility on the homepage, insights, and results pages with flexible packages.
                </p>
              </div>
              <div className="pt-4">
                <Button variant="ghost">View Media Kit</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  )
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  )
}

export default AdvertiseSection
