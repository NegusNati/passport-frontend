import shaderUrl from '@/assets/landingImages/shader_bg.svg?url'

import { AdBanner } from './AdBanner'
import { AdvertiseSection } from './Advertise'
import {ArticleSection} from './Articles'
import { DownloadAppSection } from './DownloadApp'
import { FAQsSection } from './FAQs'
import { Hero } from './Hero'
import {Testimonials} from './Testimonials'
import { VideoTabs } from './VideoTabs'


export function LandingPage() {
  return (
  
    <div className="mx-auto max-w-7xl overflow-x-hidden space-y-4">
           
      {/* Hero band with gradient surface */}
      <div className="teal-hero pb-8 md:pb-[220px] lg:pb-[480px] relative overflow-x-hidden scrollable-none"
            style={{
        backgroundImage: `url("${shaderUrl}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%'

      }}>
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
