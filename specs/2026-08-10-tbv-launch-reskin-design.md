# TBV launch reskin — design

**Date:** 2026-08-10
**Branch:** `feat/tbv-launch-reskin-reactbits`, based on `main`
**Repo:** `babylonlabs-io/babylonlabs.github.io` (docs.babylonlabs.io)

## Base branch

The base is `main`. `main` already carries the headline "Make your bitcoin
productive", the eight partner logos, the landing page hero images, and
`ChatWidget.tsx`.

`main` does **not** carry the TBV docs tree or the TBV image set. Those live on
the feature branches, `feat/tbv-vault-indexer-api-docs` being the most current.
The reskin therefore covers the chrome, the landing page, and the doc page
templates. Because the reskin is token-driven, the TBV docs inherit the new look
when their branch merges. No TBV doc page needs a second pass.

One asset is copied across: the dashboard screenshot, taken from
`feat/tbv-vault-indexer-api-docs` and stored at
`static/img/landing-page/dashboard/borrow-repay-placeholder.png`.

## Goal

Reskin the documentation site for the Trustless Bitcoin Vault launch. Use React
Bits Pro as the component source and the React Bits Pro **Security** template as
the visual reference.

## Decisions

| Decision | Value |
| --- | --- |
| Target repo | `babylonlabs.github.io` |
| Approach | Pro blocks adapted to the existing Docusaurus and Tailwind v3 stack |
| Scope | Full site: landing page, shared chrome, and doc page templates |
| Theme | Dark-first |
| Accent | Bitcoin orange |
| Type | Geist, Geist Mono, Source Serif 4 |
| Visual source | Security template at `~/Downloads/security` |

## Constraints

The Security template is Next.js 16, React 19, Tailwind v4, React Three Fiber,
Lenis, and next-themes. The docs site is Docusaurus 3.7, React 18, and Tailwind
3.4.17. The template therefore cannot be copied in directly. Its source is a
reference, and its primitives are ported by hand.

React Bits Pro **blocks** do port directly. Each block is one self-contained
`.tsx` file. Each declares only `motion` and `lucide-react`. Blocks use plain
Tailwind neutral classes with `dark:` variants, no shadcn tokens, and no
Tailwind v4-only syntax.

React Bits Pro **components** split in two groups. Text components need `motion`
only. Background and shader components need `@react-three/fiber` and `three`.

Templates are not on the registry. Only blocks and components are.

## Registry access

Registry entries need a license key. Set `REACTBITS_LICENSE_KEY` in `.env.local`,
which is git-ignored. The key is in 1Password.

```json
{
  "registries": {
    "@reactbits-starter": {
      "url": "https://pro.reactbits.dev/api/r/starter/{name}.json",
      "headers": { "Authorization": "Bearer ${REACTBITS_LICENSE_KEY}" }
    },
    "@reactbits-pro": {
      "url": "https://pro.reactbits.dev/api/r/pro/{name}.json",
      "headers": { "Authorization": "Bearer ${REACTBITS_LICENSE_KEY}" }
    }
  }
}
```

Components use the `-tw` suffix. Blocks do not.

## Token architecture

This is the load-bearing part of a full-site reskin.

Colour tokens are currently split across two blocks in `custom.css` that use
different formats and serve different consumers:

- `@layer base` at lines 56-80 holds RGB-channel tokens
  (`--docs-color-primary-200: 51 197 206`) which `tailwind.config.cjs` reads
  through `rgb(var(...) / <alpha-value>)`.
- A plain `:root` at lines 137-158 holds hex tokens
  (`--docs-color-primary: #33C5CE`) used by hand-written CSS.

Both work today. The problem is that one colour has to be edited in two places
and two formats, and the Infima `--ifm-*` values at lines 176-235 are a third,
hard-coded set. A full-site reskin through three unlinked palettes is where
drift comes from.

The reskin defines one token set in `custom.css`, stored as **RGB channels**:

```css
:root {
  --tbv-background: 255 255 255;
  --tbv-foreground: 10 10 10;
  --tbv-muted: 245 245 245;
  --tbv-muted-foreground: 115 115 115;
  --tbv-border: 229 229 229;
  --tbv-accent: 247 147 26;      /* Bitcoin orange */
  --tbv-accent-foreground: 10 10 10;
}

[data-theme='dark'] {
  --tbv-background: 10 10 10;
  --tbv-foreground: 250 250 250;
  --tbv-muted: 23 23 23;
  --tbv-muted-foreground: 163 163 163;
  --tbv-border: 38 38 38;
}
```

Channels, not hex. The template writes `border-border/60` and similar opacity
modifiers dozens of times. Tailwind v3 needs raw channels for `<alpha-value>`.
A hex token would silently drop every opacity modifier.

`tailwind.config.cjs` gains matching colour names. Infima variables map onto the
same tokens, so `--ifm-*` and Tailwind stay in step. The existing
`--docs-color-*` names are kept as aliases that point at the new tokens, so
`custom.css` and every current component keep working untouched. The reskin is
additive, not a rewrite.

The OpenAPI theme and Stoplight Elements both style from Infima variables, so
the API reference pages follow with no extra work.

## Page composition

**The content is the existing content.** The theme changes, the copy does not.
New marketing copy is not written for this reskin. Product titles, descriptions,
guides, samples, partner names and destinations are imported from the current
homepage components so they stay in one place.

| # | Section | Content | Source of copy |
| --- | --- | --- | --- |
| 1 | Hero | "Make your bitcoin productive". Ask AI widget in the sub-headline slot. Window mockup holding the dashboard screenshot. | Existing headline on `main` |
| 2 | Product partners | Logo wall, linked | `ToolsAndInfra` partner list |
| 3 | Hero 2 | Pinned scroll gallery, "Trustlessly use Bitcoin as collateral" | New section, kept exactly as built |
| 4 | Products | The four existing cards: Trustless Bitcoin Vault, Become Operators, Stake BTC, Stake BABY | `PRODUCTS` in `homepage/HeroSection` |
| 5 | Guides and samples | The existing guides and samples | `guides` and `samples` in `homepage/GuidesAndSamples` |
| 6 | FAQ | Generated. Bitcoin staking last and deepest. | New, requested |
| 7 | Community | Join the community band | `homepage/CommunitySection` |
| 8 | Footer | Link columns, social icons, `llms.txt` link | `docusaurus.config.js` |

There is no pricing section. There is no invented core-concepts section and no
invented final CTA. Both were built and then removed, because they replaced
real content with copy the site did not have.

## Accent change

The whole site swaps Babylon teal for Bitcoin orange. Layout and structure of
the documentation stay exactly as they are. Teal surfaces that carried the old
branding, such as the `#ECF8F1` light background and the `#031B24` dark
background, become neutral so that the accent is the only colour carrying
meaning.

### Assets

Hero screenshot placeholder:
`static/img/landing-page/dashboard/borrow-repay-placeholder.png`. Copied from
`feat/tbv-vault-indexer-api-docs`, originally
`withdraw-redeem-01-position-check.png`. This is a placeholder for a real
dashboard later.

Partner logos: `static/img/landing-page/tools-and-infra/` — `satlayer`, `skip`,
`squid`, `escher`, `tower`, `milkyway`, `persistence`, `union`.

Gallery images: the existing `static/img/landing-page/hero/` set, kept for now.

### AI ask widget

`src/components/ChatWidget.tsx` is 928 lines. It already has an `isExpanded`
full-screen state, session storage, and a privacy consent gate. It is not
rewritten.

A new hero input dispatches a `window` custom event carrying the question text.
The existing widget listens, opens full-screen, and submits.

A `window` event is used rather than React context because the widget mounts in
`src/theme/Root.js`, outside the page tree. A context provider on the homepage
could never reach it.

The hero input must never call the chat API itself. It hands the text to the
widget so the widget's consent gate runs first. Calling the API directly would
bypass a privacy control.

**Known backend fault.** The Ask AI backend currently returns 404, because the
Azure resource behind it was deleted. This is not a key fault and not caused by
the reskin. The hero input and the full-screen handoff can be verified, but a
successful answer cannot be, until the backend is restored. This is tracked
separately from the reskin.

## Porting rules

`@theme inline` does not exist in Tailwind v3. Tokens live in `custom.css` and
colour names are declared in `tailwind.config.cjs`.

`@custom-variant dark (.dark)` is dropped. `tailwind.config.cjs` already sets
`darkMode: ['class', '[data-theme="dark"]']`, and Docusaurus writes
`data-theme="dark"` on `<html>`. React Bits `dark:` classes therefore follow the
docs theme toggle with no extra work and no `next-themes`.

The site sets `corePlugins.preflight: false`, because Infima styles base
elements and preflight would reset them. Blocks assume preflight ran. A scoped
reset covering `button`, `ul`, `ol`, and border defaults is added under a
`.tbv-surface` wrapper class. Nothing outside that wrapper changes.

The template's chamfered corners use
`[clip-path:polygon(var(--cut) 0, ...)]`, which is valid in Tailwind 3.4.

The corner-plus motif uses `text-[#2f80ff]`. This changes to the accent token.

## Dependencies

Add: `motion`, `three`, `@react-three/fiber`.

Already present: `lucide-react`, `framer-motion`, `clsx`.

Not added: `lenis`, `next-themes`, `next`, `tailwind-merge`. Docusaurus supplies
theming. Lenis hijacks scrolling site-wide and would break doc anchor links. The
pinned gallery uses `IntersectionObserver` and CSS `position: sticky` instead.

## New files

`src/components/tbv/`:

- `CutButton.tsx` — chamfered solid and outline button
- `CornerPlus.tsx` — corner crosshair motif and section kicker
- `WindowMockup.tsx` — window chrome around the dashboard screenshot
- `AskHero.tsx` — hero input that opens the chat widget
- `PartnerWall.tsx` — partner logo wall
- `CoverageGallery.tsx` — pinned scroll gallery
- `CoreConcepts.tsx` — three concept widgets
- `Faq.tsx` — FAQ accordion
- `FinalCta.tsx` — closing call to action

`src/pages/index.jsx` recomposes from these.

## Accessibility and motion

Every animated section respects `prefers-reduced-motion` and renders the static
composition. WebGL components go behind `<BrowserOnly>`, because Docusaurus
prerenders every page in Node where `window` and WebGL do not exist. WebGL also
falls back to static at small viewport widths.

## Risks

| Risk | Mitigation |
| --- | --- |
| Scoped reset leaks into doc pages | Wrapper class only, plus a visual check on doc pages |
| WebGL cost on mobile | Reduced-motion and small-viewport fallbacks |
| Token rename breaks existing components | Old `--docs-color-*` names kept as aliases |
| Chat consent bypass | Hero input hands text to the widget, never calls the API |
| Tailwind v4 syntax copied by mistake | Port by hand, then confirm the build passes |

## Verification

The work is not complete until all of these pass:

1. `npm run build` completes.
2. `npm run typecheck` completes.
3. The homepage is correct in light and dark themes.
4. A doc page and an API reference page show no regression.
5. Mobile width is correct.
6. The chat widget opens full-screen with the question prefilled.
7. `prefers-reduced-motion` renders the static composition.
