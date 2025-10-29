# Performance Improvement Log

Track changes, metrics, and impact after each optimization task.

## Format

Each entry captures before/after metrics to demonstrate progress toward our North Star targets.

| Date       | Phase   | Task             | LCP         | FCP         | TBT           | INP           | CLS         | PSI Mobile | Notes         |
| ---------- | ------- | ---------------- | ----------- | ----------- | ------------- | ------------- | ----------- | ---------- | ------------- |
| YYYY-MM-DD | Phase N | Task description | X.Xs → Y.Ys | X.Xs → Y.Ys | XXXms → YYYms | XXXms → YYYms | X.XX → Y.YY | XX → YY    | Brief summary |

## Legend

- **LCP** - Largest Contentful Paint (target: ≤2.5s)
- **FCP** - First Contentful Paint (target: ≤1.8s)
- **TBT** - Total Blocking Time (target: ≤150ms)
- **INP** - Interaction to Next Paint (target: ≤200ms)
- **CLS** - Cumulative Layout Shift (target: ≤0.1)
- **PSI Mobile** - PageSpeed Insights mobile score (target: ≥90)

## Entries

### Phase 0 - Baseline & Observability

| Date       | Phase   | Task                       | LCP   | FCP  | TBT   | INP | CLS | PSI Mobile | Notes                                       |
| ---------- | ------- | -------------------------- | ----- | ---- | ----- | --- | --- | ---------- | ------------------------------------------- |
| 2025-10-29 | Phase 0 | Baseline capture           | 15.5s | 5-9s | 350ms | ?   | ?   | <50        | Initial state, no optimizations yet         |
| 2025-10-29 | Phase 0 | Wire Web Vitals to PostHog | 17.4s    | 5.5s | 750ms   | -   | -   | -          | RUM enabled, no performance change expected |

### Phase 1 - Critical Rendering Path

| Date       | Phase   | Task                                    | LCP            | FCP            | TBT           | INP | CLS     | PSI Mobile | Notes                                                                                    |
| ---------- | ------- | --------------------------------------- | -------------- | -------------- | ------------- | --- | ------- | ---------- | ---------------------------------------------------------------------------------------- |
| 2025-10-30 | Phase 1 | Initial optimizations (broken preload)  | 17.4s → 24.8s  | 5.5s → 11.7s   | 750ms → 220ms | -   | ? → 0   | -          | ❌ Regression! Broken image preload path blocked rendering. TBT improved 70%, CLS fixed. |
| 2025-10-30 | Phase 1 | Fix: Remove broken image preload        | Awaiting test  | Awaiting test  | Should stay   | -   | Stay 0  | -          | Removed /src/assets path that doesn't exist in production build                          |


### Phase 2 - JavaScript & CSS Budget

_(Entries will be added as Phase 2 tasks complete)_

### Phase 3 - Asset Delivery & Caching

_(Entries will be added as Phase 3 tasks complete)_

### Phase 4 - Interactivity & Third Parties

_(Entries will be added as Phase 4 tasks complete)_

### Phase 5 - Regression Monitoring

_(Entries will be added as Phase 5 tasks complete)_
