import appStore from '@/assets/landingImages/app_store.svg'
import playStore from '@/assets/landingImages/play_store.svg'
import { Container } from '@/shared/ui/container'
import { toast } from '@/shared/ui/sonner'

export function DownloadAppSection() {
  const notifyComingSoon = () =>
    toast('Under construction 🚧', {
      description: 'Passport.ET mobile apps are brewing. Join our community for launch updates!',
    })

  return (
    <section id="download" className="py-10 sm:py-12" aria-label="Sponsored advertisement">
      <Container>
        <div className="bg-muted relative flex flex-row items-center gap-6 overflow-hidden px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12 lg:flex-col lg:text-left">
          <div className="max-w-2xl items-center space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">Download the Passport.ET App</h2>
            <p className="text-muted-foreground text-sm">
              Check your passport status anytime, anywhere—right from your phone.
            </p>
            <div className="my-4 flex items-center gap-6 sm:w-full md:w-auto">
              <button
                type="button"
                onClick={notifyComingSoon}
                aria-label="Get it on Google Play"
                className="focus-visible:outline-primary rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <img src={playStore} alt="Get it on Google Play" className="h-[45px]" />
              </button>
              <button
                type="button"
                onClick={notifyComingSoon}
                aria-label="Download on the App Store"
                className="focus-visible:outline-primary rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <img src={appStore} alt="Download on the App Store" className="h-[45px]" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
