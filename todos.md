# Dark/Light/System Theme Implementation Plan

Phases

1) Foundation
- Install next-themes and configure class strategy [done]
- Add no-flash prepaint script in index.html [done]
- Define CSS tokens for colors/radius in styles.css [done]
- Expose tokens via Tailwind v4 @theme (bg-*, text-*, border-*, ring-*) [done]

2) Wiring
- Create ThemeProvider and wrap app in src/main.tsx [done]
- Add ThemeToggle and place in Header [done]

3) Refactors (core)
- Refactor AppShell to use bg-background/text-foreground [done]
- Refactor Header and MobileMenu to token-based colors [done]
- Refactor shared primitives: Button, Input, Card [done]

4) Feature surfaces (follow-ups)
- Update all feature components to tokens (Articles, Passports, Calendar, Landing)
- Replace hardcoded neutrals (bg-white, text-neutral-900, etc.) with tokens
- Ensure focus rings use ring/ring-offset tokens consistently
- Verify footer gradients and overlays for dark contrast

5) QA & polish
- Manual testing: light/dark/system, toggle persistence, no flash on reload
- a11y contrast checks (WCAG AA) in both themes
- Run `pnpm build` and preview

6) SEO & performance
- Verify `color-scheme: light dark` is applied to enable UA styling
- Prerender critical pages for meaningful HTML in both themes

Notes
- Use `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-card-foreground`, `bg-accent`, `text-muted-foreground`, `ring-ring`, and `ring-offset-background`.
- Avoid hardcoded `bg-white/black` unless intentional; prefer tokens.

