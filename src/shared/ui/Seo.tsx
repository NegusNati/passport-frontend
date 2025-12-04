import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import landingOgImage from '@/assets/landingImages/landing_og.webp'
import { SUPPORTED_LANGUAGES } from '@/i18n/config'

type Props = {
  title?: string
  description?: string
  path?: string // e.g., '/articles/how-to-apply'
  canonical?: string // absolute canonical URL overrides path+SITE
  noindex?: boolean
  ogImage?: string
  schemaJson?: Record<string, unknown>
  extraLinks?: Array<{ rel: string; href: string; type?: string }>
}

const SITE = import.meta.env.VITE_SITE_URL as string | undefined
const SITE_NAME = (import.meta.env.VITE_SITE_NAME as string | undefined) ?? ''

export function Seo({
  title,
  description,
  path = '',
  canonical,
  noindex,
  ogImage,
  schemaJson,
  extraLinks = [],
}: Props) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language || 'en'

  const base = SITE?.replace(/\/$/, '') || ''
  // Normalize path: root path '/' becomes empty to avoid trailing slash
  const normalizedPath = path === '/' ? '' : path
  const url = canonical || (base && normalizedPath ? `${base}${normalizedPath}` : base)
  const fullTitle = title ? (SITE_NAME ? `${title} · ${SITE_NAME}` : title) : SITE_NAME

  // Default OG image with absolute URL handling
  const ogImageUrl = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${base}${ogImage}`
    : `${base}${landingOgImage}`

  // Map language codes to og:locale format
  const localeMap: Record<string, string> = {
    en: 'en_US',
    am: 'am_ET',
    om: 'om_ET',
    ti: 'ti_ET',
  }
  const ogLocale = localeMap[currentLang] || 'en_US'

  return (
    <>
      <Helmet prioritizeSeoTags>
        {title && <title>{fullTitle}</title>}
        {description && <meta name="description" content={description} />}

        {/* Robots meta tags - explicitly allow all bots including AI crawlers */}
        {noindex ? (
          <>
            <meta name="robots" content="noindex, nofollow" />
            <meta name="googlebot" content="noindex, nofollow" />
            <meta name="bingbot" content="noindex, nofollow" />
          </>
        ) : (
          <>
            <meta
              name="robots"
              content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
            />
            <meta
              name="googlebot"
              content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
            />
            <meta
              name="bingbot"
              content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
            />
            {/* AI bot specific permissions */}
            <meta name="GPTBot" content="index, follow" />
            <meta name="Claude-Web" content="index, follow" />
            <meta name="Google-Extended" content="index, follow" />
            <meta name="CCBot" content="index, follow" />
            <meta name="PerplexityBot" content="index, follow" />
          </>
        )}

        {url && <link rel="canonical" href={url} />}

        {/* Open Graph / Facebook */}
        {title && <meta property="og:title" content={fullTitle} />}
        {description && <meta property="og:description" content={description} />}
        {url && <meta property="og:url" content={url} />}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:alt" content={fullTitle} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={ogLocale} />

        {/* hreflang alternate links for SEO - each language has its own URL with ?lang= param */}
        {base &&
          SUPPORTED_LANGUAGES.map((lang) => (
            <link
              key={lang.code}
              rel="alternate"
              hrefLang={lang.code}
              href={`${base}${normalizedPath || '/'}?lang=${lang.code}`}
            />
          ))}
        {base && (
          <link rel="alternate" hrefLang="x-default" href={`${base}${normalizedPath || '/'}`} />
        )}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        {title && <meta name="twitter:title" content={fullTitle} />}
        {description && <meta name="twitter:description" content={description} />}
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={fullTitle} />

        {extraLinks.map((l, i) => (
          <link key={i} rel={l.rel} href={l.href} {...(l.type ? { type: l.type } : {})} />
        ))}
      </Helmet>
      {schemaJson ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      ) : null}
    </>
  )
}

export default Seo
