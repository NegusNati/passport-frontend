# Dynamic Advertisement Management Spec

## Goal

Make every Passport.ET owned ad/banner placement dynamic, fast, measurable, and safe to manage from `https://passport.et/admin/advertisements`.

The system should support first-party ads for Passport.ET products and partner campaigns with a simple code per ad section, separate desktop/mobile creatives, and a click target wrapping the rendered ad.

## Current State

- Frontend has a `DynamicAdSlot`, but most public placements still render static sponsored placeholders.
- Frontend expects `/api/v1/advertisements/placement`, `/impression`, and `/click`.
- Backend currently exposes `/api/v1/advertisements/active?slot_number=...` and tracking endpoints under `/api/v1/advertisements/{advertisement}/...`.
- Backend advertisements already store title, desktop/mobile assets, link, status, dates, priority, and counters.
- Admin CRUD exists, but slot codes are free text and `ad_slot_number` is unique, which makes replacement scheduling awkward.

## Slot Codes

Initial slot inventory:

| Code                         | Surface                                       | Format     | Desktop Ratio | Mobile Ratio |
| ---------------------------- | --------------------------------------------- | ---------- | ------------- | ------------ |
| `home-alerts-banner`         | Landing page "Advertise with Passport Alerts" | horizontal | 1200x300      | 640x360      |
| `home-download-app`          | Landing page "Download the Passport.ET App"   | horizontal | 1200x300      | 640x360      |
| `articles-list-top`          | Articles index top banner                     | horizontal | 1200x300      | 640x360      |
| `article-mobile-top`         | Article detail mobile top                     | horizontal | 1200x300      | 640x360      |
| `article-inline-bottom`      | Article detail inline bottom                  | horizontal | 1200x300      | 640x360      |
| `article-sidebar`            | Article detail sidebar                        | vertical   | 320x640       | 640x360      |
| `passport-detail-result`     | Passport result/detail page                   | horizontal | 1200x300      | 640x360      |
| `calendar-sidebar-primary`   | Calendar upper sidebar                        | vertical   | 320x640       | 640x360      |
| `calendar-inline`            | Calendar inline banner                        | horizontal | 1200x300      | 640x360      |
| `calendar-sidebar-secondary` | Calendar lower sidebar                        | vertical   | 320x640       | 640x360      |

## Backend Contract

### Public API

Batch fetch:

```http
GET /api/v1/advertisements/slots?codes[]=home-alerts-banner&codes[]=home-download-app
```

Single slot:

```http
GET /api/v1/advertisements/slots/{code}
```

Response:

```json
{
  "data": {
    "home-alerts-banner": {
      "id": 12,
      "slot_code": "home-alerts-banner",
      "title": "Advertise with Passport Alerts",
      "alt_text": "Passport Alerts promotion",
      "target_url": "https://passport.et/advertisement-requests",
      "desktop_asset": {
        "url": "https://passport.et/storage/advertisements/desktop/example.webp",
        "width": 1200,
        "height": 300
      },
      "mobile_asset": {
        "url": "https://passport.et/storage/advertisements/mobile/example.webp",
        "width": 640,
        "height": 360
      },
      "impression_url": "/api/v1/advertisements/12/impression",
      "click_url": "/api/v1/advertisements/12/click"
    }
  }
}
```

Tracking:

```http
POST /api/v1/advertisements/{advertisement}/impression
POST /api/v1/advertisements/{advertisement}/click
```

Payload:

```json
{
  "slot_code": "home-alerts-banner",
  "session_id": "stable-browser-session-id",
  "pathname": "/",
  "viewport": "desktop",
  "language": "en"
}
```

### Admin API

Keep the existing admin endpoints, but evolve the payload:

- `slot_code` replaces free-text `ad_slot_number` as the canonical section identifier.
- `ad_slot_number` remains supported temporarily for backward compatibility.
- `target_url` is canonical and maps to the current `ad_client_link`.
- `alt_text` is required before publish.
- desktop and mobile assets are required before `active`.
- asset width/height are stored after upload.
- validation prevents overlapping active/scheduled campaigns for the same slot.

## Frontend Contract

Use one component everywhere:

```tsx
<DynamicAdSlot code="home-alerts-banner" orientation="horizontal" />
```

Rendering requirements:

- Use an `<a>` wrapper for native link semantics.
- Use `<picture>` with mobile and desktop sources.
- Reserve space via backend width/height and CSS `aspect-ratio`.
- Use `loading="lazy"` for below-the-fold ads.
- Use `fetchPriority="low"` for non-critical ads.
- Use `decoding="async"`.
- Use `IntersectionObserver` to track impressions only after the slot is meaningfully visible.
- Use `navigator.sendBeacon()` where possible for tracking.
- Fall back to a static internal CTA when no active ad is available.

## Performance Rules

- Fetch all landing slots in one request to avoid waterfalls.
- Cache public ad responses for 60-300 seconds.
- Flush public ad caches on create, update, delete, restore, activation, and expiry.
- Never load desktop creative on mobile when a mobile asset exists.
- Always include intrinsic creative dimensions to avoid CLS.
- Keep tracking fire-and-forget and non-blocking.

## Todo

### Phase 1: Backend Public Slot Contract

- [x] Add `ad_slots` table with seeded section codes and dimensions.
- [x] Add canonical advertisement fields: `slot_code`, `target_url`, `alt_text`, asset dimensions.
- [x] Backfill existing advertisements from `ad_slot_number` and `ad_client_link`.
- [x] Add public `AdvertisementPublicResource`.
- [x] Add batch and single-slot public endpoints.
- [x] Keep current `/active` endpoint compatible.
- [x] Add body-based compatibility tracking endpoints if needed.
- [x] Add feature tests for batch slot fetch and tracking.

### Phase 2: Admin Management UX/API

- [x] Add admin endpoint or metadata response for available slots.
- [x] Change frontend admin form from free-text slot number to slot selector.
- [x] Require desktop and mobile creatives for active ads.
- [x] Add `alt_text`, `target_url`, and priority controls.
- [x] Store and show creative dimensions.
- [x] Add desktop/mobile preview states.
- [x] Validate schedule conflicts for the same slot.

### Phase 3: Frontend Public Rendering

- [x] Update public ad schemas to the new API shape.
- [x] Replace `window.innerWidth` asset selection with `<picture>`.
- [x] Implement viewability-based impression tracking.
- [x] Use `sendBeacon`/keepalive tracking.
- [x] Replace landing static banners with dynamic slots.
- [x] Replace article, passport, and calendar static placeholders with dynamic slots.
- [x] Batch fetch landing slots.

### Phase 4: Quality And Performance

- [x] Add backend feature tests for slot selection, publish requirements, conflicts, and tracking dedupe.
- [x] Add frontend tests for schema parsing and dynamic ad rendering.
- [ ] Run backend API tests. Blocked locally because the configured MySQL host `mysql` is unavailable.
- [x] Run frontend typecheck/build.
- [x] Verify rendering in browser on desktop.
- [x] Verify rendering in browser on mobile.
- [x] Check no layout shift from ad loading by reserving slot aspect ratios from creative dimensions.

### Phase 5: Cleanup

- [ ] Migrate old records fully to `slot_code`.
- [x] Remove old frontend `/placement` assumptions from dynamic public rendering while keeping compatibility helpers.
- [ ] Deprecate or remove legacy `ad_slot_number` once admin and records are migrated.
- [ ] Document creative size requirements for admins.
