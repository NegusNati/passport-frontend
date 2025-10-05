import { Link } from '@tanstack/react-router'

import appStore from '@/assets/landingImages/app_store.svg'
import playStore from '@/assets/landingImages/play_store.svg'
import {Container} from '@/shared/ui/container'

export function DownloadAppSection() {
  return (<section id="download" className="py-10 sm:py-12" aria-label="Sponsored advertisement">
    <Container>
      <div className="bg-muted relative overflow-hidden shadow-sm flex flex-row items-center  gap-6 px-6 py-10 text-center sm:px-10 sm:py-12 lg:flex-col lg:text-left">
        <div className="max-w-2xl space-y-3 items-center">
          <h2 className="text-2xl font-semibold tracking-tight">Download the Passport.ET App</h2>
          <p className="text-sm text-muted-foreground">
            Check your passport status anytime, anywhere—right from your phone.
          </p>
          <div className="my-4 flex items-center gap-6 sm:w-full md:w-auto">
            <Link to="/" aria-label="Get it on Google Play">
              <img src={playStore} alt="Get it on Google Play" className="h-[45px]" />
            </Link>
            <Link to="/" aria-label="Download on the App Store">
              <img src={appStore} alt="Download on the App Store" className="h-[45px]" />
            </Link>
          </div>
        </div>
      </div>
    </Container>
  </section>
  )
}
