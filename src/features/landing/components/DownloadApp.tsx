import { Link } from "@tanstack/react-router"
import playStore from '@/assets/landingImages/play_store.svg'
import appStore from '@/assets/landingImages/app_store.svg'

export function DownloadAppSection() {
  return (
    <section id="download" className="py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight">Download the Passport.ET App</h2>
        <p className="text-sm text-neutral-600">
          Check your passport status anytime, anywhere—right from your phone.
        </p>
        <div className="sm:w-full md:w-auto flex items-center gap-6 my-4">
          <Link
            to="/"
            aria-label="Get it on Google Play"
          >
            <img
              src={playStore}
              alt="Get it on Google Play"
              className="h-[35px]"
            />
          </Link>
          <Link
            to="/"
            aria-label="Download on the App Store"
             
          >
            <img
              src={appStore}
              alt="Download on the App Store"
              className="h-[35px]"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}


