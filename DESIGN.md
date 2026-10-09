# BreachMirror design system

Source of truth: [src/styles/design-tokens.css](src/styles/design-tokens.css). Contrast of every foreground/background pair is checked in CI-style by `npm test` ([tests/design-tokens.test.ts](tests/design-tokens.test.ts)), against WCAG 2.2 AA (4.5:1 text, 3:1 UI boundaries and focus rings), in both themes.

## Idea: the reflection axis
BreachMirror is about two sides of one moment: *the threat* and *your behaviour*. The idea is used sparingly, in three places only:

- **Logo** – a shield split on a vertical axis: dashed outline (threat) mirrored by a solid half (you).
- **Posture score** – two mirrored half-rings around the score. Left = threat pressure, right = your readiness.
- **Radar** (phase 4) – threat blips on one side of the axis, your response on the other.

Everything else is flat: hairline borders, no glow, no aurora, no stock glassmorphism. Colour is reserved for meaning.

## Tokens
All tokens are CSS variables (`--bm-*`) with light defaults in `:root` and dark overrides in `html.dark`. Tailwind utilities are bridged in `@theme inline` (`bg-surface`, `text-fg-2`, `border-line`, `text-crit`, …), so components never hard-code a hex value.

| Group | Tokens |
| --- | --- |
| Neutrals | `bg`, `surface`, `surface-2`, `sunken`, `line`, `line-strong`, `fg`, `fg-2`, `fg-3` |
| Accent ("mirror blue") | `accent` (fill), `accent-fg` (text on fill), `accent-text` (accent as text/icon), `accent-soft` (tint), `focus` |
| Severity | `crit`, `high`, `med`, `low`, `safe` + `-soft` tints. Always paired with an icon and a label, never colour alone. |
| Brand | `brand-crimson` – XYZ logo and certificate only |
| Radius | `sm 6`, `md 10`, `lg 14`, `xl 20` px |
| Elevation | `shadow-card`, `shadow-raised`, `shadow-overlay` |
| Motion | `--bm-dur-fast 120ms`, `base 200ms`, `slow 360ms`, `--bm-ease cubic-bezier(.2,.8,.2,1)` |

Accent usage: `bg-accent text-accent-fg` for solid fills, `text-accent-text` on `surface`/`bg`/`accent-soft`. In dark theme the accent is lighter and its foreground is dark ink.

## Type
- **Fonts are self-hosted** in `public/fonts` (latin subset, SIL OFL), so the app works offline with no third-party requests.
- **Display:** Bricolage Grotesque (headings, big numbers).
- **Body:** IBM Plex Sans.
- **Mono:** JetBrains Mono (threat IDs, timestamps, shortcuts, data).
- Scale: Tailwind `text-xs` (12px, minimum) → `text-sm` 14 → `text-base` 16 → `text-lg` 18 → `text-xl` 20 → `text-2xl` 24 → `text-3xl` 30 → `text-display` 40. Do not use arbitrary pixel sizes below 12px.

## Primitives
`.bm-card`, `.bm-btn` (+ `-primary`, `-ghost`, `-icon`, `-sm`), `.bm-chip`, `.bm-sev-*`, `.bm-kbd`, `.bm-eyebrow`, `.bm-skeleton`, `.bm-rise` (staggered reveal via `--bm-i`), `.bm-pop`. React primitives: `Dialog`, `Switch`, `ThemeSwitcher` in `src/components/ui/`.

`bm-ds` marks a design-system region (kept for scoping). The old light-theme colour patch layer has been deleted: `src/index.css` now only imports Tailwind, the fonts and the tokens.

## Motion and accessibility rules
- Animate only `transform` and `opacity`.
- `prefers-reduced-motion` disables all animation and transitions globally; the optional Scenery clouds stop moving.
- Dialogs (`Dialog`) are labelled, trap focus, make the app root `inert`, close on Escape/backdrop and restore focus.
- Sound effects are optional and **muted by default**.
- Scenery backdrop (light theme) is **off by default**, toggled from the user menu.

## Additions in phases 4-6
- **Chart series:** `--bm-s1` to `--bm-s5` (colour-blind-safe, at least 3:1 against surfaces, tested). Every series also has a marker shape (circle, square, diamond, triangle, cross), so colour is never the only cue.
- **Chart kit** ([chart-kit.tsx](src/components/charts/chart-kit.tsx)): `ChartFrame` (legend and a "View as table" alternative), `ChartTooltip`, `useElementWidth` (responsive) and `useChartCursor` (arrow-key reading). Charts are React-rendered SVG using only the d3 scale and shape modules.
- **Severity language:** `SeverityBadge` (icon, label and tint) and `RiskMeter` in [src/components/ui/](src/components/ui/). Radar blips also encode severity by shape.
- **Radar:** the vertical axis is the mirror. A neutralized threat becomes a hollow marker and its reflection appears across the axis in the safe colour.
- **Dialogs:** every dialog uses `Dialog`, which builds on `useModalBehavior` (focus trap, Escape, inert background, scroll lock, focus restore, stacked-modal aware).
- **Learning:** `ProgressRing`, the Learning journey card (five milestones and a day streak), and a certificate that prints on its own (`#bm-certificate` print styles).
- **Live telemetry:** [live-telemetry.ts](src/services/live-telemetry.ts) is a small external store shared by the velocity widget, the feed and "Run simulation".
- **Storage keys added:** `bm_posture_history`, `bm_activity_days`, `bm_flashcards_mastered`, `bm_onboarding_checklist`, `breachmirror_scenery`.

- **High contrast:** a `forced-colors: active` block keeps borders, focus and selected states visible in Windows high-contrast mode.
- **Touch:** widget reorder works with a finger (drag the handle) as well as mouse, keyboard and the up/down buttons.

## Glass, ambient backdrop and cursor effects
- **Glass** (`.bm-glass`, `.bm-glass-strong`, and `.bm-card`): translucent base plus a soft sheen, backdrop blur and an inner top highlight. Used for the header, cards, dialogs, menus and toasts. Falls back to solid surfaces without `backdrop-filter` and in forced-colors mode.
- **Ambient backdrop:** three slowly drifting colour fields behind everything, so the glass has something to refract. Tokens `--bm-blob-*`, `--bm-bg-grad-*`.
- **Contrast:** `tests/design-tokens.test.ts` composites every text token over the worst case of the backdrop (all blobs overlapping) and the glass layers, in both themes.
- **Cursor effects** ([cursor-fx.tsx](src/components/shell/cursor-fx.tsx)): a light that trails the pointer behind the glass, a ring and dot that grow over controls, a click ripple, a pointer-lit edge and sheen on glass, and a slight magnetic pull on primary controls. Fine pointers only; off for touch, reduced motion and forced colors; switchable in the user menu ("Cursor and glass effects"). Transform/opacity only, one animation loop.
- **Home page:** the landing screen after sign in (`BreachMirror`), with breadcrumbs `BreachMirror > Dashboard` and so on once you navigate. Photos live in `public/images/xyz/`.
