# Theming Rollout Plan (Teal Light/Dark)

Goal: make every page and component use shadcn-style tokens from `src/styles.css` instead of ad-hoc colors; visually match the provided light/dark references (teal accent, soft backgrounds, strong contrast, consistent borders).

We will proceed in phases. Each phase has concrete TODOs with file paths. After each phase, we do a quick visual sweep and a11y checks.

## Principles (confirmed against styles.css)

- Use only semantic tokens from styles.css via Tailwind tokens: `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `text-muted-foreground`, `border-border`, `ring-ring`, `bg-accent`, `text-accent-foreground`, `bg-primary`, `text-primary-foreground`.
- Prefer shadcn/ui components; avoid raw Tailwind color scales (e.g., `text-slate-700`).
- No hardcoded hex/rgb/hsl in TSX/JSX unless reading CSS vars: `hsl(var(--...))`.
- Respect dark mode; never set absolute whites/blacks for surfaces or text.
- Focus styles should use `ring-ring ring-offset-background`.

Token inventory (from styles.css)

- Brand primary
  - Light: `--primary: 160 100% 30%` (≈ #009966)
  - Dark: `--primary: 152 57% 59%` (≈ #5ad29b)
- Ring
  - Light: `--ring: 240 5% 64.9%` (neutral) — optional TODO to align to teal (see Phase 0 below)
  - Dark: `--ring: 152 57% 59%` (teal-aligned)
- Full teal scale available (light/dark + P3): `--teal-1 … --teal-12`, and alpha `--teal-a1 … --teal-a12` for gradients/tints.
- Standard shadcn tokens already present: background/foreground, card, popover, muted, border, input, accent.

## Phase 0 — Baseline and guardrails

- [x] Styles: Teal brand + ring added in `src/styles.css` (done)
- [ ] Optional: Align light `--ring` to teal for consistent focus states (suggest `--ring: 160 100% 35%`).
- [ ] Add eslint rule to flag color literals in JSX (optional, follow-up)
- [ ] Add stylelint rule to flag hex/rgb/hsl in CSS (optional)

## Phase 1 — App shell and global chrome

Checklist

- [ ] `src/app/layout/AdminShell.tsx`: ensure container surfaces use `bg-background` and panels `bg-card` + `border-border`.
- [ ] `src/app/layout/Header.tsx`: replace any brand blues/greens with `text-foreground` / `text-muted-foreground`; buttons use `variant="default"` (`bg-primary`). Add subtle divider using `border-border`.
- [ ] `src/app/layout/Footer.tsx`: remove Framer Motion color hexes and Tailwind brand blues; map to tokens. Replace `hover:text-blue-800` with `hover:text-foreground` and use `text-muted-foreground` default. Update motion hover `color` to `var(--color-primary)`.
  - Example: `whileHover={{ x: 5, color: 'hsl(var(--primary))' }}`.

References flagged by scan

- `src/app/layout/Footer.tsx`:
  - `hover:text-blue-800`
  - `whileHover={{ x: 5, color: '#16a34a' }}`
  - `whileHover={{ x: 5, color: '#ca8a04' }}`

## Phase 2 — Shared primitives and utilities

Checklist

- [ ] `src/shared/components/theme-toggle.tsx`: replace `bg-white text-neutral-900 border-neutral-300` with shadcn Button/ghost variant or tokens: `bg-card text-card-foreground border-border`.
- [ ] `src/shared/ui/*` primitives (Button/Input/Card already likely tokenized via shadcn). Verify their classes only reference tokens.
- [ ] `index.html` and `public/manifest.json`: set `<meta name="theme-color">` to `hsl(var(--background))` (or server-injected) and `background_color` to `#ffffff` (ok as a fallback). Prefer dynamic if SSR later.

Flags

- `index.html`: `<meta name="theme-color" content="#000000" />` → replace.
- `public/manifest.json`: `theme_color` `#000000` and `background_color` `#ffffff` → align to design.

## Phase 3 — Feature pages (public)

Articles

- [ ] `src/features/articles/components/ArticlesPage.tsx`:
  - Wrap hero/filter bands in a soft tint using either `bg-muted` or a custom teal gradient utility (see code block below).
  - Confirm counts, badges, and skeletons use tokens; remove slate/neutral classes.
- [ ] `src/features/articles/components/ArticleCard.tsx`:
  - Background: `bg-card` + `text-card-foreground` (already present).
  - Remove default gray badges; ensure tags use `variant="outline"` (keeps tokens).
- [ ] `src/routes/articles/$slug.tsx`:
  - Ensure aside uses `bg-card` `border-border` (done) and text tokens.

Landing

- [ ] `src/features/landing/components/Hero.tsx`: replace any slate/gray text with `text-foreground`/`text-muted-foreground`; CTA Button as `variant="default"`.

Calendar

- [ ] `src/features/calendar/components/CalendarPage.tsx` (many instances):
  - Replace: `bg-white` → `bg-card`; `text-neutral-900` → `text-foreground`;
  - `text-neutral-400/500/600/700` → `text-muted-foreground` (or step via `opacity-` if needed).
  - `border-neutral-200` → `border-border`; `bg-neutral-50` → `bg-muted`.

## Phase 4 — Admin: tables and badges

- [ ] `src/features/admin/users/components/UsersTable.tsx`:
  - Replace status/verified badge backgrounds: emerald/slate utilities → tokenized Badge variants (`secondary`/`outline`) or `bg-accent text-accent-foreground`.
- [ ] `src/features/admin/articles/components/ArticlesTable.tsx`:
  - Replace badge map: `draft: 'bg-slate-200 text-slate-700'`, `published: 'bg-emerald-100 text-emerald-700'`, `archived: 'bg-gray-200 text-gray-600'` → shadcn `Badge` variants or token utilities.

## Phase 5 — Assets and vectors

- [ ] `src/logo.svg` and other SVG fills (`#9ae7fc`, `#61dafb`, etc.) → swap to `fill="currentColor"` and drive color from CSS (`text-primary` where needed).
- [ ] `src/assets/landingImages/*.svg` with embedded fills (e.g., app/play store) — leave brand assets as-is, but any UI decorative fills should move to tokens.

## Phase 6 — Polish & QA

- [ ] Run a repo-wide scan for hardcoded colors and Tailwind palette classes and resolve remaining instances.
- [ ] Contrast: verify AA on `muted` text against backgrounds; adjust tokens if needed.
- [ ] Motion/hover states should not rely on raw color values; prefer `group-hover:text-foreground` or `text-primary`.

---

## Mapping Cheat Sheet

- `bg-white` → `bg-card` (for panels) or `bg-background` (for page surfaces)
- `text-black`/`text-neutral-900` → `text-foreground`
- `text-neutral-500/600` → `text-muted-foreground`
- `border-neutral-200`/`border-slate-200` → `border-border`
- Brand actions (old green/blue classes) → `bg-primary text-primary-foreground`
- Subtle backgrounds → `bg-muted`
- Focus ring → `ring-ring ring-offset-background`

Optional teal tints (from variables)

- Section tint (hero):

```css
.teal-hero { background: linear-gradient(to bottom, hsl(var(--teal-2)) 0%, transparent 60%); }
```

- Accent panel:

```css
.panel-accent { background-color: hsl(var(--teal-1)); border: 1px solid hsl(var(--border)); }
```

## Concrete TODOs (from scan)

- [ ] index.html:7 `<meta name="theme-color" content="#000000" />`
- [ ] public/manifest.json: `theme_color` `#000000`, `background_color` `#ffffff`
- [ ] src/app/layout/Footer.tsx: `hover:text-blue-800`; framer `color: '#16a34a'` and `'#ca8a04'`
- [ ] src/shared/components/theme-toggle.tsx: `bg-white text-neutral-900 border-neutral-300`
- [ ] src/features/calendar/components/CalendarPage.tsx: numerous `bg-white`, `text-neutral-*`, `border-neutral-200`, `bg-neutral-50`
- [ ] src/features/admin/users/components/UsersTable.tsx: badge bg/text colors (`emerald-100/700`, `slate-100/600`)
- [ ] src/features/admin/articles/components/ArticlesTable.tsx: status color classes (`slate-200`, `emerald-100/700`, `gray-200/600`)
- [ ] src/logo.svg: hex fills → `currentColor` (if used as UI element)

Additions after review

- [ ] Replace any usage of `text-blue-*`, `text-emerald-*`, `bg-slate-*` in:
  - `src/app/layout/Header.tsx`, `src/app/layout/AdminShell.tsx`
  - `src/features/landing/components/Hero.tsx`
  - `src/features/articles/components/*` (ensure all text/badge colors come from tokens)
  - `src/features/admin/**/*Table*.tsx` (badges and table headers)


---

## Implementation Notes

1) Prefer component-level refactors over scattering utility replacements. E.g., a `StatusBadge` that maps domain status → shadcn `Badge` variant.
2) For large tables, keep contrast high; use `text-muted-foreground` for secondary cells and `text-foreground` for primary columns.
3) If a brand-tinted section is desired (like the Radix screenshot hero), add a utility class:

```css
.teal-hero {
  background: linear-gradient(to bottom, hsl(var(--teal-2)) 0%, transparent 60%);
}
```

Then apply on page wrappers or headers.

4) For icons/SVG, drive color with `text-*` tokens; avoid inline `fill="#..."`.

5) After each phase, run:

```bash
pnpm -s typecheck && pnpm -s build && pnpm -s preview
```

and visually verify light/dark with the ThemeToggle.
