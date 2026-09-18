---
name: neumorphism
description: >-
  Use whenever the user wants a Neumorphist / Soft UI website, landing
  page, portfolio, or UI component — trigger on "neumorphism,"
  "neumorphic," "soft UI," "new skeuomorphism," or synonyms like
  "extruded plastic," "pillowy buttons," "same-color-as-background UI."
  Also trigger on a look description even when unnamed: one muted
  grey-blue surface color for the page background AND every element,
  zero borders/fills, elements pushed out of or pressed into that
  surface via a paired light (top-left) / dark (bottom-right) soft
  shadow, soft slate text (never pure black), large soft radii, buttons
  that flip convex to concave when pressed. "Make buttons look molded
  out of the background," "soft shadows, no borders, everything one
  color," or "pillowy, embossed UI" should trigger this without the
  word "neumorphic." Distinct from Claymorphism/Glassmorphism — one
  surface color throughout, element and background identical, not a
  distinct card color or transparency. Apply without exact words.
---

# Neumorphism (Soft UI)

One surface, one color. Nothing sits ON the page — elements are pushed
OUT of it or pressed INTO it, using a paired light shadow (top-left) and
dark shadow (bottom-right). Contrast is deliberately low; the whole page
reads as a single piece of molded plastic. This dates to 2019–2020,
coined from "new skeuomorphism" after a widely shared Dribbble concept by
Alexander Plyuto — a short-lived reaction to flat design's total lack of
affordance.

## Core Rules

1. Pick one mid-light desaturated surface color (around `#e0e5ec`) and give it to the page background *and* every element without exception — element and background must be the literal same color.
2. Define exactly two shadow recipes — outer (light top-left, dark bottom-right) and the same values with `inset` — and use only those two for all depth. No third state.
3. Never use borders, fills, or dark/black text; keep text a soft slate and reserve any hue for a single accent used sparingly (e.g. on button labels only).
4. Keep the light source constant at the top-left, which means center-aligned, symmetrical layouts and generous padding around every element so shadows have room to read.
5. Animate only `box-shadow` (convex to concave on press) — and treat low native text contrast as a hard, structural constraint to solve for, not a trade-off to shrug off.

## Reference Implementation Details

**Color tokens (light)**: `#e0e5ec` the single surface color (page,
cards, buttons, nav — all identical); `#ffffff` the top-left highlight
shadow; `#a3b1c6` the bottom-right cast shadow; `#4a5568` primary text
(soft slate, never black); `#576272` secondary text/inactive labels;
one restrained accent hue (e.g. `#5b4ed6`) used only on interactive
labels, never as a fill. **Dark mode is a rebuild, not a recolor**: the
highlight shadow stays white-ish (still reads clearly on a dark
surface), but the cast shadow can't just go dark-on-dark — a dark shadow
on an already-dark surface collapses to near-invisible. Replace the cast
side with a soft glow in the page's own accent hue instead (e.g. a
translucent lavender), so elements still read as raised or pressed
rather than flattening into the background.

**Type**: one geometric sans (Poppins or similar; fallback to system UI
sans) whose round bowls match the soft extrusions. Weight caps at 600 —
true bold breaks the low-contrast illusion. A hero runs
`clamp(30px,4.6vw,52px)` at 600; card titles ~19px/600; body 14.5–16px/
400 in the muted slate; labels 10px uppercase at 0.1em tracking.
Headings can carry a two-part `text-shadow` (a light offset one direction,
a dark offset the opposite direction) so the type itself looks embossed
into the surface.

**Layout**: a centered column (~1020px), everything center-aligned —
symmetry keeps the implied light source consistent, since off-center
content would betray the fixed top-left illumination. Uniform vertical
rhythm (~30–38px) between blocks, generous padding (34–64px) inside them.

**Signature mechanics**:
- The paired shadow is the entire visual language: `box-shadow:-7px -7px 16px <light>, 8px 8px 18px <dark>` for a raised ("out") element, and the same numeric values rewritten with `inset` for a pressed ("in") element.
- Circular inset "wells" for icons (a circle with the inset shadow pair) rather than a filled icon background.
- Large soft border-radii scaled to element size (roughly 14–34px) — never a sharp corner.
- A pressable primary action can flip a whole region from convex to concave (e.g. toggling a class on `<body>` that swaps every card's shadow to its inset form) as a direct demonstration of the style's one idea — treat this as a real toggle with `role="button"` and a live `aria-pressed`, not just a visual class swap, since the state itself is meaningful.

## Common Mistakes to Avoid

The most common failure is adding a border or a third shadow state "to
make buttons clearer." The technique is exactly two shadow recipes —
outer light-top-left/dark-bottom-right, and the same values inset — with
zero borders and zero fills anywhere. An extra shadow layer or a border
reintroduces the depth cues this style deliberately withholds, and
undoes the "one surface, one material" illusion immediately.

## Accessibility Notes

Low native text contrast is structural to this style, not an edge case:
because weights cap at 600 and the surface color is inherently
mid-toned, ordinary body text at 14–16px never reaches WCAG's large-text
exemption, so every single text token has to independently clear 4.5:1
against the one surface color on its own — there's no border or fill to
lean on for a contrast boost. Check every text color against the surface
color directly, not against a card background, since in this style they
are the same value. Also, because element and background share one
color, an unstyled native form control (a `<select>`, a third-party
embed) will look broken rather than neutral — anything added later needs
the paired-shadow treatment from day one, there's no flat fallback state.

## When Not To Use This Style

Avoid this style for interfaces where users need to identify what's
clickable at a glance — forms, dense toolbars, anything with more than a
handful of controls. The core idea (element and background as one
color) is directly opposed to strong affordance, which costs real
usability once there's more to scan than a few centered buttons.
