---
name: dark-mode-ui
description: >-
  Use whenever the user wants a Dark Mode UI website, product landing
  page, dashboard, portfolio, or UI component — trigger on "dark mode
  UI," "dark theme," "dark mode dashboard," "product UI dark theme," or
  synonyms like "Linear-style dark UI," "Vercel-style dark interface,"
  "GitHub dark theme look." Also trigger on a look description even when
  unnamed: a near-black (never pure black) app background, hairline
  borders defining every card and control instead of shadows, off-white
  (never pure white) text, a desaturated accent color, tight platform UI
  type with no webfont, and visible focus rings. "Make it look like a
  dark-themed SaaS product," "dark UI with subtle borders instead of
  shadows," or "GitHub/Linear dark mode style" should trigger this
  without the words "dark mode UI." Apply even without those exact
  words.
---

# Dark Mode UI

A genuine product-interface dark theme, not a decorative black
background: every color is a token, elevation comes from surface tints
and hairline borders rather than shadows, and nothing is pure black or
pure white. It dates from 2018 onward — system-level dark themes in iOS
13, Android 10, and macOS Mojave, codified by Material Design's dark
theme guidance and the Linear/Vercel/GitHub generation of product
interfaces.

## Core Rules

1. Define every color as a custom property under a theme selector, and
   treat any other theme (e.g. a light mode) as a second token block
   layered over the exact same component CSS — never fork the
   components themselves. This is the foundation the rest of the style
   depends on: a literal invert of a light design (white to black, black
   to white) produces exactly the pure-black/pure-white values this
   style explicitly bans, and is the single most common way to get this
   style wrong.
2. Never use a pure black background or pure white text. Start the
   background around `#0b0d12` and cap primary text around ~91% white —
   reaching for `#ffffff` "for extra contrast" actually increases
   halation (glow around light text on a dark ground) and makes large
   blocks of text harder to read, not easier.
3. Build elevation from a ladder of surface tints (background → surface-1
   → surface-2) plus a 1px hairline border on every container, rather
   than from drop shadows — shadows barely read on dark grounds.
   Strengthen the border's opacity on hover rather than adding or
   deepening a shadow.
4. Desaturate the accent color for dark surfaces, and keep a low-alpha
   "quiet" variant of that same hue on hand for chip and badge
   backgrounds, rather than introducing a second, unrelated color for
   that purpose.
5. Keep every transition fast and quiet — under ~250ms, nothing longer —
   ship a visible `:focus-visible` ring (roughly 2px, with a 2–3px
   offset) on every interactive element, and load no webfont. Use the
   platform UI stack instead, so the interface paints on first frame the
   way a real product would.

## Reference Implementation Details

**Color tokens**: `#0b0d12` app background, deliberately not pure black;
`#12151c` surface-1 (nav, cards, CTA fields); `#1a1f29` surface-2 (hover
states, chips, secondary buttons); `#e7eaf0` primary text at roughly 91%
white, never `#ffffff`; `#98a2b6` secondary text, kept above 4.5:1
against the background; `#6d8fff` accent, desaturated specifically for
use on dark surfaces. Every single one of these needs to be a token
(custom property), not a literal value inlined into a component — a
component that ships with a hardcoded hex value instead of reading the
token will silently fail to re-theme when the theme attribute flips, and
that failure typically isn't caught until someone actually toggles the
theme.

**Type**: no webfont — use the platform UI stack (`system-ui`, San
Francisco, Segoe UI, Roboto) for text, paired with `ui-monospace` (SF
Mono, Menlo, Consolas) for icon glyphs and small technical labels.
Restrict weights to 500/600/650 — a true 700 bloats visibly on dark
backgrounds. Use a tight size ramp: 12–13.5px labels, 14–15px body, 16px
card titles, `clamp(32px, 4.6vw, 52px)` for a hero, with slightly
negative tracking (−0.012 to −0.028em) on headings.

**Layout**: an application-shell measure around 1080px, built on a 4px
spacing scale (8/16/22/40/88) with a consistent 16px gutter between
cards and sections. Keep content flush left rather than centered, and
cap a hero's text measure around 44rem. Step corner radii with element
size — 8–9px for controls, 12px for containers, 999px for pills.

**Signature mechanics**:
- Hairline borders at roughly `rgba(255,255,255,.09)`, strengthening to
  around `.16` on hover — the primary way edges get defined on this
  style, doing the job a shadow would do on a light background.
- A desaturated accent plus a ~14%-alpha "quiet" variant of the same hue
  for chip backgrounds (per Core Rule 4).
- `inset 0 1px 0 rgba(255,255,255,.14)` as a top highlight on primary
  buttons, implying a light source without an actual glow effect.
- Explicit `:focus-visible` rings on every interactive element (per Core
  Rule 5) — don't rely on the browser's default outline, since it's
  often invisible or low-contrast against a dark surface.

## Common Mistakes to Avoid

Inverting a light design — swapping white for black and black for
white — instead of building genuinely tokenized surfaces is the most
common failure. Every color needs to run through a custom property so a
second theme (or any future theme) is a new token block over the same
components, never a separate fork of them; a literal invert also tends
to reintroduce the pure-black/pure-white values this style specifically
avoids.

## Accessibility Notes

Capping primary text at roughly 91% white instead of pure `#fff` is a
deliberate response to halation — the glow effect light text produces on
a dark ground — which gets worse, not better, at higher contrast values
for large blocks of text at night. Treat this as a first-class
constraint on any new text color, not an arbitrary stylistic choice: a
new component that reaches for `#ffffff` "for extra contrast" is making
body text objectively harder to read on this background, not easier.

## When Not To Use This Style

Avoid this style for print-adjacent or content-heavy reading contexts.
Dark backgrounds fight established reading conventions for long text,
and printing a page designed around a dark background produces
unreadable output without a dedicated print stylesheet.
