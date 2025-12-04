# Localization Refactor Plan

> A comprehensive plan to implement full i18n support across all non-admin routes in passport-frontend.

## Overview

This plan refactors the localization system to:

1. Organize translations by feature/route (maintainable folder structure)
2. Add dynamic language support to all public-facing components
3. Support 4 languages: English (en), Amharic (am), Oromo (om), Tigrinya (ti)
4. Use eager namespace loading in route loaders for optimal UX

---

## Current State

### Existing Locales Structure

```
src/i18n/locales/
├── en/
│   ├── common.json     ✅ (nav, footer, pwa, shared)
│   └── landing.json    ✅ (hero, faqs, testimonials, etc.)
├── am/
│   ├── common.json     ✅
│   └── landing.json    ✅
├── om/
│   ├── common.json     ✅
│   └── landing.json    ✅
└── ti/
    ├── common.json     ✅
    └── landing.json    ✅
```

### Routes to Localize (excluding /admin/\*)

| Route                      | Feature                | Components                                            | Status  |
| -------------------------- | ---------------------- | ----------------------------------------------------- | ------- |
| `/`                        | landing                | LandingPage, Hero, FAQs, etc.                         | ✅ Done |
| `/login`                   | auth                   | LoginPage, LoginForm                                  | ✅ Done |
| `/register`                | auth                   | RegisterPage, RegisterForm                            | ✅ Done |
| `/profile`                 | auth                   | ProfilePage                                           | ✅ Done |
| `/passports`               | passports              | PassportsPage, PassportSearchForm, PassportsTable     | ⬜ Todo |
| `/passports/$passportId`   | passports              | PassportDetailPage, PassportDetailCard                | ⬜ Todo |
| `/locations`               | passports              | LocationsDirectoryPage                                | ⬜ Todo |
| `/locations/$locationSlug` | passports              | PassportsByLocationPage                               | ⬜ Todo |
| `/articles`                | articles               | ArticlesPage, ArticleCard, ArticleFilters             | ⬜ Todo |
| `/articles/$slug`          | articles               | ArticleDetail (in route file)                         | ⬜ Todo |
| `/calendar`                | calendar               | CalendarPage                                          | ⬜ Todo |
| `/advertisement-requests`  | advertisement-requests | AdvertisementRequestForm, AdvertisementRequestSuccess | ⬜ Todo |
| `/advertisment`            | advertisements         | AdvertisementPreviewPage                              | ⬜ Todo |
| (global)                   | misc                   | NotFound, AppErrorBoundary                            | ✅ Done |

---

## Target Locales Structure

```
src/i18n/locales/
├── en/
│   ├── common.json           # Shared: nav, footer, pwa, errors, buttons
│   ├── landing.json          # Landing page (existing)
│   ├── auth.json             # Login, Register, Profile
│   ├── passports.json        # Passport search, detail, locations
│   ├── articles.json         # Articles list & detail
│   ├── calendar.json         # Ethiopian calendar
│   ├── advertisements.json   # Ad requests & preview
│   └── errors.json           # NotFound, ErrorBoundary
├── am/
│   └── (same structure)
├── om/
│   └── (same structure)
└── ti/
    └── (same structure)
```

---

## Phase 1: Foundation & Auth Feature

**Goal**: Set up new namespace structure and localize authentication flows.

### Tasks

- [x] **1.1 Create auth.json for all 4 languages**
  - Keys: login (title, subtitle, form labels, errors, cta), register (title, subtitle, form labels, errors, cta), profile (title, labels, sections, logout)
  - Files: `en/auth.json`, `am/auth.json`, `om/auth.json`, `ti/auth.json`

- [x] **1.2 Create errors.json for all 4 languages**
  - Keys: notFound (title, subtitle, goHome, goBack), errorBoundary (title, subtitle, tryAgain, goHome)
  - Files: `en/errors.json`, `am/errors.json`, `om/errors.json`, `ti/errors.json`

- [x] **1.3 Update i18n/index.ts to import new namespaces**
  - Add auth, errors to resources for all languages
  - Update ns array

- [x] **1.4 Update i18n/types.ts with new namespace types**
  - Add auth.json and errors.json type imports
  - Update I18nResources interface

- [x] **1.5 Localize LoginPage.tsx**
  - Add useTranslation('auth')
  - Replace hardcoded strings with t() calls

- [x] **1.6 Localize LoginForm.tsx**
  - Add useTranslation('auth')
  - Replace form labels, placeholders, error messages

- [x] **1.7 Localize RegisterPage.tsx**
  - Add useTranslation('auth')
  - Replace hardcoded strings

- [x] **1.8 Localize RegisterForm.tsx**
  - Add useTranslation('auth')
  - Replace form labels, placeholders, error messages

- [x] **1.9 Localize ProfilePage.tsx**
  - Add useTranslation('auth')
  - Replace all labels and section headers

- [x] **1.10 Localize NotFound.tsx**
  - Add useTranslation('errors')
  - Replace 404 messaging

- [x] **1.11 Localize AppErrorBoundary.tsx**
  - Add useTranslation('errors')
  - Replace error messaging

- [x] **1.12 Add loadI18nNamespaces to auth routes**
  - Update `/login`, `/register`, `/profile` route loaders

---

## Phase 2: Passports Feature

**Goal**: Full localization of passport search, detail, and location pages.

### Tasks

- [x] **2.1 Create passports.json for all 4 languages**
  - Keys: search (title, description, form, placeholders, modes), table (headers, empty, loading, error), detail (title, labels, status, actions), locations (title, description, directory)
  - Files: `en/passports.json`, `am/passports.json`, `om/passports.json`, `ti/passports.json`

- [x] **2.2 Update i18n/index.ts with passports namespace**

- [x] **2.3 Update i18n/types.ts with passports types**

- [x] **2.4 Localize PassportsPage.tsx**
  - Add useTranslation('passports')
  - Replace SEO, headings

- [x] **2.5 Localize PassportSearchForm.tsx**
  - Add useTranslation('passports')
  - Replace form labels, placeholders, buttons, mode toggles

- [x] **2.6 Localize PassportsTable.tsx**
  - Add useTranslation('passports')
  - Replace table headers, empty states, loading states

- [x] **2.7 Localize PassportDetailPage.tsx**
  - Add useTranslation('passports')
  - Replace all labels, status messages, CTAs

- [x] **2.8 Localize PassportDetailCard.tsx**
  - Add useTranslation('passports')
  - Replace card labels and status badges

- [x] **2.9 Localize LocationsDirectoryPage.tsx**
  - Add useTranslation('passports')
  - Replace directory title, descriptions

- [x] **2.10 Localize PassportsByLocationPage.tsx**
  - Add useTranslation('passports')
  - Replace page title, breadcrumbs

- [x] **2.11 Add loadI18nNamespaces to passport routes**
  - Update `/passports`, `/passports/$passportId`, `/locations`, `/locations/$locationSlug`

---

## Phase 3: Articles Feature

**Goal**: Localize articles listing and detail pages.

### Tasks

- [x] **3.1 Create articles.json for all 4 languages**
  - Keys: list (title, description, filters, search, empty, loading), detail (backLink, shareButton, relatedArticles), categories, pagination
  - Files: `en/articles.json`, `am/articles.json`, `om/articles.json`, `ti/articles.json`

- [x] **3.2 Update i18n/index.ts with articles namespace**

- [x] **3.3 Update i18n/types.ts with articles types**

- [x] **3.4 Localize ArticlesPage.tsx**
  - Add useTranslation('articles')
  - Replace SEO, filters, search, empty states

- [x] **3.5 Localize ArticleCard.tsx**
  - (Inline within ArticlesPage - no separate component)

- [x] **3.6 Localize ArticleFilters.tsx**
  - (Integrated within ArticlesPage - filters use t() calls)

- [x] **3.7 Localize ArticleSearchForm.tsx**
  - (Integrated within ArticlesPage - search uses t() calls)

- [x] **3.8 Localize ArticlePagination.tsx**
  - Add useTranslation('articles')
  - Replace previous/next, page info, aria labels

- [x] **3.9 Localize /articles/$slug route component**
  - Add useTranslation('articles')
  - Replace back link, share button, related articles header, error states, reading time

- [x] **3.10 Add loadI18nNamespaces to articles routes**
  - Update `/articles`, `/articles/$slug`

---

## Phase 4: Calendar Feature

**Goal**: Localize Ethiopian calendar page.

### Tasks

- [x] **4.1 Create calendar.json for all 4 languages**
  - Keys: seo, header, digits, navigation, viewMode, actions, selectors, weekdays, holidays, selectedDate, geezNumbers, readingTips
  - Files: `en/calendar.json`, `am/calendar.json`, `om/calendar.json`, `ti/calendar.json`

- [x] **4.2 Update i18n/index.ts with calendar namespace**

- [x] **4.3 Update i18n/types.ts with calendar types**

- [x] **4.4 Localize CalendarPage.tsx**
  - Add useTranslation('calendar')
  - Replace SEO, navigation labels, view mode buttons, holidays section, selected date, Ge'ez numbers section, reading tips

- [x] **4.5 Update calendar-utils.ts constants**
  - (Kept ETHIOPIAN_MONTHS and WEEKDAYS as data with bilingual labels - no changes needed as they display both English and Amharic)

- [x] **4.6 Add loadI18nNamespaces to calendar route**
  - Created `/calendar.tsx` with loader that calls loadI18nNamespaces(['calendar'])

---

## Phase 5: Advertisements Feature

**Goal**: Localize advertisement request and preview pages.

### Tasks

- [x] **5.1 Create advertisements.json for all 4 languages**
  - Keys: request (title, description, form labels, validation, success), preview (title, description, demo labels)
  - Files: `en/advertisements.json`, `am/advertisements.json`, `om/advertisements.json`, `ti/advertisements.json`

- [x] **5.2 Update i18n/index.ts with advertisements namespace**

- [x] **5.3 Update i18n/types.ts with advertisements types**

- [x] **5.4 Localize AdvertisementRequestForm.tsx**
  - Add useTranslation('advertisements')
  - Replace all form labels, placeholders, validation messages

- [x] **5.5 Localize AdvertisementRequestSuccess.tsx**
  - Add useTranslation('advertisements')
  - Replace success messaging, next steps

- [x] **5.6 Localize advertisement-requests route page**
  - Add useTranslation('advertisements')
  - Replace SEO, page content

- [x] **5.7 Localize AdvertisementPreviewPage.tsx**
  - Add useTranslation('advertisements')
  - Replace demo labels

- [x] **5.8 Add loadI18nNamespaces to advertisement routes**
  - Update `/advertisement-requests`, `/advertisment`

---

## Phase 6: Final Polish & Testing

**Goal**: Ensure consistency, fix edge cases, and validate all translations.

### Tasks

- [x] **6.1 Audit common.json for missing shared keys**
  - Buttons (submit, cancel, save, loading...)
  - Form validation (required, invalidEmail, minLength...)
  - Date/time formatting

- [x] **6.2 Run full typecheck**
  - Ensure all t() calls have valid keys

- [x] **6.3 Run lint**
  - Fix any import ordering issues

- [x] **6.4 Manual testing - English**
  - Navigate all routes, verify no hardcoded strings

- [x] **6.5 Manual testing - Amharic**
  - Verify Ge'ez script renders correctly
  - Check text overflow/layout

- [x] **6.6 Manual testing - Oromo**
  - Verify translations display correctly

- [x] **6.7 Manual testing - Tigrinya**
  - Verify Ge'ez script renders correctly
  - Check text overflow/layout

- [x] **6.8 Update locales.md with completion status**

---

## Implementation Notes

### Naming Conventions

- Namespace files: `feature-name.json` (lowercase, hyphenated if multi-word)
- Translation keys: `section.subsection.key` (dot notation, camelCase)
- Array items: Use `returnObjects: true` for FAQ-style arrays

### Route Loader Pattern

```tsx
// Example: /passports route
import { loadI18nNamespaces } from '@/i18n/loader'

export const Route = createFileRoute('/passports/')({
  loader: async ({ context }) => {
    await Promise.all([
      loadI18nNamespaces(['passports']),
      // ... other prefetch queries
    ])
  },
})
```

### Component Pattern

```tsx
import { useTranslation } from 'react-i18next'

export function MyComponent() {
  const { t } = useTranslation('namespace')

  return (
    <div>
      <h1>{t('section.title')}</h1>
      <p>{t('section.description')}</p>
    </div>
  )
}
```

### Interpolation Pattern

```tsx
// For dynamic values
t('passports.count', { count: 1300173 })
// JSON: "{{count}}+ passports found"

// For pluralization (if needed)
t('items', { count: 5 })
// JSON: "{{count}} item" / "{{count}} items"
```

---

## Progress Summary

| Phase | Description             | Status      |
| ----- | ----------------------- | ----------- |
| 0     | Landing page (existing) | ✅ Complete |
| 1     | Foundation & Auth       | ✅ Complete |
| 2     | Passports               | ✅ Complete |
| 3     | Articles                | ✅ Complete |
| 4     | Calendar                | ✅ Complete |
| 5     | Advertisements          | ✅ Complete |
| 6     | Final Polish            | ✅ Complete |

**Total Tasks**: 52  
**Completed**: 52  
**Remaining**: 0

---

## Dependencies

- `i18next` ✅ Installed
- `react-i18next` ✅ Installed
- Noto Sans Ethiopic font ✅ Configured
- Type-safe i18n ✅ Configured

---

_Last updated: December 1, 2025_
