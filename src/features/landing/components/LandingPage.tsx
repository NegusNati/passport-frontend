import { AdBanner } from './AdBanner'
import { AdvertiseSection } from './Advertise'
import { BlogSection } from './Blogs'
import { DownloadAppSection } from './DownloadApp'
import { FAQsSection } from './FAQs'
import { Hero } from './Hero'
import { Testimonials } from './Testimonials'
import { VideoTabs } from './VideoTabs'

export function LandingPage() {
  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden">
      <div className="pb-8">
        <div className="mx-4 grid grid-cols-1 items-start gap-10 md:my-10 md:grid-cols-[1fr_1fr]">
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
