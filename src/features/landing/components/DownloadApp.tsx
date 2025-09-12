export function DownloadAppSection() {
  return (
    <section id="download" className="py-14 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold tracking-tight">Download the Passport.ET App</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Check your passport status anytime, anywhere—right from your phone.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="#play"
            className="inline-flex items-center gap-3 rounded-md bg-black px-4 py-2 text-white shadow transition hover:bg-black/90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M3 4.27v15.46c0 .8.86 1.3 1.53.89l12.1-7.73c.67-.43.67-1.36 0-1.79L4.53 3.38C3.86 2.97 3 3.47 3 4.27zM20.5 3.5l-4.29 4.29M19 12l-2 0M20.5 20.5l-4.29-4.29"/>
            </svg>
            <span className="text-left">
              <span className="block text-[10px] leading-tight text-white/80">GET IT ON</span>
              <span className="-mt-0.5 block text-sm font-semibold leading-tight">Google Play</span>
            </span>
          </a>
          <a
            href="#appstore"
            className="inline-flex items-center gap-3 rounded-md bg-black px-4 py-2 text-white shadow transition hover:bg-black/90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M16 13c0 3.87-3.13 7-7 7-1.53 0-2.94-.5-4.09-1.34C3.79 17.19 3 15.69 3 14c0-3.87 3.13-7 7-7 1.53 0 2.94.5 4.09 1.34C16.21 8.81 17 10.31 17 12z"/>
              <path d="M19 7l2-3"/>
            </svg>
            <span className="text-left">
              <span className="block text-[10px] leading-tight text-white/80">Download on the</span>
              <span className="-mt-0.5 block text-sm font-semibold leading-tight">App Store</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default DownloadAppSection

