import { AdBanner } from './AdBanner'
import { AdvertiseSection } from './Advertise'
import { ArticleSection } from './Articles'
import { DownloadAppSection } from './DownloadApp'
import { FAQsSection } from './FAQs'
import { Hero } from './Hero'
import { HeroCardsMobile } from './HeroCardsMobile'
import { Testimonials } from './Testimonials'
import { VideoTabs } from './VideoTabs'

export function LandingPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 overflow-x-hidden">
      {/* Hero band with gradient surface */}
      <div className="relative h-[80svh] overflow-hidden overscroll-none pb-0 md:pb-[120px] lg:pb-[80px]">
        <Hero />
      </div>

      {/* Mobile-only CardSwap section */}
      <HeroCardsMobile />

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
