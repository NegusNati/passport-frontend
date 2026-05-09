import { Link } from '@tanstack/react-router'
import { useTheme } from 'next-themes'
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
    'relative flex bg-muted text-sm font-medium text-muted-foreground',
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
  const { theme, resolvedTheme } = useTheme()
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
          'bg-muted relative flex animate-pulse items-center justify-center',
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

  const isDarkTheme = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')
  const desktopAsset =
    isDarkTheme && ad.desktop_dark_asset.url ? ad.desktop_dark_asset : ad.desktop_asset
  const mobileAsset =
    isDarkTheme && ad.mobile_dark_asset.url
      ? ad.mobile_dark_asset
      : isDarkTheme && ad.desktop_dark_asset.url
        ? ad.desktop_dark_asset
        : ad.mobile_asset

  const desktopAssetUrl = desktopAsset.url ?? ad.desktop_asset_url
  const mobileAssetUrl = mobileAsset.url ?? desktopAssetUrl
  const hasMobileCreative = Boolean(
    mobileAssetUrl && desktopAssetUrl && mobileAssetUrl !== desktopAssetUrl,
  )
  const defaultAsset = hasMobileCreative ? mobileAsset : desktopAsset
  const desktopRatio = `${desktopAsset.width} / ${desktopAsset.height}`
  const mobileRatio = `${defaultAsset.width} / ${defaultAsset.height}`
  const adStyle = {
    '--ad-desktop-ratio': desktopRatio,
    '--ad-mobile-ratio': mobileRatio,
    ...style,
  } as CSSProperties

  return (
    <a
      ref={impressionRef}
      href={ad.target_url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={[
        'bg-background relative flex [aspect-ratio:var(--ad-mobile-ratio)] items-center justify-center overflow-hidden rounded-lg shadow-sm transition-shadow hover:shadow-md md:[aspect-ratio:var(--ad-desktop-ratio)]',
        orientationClasses[orientation],
        className,
      ].join(' ')}
      onClick={handleAdClick}
      style={adStyle}
      aria-label={tAds('shared.ariaLabel')}
      {...props}
    >
      <picture className="block h-full w-full">
        {desktopAssetUrl !== mobileAssetUrl ? (
          <source
            media="(min-width: 768px)"
            srcSet={desktopAssetUrl}
            width={desktopAsset.width}
            height={desktopAsset.height}
          />
        ) : null}
        <img
          src={mobileAssetUrl}
          alt={ad.alt_text || tAds('shared.imageAlt')}
          className="h-full w-full object-cover"
          width={defaultAsset.width}
          height={defaultAsset.height}
          sizes="100vw"
          loading="lazy"
          fetchPriority="low"
          decoding="async"
        />
      </picture>
    </a>
  )
}

export default AdSlot
