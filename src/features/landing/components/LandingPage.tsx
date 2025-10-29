import { Seo } from '@/shared/ui/Seo'

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
    <>
      <Seo
        title="Ethiopian Passport Status - Track Urgent & Regular"
        description="Track your Ethiopian passport application status instantly. Check urgent and regular passport releases from all ICS branch offices across Ethiopia. ፓስፖርት ሁኔታ ያረጋግጡ።"
        path="/"
      />

      {/* Hero section - kept outside layout wrapper for earlier paint */}
      <Hero />

      {/* Supporting sections */}
      <div className="mx-auto  max-w-7xl space-y-4 overflow-x-hidden px-4 md:px-6">
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
    </>
  )
}
