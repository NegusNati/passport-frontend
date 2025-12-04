# Localization Plan (i18next) — Passport.ET

This file documents the phased plan to add localization to the application and includes a TODO checklist that I will update as tasks complete.

Supported languages

- `en` — English
- `am` — Amharic (አማርኛ)
- `om` — Oromo / Afaan Oromoo
- `ti` — Tigrinya (ትግርኛ)

Phases

1. Foundation

- Add i18next configuration and language constants
- Add initial English translation files (namespaces: `common`, `landing`)
- Add a simple `LanguageSwitcher` component (select) that persists choice to `localStorage`
- Wire i18n initialization into app entry

2. Layout & Navigation

- Add `LanguageSwitcher` to header and mobile menu
- Replace hard-coded nav/labels in `Header`, `Footer`, `MobileMenu` with `t()` lookups
- Ensure to use `siteName` and canonical linking from translations

3. Routing & SEO

- Implement URL-based language prefixes (e.g. `/en/passports`, `/am/passports`) using route groups
- Update `Seo` component to emit `rel="alternate" hreflang` tags and `og:locale`
- Add `x-default` link

4. Landing pages

- Translate all landing components (Hero, Cards, FAQs, Testimonials, CTAs) into 4 languages
- Ensure fonts and layout work for Ge'ez script (Noto Sans Ethiopic)

5. Features & Polishing

- Translate passports, articles, advertisement flows and admin pages
- Enable lazy-loading translation files and i18next-http-backend
- Add i18next-parser to extract keys and maintain translation files

Checklist

- [x] Phase 1 — Add i18n foundation (config, init, english resources, import in `src/main.tsx`)
  - Files added: `src/i18n/config.ts`, `src/i18n/index.ts`, `src/i18n/locales/en/common.json`, `src/i18n/locales/en/landing.json`
  - `src/main.tsx` now imports `@/i18n`

- [x] Phase 1 — Create `LanguageSwitcher` component and wire it into header (desktop + mobile)
- [x] Phase 2 — Replace header/footer hard-coded strings with `t()` calls
  - Header, Footer, MobileMenu now use `useTranslation()` hook
  - All nav items, button labels, and footer strings are translated
- [x] Phase 2 — Update `MobileMenu` to surface language switcher
- [x] Phase 2 — Create SEO/routing documentation (`src/i18n/README_LOCALIZATION.md`)
- [x] Phase 3 — Update `Seo` component to output `hreflang` and `og:locale`
  - Added dynamic `og:locale` based on current language (en_US, am_ET, om_ET, ti_ET)
  - Added `hreflang` alternate links for all supported languages
  - Added `x-default` hreflang link
- [x] Phase 4 — Add translations for landing pages (am/om/ti)
  - Created `src/i18n/locales/am/`, `om/`, `ti/` folders
  - Added `common.json` and `landing.json` for all 3 languages with real translations
  - Updated `src/i18n/index.ts` to load all language resources
- [x] Phase 4 — Add Noto Sans Ethiopic font for Ge'ez script
  - Added Google Fonts link in `index.html`
  - Added `font-ethiopic` class in `tailwind.config.ts`
  - LanguageSwitcher now applies `font-ethiopic` class to document when am/ti selected
- [x] Phase 3 — Implement URL language sync via `?lang=` search param
  - Created `src/shared/hooks/useLanguageSync.ts` hook
  - Hook syncs URL `?lang=` param with i18n language
  - Called in `AppShell.tsx` to enable app-wide URL language sync
  - URLs now update when language changes (e.g., `/?lang=am`)
  - Language is restored from URL on page load
- [x] Phase 5 — Feature namespaces & non-admin routes
  - Added `auth`, `errors`, `passports`, `articles`, `calendar`, and `advertisements` namespaces for all 4 languages
  - Localized non-admin routes: `/`, `/login`, `/register`, `/profile`, `/passports`, `/passports/$passportId`, `/locations`, `/locations/$locationSlug`, `/articles`, `/articles/$slug`, `/calendar`, `/advertisement-requests`, `/advertisment`
- [x] Phase 6 — Final polish & testing
  - Audited `common.json` shared keys (PWA + status) and wired Header / DownloadApp to translated PWA messages
  - Localized dynamic ad slots (sponsored banner, loading, labels) via the `advertisements` namespace
  - Ran `pnpm typecheck` and `pnpm lint` successfully (no remaining type or lint errors)
- [ ] Phase 3 — (Optional) Implement path-based language prefixes (`/am/`, `/en/`) — requires route restructuring
- [ ] Phase 5 — Add lazy-loading of translations and back-end plugin (`i18next-http-backend`)
- [ ] Phase 5 — Add `i18next-parser` integration and prepare extraction scripts

Notes / Next steps

- I added the minimal initial English JSONs inline so the app works without external HTTP backend. Next I'll update `Header` to render `LanguageSwitcher` and ensure the mobile menu has access to it.
- For best SEO we will implement URL prefixes in routing; that requires changes to `src/routes/` and route generation (`routeTree.gen.ts`) — I will propose the exact code changes before applying them.
- I'll also add guidance for adding the `Noto Sans Ethiopic` font in `index.html` and `tailwind.config.ts` in the next step.

If you'd like, I can now:

- continue and complete the `LanguageSwitcher` + Header integration (desktop + mobile), or
- stop and present an exact routing change proposal for URL-language prefixes before making route edits.

— I'll wait for your confirmation before proceeding to the next phase.
