# AGENTS.md

> A practical guide for contributors (aka “agents”) working on this React app using **pnpm**, **TanStack Router**, **TanStack Query**, **Tailwind CSS**, **shadcn/ui**, **Zod**, and **Framer Motion**. The goal: **feature‑based**, **mobile‑first**, accessible, testable, and fast.

---

## 1) Principles

- **Feature-first:** Organize by feature, not by technology. Each feature owns its routes, UI, data access, schemas, and tests.
- **Types everywhere:** Trust Zod + TypeScript for runtime + compile-time safety. Parse inputs/outputs at the edges.
- **Server state via Query:** Cache, de-dupe, and keep server data in TanStack Query. Keep local UI state in components.
- **Mobile-first UI:** Build for small screens first; scale up with Tailwind responsive variants.
- **Progressive enhancement:** Work without JS where possible; handle slow networks gracefully.
- **Accessibility & motion:** Ship keyboard + screen-reader friendly UI; honor reduced motion preferences.
- **SEO-first:** Meet Core Web Vitals (LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms). Prefer SSR/SSG or prerender for key pages. Use semantic HTML and rich metadata.

---

## 2) Tech Stack

- **React + TypeScript** (strict mode)
- **TanStack Router** for file-like routing with code-splitting
- **TanStack Query** for data fetching/caching/invalidation
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** (Radix-based) for accessible components
- **Zod** for schema validation and inference
- **Framer Motion** for animations
- **Vite** (or similar) for dev/build
- **pnpm** as the package manager (workspaces optional)

**Node & Package Manager**

- Use the `.nvmrc` (or engines field) for Node version. Always run with **pnpm**.

---

## 3) Getting Started

```bash
pnpm i
pnpm dev
pnpm build
pnpm preview
```

**shadcn/ui** (example):

```bash
# initialize (if not already)
pnpm dlx shadcn-ui@latest init
# add a component
yes | pnpm dlx shadcn-ui@latest add button input form dialog
```

---

## 4) Folder Structure (Feature-Based)

```
src/
  app/
    router/               # TanStack Router tree (root + route registries)
      root.tsx
      routes.tsx          # central route registration (lazy imports)
    providers/            # App-level providers (QueryClientProvider, ThemeProvider, etc.)
    layout/               # Shell layout pieces (Header, Nav, Footer)
  shared/
    ui/                   # Reusable UI atoms/molecules (shadcn-wrapped)
    lib/                  # Utilities (fetch client, env, logger)
    hooks/                # Cross-feature hooks
    config/               # Tailwind tokens, constants, feature flags
    types/                # Global types
  features/
    <feature-name>/
      routes/             # Route files for this feature
        index.route.tsx   # Each route exports a TanStack Route object
        [id].route.tsx
      components/         # Feature-local components
      api/                # Query/mutation fns; API adapters
      schemas/            # Zod schemas for this feature
      hooks/              # Feature-specific hooks
      types.ts            # Feature-local types
      index.ts            # Barrel exports
  styles/
    globals.css           # Tailwind base/components/utilities imports
  main.tsx                # App entry
  vite-env.d.ts

public/
  ...
```

**Naming**

- Files: `kebab-case.ts`, components in `PascalCase.tsx`. Test files `*.test.ts(x)`.
- Route files end with `.route.tsx`.
- Query/mutation keys: `['feature', 'entity', params]`.

---

## 5) App Bootstrapping

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/app/router/routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
```

---

## 6) Routing (TanStack Router)

**Router setup**

```tsx
// src/app/router/root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/app/layout/AppShell'

export const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
})
```

```tsx
// src/app/router/routes.tsx
import { createRouter } from '@tanstack/react-router'
import { rootRoute } from './root'
import { routeTree } from './routeTree.gen' // if using file-based plugin, else compose manually

export const router = createRouter({ routeTree: routeTree ?? rootRoute })
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

**Feature route**

```tsx
// src/features/todos/routes/index.route.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { getTodos } from '../api/todos'

export const Route = createFileRoute('/todos')({
  validateSearch: z.object({ q: z.string().optional() }).parse,
  loader: async ({ context }) => {
    // optional: prefetch data using context.queryClient
    await context.queryClient.prefetchQuery({ queryKey: ['todos'], queryFn: getTodos })
  },
  component: TodosPage,
})

function TodosPage() {
  const { data } = useQuery({ queryKey: ['todos'], queryFn: getTodos })
  return <div className="container mx-auto p-4">{JSON.stringify(data)}</div>
}
```

**Params & search validation with Zod**

- Use `validateSearch` / `validateParams` to parse with Zod at the route boundary.
- Use `loader` for prefetching and redirects (auth), **never** for complex imperative UI logic.

---

## 7) Data Layer (TanStack Query + Fetch)

**HTTP client**

```ts
// src/shared/lib/http.ts
import { z } from 'zod'

export async function http<T>(
  input: RequestInfo,
  init?: RequestInit & { schema?: z.ZodSchema<T> },
) {
  const res = await fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as unknown
  return init?.schema ? init.schema.parse(data) : (data as T)
}
```

**Queries & Mutations**

```ts
// src/features/todos/schemas/todo.ts
import { z } from 'zod'
export const Todo = z.object({
  id: z.number(),
  title: z.string(),
  done: z.boolean().default(false),
})
export type Todo = z.infer<typeof Todo>
```

```ts
// src/features/todos/api/todos.ts
import { http } from '@/shared/lib/http'
import { z } from 'zod'
import { Todo } from '../schemas/todo'

export function getTodos() {
  return http('/api/todos', { schema: z.array(Todo) })
}

export function createTodo(input: Pick<Todo, 'title'>) {
  return http('/api/todos', { method: 'POST', body: JSON.stringify(input), schema: Todo })
}
```

```ts
// usage inside a component
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const qc = useQueryClient()
const { data } = useQuery({ queryKey: ['todos'], queryFn: getTodos })
const { mutate } = useMutation({
  mutationFn: createTodo,
  onSuccess: () => qc.invalidateQueries({ queryKey: ['todos'] }),
})
```

**Best practices**

- Co-locate queries/mutations with their feature.
- Use typed query keys: `as const` + small helpers if needed.
- Prefer **invalidations** over manual cache writes unless you have clear invariants.
- Tune `staleTime` and `gcTime` per feature where needed.

---

## 8) Styling (Tailwind + shadcn/ui)

- **Mobile-first:** Start unprefixed; add `sm: md: lg: xl:` progressively.
- **Layout:** Use `container`, `mx-auto`, `p-*`, and CSS Grid/Flex utilities. Cap width with `max-w-*`.
- **Design tokens:** Centralize colors, spacing, radius, and shadows via Tailwind config and CSS variables.
- **Components:** Prefer shadcn/ui primitives; extend via `className` and `variant` patterns, not custom forks.
- **Dark mode:** Use `class` strategy; wrap in `ThemeProvider` and toggle via data attributes.
- **State classes:** Use `data-[state=...]` (Radix) and `aria-*` selectors for accessible states.

**Example**

```tsx
import { Button } from '@/shared/ui/button'

export function CTA() {
  return (
    <section className="container mx-auto max-w-2xl p-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
      <p className="text-muted-foreground mt-2">Build fast, ship faster.</p>
      <Button className="mt-4">Get started</Button>
    </section>
  )
}
```

---

## 9) Animations (Framer Motion)

- Default to subtle **opacity/translate** transitions.
- Use **layout animations** cautiously; avoid jank by constraining parent layout.
- Respect `prefers-reduced-motion`:

```ts
// src/shared/lib/motion.ts
export const M = {
  duration: 0.18,
  ease: [0.2, 0.8, 0.2, 1],
}
```

```tsx
import { motion, useReducedMotion } from 'framer-motion'
import { M } from '@/shared/lib/motion'

export function Card({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: M.duration, ease: M.ease }}
      className="bg-background rounded-2xl p-4 shadow"
    >
      {children}
    </motion.div>
  )
}
```

---

## 10) Forms & Validation (Zod + TanStack Form)

- Validate **at the edges** (route params, search params, API responses, form submission payloads).
- Prefer **TanStack Form** for client forms. Use `@tanstack/react-form` with `@tanstack/zod-form-adapter` to plug Zod in.
- Show inline, accessible error messages; avoid modals for basic validation.
- Use shadcn/ui **primitives** (`<Label>`, `<Input>`, `<Button>`, etc.). The shadcn `Form` helpers target RHF—skip them and compose primitives directly with TanStack Form.

**Example schema**

```ts
// src/features/auth/schemas/login.ts
import { z } from 'zod'
export const Login = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
})
export type Login = z.infer<typeof Login>
```

**Login form with TanStack Form + Zod + shadcn/ui**

```tsx
// src/features/auth/components/LoginForm.tsx
import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { Login } from '../schemas/login'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

export function LoginForm({ onSubmit }: { onSubmit: (values: Login) => Promise<void> | void }) {
  const form = useForm({
    defaultValues: { email: '', password: '' } as Login,
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      noValidate
    >
      {/* Email */}
      <form.Field
        name="email"
        validators={{
          // Field-level: reuse Zod shape for immediate validation
          onChange: Login.shape.email,
        }}
      >
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={field.state.meta.errors.length > 0}
              aria-describedby="email-error"
            />
            {field.state.meta.errors[0] ? (
              <p id="email-error" className="text-destructive text-sm">
                {field.state.meta.errors[0]}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      {/* Password */}
      <form.Field name="password" validators={{ onChange: Login.shape.password }}>
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={field.state.meta.errors.length > 0}
              aria-describedby="password-error"
            />
            {field.state.meta.errors[0] ? (
              <p id="password-error" className="text-destructive text-sm">
                {field.state.meta.errors[0]}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) =>
          [state.canSubmit, state.isSubmitting, state.isSubmitted, state.submitError] as const
        }
      >
        {([canSubmit, isSubmitting, isSubmitted, submitError]) => (
          <div className="space-y-2">
            <Button type="submit" disabled={!canSubmit || isSubmitting} className="w-full">
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
            {submitError ? (
              <p className="text-destructive text-sm">{String(submitError)}</p>
            ) : isSubmitted ? (
              <p className="text-muted-foreground text-sm">Submitted.</p>
            ) : null}
          </div>
        )}
      </form.Subscribe>
    </form>
  )
}
```

**Integration with TanStack Query (submit)**

```tsx
// src/features/auth/routes/login.route.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { LoginForm } from '../components/LoginForm'
import { Login } from '../schemas/login'

async function loginApi(values: Login) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
  if (!res.ok) throw new Error('Invalid credentials')
}

export const Route = createFileRoute('/login')({
  component: () => {
    const mutation = useMutation({ mutationFn: loginApi })
    return (
      <div className="container mx-auto max-w-sm p-4">
        <LoginForm onSubmit={(values) => mutation.mutateAsync(values)} />
        {mutation.error ? (
          <p className="text-destructive mt-2 text-sm">{String(mutation.error)}</p>
        ) : null}
      </div>
    )
  },
})
```

**Best practices**

- Use **Zod shapes** at the field level (e.g., `Login.shape.email`) for immediate feedback; use the full form schema on submit.
- Keep server errors user-friendly; surface them below the submit button.
- Mark inputs with `aria-invalid` and connect errors via `aria-describedby`.
- Prefer `noValidate` on `<form>` to avoid native popups; rely on consistent, inline errors.
- For multi-step flows, keep a **single form instance** and gate steps by validation state.
- When file uploads are involved, validate **metadata** with Zod and stream the file; don’t read large files fully into memory on the client.

---

## 10.1) Rich Text Editing with Markdown Support

The app uses **Lexical** as the rich text editor with real-time **Markdown shortcuts** for enhanced authoring experience.

**Editor Component**

```tsx
import { LexicalEditor } from '@/shared/components/rich-text/LexicalEditor'

// In your form
;<LexicalEditor
  value={field.state.value ?? ''}
  onChange={(html) => field.handleChange(html)}
  placeholder="Write your content here..."
/>
```

**Markdown Shortcuts**

Authors can type Markdown syntax for instant formatting:

- **Headings**: `# `, `## `, `### ` (followed by space)
- **Bold**: `**text**` or `__text__`
- **Italic**: `*text*` or `_text_`
- **Inline code**: `` `code` ``
- **Strikethrough**: `~~text~~`
- **Lists**: `- ` or `* ` for bullets, `1. ` for numbered
- **Blockquote**: `> ` (followed by space)
- **Links**: `[text](url)`
- **Images**: `![alt text](url)`
- **Videos**: `[video](url)` (custom syntax)

**Toolbar Help**

The editor includes a help icon (?) in the toolbar that displays all available Markdown shortcuts. Users can click it to see a quick reference.

**Export/Import Utilities**

```ts
import {
  exportEditorStateAsMarkdown,
  importMarkdownToEditorState,
} from '@/shared/lib/lexical/markdown-utils'

// Export current content as Markdown
const markdown = exportEditorStateAsMarkdown(editor)

// Import Markdown content (replaces current content)
importMarkdownToEditorState(editor, markdownString)
```

**Custom Transformers**

The editor includes custom transformers for `ImageNode` and `VideoNode` to handle media in Markdown:

- Images use standard Markdown syntax: `![alt](url)`
- Videos use custom syntax: `[video](url)` (since Markdown has no native video support)

**Storage Format**

Content is stored as **sanitized HTML** (backward compatible). Markdown is a convenience layer for authoring; the editor:

1. Accepts HTML as input (existing articles work unchanged)
2. Enables Markdown shortcuts during editing
3. Outputs sanitized HTML on change

**Best Practices**

- The editor automatically sanitizes all content (both HTML and Markdown-derived)
- Custom media nodes (ImageNode, VideoNode) preserve dimensions and are responsive
- Markdown shortcuts work alongside toolbar buttons without conflicts
- Reduced motion preferences are respected for animations
- All formatting is keyboard accessible

---

## 11) Accessibility

- All interactive elements must be reachable and operable by keyboard.
- Provide visible focus states (Tailwind `focus:*`), and never remove outlines.
- Use semantic HTML and ARIA only when semantics aren’t available.
- Color contrast must meet WCAG AA.
- Announce route changes for screen readers when content meaningfully changes.

---

## 12) Error Handling

- Use Error Boundaries at layout and feature levels.
- Normalize API errors in `http()`; map to user-friendly messages.
- For queries, prefer `useSuspenseQuery` + route `pendingComponent` where appropriate; otherwise show lightweight skeletons.

---

## 13) Performance

- **Code-split** by route and large feature widgets (lazy imports).
- Prefetch data on hover/intent using Router + Query prefetch.
- Memoize heavy lists (`React.memo`) and use windowing for large collections.
- Images: `loading="lazy"`, responsive sizes, modern formats.

---

## 14) Environment & Config

- Read config from `import.meta.env` via a typed helper in `shared/lib/env.ts` parsed with Zod.
- No secrets in client builds.

```ts
// src/shared/lib/env.ts
import { z } from 'zod'

const Env = z.object({
  VITE_API_URL: z.string().url(),
})

export const env = Env.parse(import.meta.env)
```

---

## 15) Linting, Formatting, and Git

- ESLint + TypeScript rules (strict), Tailwind plugin, React hooks plugin.
- Prettier with Tailwind plugin (class sorting).
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, etc.
- Run `pnpm lint && pnpm typecheck && pnpm test` before pushing.

---

## 16) Example Feature Blueprint

```
features/
  profile/
    routes/
      index.route.tsx
    api/
      get-profile.ts
      update-profile.ts
    schemas/
      profile.ts
    components/
      ProfileCard.tsx
      ProfileForm.tsx
    hooks/
      useProfile.ts
    types.ts
    index.ts
```

```ts
// features/profile/schemas/profile.ts
import { z } from 'zod'
export const Profile = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().url().nullable(),
})
export type Profile = z.infer<typeof Profile>
```

```ts
// features/profile/api/get-profile.ts
import { http } from '@/shared/lib/http'
import { Profile } from '../schemas/profile'
export function getProfile() {
  return http('/api/me', { schema: Profile })
}
```

```tsx
// features/profile/routes/index.route.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '../api/get-profile'
import { ProfileCard } from '../components/ProfileCard'

export const Route = createFileRoute('/profile')({
  loader: async ({ context }) =>
    context.queryClient.prefetchQuery({ queryKey: ['profile'], queryFn: getProfile }),
  component: ProfilePage,
})

function ProfilePage() {
  const { data } = useQuery({ queryKey: ['profile'], queryFn: getProfile })
  return (
    <div className="container mx-auto p-4">
      <ProfileCard profile={data} />
    </div>
  )
}
```

---

## 17) Testing (recommended)

- **Unit**: Vitest + React Testing Library (`@testing-library/react`)
- **E2E**: Playwright
- Keep fast tests close to features in `__tests__` or alongside files.

---

## 18) Scripts (suggested)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

---

## 19) FAQ

- **Where does state live?** Server state in Query; ephemeral UI state in components; avoid global state unless necessary.
- **How to add a feature?** Create a folder under `features/`, add route(s), API adapters, schemas, components, and register routes via the router.
- **How to style?** Use Tailwind utilities and shadcn/ui primitives. Keep CSS minimal and colocated when needed.
- **How to validate?** Use Zod at boundaries (routes, forms, network). Infer types from schemas.

---

## 20) Definition of Done

- [ ] Type-safe boundaries (Zod) and no `any` leaks
- [ ] Queries/mutations with proper keys + invalidation
- [ ] Mobile-first responsive layout
- [ ] a11y pass (keyboard, focus, labels, contrast)
- [ ] Reduced motion respected
- [ ] Tests for critical logic
- [ ] Lint, typecheck, and build succeed

---

**You’re set. Build features, keep things modular, and let the tooling work for you.**

## 21) SEO Optimization (Performance & Crawlability)

> This is a consumer app: **every feature and component must be SEO- and performance‑minded by default.**

### A) Rendering strategy

- **Preferred:** SSR/SSG or prerender for critical entry pages (home, top categories, product/detail, blog). Keep SPA navigation after first paint.
- **Acceptable fallback:** SPA + prerendered HTML for a subset of routes. Always verify indexability in Search Console.
- **Hydration:** Keep above‑the‑fold HTML meaningful (headings, copy, links) so bots see content before JS.

### B) Head & metadata management

Use **react-helmet-async** for per‑route `<title>`/meta. Add provider at the app root:

```tsx
// src/main.tsx (excerpt)
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
```

Create a small SEO component:

```tsx
// src/shared/ui/Seo.tsx
import { Helmet } from 'react-helmet-async'

type Props = {
  title?: string
  description?: string
  path?: string // "/products/123"
  noindex?: boolean
  ogImage?: string
  schemaJson?: Record<string, any>
}

const SITE = import.meta.env.VITE_SITE_URL // e.g., https://example.com

export function Seo({ title, description, path = '', noindex, ogImage, schemaJson }: Props) {
  const url = (SITE?.replace(/\/$/, '') || '') + path
  const fullTitle = title
    ? `${title} · ${import.meta.env.VITE_SITE_NAME ?? ''}`
    : (import.meta.env.VITE_SITE_NAME ?? '')
  return (
    <>
      <Helmet prioritizeSeoTags>
        {title && <title>{fullTitle}</title>}
        {description && <meta name="description" content={description} />}
        {noindex ? (
          <meta name="robots" content="noindex, nofollow" />
        ) : (
          <meta name="robots" content="index, follow" />
        )}
        {url && <link rel="canonical" href={url} />}
        {/* Open Graph / Twitter */}
        {title && <meta property="og:title" content={fullTitle} />}
        {description && <meta property="og:description" content={description} />}
        {url && <meta property="og:url" content={url} />}
        <meta property="og:type" content="website" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {schemaJson ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      ) : null}
    </>
  )
}
```

Route usage example:

```tsx
// src/features/home/routes/index.route.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Seo } from '@/shared/ui/Seo'

export const Route = createFileRoute('/')({
  component: () => (
    <main className="container mx-auto p-4">
      <Seo title="Home" description="Discover our latest products and stories." path="/" />
      <h1 className="sr-only">Example App</h1>
      {/* content */}
    </main>
  ),
})
```

### C) Structured data (JSON‑LD)

Provide rich snippets where useful (Product, Article, Breadcrumb):

```tsx
<Seo
  title={product.name}
  description={product.teaser}
  path={`/p/${product.slug}`}
  schemaJson={{
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images[0]?.url,
    description: product.teaser,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability: 'https://schema.org/InStock',
      url: `${import.meta.env.VITE_SITE_URL}/p/${product.slug}`,
    },
  }}
/>
```

### D) Links, sitemaps, robots

- Maintain **canonical URLs** (one URL per piece of content). Avoid duplicate query parameter variants.
- Generate **sitemap.xml** and **robots.txt** at build time.
- Add internal links between related routes; keep anchor text descriptive.

Minimal sitemap generator (Node):

```ts
// scripts/sitemap.ts
import { writeFileSync } from 'node:fs'
const site = process.env.SITE_URL || 'https://example.com'
const routes = ['/', '/about', '/products'] // extend programmatically
const xml =
  `<?xml version="1.0" encoding="UTF-8"?>
` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
  routes
    .map(
      (r) => `
  <url><loc>${site}${r}</loc></url>`,
    )
    .join('') +
  `
</urlset>`
writeFileSync('dist/sitemap.xml', xml)
writeFileSync(
  'dist/robots.txt',
  `Sitemap: ${site}/sitemap.xml
User-agent: *
Allow: /`,
)
```

Add to package.json build pipeline:

```json
{
  "scripts": { "postbuild": "node scripts/sitemap.ts" }
}
```

### E) Images & media (LCP friendly)

- Always set **intrinsic width/height** to avoid CLS.
- Use `loading="lazy"` for below‑the‑fold, but **eager** + `fetchpriority="high"` for LCP hero.
- Provide `srcset`/`sizes` and modern formats (WebP/AVIF). Include descriptive `alt`.

```tsx
<img
  src="/media/hero-1200.webp"
  srcSet="/media/hero-800.webp 800w, /media/hero-1200.webp 1200w, /media/hero-1600.webp 1600w"
  sizes="(max-width: 768px) 100vw, 1200px"
  width={1200}
  height={600}
  alt="Shop the new collection"
  decoding="async"
  loading="eager"
  fetchPriority="high"
/>
```

### F) Fonts

- Prefer **system fonts**; if using web fonts, self‑host and subset.
- Preconnect and preload critical font files; ensure `font-display: swap`.

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preload" as="font" type="font/woff2" href="/fonts/Inter-400-subset.woff2" crossorigin />
```

### G) Component performance checklist

For every component:

- Uses **semantic HTML** and accessible names.
- Avoids layout thrash (batch reads/writes; prefer CSS transforms).
- Minimal JS on first paint; defer non‑critical effects to `requestIdleCallback`.
- Images have width/height; list items are virtualized if large.
- Motion is subtle and disabled on `prefers-reduced-motion`.
- No blocking `await` in render; fetch in Query with caching.
- No heavy polyfills on modern browsers; load polyfills conditionally.

### H) Core Web Vitals budgets & CI

Track budgets and regressions:

- **Budgets:** LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms, TTFB ≤ 0.8s.
- Add Lighthouse CI to PRs:

```json
{
  "scripts": {
    "lhci": "lhci autorun --collect.staticDistDir=dist"
  },
  "devDependencies": { "@lhci/cli": "^0.13.0" }
}
```

### I) Route‑level SEO patterns

- Public content routes: `<Seo ... />` with canonical + JSON‑LD.
- Auth/account routes: `<Seo noindex />`.
- For pagination, use `?page=` with consistent canonical and include `rel=prev/next` via `<Helmet>` for long series.

### J) Caching & delivery

- Serve static assets via CDN with long **Cache‑Control** and content hashing.
- API: enable HTTP caching (ETag/Last‑Modified) to help Query avoid refetch.
- Use `preconnect` to critical origins; avoid unnecessary cross‑origin requests.

---
