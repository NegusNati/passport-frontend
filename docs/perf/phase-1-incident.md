# Phase 1 Performance Incident Report

**Date:** 2025-10-30  
**Status:** 🔧 Fixed, Awaiting Revalidation

## Summary

Initial Phase 1 deployment caused severe performance regressions in LCP and FCP due to incorrect image preload path. Quick fix applied.

## What Happened

### Deployment Results

After implementing Phase 1 optimizations, performance metrics showed:

**✅ Improvements:**

- TBT: 750ms → 220ms (70% improvement)
- CLS: → 0 (perfect)

**❌ Regressions:**

- FCP: 5.5s → 11.7s (+113% slower!)
- LCP: 17.4s → 24.8s (+42% slower!)

## Root Cause Analysis

### The Bug

Added image preload in `index.html` with **development path**:

```html
<link rel="preload" href="/src/assets/landingImages/cardImages/Landing_img_1.webp" ... />
```

### Why It Failed

1. Vite processes assets during build and **adds content hashes** to filenames
2. Production path becomes: `/assets/Landing_img_1-XcY6pAgj.webp`
3. Browser tries to preload non-existent `/src/assets/...` file
4. Failed fetch blocks critical rendering path
5. Browser waits for failed resource before painting → delayed FCP/LCP

### Why TBT Improved

The GSAP lazy loading worked perfectly:

- CardSwap moved to separate chunk (75KB)
- Loads via `requestIdleCallback` after initial paint
- Main thread freed up by 70%

### Why CLS Was Fixed

Image dimension attributes worked:

- Added explicit `width` and `height` to all images
- Browser reserves space before image loads
- Zero layout shift achieved

## The Fix

### Applied Solution

**Removed the broken image preload** from `index.html`:

```diff
- <!-- Preload critical resources for faster FCP/LCP -->
- <link rel="preload" as="image" href="/src/assets/landingImages/cardImages/Landing_img_1.webp" ...>
+ <!-- Preload critical fonts for faster FCP -->
+ <!-- Note: Hero image preload removed - Vite hashes asset URLs making static preload impossible -->
+ <!-- The img tag's loading="eager" + fetchpriority="high" provides sufficient prioritization -->
```

**Why This Works:**

- The `<img>` tag already has `loading="eager"` + `fetchpriority="high"`
- Browser still prioritizes the image, just discovers it slightly later
- No blocking failed fetch
- Font preloads remain (CDN URLs are stable)

### Alternative Solutions Considered

1. **Move image to `/public/` folder** - Would give stable URL for preload
   - Pros: Enables preload with predictable path
   - Cons: Loses Vite optimization (compression, cache busting)
2. **Vite plugin for preload injection** - Dynamic preload at build time
   - Pros: Automatic, handles hashed URLs
   - Cons: Additional complexity, build-time dependency
3. **Current approach** - No image preload, rely on img attributes
   - Pros: Simple, no breaking paths
   - Cons: Slightly later image discovery (but still prioritized)

## Lessons Learned

### Critical Insights

1. **Test in production-like environments** - Development and production asset handling differs significantly
2. **Verify resource URLs** - Always check actual build output before adding preloads
3. **Understand build tools** - Vite's asset hashing breaks static preload references
4. **Monitor all metrics** - TBT improving while FCP/LCP regressing revealed the specific issue
5. **Incremental changes work** - Other optimizations (lazy GSAP, image dimensions) worked perfectly

### What Worked

- ✅ Lazy loading GSAP via `requestIdleCallback`
- ✅ Image dimensions to prevent CLS
- ✅ `loading="eager"` + `fetchpriority="high"` on images
- ✅ Font preloads (stable CDN URLs)
- ✅ Reduced motion support

### What Failed

- ❌ Static image preload with Vite-processed assets
- ❌ Assuming development paths work in production

## Expected Recovery

With broken preload removed:

- **FCP:** Should return to ~5-6s (back to baseline or better)
- **LCP:** Should return to ~15-18s (baseline or better)
- **TBT:** Should stay at ~220ms (70% improvement maintained)
- **CLS:** Should stay at 0 (fix maintained)

## Action Items

- [x] Remove broken image preload
- [x] Rebuild and verify build output
- [ ] Redeploy to production
- [ ] Rerun PageSpeed Insights
- [ ] Update performance log with corrected metrics
- [ ] Consider Phase 2 focus on main bundle size (910KB)

## Timeline

- **00:27** - Initial Phase 1 deployment
- **~01:00** - Performance regression detected
- **01:15** - Root cause identified (broken preload path)
- **01:20** - Fix applied (removed preload)
- **01:25** - Awaiting redeployment and validation

## References

- Build output: `dist/assets/Landing_img_1-XcY6pAgj.webp`
- Vite documentation: https://vitejs.dev/guide/assets.html
- Web.dev resource prioritization: https://web.dev/prioritize-resources/
