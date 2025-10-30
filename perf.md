# passport.et Performance Roadmap

## Mission

- Deliver a fast, trustworthy passport lookup experience by bringing Core Web Vitals into the green on mobile and keeping them there release after release.
- Translate PageSpeed Insights findings into repeatable engineering work, tackling one task at a time until the site consistently scores 90+ on mobile.

## North-Star Metrics

- **Largest Contentful Paint (LCP):** ≤ 2.5 s on mobile (current ~15.5 s).
- **First Contentful Paint (FCP):** ≤ 1.8 s on mobile (current 5–9 s).
- **Total Blocking Time (TBT):** ≤ 150 ms on mobile (current ~350 ms).
- **Interaction to Next Paint (INP):** ≤ 200 ms.
- **Cumulative Layout Shift (CLS):** ≤ 0.1.
- **PageSpeed Insights score:** ≥ 90 (mobile) for `https://www.passport.et`.

## How We Work

- Prioritize the biggest wins first (LCP ➝ FCP ➝ TBT ➝ polish).
- Finish and validate one task before starting the next—check it off here and log the PSI result.
- Use production-like builds for validation: `pnpm build && pnpm preview` before lab tests.
- Capture lab (PSI / WebPageTest) **and** field data (`src/reportWebVitals.ts`) so regressions surface quickly.
- Align changes with the feature-based architecture—optimize within the owning feature when possible.

---

## Phase 0 — Baseline & Observability

**Outcome:** Everyone shares the same numbers and we can detect regressions immediately.

- [x] Export current PSI & WebPageTest reports (mobile + desktop) and store them under `docs/perf/baseline/` for comparison.
- [x] Wire `src/reportWebVitals.ts` to send LCP/INP/CLS events to PostHog (via `src/shared/lib/analytics.ts`) so production users surface real data.
- [x] Add a lightweight checklist in the repo (e.g., `docs/perf/log.md`) to log date, change, and metrics after each improvement.
- [x] Document a repeatable lab testing flow (`pnpm build`, `pnpm preview`, Lighthouse CLI, PSI) and add it to `README.md`.

## Phase 1 — Critical Rendering Path (LCP & FCP)

**Outcome:** Above-the-fold content paints quickly with minimal blocking work.

- [x] Refactor `src/features/landing/components/LandingPage.tsx` to move the hero markup earlier in the route tree and strip non-essential wrappers.
- [x] Optimize hero imagery in `src/assets/landingImages/` (WebP/AVIF variants, responsive sizes) and update `Hero.tsx` with `width`/`height`, `loading="eager"` for the primary hero image, and `decoding="async"` elsewhere.
- [x] Add a runtime `<link rel="preload">` for the hero image (dynamic in `Hero.tsx`) and keep primary fonts preloaded; ensure the main CSS bundle continues to stream via Vite.
- [x] Gate `CardSwap` animations in `Hero.tsx` behind `prefers-reduced-motion` and delay its hydration on mobile (render a static card first).
- [x] Inline critical Tailwind styles for the hero using an optional `beasties` pass in `vite.config.ts` (toggle with `VITE_ENABLE_CRITICAL_CSS=true` during build).
- [ ] Re-run PSI (mobile) and record new LCP/FCP values before checking off the phase.

## Phase 2 — JavaScript & CSS Budget (TBT & Unused Code)

**Outcome:** The main thread stays free; bundles ship only what each route needs.

- [x] Produce a bundle profile (manual chunk stats from `pnpm build`) and log top offenders (`react` ≈ 738 kB, `tanstack` ≈ 205 kB, `analytics` ≈ 160 kB, entry `index` ≈ 120 kB).
- [x] Split vendor/runtime bundles via `build.rollupOptions.output.manualChunks` so React, TanStack, PostHog, Lucide, and Sonner load on demand.
- [x] Confirm heavy libraries (`jspdf`, `html2canvas`, GSAP/CardSwap) remain lazily loaded via dynamic `import()` wrappers.
- [x] Remove or replace rarely used animation helpers from `tw-animate-css` with Tailwind-native keyframes scoped to the owning component.
- [x] Confirm Tailwind purge settings cover `src/**/*` and prune unused utility classes; keep global CSS minimal in `src/styles.css`.
- [ ] Re-run PSI/Lighthouse in mobile mode, log TBT/JS execution time, and note deltas.

## Phase 3 — Asset Delivery & Caching

**Outcome:** Static assets arrive fast and stay cached between visits.

- [x] Configure the VPS reverse proxy (e.g., Nginx/Caddy) and Cloudflare caching rules to serve hashed assets in `/assets`, `/fonts`, and other static files with `Cache-Control: public, max-age=31536000, immutable` (see `docs/perf/cache-guidance.md`).
- [x] Verify Vite emits hashed filenames; if any asset is unversioned, update `vite.config.ts` or the import path to include content hashing.
- [x] Add a build step (`scripts/optimize-images.ts`) to generate AVIF/WebP breakpoints for landing imagery before the Vite build.
- [x] Introduce responsive source sets (`srcset`/`sizes`) for large marketing imagery (`Hero.tsx`, `HeroCardsMobile.tsx`).
- [ ] Audit hosting/TTFB: capture server response timings, upgrade plan or enable edge caching if median TTFB > 800 ms.
- [ ] Validate cache headers with `curl -I` against preview and production, then rerun PSI to confirm improved FCP/LCP stability.

## Phase 4 — Interactivity, Main Thread, and Third Parties

**Outcome:** Interaction remains smooth; third-party code never blocks rendering.

- [x] Load `posthog-js` asynchronously (dynamic `import()` in the analytics provider) and gate initialization until after the first paint.
- [ ] Review each third-party script and remove anything not critical; self-host open‑source bundles when feasible for better caching.
- [ ] Replace layout-affecting animations (e.g., in `Hero.tsx`, `Testimonials.tsx`) with transform/opacity transitions and add `will-change` hints sparingly.
- [ ] Throttle or debounce expensive listeners (search inputs, scroll, resize) in `src/features/passports` so handlers stay under 50 ms.
- [ ] Use the React Profiler on `pnpm dev` to identify components that re-render excessively; memoize or split them as needed.
- [ ] Run Lighthouse Performance → “Diagnostics” panel to confirm TBT < 150 ms and no long tasks remain.

## Phase 5 — Regression Monitoring & Workflow

**Outcome:** Performance stays healthy as the app evolves.

- [ ] Add an automated PSI/Lighthouse check (e.g., `pnpm dlx @lhci/cli autorun`) to CI and fail builds on budget regressions.
- [ ] Publish Core Web Vitals budgets (LCP, FCP, INP, CLS) in `docs/perf/budgets.json` and keep them version-controlled.
- [ ] Schedule a monthly performance review—compare field data vs. lab numbers, update this roadmap, and plan the next iteration.
- [ ] Keep this `perf.md` file current: mark tasks complete, add learnings, and append new phases as needed.

---

### Using This Roadmap

- Pick the top unchecked task, complete it, validate the impact, then return here to check it off and note the results.
- After each completed task, rerun PageSpeed Insights (mobile) on `https://www.passport.et` and capture the before/after metrics in your log.
- If a task uncovers new issues, add them under the relevant phase (or create a new phase) so future work stays organized.
