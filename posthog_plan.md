# PostHog Analytics Rollout Plan

## Overview

Goal: ship a privacy-conscious, phased PostHog implementation for Passport.ET that captures product usage, powers growth experiments, surfaces qualitative feedback, and monitors reliability.

Key principles:

- **Data minimization:** mask PII (passport numbers, personal identifiers) at source, strip query parameters containing sensitive values, and sample session replay conservatively.
- **Structured nomenclature:** snake_case event names, kebab-case property keys, ISO timestamps, and enumerated values for filters.
- **Environment hygiene:** separate PostHog projects (production, staging, local) and use release tags for version tracking.

## Phase 0 – Baseline Readiness

**Objective:** ensure technical foundations, privacy guardrails, and consistent instrumentation practices before custom tracking.

**Todos:**

1. Confirm PostHog provider integration in `src/main.tsx` and verify API key/host via console logs in development.
2. Create `src/shared/lib/analytics.ts` exporting typed helpers: `capture`, `identify`, `group`, `setFeatureFlag`, `reset`. Wrap PostHog client to fall back gracefully when unavailable.
3. Define event/property naming conventions and share internal doc (e.g., Notion page) for the team.
4. Configure autocapture defaults in PostHog UI; disable capture on elements with `data-ph-no-capture` and mask sensitive selectors (`input[name='passportNumber']`).
5. Enable session replay with sampling: 0% for unauthenticated routes containing PII capture forms, 20% for authenticated users; mask all text inputs by default.
6. Instrument global error boundary to call `capture('frontend_error', { type, message, stack_hash, route })` after deduplication.
7. Implement environment tagging (`capture` with `$process` property) and release version tagging (`posthog.group('release', { version })`).

**Success criteria:** helper utilities merged, privacy masking verified, baseline data flowing without PII, agreed naming conventions.

## Phase 1 – Core Product Instrumentation

**Objective:** cover core funnels and product usage required to measure value delivery and conversion.

**Todos:**

1. Hook TanStack Router navigation changes to call `capture('$pageview', { route_name, search_params_masked })` with canonical route names (e.g., `/status`, `/locations/[slug]`).
2. On successful authentication or profile enrichment, call `identify(userId, { account_type, preferred_language, created_at, device_class })`.
3. Instrument mission-critical events:
   - `passport_status_search_started` with properties `{ method: 'by-passport-number' | 'by-appointment', country_code, network_status }`.
   - `passport_status_result_success` with `{ latency_ms, result_type: 'ready' | 'processing' | 'missing', retries }`.
   - `passport_status_result_error` with `{ error_code, latency_ms, retryable: boolean }`.
   - `location_page_view` with `{ location_id, has_appointment_link }`.
   - `cta_click_track_passport` with `{ surface: 'hero' | 'sidebar' | 'footer', variant }`.
   - `share_status_link` with `{ channel: 'whatsapp' | 'telegram' | 'copy', result_type }`.
4. Capture onboarding funnel steps: landing impression, search initiation, result success. Configure PostHog funnel insight measuring conversion and time-to-convert.
5. Add computed properties (PostHog Property Definitions) for `is_returning_user`, `has_saved_searches`, and `search_frequency_bucket`.
6. Create dashboard “Core Product Health” summarizing: funnel conversion, success/error ratio, median latency, top locations viewed, search volume by method.

**Success criteria:** dashboards show stable data, funnel conversion visible, key events validated via QA session.

## Phase 2 – Behavioral Insights & Quality Monitoring

**Objective:** observe user behavior, diagnose friction, and monitor product reliability.

**Todos:**

1. Finalize session replay targeting rules: enable for search results and location detail pages; scrub DOM nodes with `.sensitive` class; exclude staff IP ranges.
2. Extend error capture pipeline to include `window.onunhandledrejection` and network failures (fetch wrappers) with normalized payload shape.
3. Track feature usage and depth:
   - `saved_search_created`, `saved_search_triggered`.
   - `location_contact_link_click`, `location_slot_alert_enabled`.
   - `faq_article_view`, `support_request_initiated`.
4. Configure retention report: returning searchers (event `passport_status_result_success`) over 7/30-day windows segmented by region.
5. Create PostHog dashboard “Quality & Reliability”: error rate, empty-result frequency, average retries per session, replay sample list.
6. Set up anomaly detection alerts for spikes in `passport_status_result_error` and drops in funnel conversion via PostHog alerts to Slack.
7. Schedule weekly QA review of session replays tagged with `result_type = 'missing'` to identify UX issues.

**Success criteria:** alerts functioning, retention trending, replay review cadence established, reliability metrics monitored.

## Phase 3 – Growth, Feedback, Experimentation

**Objective:** leverage PostHog surveys, feature flags, and experiments to drive adoption and iterate safely.

**Todos:**

1. Implement PostHog Surveys:
   - CSAT modal after `passport_status_result_success` with targeting `session_count > 1`.
   - NPS survey delivered via in-app banner for users with `search_frequency_bucket = '5+'`.
   - Exit survey triggered on repeated `passport_status_result_error` events within a session.
2. Integrate feature flags via the analytics helper: e.g., `feature:guidance-wizard` controlling alternate guidance flow; ensure fallback UI when flags are offline.
3. Run experiments using PostHog experiments API: define primary metric (conversion to successful result), guardrails (error rate), and auto-stop rules.
4. Build dashboards for growth initiatives: referral/share performance, survey response summaries, experiment lift.
5. Automate weekly email reports from PostHog with key KPIs to product and operations stakeholders.
6. Add data QA workflows: heartbeat event `analytics_heartbeat` every 6 hours, schema validations ensuring required properties exist, and alerting when data volume drops >20%.
7. Document playbooks for launching new feature flags or surveys, ensuring compliance reviews and translation coverage.

**Success criteria:** surveys collecting feedback, experiments running with clear metrics, automated reporting in place, growth KPIs improving.

## Cross-Phase Considerations

- **Data governance:** periodic audits for PII leakage, maintain data retention policies consistent with local regulations.
- **Testing:** add Cypress/Vitest utilities mocking PostHog client to verify instrumentation in CI.
- **Performance:** lazy-load PostHog snippets on slow connections; use `posthog.load()` post-interaction when possible.
- **Collaboration:** set up shared Slack channel with PostHog alerts, maintain backlog of instrumentation gaps.

## Next Steps Checklist

- [ ] Review plan with product, design, and compliance stakeholders.
- [ ] Prioritize Phase 0 tasks in upcoming sprint.
- [ ] Assign ownership for dashboards, QA reviews, and survey content.
- [ ] Schedule implementation milestones and link to project tracker.
