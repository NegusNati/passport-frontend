# Passport Task Log

## Phase 1 – Discovery
- [x] Read `PassportsPage`, `PassportsTable`, and `PassportsQuery` to understand current search and query flow.
- [x] Locate the existing empty-state copy inside `DataTable` and confirm when it renders.
- [x] Finalize the trigger rules for showing the “no passport” toast (after a completed fetch with zero results when the user applied any search or filter).

## Phase 2 – Implementation
- [x] Add a toast notification when a search (or filtered view) returns zero passports.
- [x] Update the table’s empty-state message to say the passport is not ready and to check back tomorrow.
- [x] Adjust query/helper plumbing if needed to support the new UX (none required after review).

## Phase 3 – Verification
- [x] Manually verify the zero-results path and general table rendering still works (logic review; no automated tests run).
- [x] Summarize the work and remaining follow-ups (if any).

Notes: No automated tests were executed for this change.

Additional tweak: Updated empty-state and toast copy with a sad emoji and clearer guidance so users understand their passport isn’t ready yet but should be soon.

## Phase 4 – Default Search Mode Update
- [x] Switch default search mode to “name” in `PassportsPage` and `PassportSearchForm` so users start with name search.
- [x] Verify toggling still works and UI hints align with the new default (logic review; not manually tested).
