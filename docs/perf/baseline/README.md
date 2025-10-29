# Performance Baseline

Captured: **2025-10-29**  
URL: `https://www.passport.et`  
Environment: Production

## Purpose

These baseline metrics establish our starting point before optimization work. All future improvements will be measured against these numbers.

## Current State (from perf.md)

- **LCP:** ~15.5s (target: ≤2.5s) ❌
- **FCP:** 5-9s (target: ≤1.8s) ❌
- **TBT:** ~350ms (target: ≤150ms) ❌
- **INP:** Unknown (target: ≤200ms)
- **CLS:** Unknown (target: ≤0.1)
- **PageSpeed Score:** < 50 (mobile)

## Files

- `psi-mobile.json` - PageSpeed Insights mobile test (to be captured)
- `psi-desktop.json` - PageSpeed Insights desktop test (to be captured)
- `webpagetest.json` - WebPageTest full analysis (to be captured)

## Instructions

1. Visit https://pagespeed.web.dev/
2. Test `https://www.passport.et` for both mobile and desktop
3. Download JSON reports and save here
4. Optionally run WebPageTest at https://www.webpagetest.org/

## Next Steps

1. Run actual tests and save results here
2. Begin Phase 1 optimizations
3. Compare all future tests against these baselines

i get this on phase 0 https://pagespeed.web.dev/analysis/https-passport-et/7tpozf9evn?form_factor=mobile