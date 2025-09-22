import { Container } from '@/shared/ui/container'
import { Button } from '@/shared/ui/button'

export function AdBanner() {
  return (
    <section className="py-10 sm:py-12" aria-label="Sponsored advertisement">
      <Container>
        <div className="relative overflow-hidden bg-muted shadow-sm">
          <div className="flex flex-col items-center justify-between gap-6 px-6 py-10 text-center sm:px-10 sm:py-12 lg:flex-row lg:text-left">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Sponsored</p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Advertise with Passport Alerts</h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                Reach thousands of travelers looking for passport updates and related services. Reserve this premium banner for your brand.
              </p>
            </div>
            <Button size="sm" variant="secondary">
              Promote Your Business
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default AdBanner
