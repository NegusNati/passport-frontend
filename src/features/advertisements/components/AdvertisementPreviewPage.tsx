import { Link } from '@tanstack/react-router'
import { Calendar, LayoutGrid, Smartphone } from 'lucide-react'

import ad1 from '@/assets/advert/ad_1.png'
import ad2 from '@/assets/advert/ad_2.png'
import ad3 from '@/assets/advert/ad_3.png'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Seo } from '@/shared/ui/Seo'


export function AdvertisementPreviewPage() {
  return (
    <div className="from-primary/5 via-background to-background relative min-h-screen overflow-hidden bg-gradient-to-b ">
      <Seo
        title="Advertisement Preview"
        description="See where your advertisements will appear across Passport.ET"
        path="/advertisment"
      />

      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="border-primary/10 bg-primary/5 pointer-events-none absolute top-24 -right-40 hidden h-[600px] w-[600px] rounded-[200px] border blur-3xl lg:block"
      />

      <div className=" max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="py-16 text-center lg:py-24">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <LayoutGrid className="h-4 w-4" />
              <span>Advertisement Showcase</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-4xl">Advert Preview</h1>
            <p className="text-muted-foreground text-lg sm:text-xl">
              This is where your advertisement will look in Desktop and Mobile devices
            </p>
          </div>
        </section>

        {/* Placement Previews */}
        <section className="space-y-16 pb-16">
          {/* Calendar Page - Desktop View */}
          <div className="space-y-8">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <Calendar className="text-primary h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Desktop Check Landscape View
                </h2>
                <p className="text-muted-foreground mt-1">
                  Calendar page showing horizontal banner placement below the calendar grid
                </p>
              </div>
            </div>
            <Card className="overflow-hidden">
              <img
                src={ad1}
                alt="Calendar page with advertisement placement"
                className="h-auto w-full"
              />
            </Card>
          </div>

          {/* Existing Below Pocket Card */}
          <div className="space-y-8">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <LayoutGrid className="text-primary h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Existing Below Pocket Book
                </h2>
                <p className="text-muted-foreground mt-1">
                  Multiple ad placements on content pages with both horizontal and vertical formats
                </p>
              </div>
            </div>
            <Card className="overflow-hidden">
              <img
                src={ad2}
                alt="Content page with multiple advertisement placements"
                className="h-auto w-full"
              />
            </Card>
          </div>



          {/* Mobile Banner */}
          <div className="space-y-8">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <Smartphone className="text-primary h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Mobile Banner View</h2>
                <p className="text-muted-foreground mt-1">
                  Vertical ad placement optimized for mobile users browsing content
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-sm">
              <Card className="overflow-hidden">
                <img
                  src={ad3}
                  alt="Mobile view with advertisement placement"
                  className="h-auto w-full"
                />
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-border/60 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden rounded-3xl border px-8 py-16 text-center shadow-lg backdrop-blur-sm">
          <div
            aria-hidden="true"
            className="bg-primary/20 absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl"
          />
          <div
            aria-hidden="true"
            className="bg-primary/20 absolute -bottom-20 -left-20 h-40 w-40 rounded-full blur-3xl"
          />

          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Advertise?
            </h2>
            <p className="text-muted-foreground text-lg">
              We designed a service just for you to get started. Reach thousands of users searching
              for passport information daily.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/advertisement-requests">Request a Quote</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Bottom spacing */}
        <div className="py-12" />
      </div>
    </div>
  )
}
