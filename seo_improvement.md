# SEO Improvement Plan

## Phase 1: Technical Setup & Canonicalization
- [x] **Internal Link Audit:** Search for hardcoded `http://` or `www` links in the codebase and replace them with `https://` or relative paths.
- [x] **Canonical Tag Verification:** Ensure the `<Seo>` component is correctly used in all public pages with the proper `path` prop to generate self-referencing canonical tags.
- [x] **Robots.txt & Sitemap Link:** Ensure `robots.txt` points to the sitemap (checked in script, but verify existence).

## Phase 2: Content & Metadata Optimization (The "12 Pages" Fix)
Iterate through key public pages to ensure unique H1s, proper titles, and meta descriptions.

### Pages to Audit:
1.  **Home (`/`)**
    - [x] Add/Verify `H1`.
    - [x] Fix Title length (50-60 chars).
    - [x] Add/Verify Meta Description (150-160 chars).
    - [x] Ensure `<Seo>` has `path="/"`.
2.  **Calendar (`/calendar`)**
    - [x] Add/Verify `H1`.
    - [x] Fix Title & Description.
    - [x] Ensure `<Seo>` has `path="/calendar"`.
3.  **Articles Index (`/articles`)**
    - [x] Add/Verify `H1`.
    - [x] Fix Title & Description.
    - [x] Ensure `<Seo>` has `path="/articles"`.
4.  **Passports Index (`/passports`)**
    - [x] Add/Verify `H1`.
    - [x] Fix Title & Description.
    - [x] Ensure `<Seo>` has `path="/passports"`.
5.  **Locations Index (`/locations`)**
    - [x] Add/Verify `H1`.
    - [x] Fix Title & Description.
    - [x] Ensure `<Seo>` has `path="/locations"`.
6.  **Login (`/login`)**
    - [x] Add `H1`.
    - [x] Fix Title & Description.
    - [x] Ensure `<Seo>` has `path="/login"`.
7.  **Register (`/register`)**
    - [x] Add `H1`.
    - [x] Fix Title & Description.
    - [x] Ensure `<Seo>` has `path="/register"`.
8.  **Dynamic Article Pages (`/articles/$slug`)**
    - [x] Ensure dynamic H1 generation.
    - [x] Ensure dynamic Title/Description in `<Seo>`.
9.  **Dynamic Location Pages (`/locations/$slug`)**
    - [x] Ensure dynamic H1 generation.
    - [x] Ensure dynamic Title/Description in `<Seo>`.

## Phase 3: Sitemap Fixes
- [x] **Update `scripts/generate-sitemap.ts`:**
    - [x] Add function to fetch Articles from API.
    - [x] Add Articles to the sitemap XML generation.
    - [x] Verify `locations` fetching is working.
- [x] **Verify Sitemap Output:** Run the script and check `dist/sitemap.xml` content.

## Phase 4: Verification
- [x] Run build and typecheck.
- [ ] (User Action) Re-run Ahrefs audit or check source code manually.
