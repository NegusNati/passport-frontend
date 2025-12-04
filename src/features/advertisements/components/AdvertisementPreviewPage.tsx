import { Calendar, LayoutGrid, Smartphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import ad1 from '@/assets/advert/ad_1.png'
import ad2 from '@/assets/advert/ad_2.png'
import ad3 from '@/assets/advert/ad_3.png'
import { AdSlot } from '@/shared/ui/ad-slot'
import { Card } from '@/shared/ui/card'
import { Seo } from '@/shared/ui/Seo'

export function AdvertisementPreviewPage() {
  const { t } = useTranslation('advertisements')

  return (
    <div className="from-primary/5 via-background to-background relative min-h-screen overflow-hidden bg-gradient-to-b">
      <Seo
        title={t('preview.seo.title')}
        description={t('preview.seo.description')}
        path="/advertisment"
      />
      <h1 className="sr-only">{t('preview.seo.title')}</h1>

      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="border-primary/10 bg-primary/5 pointer-events-none absolute top-24 -right-40 hidden h-[600px] w-[600px] rounded-[200px] border blur-3xl lg:block"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-12 text-center sm:py-16 lg:py-24">
          <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
            <div className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium">
              <LayoutGrid className="h-4 w-4" />
              <span>{t('preview.header.badge')}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t('preview.header.title')}
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl">
              {t('preview.header.description')}
            </p>
          </div>
        </section>

        {/* Placement Previews */}
        <section className="space-y-8 pb-16 md:space-y-16">
          {/* Calendar Page - Desktop View */}
          <div className="space-y-4 sm:space-y-8">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <Calendar className="text-primary h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {t('preview.placements.desktopCalendar.title')}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {t('preview.placements.desktopCalendar.description')}
                </p>
              </div>
            </div>
            <Card className="relative overflow-hidden">
              <div
                className="from-background pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent"
                aria-hidden
              />
              <img
                src={ad1}
                alt={t('preview.placements.desktopCalendar.imageAlt')}
                className="h-auto w-full"
              />
              <div
                className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent"
                aria-hidden
              />
            </Card>
          </div>

          {/* Existing Below Pocket Card */}
          <div className="space-y-4 sm:space-y-8">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <LayoutGrid className="text-primary h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {t('preview.placements.belowPocket.title')}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {t('preview.placements.belowPocket.description')}
                </p>
              </div>
            </div>
            <Card className="relative overflow-hidden">
              <div
                className="from-background pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent"
                aria-hidden
              />
              <img
                src={ad2}
                alt={t('preview.placements.belowPocket.imageAlt')}
                className="h-auto w-full border-0 bg-transparent"
              />
              <div
                className="from-background pointer-events-none absolute inset-x-1 bottom-0 h-24 bg-gradient-to-t to-transparent"
                aria-hidden
              />
            </Card>
          </div>

          {/* Mobile Banner */}
          <div className="space-y-4 sm:space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <Smartphone className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {t('preview.placements.mobileBanner.title')}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {t('preview.placements.mobileBanner.description')}
                  </p>
                </div>
              </div>
              <Card className="relative overflow-hidden">
                <div
                  className="from-background pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent"
                  aria-hidden
                />
                <img
                  src={ad3}
                  alt={t('preview.placements.mobileBanner.imageAlt')}
                  className="h-auto w-full border-0 bg-transparent"
                />
                <div
                  className="from-background pointer-events-none absolute inset-x-1 bottom-0 h-24 bg-gradient-to-t to-transparent"
                  aria-hidden
                />
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="focus:outline-none">
          <AdSlot preset="sponsored" />
        </section>

        {/* Bottom spacing */}
        <div className="py-8 sm:py-12" />
      </div>
    </div>
  )
}
