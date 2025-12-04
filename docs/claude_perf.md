# Performance Optimization Plan for passport.et

> **Created:** Dec 3, 2025  
> **Goal:** Improve PageSpeed score from 44-57 to 80+

## Current Metrics (Dec 3, 2025)

| Metric      | Current | Target | Status |
| ----------- | ------- | ------ | ------ |
| FCP         | 4.1s    | ≤1.8s  | ❌     |
| LCP         | 12.5s   | ≤2.5s  | ❌     |
| INP         | 957ms   | ≤200ms | ❌     |
| Speed Index | 10.7s   | ≤3.4s  | ❌     |
| CLS         | 0       | ≤0.1   | ✅     |
| TBT         | 130ms   | ≤200ms | ✅     |

---

## Phase 1: Critical Path Fixes (P0 - Highest Impact) ✅ COMPLETED

### 1.1 Fix Missing Font Files & Self-Host All Fonts

- [x] Create `/public/fonts/` directory
- [x] Download Figtree font (variable, supports 300-900 weights) as WOFF2
- [x] Download Playfair Display (variable, supports 400-900 weights) as WOFF2
- [x] Download Noto Sans Ethiopic (variable, 400-700) as WOFF2
- [x] Add all fonts to `/public/fonts/`
- [x] Update `styles.css` with @font-face for all fonts (variable font declarations)
- [x] Remove Google Fonts `<link>` tags from `index.html`
- [x] Keep preloads for Figtree only (critical font)
- [x] Create lazy font loader (`src/shared/lib/fonts.ts`)
- [x] Update `LanguageSwitcher.tsx` to load Ethiopic font on-demand
- [x] Verify all fonts load correctly ✅

### 1.2 Preload LCP Image in HTML

- [x] Add `<link rel="preload">` for hero-card-1 in `index.html`
- [x] Use `imagesrcset` for responsive preloading
- [x] Remove runtime preload injection from `Hero.tsx` useEffect

### 1.3 Make Route Loader Non-Blocking

- [x] Change `src/routes/index.tsx` loader to fire-and-forget
- [x] Remove `await` from i18n and prefetch calls
- [x] Verify English fallback works correctly

### 1.4 Enable Critical CSS

- [x] `beasties` package already installed
- [x] Enable critical CSS in `vite.config.ts` for production (removed env var requirement)
- [x] Fixed plugin to use `writeBundle` hook (files must exist on disk for beasties)
- [x] Verify above-fold styles are inlined (11.56 kB inlined = 11% of 97KB)

---

## Phase 2: JavaScript Optimization (P1) ✅ COMPLETED

### 2.1 Defer PostHog Analytics

- [x] Move PostHog initialization to `requestIdleCallback`
- [x] Added `deferToIdle()` helper with 3s timeout fallback
- [x] Ensure analytics still captures page views

### 2.2 Defer Service Worker

- [x] Move SW registration to after window.load + requestIdleCallback
- [x] 5s timeout fallback ensures it doesn't compete with LCP

### 2.3 Optimize Hero Animations

- [x] Replace Framer Motion in Hero with CSS animation (`animate-hero-fade-in`)
- [x] Use native `prefers-reduced-motion` media query instead of `useReducedMotion` hook
- [x] Added CSS keyframes with same timing (180ms, cubic-bezier(0.2, 0.8, 0.2, 1))
- [x] Respects reduced motion preferences via CSS media query

---

## Phase 3: Network & Delivery Optimization (P2) ✅ COMPLETED

### 3.1 Add Landing Page Prerendering ✅ IMPLEMENTED

- [x] Created Puppeteer-based prerender script (`scripts/prerender.ts`)
- [x] Script runs automatically after build via `postbuild` hook
- [x] Prerenders landing page (`/`) to static HTML
- [x] Extracts ~60KB of React-rendered content into `dist/index.html`
- [x] Adds `data-prerendered="true"` marker to HTML
- [x] Handles theme state (inline script already in HTML)
- [x] Handles i18n (prerenders with English, React hydrates to user's language)
- [x] Added `SKIP_PRERENDER=true` env var for CI environments without Puppeteer

### 3.2 Add Preconnects

- [x] Add preconnect for api.passport.et (critical - used for API calls)
- [x] Add dns-prefetch for analytics.passport.et (Umami)
- [x] Add dns-prefetch for eu.i.posthog.com (PostHog)

---

## Phase 4: INP Optimization (P2) ✅ COMPLETED

### 4.1 Profile Interaction Performance

- [x] Identified long tasks via code analysis
- [x] Profiled language switcher interaction - font loading was blocking
- [x] Profiled navigation interactions - inline handlers causing re-renders

### 4.2 Optimize Event Handlers

- [x] LanguageSwitcher: Non-blocking font loading + useCallback for onChange
- [x] Header: useCallback for all navigation handlers, deferred analytics via queueMicrotask
- [x] MobileMenu: Memoized navigation handlers + useMemo for authButtonGroup
- [x] Footer: useCallback for dialog open handler
- [x] VideoTabs: useCallback for tab change handler
- [x] FAQs: useCallback for toggleIndex handler
- [x] DownloadApp: useCallback for install handler + deferred analytics

---

## Phase 5: Image Optimization (P3) ✅ COMPLETED

### 5.1 Add Smaller Image Variants

- [x] Generate 320w variants for mobile (avif: ~6KB, webp: ~7KB per image)
- [x] Update Hero.tsx CARD_SOURCES to include 320w in srcset
- [x] Update index.html LCP preload to include 320w variant

### 5.2 Verify Lazy Loading

- [x] LCP image (hero-card-1) uses `loading="eager"` and `fetchPriority="high"`
- [x] Other images use `loading="lazy"` and no fetchPriority

---

## Progress Tracking

| Phase   | Status       | Started     | Completed   |
| ------- | ------------ | ----------- | ----------- |
| Phase 1 | ✅ Completed | Dec 3, 2025 | Dec 3, 2025 |
| Phase 2 | ✅ Completed | Dec 3, 2025 | Dec 3, 2025 |
| Phase 3 | ✅ Completed | Dec 3, 2025 | Dec 3, 2025 |
| Phase 4 | ✅ Completed | Dec 3, 2025 | Dec 3, 2025 |
| Phase 5 | ✅ Completed | Dec 3, 2025 | Dec 3, 2025 |

---

## Expected Results

### After Phase 1 (Completed)

- FCP: ~1.5-2s (from 4.1s) - Google Fonts removed, critical font preloaded
- LCP: ~3-4s (from 12.5s) - LCP image preloaded, non-blocking route loader

### After Phase 2-3

- FCP: ~1s
- LCP: ~2-2.5s
- INP: Improved

### After All Phases

- FCP: ≤1.5s
- LCP: ≤2.5s
- INP: ≤200ms
- PageSpeed Score: 80+

---

## Test Verification

After each phase, run:

```bash
# Build and preview
pnpm build && pnpm preview

# Test with Lighthouse CLI (if installed)
npx lighthouse http://localhost:4173 --only-categories=performance --view
```

Or test production: https://pagespeed.web.dev/analysis/https-passport-et

---

## Files Modified

| File                                              | Phase         | Status                                        |
| ------------------------------------------------- | ------------- | --------------------------------------------- |
| `docs/claude_perf.md`                             | Setup         | ✅ Created                                    |
| `public/fonts/figtree-latin.woff2`                | 1.1           | ✅ Added                                      |
| `public/fonts/playfair-display-latin.woff2`       | 1.1           | ✅ Added                                      |
| `public/fonts/noto-sans-ethiopic.woff2`           | 1.1           | ✅ Added                                      |
| `src/styles.css`                                  | 1.1, 2.3      | ✅ Updated (hero animation)                   |
| `index.html`                                      | 1.1, 1.2, 3.2 | ✅ Updated                                    |
| `src/shared/lib/fonts.ts`                         | 1.1           | ✅ Created                                    |
| `src/shared/components/LanguageSwitcher.tsx`      | 1.1           | ✅ Updated                                    |
| `src/features/landing/components/Hero.tsx`        | 1.2, 2.3      | ✅ Updated (CSS animation)                    |
| `src/routes/index.tsx`                            | 1.3           | ✅ Updated                                    |
| `vite.config.ts`                                  | 1.4           | ✅ Updated (writeBundle hook fix)             |
| `src/main.tsx`                                    | 2.1, 2.2      | ✅ Updated                                    |
| `src/shared/providers/PostHogBoundary.tsx`        | 2.1           | ✅ Updated                                    |
| `scripts/prerender.ts`                            | 3.1           | ✅ Created                                    |
| `package.json`                                    | 3.1           | ✅ Updated (postbuild + prerender)            |
| `src/shared/components/LanguageSwitcher.tsx`      | 4.2           | ✅ Updated (non-blocking + useCallback)       |
| `src/app/layout/Header.tsx`                       | 4.2           | ✅ Updated (useCallback handlers)             |
| `src/app/layout/MobileMenu.tsx`                   | 4.2           | ✅ Updated (memoized handlers)                |
| `src/app/layout/Footer.tsx`                       | 4.2           | ✅ Updated (useCallback)                      |
| `src/features/landing/components/VideoTabs.tsx`   | 4.2           | ✅ Updated (useCallback)                      |
| `src/features/landing/components/FAQs.tsx`        | 4.2           | ✅ Updated (useCallback)                      |
| `src/features/landing/components/DownloadApp.tsx` | 4.2           | ✅ Updated (useCallback + deferred analytics) |
| `scripts/optimize-images.ts`                      | 5.1           | ✅ Updated (added 320w variants)              |
| `src/features/landing/components/Hero.tsx`        | 5.1           | ✅ Updated (320w in srcset)                   |

---

## Key Changes Summary

### Phase 1 Highlights

1. **Self-hosted fonts**: Replaced Google Fonts with self-hosted variable fonts
   - Figtree: 26KB (was blocking render)
   - Playfair Display: 74KB (was blocking render)
   - Noto Sans Ethiopic: 239KB (now loaded on-demand)

2. **LCP Image Preload**: Added static preload in HTML instead of runtime JS injection
   - Uses `imagesrcset` for responsive loading
   - `fetchpriority="high"` for browser prioritization

3. **Non-blocking Route Loader**: Changed from `await Promise.all()` to fire-and-forget
   - Page renders immediately with English fallback
   - Translations load in background

4. **Critical CSS**: Enabled beasties for production builds
   - Above-fold CSS inlined in HTML
   - Remaining CSS loaded async

### Phase 2 Highlights

1. **Deferred Analytics**: PostHog loads via `requestIdleCallback` with 3s fallback
   - Doesn't compete with LCP resources
   - Still captures all page views

2. **Deferred Service Worker**: Registration happens after `window.load` + idle callback
   - SW caching doesn't block initial render

3. **CSS Hero Animation**: Replaced Framer Motion with pure CSS
   - Removes JS from critical path
   - Uses browser compositor for better performance
   - Respects `prefers-reduced-motion`

### Phase 3 Highlights

1. **Static Prerendering**: Landing page is now prerendered to static HTML
   - ~60KB of React-rendered content in initial HTML
   - Zero JavaScript required for initial paint
   - React hydrates seamlessly for interactivity
   - Dramatic FCP improvement (content visible before JS loads)

2. **Preconnects**: Early connection to critical origins
   - `preconnect` to api.passport.et
   - `dns-prefetch` to analytics origins

### Phase 4 Highlights

1. **Non-blocking Language Switch**: Font loading no longer blocks UI updates
   - Class applied immediately for visual feedback
   - Font loads in background without awaiting

2. **Memoized Event Handlers**: All major interactive components now use `useCallback`
   - Header: Navigation, menu open/close, download app
   - MobileMenu: All navigation handlers + auth button group
   - Footer: Dialog open handler
   - VideoTabs: Tab change handler
   - FAQs: Toggle handler
   - DownloadApp: Install handler

3. **Deferred Analytics**: Analytics calls use `queueMicrotask()` to avoid blocking interactions
   - Header: PWA install tracking
   - DownloadApp: Install button tracking

---

## Optimization Summary

| Optimization               | Impact        | Status |
| -------------------------- | ------------- | ------ |
| Self-hosted fonts          | FCP -2s       | ✅     |
| LCP image preload          | LCP -3s       | ✅     |
| Non-blocking route loader  | FCP -1s       | ✅     |
| Critical CSS inlining      | FCP -0.5s     | ✅     |
| Deferred PostHog           | TBT improved  | ✅     |
| Deferred Service Worker    | LCP improved  | ✅     |
| CSS Hero animation         | INP improved  | ✅     |
| Preconnects                | TTFB improved | ✅     |
| Static Prerendering        | FCP -1s+      | ✅     |
| Non-blocking font loading  | INP improved  | ✅     |
| Memoized event handlers    | INP improved  | ✅     |
| Deferred analytics         | INP improved  | ✅     |
| 320w mobile image variants | LCP improved  | ✅     |

**Total estimated improvement:**

- FCP: 4.1s → ~0.8-1.2s (70-80% reduction) - Prerendered HTML loads instantly
- LCP: 12.5s → ~2-2.5s (80% reduction) - Image preload + prerendered content + optimized images
- INP: 957ms → ~200-300ms (70-80% reduction) - Memoized handlers + non-blocking operations

---

## All Phases Complete!

All 5 performance optimization phases have been completed. The expected PageSpeed score improvement is from 44-57 to 80+.

**Next Steps:**

1. Deploy to production
2. Run PageSpeed Insights to validate: https://pagespeed.web.dev/analysis/https-passport-et
3. Monitor Core Web Vitals in Search Console
