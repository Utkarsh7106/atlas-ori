---
name: glassmorphism
description: >-
  Use whenever the user wants a Glassmorphist website, landing page,
  portfolio, or UI component — trigger on "glassmorphism," "glass
  UI," "frosted glass," "macOS Big Sur style," or synonyms like
  "backdrop blur," "translucent panels," "frosted panel." Also
  trigger on a look description even when unnamed: semi-transparent
  white panels with a heavy backdrop blur sitting over large blurred
  saturated color blobs on a dark ground, a thin bright white border
  plus a top highlight on each panel, a diagonal specular streak, and
  hierarchy carried by font weight and white opacity rather than
  color. "Make it look like frosted glass over a colorful blurry
  background," "translucent cards you can sort of see through," or
  "like iOS control center" should trigger this without the word
  "glassmorphic." Apply even without those exact words.
---

# Glassmorphism

Panels are frosted glass: semi-transparent, backdrop-blurred, edged with
a 1px light border and a top highlight. The style only works if there is
something saturated and moving behind the glass for it to distort. This
dates to 2020–2021, named by Michal Malewicz after Apple's macOS Big Sur
and iOS control-center materials, with roots in Windows Vista Aero
(2007).

## Core Rules

1. Put something saturated and moving behind the glass first — blurred color orbs on a dark ground — because glass with nothing behind it reads as flat grey, not glass.
2. Build panes from a low-alpha white fill (around 10%) plus `backdrop-filter: blur(18px) saturate(160%)`; always include the saturate component, since blur alone desaturates and kills the effect.
3. Edge every pane with a thin (1px) bright white border at high alpha (~65–70%, tuned for real contrast, not the more commonly cited ~28% which can fail a 3:1 non-text-contrast check against a bright background) plus an inset top highlight, then add a soft downward drop shadow for separation from the ground.
4. Keep corner radii moderate (18–32px) and hold every pane at one consistent visual depth — glassmorphism is about layers, not extrusion or stacking depth.
5. Carry hierarchy with type weight and white-alpha levels rather than hue, and never place body text below 14px on a blurred surface.

## Reference Implementation Details

**Color tokens**: `#0d0b1f` deep ground behind the light sources (or
darker, e.g. `#05040e`, for a dark-mode variant); three fixed, saturated
orb colors that do NOT change between themes since they're the light
source the whole effect depends on — e.g. `#7b2ff7` violet, `#f107a3`
magenta, `#00d4ff` cyan; white used only at low alpha for every glass
fill and border (roughly 10% for a resting pane, ~24–30% for a
hover/active "strong" fill, ~65–70% for the pane's own border — verify
these against your actual ground and orb colors with real contrast
math, don't just copy percentages, since a pane's edge sitting over a
bright orb needs meaningfully more alpha than the same edge over open
dark ground to clear a 3:1 non-text contrast minimum). **A translucent
white fill alone often isn't enough to guarantee body text stays
legible** — composite a solid low-alpha dark "scrim" layer underneath
the white glass fill as a contrast floor; it's a no-op wherever the
ground is already dark, and only bites where a bright orb sits directly
behind a pane.

**Type**: one sans (Manrope or similar) across a wide weight range — 300
for large display type, 400 for body, 500 for nav labels, 700 for
buttons and card titles. Weight contrast inside a single headline (light
weight, with one word bumped to 700) replaces color contrast, which
glass can't provide reliably. Hero around `clamp(34px,5.6vw,64px)` at
−0.03em tracking; body 14.5–17px at reduced white opacity (not full
white); labels 11px uppercase at 0.12em.

**Layout**: a centered column (~1060px) of stacked panes with a tight,
uniform gap (~22px) so every pane overlaps the same orb field and reads
as a parallel sheet at one depth. Content sits flush left inside
generous padding (32–78px). Layer order matters: the orb field at the
back, an optional fine grain texture above it, all real content above
both.

**Signature mechanics**:
- The glass recipe as one reusable class: two stacked `background` gradients (a translucent white fill layer, then a solid low-alpha dark scrim layer beneath it — CSS paints the first-listed background layer on top), `backdrop-filter: blur(18px) saturate(160%)`, a bright thin border, and a box-shadow pairing a soft outer drop shadow with an `inset 0 1px 0` top highlight.
- A diagonal specular streak: a `::before` overlay with a linear-gradient running from a bright translucent white down to transparent at roughly a 160deg angle, fading out by less than half the pane's height.
- Three large blurred color blobs (heavy blur, ~90px) positioned off-canvas at the corners as the only saturated content on the page.
- Optional fine grain: a repeating tiny radial-gradient dot pattern at very low opacity over everything, to keep large blurred gradients from visibly banding.
- Optional parallax: read pointer position and translate each orb by its own small depth factor so the refraction shifts as the cursor moves, lerped toward the target each frame rather than snapping — and because this is a `requestAnimationFrame` loop rather than CSS, it needs its own `prefers-reduced-motion` check to park the orbs at rest.

## Common Mistakes to Avoid

The most common failure is applying blur and transparency over a flat or
static background. Glass needs something saturated and moving behind it
— glass over nothing, or over a plain solid color, reads as flat grey,
not glass. If a panel isn't visibly distorting colorful content behind
it, the effect hasn't actually been achieved yet, no matter how correct
the blur/border/highlight recipe is.

## Accessibility Notes

Body text sitting at reduced white opacity over a blurred, moving
background only has guaranteed contrast against the specific background
colors and positions actually tested — a differently colored or
user-repositioned background behind the same pane can push text below
4.5:1 with no code change flagging it. Composite a solid contrast-floor
scrim underneath the translucent fill (see Reference Implementation
Details) rather than relying on the glass alpha alone to keep text
legible, and verify the pane's own border clears a 3:1 non-text contrast
minimum against the brightest point the background can realistically
reach behind it, not just an average sample.

## When Not To Use This Style

Avoid this style for data-dense enterprise software or anything read for
long stretches. Semi-transparent text over moving color is fatiguing
well before the novelty wears off, and `backdrop-filter` is GPU-expensive
— especially layered (blur plus saturate) across many stacked panes on
one screen, which can visibly tax a lower-end device's compositor.
