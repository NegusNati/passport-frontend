import { Hero } from './Hero'
import { Testimonials } from './Testimonials'
import { VideoTabs } from './VideoTabs'
import { AdvertiseSection } from './Advertise'
import { BlogSection } from './Blogs'
import { Container } from '@/shared/ui/container'

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
    </div>
  )
}

export default LandingPage
