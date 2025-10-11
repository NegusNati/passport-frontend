# Admin Dashboard Plan (Feature-Based)

This plan introduces an admin dashboard built with shadcn/ui, TanStack Router, TanStack Query, Zod, and TanStack Form. It follows the feature-first folder structure described in AGENTS.md and integrates tightly with the existing auth stack, table primitives, and newly supplied API contracts for articles and PDF ingestion.

---

## Goals

- Role-gated admin area under `/admin` with responsive shell (sidebar + header + content).
- Sub-features: User Management, Passports Admin, Articles Admin, and PDF-to-SQLite ingestion.
- Reuse DataTable, Input/Button primitives, and existing query patterns.
- Strong validation (Zod) and predictable state (React Query) with optimistic UX where safe.
- Clean route loaders/guards that enforce authentication, admin status, and ability gates.

---

## Architecture & Folders

```
src/
  features/
    admin/
      layout/
        AdminShell.tsx            # Sidebar + header + Outlet
        Sidebar.tsx               # Nav items, active state, responsive
        Header.tsx                # Title/breadcrumbs, user menu
      lib/
        guards.ts                 # isAdmin check + helpers
        keys.ts                   # Query keys (admin namespace)
      routes/
        index.route.tsx           # /admin home (overview)
        users.route.tsx           # /admin/users (list)
        users.$id.route.tsx       # /admin/users/$id (detail/edit)
        passports.route.tsx       # /admin/passports (list)
        passports.new.route.tsx   # /admin/passports/new (create)
        articles.route.tsx        # /admin/articles (list)
        articles.new.route.tsx    # /admin/articles/new (create)
        articles.$slug.route.tsx  # /admin/articles/$slug (edit)
        pdf-import.route.tsx      # /admin/pdf-import (upload helper)
      users/
        api/
          get-users.ts
          get-user.ts
          update-user.ts
          create-user.ts
        schemas/
          user.ts
          filters.ts
        components/
          UsersTable.tsx
          UserForm.tsx
      passports/
        api/
          get-passports.ts
          create-passport.ts
          update-passport.ts
        schemas/
          passport.ts
          create.ts
        components/
          PassportsAdminTable.tsx
          PassportCreateForm.tsx
      articles/
        api/
          get-articles.ts
          get-article.ts
          create-article.ts
          update-article.ts
          delete-article.ts
        schemas/
          article.ts
          filters.ts
          create.ts
        components/
          ArticlesTable.tsx
          ArticleFilters.tsx
          ArticleForm.tsx
      pdf-import/
        api/
          get-info.ts
          upload.ts
        schemas/
          upload.ts
        components/
          PdfImportPanel.tsx
          PdfUploadForm.tsx
```

Notes

- Each sub-feature owns schemas/api/components; routes simply orchestrate and prefetch data.
- Keep loaders thin: prefetch + redirect; avoid embedding heavy UI logic.

---

## Phase 0 – Prep & Decisions

Todos

- Confirm backend role info on `/api/v1/auth/me` (`role`, `is_admin`) and available abilities (`can:manage-articles`, `can:upload-files`).
- Catalog admin API endpoints and expected pagination param names (`page_size`, `per_page`, `limit`).
- Compile design tokens for admin shell (spacing, sidebar width, header height) via Tailwind config/utilities.
- Decide ability constants for articles/PDF import and expose helper in `guards.ts` if needed.

Deliverables

- `src/features/admin/lib/guards.ts` implementing `ensureAdmin`.
- `src/features/admin/lib/keys.ts` with helpers for users, passports, articles.
- Documented abilities (constants or enum) for downstream use.

---

## Phase 1 – Routing & Guards

Todos

- Create `/admin` root route loader:
  - `ensureQueryData(['auth','user'], fetchMe)`.
  - Guard by admin status (from Phase 0 helper).
  - On 401 → redirect `/login?redirect=/admin`.
  - On non-admin → redirect `/` or render 403 component.
- Register file routes:
  - `/admin`, `/admin/users`, `/admin/users/$id`.
  - `/admin/passports`, `/admin/passports/new`.
  - `/admin/articles`, `/admin/articles/new`, `/admin/articles/$slug`.
  - `/admin/pdf-import`.
- Each route sets `<Seo noindex />`.
- Provide `RouterContext` `loaderData` type augmentation for admin user if needed.

Deliverables

- Route files with guards and lazy components.
- Optional shared `Forbidden` component for non-admin fallback.

QA

- Unauth user → `/login?redirect=/admin`.
- Auth non-admin → redirected/403.
- Admin sees dashboard without flash.

---

## Phase 2 – Admin Shell (Layout)

Todos

- Build `AdminShell.tsx` with responsive sidebar + header and `<Outlet />`.
- `Sidebar.tsx` using shadcn Navigation primitives:
  - Sections: Overview, Users, Passports, Articles, PDF Import (placeholder for Settings later).
  - Active link state via TanStack `Link`.
- `Header.tsx` with page title slot, breadcrumb placeholder, theme toggle, user menu.
- Mobile nav: burger opens overlay; ESC closes; focus trap ensures accessibility.
- Add `AdminShell` provider (if we need context for collapsed state) under `features/admin/layout`.

Deliverables

- Layout components with tests for focus/ARIA (optional).

QA

- Keyboard navigation works; sidebar toggle is accessible.
- Focus rings visible; screen reader labels present.
- Layout responsive ≥320px.

---

## Phase 3 – Users (List + Edit)

Todos

- Schemas
  - `users/schemas/user.ts`: extend public user with role/status fields.
  - `users/schemas/filters.ts`: Zod parser for search, role, status, pagination, sort.
- API wrappers
  - `get-users.ts`: `GET /api/v1/admin/users` with hashed params.
  - `get-user.ts`: `GET /api/v1/admin/users/:id`.
  - `update-user.ts`: `PATCH /api/v1/admin/users/:id` (role/status toggles).
  - `create-user.ts`: optional (if backend supports create user).
- Components
  - `UsersTable.tsx`: DataTable with server pagination, filters, bulk actions placeholder.
  - `UserForm.tsx`: TanStack Form + Zod for editing role/status; surfaces 422 errors.
- Routes
  - `/admin/users`: loader prefetch list; component renders `UsersTable` with filters bound to URL via `validateSearch`.
  - `/admin/users/$id`: loader prefetch detail; component renders `UserForm`.
- Cache invalidations using `adminKeys.users` helpers.

QA

- Page size change updates rows; skeleton matches selection during refetch.
- Editing role updates list/detail caches and shows toast.
- Filters persist via URL; disallowed edits show errors gracefully.

---

## Phase 4 – Passports Admin (Create + List)

Todos

- Schemas
  - `passports/schemas/create.ts`: form validation (request_number, names, location, publish date).
- API wrappers
  - `get-passports.ts`: `GET /api/v1/admin/passports` with hashed params (reuse existing when possible).
  - `create-passport.ts`: `POST /api/v1/admin/passports`.
  - `update-passport.ts`: optional patch.
- Components
  - `PassportsAdminTable.tsx`: extends existing passports table with admin columns/actions.
  - `PassportCreateForm.tsx`: creation form with success redirect.
- Routes
  - `/admin/passports`: list with filters.
  - `/admin/passports/new`: create form route.

QA

- Creating passport adds row (invalidate list).
- Validation errors surface inline with hints from backend 422 payload.
- Page size change updates row count & summary.

---

## Phase 5 – Articles Admin (CRUD + Filters)

Todos

- Schemas
  - `articles/schemas/article.ts`: Article resource for admin (full payload per API guide).
  - `articles/schemas/filters.ts`: list filter schema (q, title, category, tag, status, author_id, date range, per_page/page/sort).
  - `articles/schemas/create.ts`: create/update payload validation (title/status required, optional arrays, ISO datetimes).
- API wrappers (require `manage-articles` ability)
  - `get-articles.ts`: `GET /api/v1/admin/articles` supporting pagination + limit.
  - `get-article.ts`: `GET /api/v1/admin/articles/:slug`.
  - `create-article.ts`: POST create.
  - `update-article.ts`: PATCH partial update.
  - `delete-article.ts`: DELETE slug.
- Components
  - `ArticlesTable.tsx`: server-driven DataTable with filters, status badges, actions (Edit/Delete).
  - `ArticleFilters.tsx`: filter form (search input, selects for status, category, tag, author; date pickers).
  - `ArticleForm.tsx`: TanStack Form + Zod for create/update; handles slug preview, metadata, tags/categories (chips or multi-select).
- Routes
  - `/admin/articles`: loader prefetch list; component renders table + filters bound to search params.
  - `/admin/articles/new`: create form route.
  - `/admin/articles/$slug`: edit route prefetching detail.
- Cache invalidations using `adminKeys.articles`.
- Error handling for 429 with Retry-After (show cooldown message).

QA

- Filters update URL and trigger new fetch.
- Create/update flows show success toasts and redirect appropriately.
- Delete prompts confirmation and removes row; handles 403/404 gracefully.
- Form enforces required fields and surfaces backend 422 bag.

---

## Phase 6 – PDF Import Flow

Todos

- Schema `pdf-import/schemas/upload.ts` (file, date, location, linesToSkip) with client size guard (<=10MB where possible).
- API wrappers (require `upload-files` ability)
  - `get-info.ts`: GET helper endpoint (show constraints).
  - `upload.ts`: POST multipart upload, returning 202 Accepted payload.
- Components
  - `PdfImportPanel.tsx`: renders helper message from GET endpoint.
  - `PdfUploadForm.tsx`: TanStack Form + file input using shadcn components, submission states (idle/uploading/queued/success/error).
- Route `/admin/pdf-import`: loader prefetches info + ensures ability.
- Optional: stub status polling hook for future job tracking.

QA

- Form prevents >10MB uploads client-side, surfaces 422 errors inline.
- Successful upload shows 202 message and invalidates passports admin list.
- Spinner/progress indicator visible during upload; handles 429 gracefully.

---

## Phase 7 – Error & Loading UX

Todos

- Use `DataTableLoadingSkeleton` keyed to selected page size for all server-driven tables.
- Provide fallback `pendingComponent` or skeleton wrappers on admin routes.
- Centralize API error normalization (429 → display retry message with header; 401/403 → redirect or special UI).

QA

- Skeleton row counts match selected page size during refetch.
- 429 responses display friendly cooldown messaging using `Retry-After` header.
- No layout jank on slow connections.

---

## Phase 8 – Testing

Todos

- Unit tests: schemas (`safeParse`), hashParams helpers, guards (`isAdminUser`, ability checks).
- Integration tests: route loaders (redirect logic), table page-size behaviour, mutation invalidations.
- E2E (optional): admin login → create article → edit user role → upload PDF.

QA

- `pnpm test`, `pnpm typecheck`, `pnpm lint` all pass.
- Snapshot/RTL tests cover critical components where feasible.

---

## Phase 9 – Performance & A11y

Todos

- Consider virtualized rows for large tables (keep server pagination primary).
- Prefetch admin subroutes when sidebar items are hovered/focused.
- Ensure WCAG AA contrast, accessible names, focus order, and that animations respect `prefers-reduced-motion`.

QA

- Lighthouse a11y ≥ 95 for key admin pages.
- No layout shifts when toggling sidebar/hydrating data.

---

## Rollout

- Phase 0–2 behind `ADMIN_DASH_ENABLED` flag.
- Gate main header link to `/admin` for admin users only.
- Soft launch to internal admins; monitor logs (403, 429) and queue health.

---

## Open Questions / Backend Alignment

- Confirm role/ability data returned on `/api/v1/auth/me`.
- Verify admin endpoints and param naming (e.g., `page_size` vs `per_page`, `paginate`).
- Clarify article tag/category structures (IDs vs slugs) for updates.
- Determine whether PDF import needs status polling endpoint.

---

## QA Checklist (Global)

- Auth & Routing
  - [ ] `/admin` requires login; unauth redirects to `/login?redirect=/admin`.
  - [ ] Non-admins redirected or see 403 component.
  - [ ] All admin routes include `<Seo noindex />`.
  - [ ] Loaders use `ensureQueryData` without flashing unauthorized UI.
- Tables & Lists
  - [ ] Changing page size updates visible rows to match server `page_size`.
  - [ ] Skeleton row count matches selected page size during refetch.
- Users
  - [ ] List with filters & pagination works.
  - [ ] Editing role/status updates list/detail caches and shows feedback.
- Passports
  - [ ] Create form validates inputs, invalidates list on success.
  - [ ] Admin list respects filters and pagination.
- Articles
  - [ ] List filters (status, tag, category, author, date) map to URL and refetch.
  - [ ] Create/update forms enforce required fields, render backend 422 errors inline.
  - [ ] Delete prompts confirmation and removes row on success.
- PDF Import
  - [ ] Helper endpoint message renders; upload form enforces constraints.
  - [ ] Successful upload shows queued state and invalidates passport list.
- Errors & Rate Limiting
  - [ ] 401 → login redirect; 403 → 403 screen/redirect.
  - [ ] 429 → friendly cooldown with retry timer.
- A11y & UX
  - [ ] Sidebar keyboard trap works in mobile; ESC closes and focus returns to trigger.
  - [ ] All interactive elements have accessible names + focus rings.
- DX
  - [ ] `pnpm lint && pnpm typecheck && pnpm test` pass before shipping.

---

## Implementation Notes & Tips

- Keep server-driven pagination for admin tables; use hashed query keys to ensure refetch on filter/page changes.
- Prefer `validateSearch` with Zod for filter state to enable shareable URLs.
- Centralize ability strings (e.g., `MANAGE_ARTICLES`, `UPLOAD_FILES`) to avoid typos.
- Add confirmation dialogs for destructive actions (delete article, revoke user).
- Consider toast notifications for success/failure across admin forms.
