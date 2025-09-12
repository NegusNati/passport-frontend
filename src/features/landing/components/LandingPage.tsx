import { Hero } from './Hero'
import { Testimonials } from './Testimonials'
import { VideoTabs } from './VideoTabs'
import { AdvertiseSection } from './Advertise'
import { BlogSection } from './Blogs'
import { Container } from '@/shared/ui/container'
import { FAQsSection } from './FAQs'
import { DownloadAppSection } from './DownloadApp'
import Footer from '@/app/layout/Footer'

export function LandingPage() {
  return (
    <div>
      <div className="pb-8">
        <div className="grid items-start gap-10 md:grid-cols-[1.5fr_1fr]">
          <Hero />
          <Container className="hidden md:block pt-10">
            <Testimonials />
          </Container>
        </div>
      </div>

      <VideoTabs />
      <AdvertiseSection />
      <BlogSection />
      <FAQsSection />
      <DownloadAppSection />
      {/* <Footer /> */}
    </div>
  )
}

export default LandingPage
