import { AdBanner } from './AdBanner'
import { AdvertiseSection } from './Advertise'
import { ArticleSection } from './Articles'
import { DownloadAppSection } from './DownloadApp'
import { FAQsSection } from './FAQs'
import { Hero } from './Hero'
import { Testimonials } from './Testimonials'
import { VideoTabs } from './VideoTabs'

export function LandingPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 overflow-x-hidden">
      {/* Hero band with gradient surface */}
      <div className="relative h-[100svh] overflow-hidden overscroll-none pb-8 md:pb-[220px] lg:pb-[480px]">
        <Hero />
      </div>

      <div className="relative z-[1]">
        <Testimonials />
      </div>

      <AdBanner />

      <VideoTabs />
      <AdvertiseSection />
      <ArticleSection />
      <FAQsSection />
      <DownloadAppSection />

      {/* <Footer /> */}
    </div>
  )
}
