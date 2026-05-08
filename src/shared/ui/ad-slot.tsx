import { Link } from '@tanstack/react-router'
import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useAdQuery } from '@/features/advertisements/api/get-ad'
import { useAdTracking } from '@/features/advertisements/hooks/useAdTracking'
import type { PublicAdvertisement } from '@/features/advertisements/schemas/public-advertisement'
import { Button } from '@/shared/ui/button'

interface AdSlotProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  orientation?: 'horizontal' | 'vertical'
  preset?: 'sponsored'
}

interface DynamicAdSlotProps extends HTMLAttributes<HTMLAnchorElement> {
  code?: string
  placement?: string
  orientation?: 'horizontal' | 'vertical'
  fallback?: ReactNode
  ad?: PublicAdvertisement | null
  isLoading?: boolean
}

const orientationClasses = {
  horizontal: 'min-h-[12rem] w-full',
  vertical: 'min-h-[16rem] w-full h-full',
} as const

function SponsoredContent({ orientation }: { orientation: 'horizontal' | 'vertical' }) {
  const { t } = useTranslation('advertisements')
  const alignClasses =
    orientation === 'vertical' ? 'items-start text-left' : 'items-center text-center'
  const textWidth = orientation === 'vertical' ? 'max-w-xs sm:max-w-sm' : 'max-w-sm sm:max-w-md'

  return (
    <div
      className={['text-muted-foreground flex w-full flex-col gap-2 text-sm', alignClasses].join(
        ' ',
      )}
    >
      <span className="text-muted-foreground text-xs font-semibold tracking-[0.35em] uppercase">
        {t('shared.sponsoredTag')}
      </span>
      <h3 className="text-foreground text-lg font-semibold tracking-tight">
        {t('shared.ctaTitle')}
      </h3>
      <p className={[textWidth, 'text-muted-foreground text-sm'].join(' ')}>
        {t('shared.ctaDescription')}
      </p>
      <Button size="sm" className="mt-1 w-full sm:w-auto" asChild>
        <Link to="/advertisement-requests">{t('shared.ctaButton')}</Link>
      </Button>
    </div>
  )
}

export function AdSlot({
  label,
  orientation = 'horizontal',
  className = '',
  preset,
  children,
  ...props
}: AdSlotProps) {
  const { t } = useTranslation('advertisements')
  const isSponsored = preset === 'sponsored'

  const baseClasses = [
    'relative flex  border border-dashed border-border bg-muted text-sm font-medium text-muted-foreground shadow-inner',
    orientationClasses[orientation],
    isSponsored
      ? 'items-stretch justify-between px-6 py-6 sm:px-8 sm:py-8'
      : 'items-center justify-center',
    className,
  ]

  const content = isSponsored ? (
    <SponsoredContent orientation={orientation} />
  ) : (
    (children ?? <span>{label ?? t('shared.slotLabel')}</span>)
  )

  return (
    <div className={baseClasses.join(' ')} {...props}>
      {content}
    </div>
  )
}

// Dynamic ad slot that fetches and displays real ads
export function DynamicAdSlot({
  code,
  placement,
  orientation = 'horizontal',
  className = '',
  fallback,
  ad: providedAd,
  isLoading: providedIsLoading,
  style,
  ...props
}: DynamicAdSlotProps) {
  const { t: tCommon } = useTranslation()
  const { t: tAds } = useTranslation('advertisements')
  const slotCode = code ?? placement ?? ''
  const shouldFetch = providedAd === undefined
  const { data: fetchedAd, isLoading: isQueryLoading } = useAdQuery(slotCode, shouldFetch)
  const ad = shouldFetch ? fetchedAd : providedAd
  const isLoading = shouldFetch ? isQueryLoading : Boolean(providedIsLoading)
  const { handleClick, impressionRef } = useAdTracking(ad?.id, slotCode, {
    impressionUrl: ad?.impression_url,
    clickUrl: ad?.click_url,
  })

  // Show loading skeleton
  if (isLoading) {
    return (
      <div
        className={[
          'border-border bg-muted relative flex animate-pulse items-center justify-center border border-dashed',
          orientationClasses[orientation],
          className,
        ].join(' ')}
      >
        <span className="text-muted-foreground text-sm">{tCommon('status.loading')}</span>
      </div>
    )
  }

  // No ad available - show fallback or sponsored content
  if (!ad) {
    if (fallback) {
      return <>{fallback}</>
    }
    return <AdSlot preset="sponsored" orientation={orientation} className={className} />
  }

  if (!ad.desktop_asset_url || !ad.target_url) {
    return <AdSlot preset="sponsored" orientation={orientation} className={className} />
  }

  const handleAdClick = () => {
    handleClick()
  }

  const desktopRatio = `${ad.desktop_asset.width} / ${ad.desktop_asset.height}`
  const mobileRatio = `${ad.mobile_asset.width} / ${ad.mobile_asset.height}`
  const adStyle = {
    '--ad-desktop-ratio': desktopRatio,
    '--ad-mobile-ratio': mobileRatio,
    aspectRatio: mobileRatio,
    ...style,
  } as CSSProperties

  return (
    <a
      ref={impressionRef}
      href={ad.target_url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={[
        'border-border bg-background relative flex items-center justify-center overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md md:[aspect-ratio:var(--ad-desktop-ratio)]',
        orientationClasses[orientation],
        className,
      ].join(' ')}
      onClick={handleAdClick}
      style={adStyle}
      aria-label={tAds('shared.ariaLabel')}
      {...props}
    >
      <picture className="h-full w-full">
        {ad.mobile_asset_url ? (
          <source media="(max-width: 767px)" srcSet={ad.mobile_asset_url} />
        ) : null}
        <img
          src={ad.desktop_asset_url}
          alt={ad.alt_text || tAds('shared.imageAlt')}
          className="h-full w-full object-cover"
          width={ad.desktop_asset.width}
          height={ad.desktop_asset.height}
          loading="lazy"
          fetchPriority="low"
          decoding="async"
        />
      </picture>
      <span className="bg-muted/80 text-muted-foreground absolute top-2 right-2 rounded px-2 py-1 text-xs font-medium">
        {tAds('shared.badge')}
      </span>
    </a>
  )
}

export default AdSlot
