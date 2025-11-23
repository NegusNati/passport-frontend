import { lazy, Suspense } from 'react'

import { Seo } from '@/shared/ui/Seo'

import { AdvertiseSection } from './Advertise'
import { ArticleSection } from './Articles'
import { DownloadAppSection } from './DownloadApp'
import { FAQsSection } from './FAQs'
import { Hero } from './Hero'
import { HeroCardsMobile } from './HeroCardsMobile'

const AdBanner = lazy(() => import('./AdBanner').then((m) => ({ default: m.AdBanner })))
const Testimonials = lazy(() => import('./Testimonials').then((m) => ({ default: m.Testimonials })))
const VideoTabs = lazy(() => import('./VideoTabs'))

const SectionSkeleton = () => (
  <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
    <div className="bg-muted/50 h-96 w-full animate-pulse rounded-3xl" />
  </div>
)

export function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <Seo
        title="Ethiopian Passport Status - Track Urgent & Regular"
        description="Track your Ethiopian passport application status instantly. Check urgent and regular passport releases from all ICS branch offices across Ethiopia. ፓስፖርት ሁኔታ ያረጋግጡ።"
        path="/"
      />

      <Hero />

      <div className="mx-auto mt-6 flex w-full max-w-7xl flex-col gap-4 px-4 md:px-6">
        <HeroCardsMobile />

        <div className="relative z-[1]">
          <Suspense fallback={<SectionSkeleton />}>
            <Testimonials />
          </Suspense>
        </div>

        <Suspense fallback={<div className="h-32 w-full" />}>
          <AdBanner />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <VideoTabs />
        </Suspense>

        <AdvertiseSection />
        <ArticleSection />
        <FAQsSection />
        <DownloadAppSection />

        {/* <Footer /> */}
      </div>
    </div>
  )
}
