import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import type { PublicAdvertisement } from '@/features/advertisements/schemas/public-advertisement'
import { DynamicAdSlot } from '@/shared/ui/ad-slot'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'

type AdBannerProps = {
  ad?: PublicAdvertisement | null
  isLoading?: boolean
}

export function AdBanner({ ad, isLoading }: AdBannerProps) {
  return (
    <section className="py-10 sm:py-12" aria-label="Sponsored advertisement">
      <Container>
        <DynamicAdSlot
          code="home-alerts-banner"
          orientation="horizontal"
          className="rounded-lg"
          ad={ad}
          isLoading={isLoading}
          fallback={<StaticAdBanner />}
        />
      </Container>
    </section>
  )
}

function StaticAdBanner() {
  const { t } = useTranslation('landing')

  return (
    <div className="bg-muted relative overflow-hidden shadow-sm">
      <div className="flex flex-col items-center justify-between gap-6 px-6 py-10 text-center sm:px-10 sm:py-12 lg:flex-row lg:text-left">
        <div className="max-w-2xl space-y-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.4em] uppercase">
            {t('adBanner.sponsored')}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t('adBanner.title')}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">{t('adBanner.description')}</p>
        </div>
        <Button size="sm" className="" asChild>
          <Link to="/advertisement-requests">{t('adBanner.cta')}</Link>
        </Button>
      </div>
    </div>
  )
}

export default AdBanner
