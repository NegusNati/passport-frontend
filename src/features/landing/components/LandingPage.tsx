


import HeroWaveShader from '@/shared/components/common/HeroWaveShader'

import { AdBanner } from './AdBanner'
import { AdvertiseSection } from './Advertise'
import { BlogSection } from './Blogs'
import { DownloadAppSection } from './DownloadApp'
import { FAQsSection } from './FAQs'
import { Hero } from './Hero'
import Testimonials from './Testimonials'
import { VideoTabs } from './VideoTabs'

export function LandingPage() {
  return (
  
    <div className="mx-auto max-w-7xl overflow-x-hidden space-y-4">
            <HeroWaveShader
        className="absolute inset-0 -z-10"
        height={640}
        color="#009966"      // your accent
        strokeWidth={230}    // adjust thickness
        />
      {/* Hero band with gradient surface */}
      <div className="teal-hero pb-8 md:pb-[620px] lg:pb-[680px]">
          <Hero />
      </div>


      <div className="relative z-[1]">
        <Testimonials />
      </div>

      <AdBanner />

      <VideoTabs />
      <AdvertiseSection />
      <BlogSection />
      <FAQsSection />
      <DownloadAppSection />
      {/* <Footer /> */}
    </div>

  )
}
