# Localization Guide — Passport.ET

This document describes how internationalization (i18n) is implemented and provides guidance for adding new languages, updating translations, and extending SEO support.

---

## 1. Supported Languages

| Code | Language | Native Name  | Script |
| ---- | -------- | ------------ | ------ |
| `en` | English  | English      | Latin  |
| `am` | Amharic  | አማርኛ         | Ge'ez  |
| `om` | Oromo    | Afaan Oromoo | Latin  |
| `ti` | Tigrinya | ትግርኛ         | Ge'ez  |

All languages are **left-to-right (LTR)**. No RTL support is needed.

---

## 2. File Structure

```
src/i18n/
├── config.ts                # SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE
├── index.ts                 # i18next initialization
├── README_LOCALIZATION.md   # this file
└── locales/
    ├── en/
    │   ├── common.json      # nav, footer, PWA strings
    │   └── landing.json     # landing page-specific strings
    ├── am/
    │   ├── common.json
    │   └── landing.json
    ├── om/
    │   └── ...
    └── ti/
        └── ...
```

Each **namespace** (e.g., `common`, `landing`) maps to a JSON file in each language folder.

---

## 3. Adding a New Language

1. Create a new folder in `src/i18n/locales/` named with the ISO 639-1 code (e.g., `sw` for Swahili).
2. Copy the English JSON files as a template.
3. Translate all keys.
4. Add the language to `SUPPORTED_LANGUAGES` in `src/i18n/config.ts`.

---

## 4. Adding a New Namespace

1. Create `<namespace>.json` in each language folder.
2. Import and register the namespace in `src/i18n/index.ts`:
   ```ts
   import feature_en from './locales/en/feature.json'
   // ...
   resources: {
     en: { common, landing, feature: feature_en },
     // repeat for other languages
   },
   ns: ['common', 'landing', 'feature'],
   ```
3. Use with `useTranslation('feature')` or `t('feature:key')`.

---

## 5. Usage in Components

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation() // uses default namespace 'common'
  return <h1>{t('nav.passports')}</h1>
}

// For landing namespace:
const { t } = useTranslation('landing')
return <p>{t('hero.headline')}</p>
```

---

## 6. Lazy-Loading Translations (Future)

To avoid bundling all languages upfront:

1. Install `i18next-http-backend`:
   ```bash
   pnpm add i18next-http-backend
   ```
2. Move JSON files to `public/locales/`:
   ```
   public/locales/en/common.json
   public/locales/am/common.json
   ...
   ```
3. Update `src/i18n/index.ts`:

   ```ts
   import Backend from 'i18next-http-backend'

   i18n
     .use(Backend)
     .use(initReactI18next)
     .init({
       backend: {
         loadPath: '/locales/{{lng}}/{{ns}}.json',
       },
       // ...
     })
   ```

---

## 7. URL-Based Language Prefixes (SEO)

For optimal SEO, implement URL language prefixes:

```
/en/passports
/am/passports
/om/passports
/ti/passports
```

### Implementation Strategy

1. **Route Groups**: Add a `$lang` dynamic segment at the route root.
2. **Language Detection Order**:
   - URL path (primary)
   - localStorage (fallback)
   - Browser navigator (initial visit)
3. **Redirect**: `/` → `/${detectedLang}/`

### TanStack Router Setup (Proposed)

```tsx
// src/routes/$lang.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/i18n/config'
import i18n from '@/i18n'

const supportedCodes = SUPPORTED_LANGUAGES.map((l) => l.code)

export const Route = createFileRoute('/$lang')({
  beforeLoad: ({ params }) => {
    const { lang } = params
    if (!supportedCodes.includes(lang)) {
      throw redirect({ to: `/${DEFAULT_LANGUAGE}` })
    }
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
  },
})
```

### Redirect from Root

```tsx
// src/routes/index.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { DEFAULT_LANGUAGE } from '@/i18n/config'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const stored = localStorage.getItem('i18nextLng')
    const lang = stored || DEFAULT_LANGUAGE
    throw redirect({ to: `/${lang}` })
  },
})
```

---

## 8. SEO: hreflang Tags

Update `src/shared/ui/Seo.tsx` to emit alternate links:

```tsx
import { SUPPORTED_LANGUAGES } from '@/i18n/config'
import { useTranslation } from 'react-i18next'

export function Seo({ path = '', ... }: Props) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language
  const base = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') || ''

  return (
    <Helmet>
      {/* ... existing meta */}
      {SUPPORTED_LANGUAGES.map((lang) => (
        <link
          key={lang.code}
          rel="alternate"
          hrefLang={lang.code}
          href={`${base}/${lang.code}${path}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${base}/en${path}`} />
      <meta property="og:locale" content={currentLang === 'am' ? 'am_ET' : 'en_US'} />
    </Helmet>
  )
}
```

---

## 9. Font Support for Ge'ez Script

Amharic and Tigrinya require Ethiopic font support.

### Add to `index.html`

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### Extend Tailwind Config

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        ethiopic: ['"Noto Sans Ethiopic"', 'sans-serif'],
      },
    },
  },
}
```

### Apply Conditionally

```tsx
<html lang={currentLang} className={['am', 'ti'].includes(currentLang) ? 'font-ethiopic' : ''}>
```

Or scope to specific components:

```tsx
<p className={lang === 'am' ? 'font-ethiopic' : ''}>{t('hero.headline')}</p>
```

---

## 10. i18next-parser (Key Extraction)

Install for automatic key extraction:

```bash
pnpm add -D i18next-parser
```

Add config file `i18next-parser.config.js`:

```js
module.exports = {
  locales: ['en', 'am', 'om', 'ti'],
  output: 'src/i18n/locales/$LOCALE/$NAMESPACE.json',
  input: ['src/**/*.{ts,tsx}'],
  defaultNamespace: 'common',
  keySeparator: '.',
  namespaceSeparator: ':',
}
```

Run:

```bash
pnpm i18next-parser
```

---

## 11. Testing Translations

1. Switch language via the `<LanguageSwitcher>` in the header.
2. Verify localStorage persists the selection (`i18nextLng`).
3. Check that all UI strings update without page reload.
4. Validate `hreflang` tags in page source (after SEO update).

---

## 12. Checklist for Full i18n

- [x] i18next initialized with English resources
- [x] LanguageSwitcher component added to header/mobile menu
- [x] Header, Footer, MobileMenu use `t()` calls
- [ ] Add Amharic translations (`am/common.json`, `am/landing.json`)
- [ ] Add Oromo translations
- [ ] Add Tigrinya translations
- [ ] Implement URL language prefixes (`/$lang/...`)
- [ ] Update Seo component with hreflang tags
- [ ] Add Noto Sans Ethiopic font
- [ ] Configure lazy-loading with `i18next-http-backend`
- [ ] Add `i18next-parser` for key extraction

---

_Last updated: 1 December 2025_
