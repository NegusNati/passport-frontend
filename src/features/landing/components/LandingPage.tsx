import { Hero } from './Hero'
import { Testimonials } from './Testimonials'
import { AdBanner } from './AdBanner'
import { VideoTabs } from './VideoTabs'
import { AdvertiseSection } from './Advertise'
import { BlogSection } from './Blogs'
import { FAQsSection } from './FAQs'
import { DownloadAppSection } from './DownloadApp'

export function LandingPage() {
  return (
    <div className="max-w-7xl mx-auto overflow-x-hidden">
      <div className="pb-8">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_1fr] mx-4 md:my-10">
          <Hero />
          <Testimonials />
        </div>
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
