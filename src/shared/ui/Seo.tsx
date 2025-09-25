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
        {noindex ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : (
          <meta name="robots" content="index, follow" />
        )}
        {url && <link rel="canonical" href={url} />}
        {/* Open Graph / Twitter */}
        {title && <meta property="og:title" content={fullTitle} />}
        {description && <meta property="og:description" content={description} />}
        {url && <meta property="og:url" content={url} />}
        <meta property="og:type" content="article" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
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
