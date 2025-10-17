import { Helmet } from 'react-helmet-async'

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
  const base = SITE?.replace(/\/$/, '') || ''
  const url = canonical || (base && path ? `${base}${path}` : '')
  const fullTitle = title ? (SITE_NAME ? `${title} · ${SITE_NAME}` : title) : SITE_NAME

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
        {ogImage && <meta property="og:image" content={ogImage} />}
        {ogImage && <meta property="og:image:alt" content={fullTitle} />}
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        {title && <meta name="twitter:title" content={fullTitle} />}
        {description && <meta name="twitter:description" content={description} />}
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        {ogImage && <meta name="twitter:image:alt" content={fullTitle} />}

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
