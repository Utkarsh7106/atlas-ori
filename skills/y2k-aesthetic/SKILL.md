---
name: y2k-aesthetic
description: >-
  Use whenever the user wants a Y2K Aesthetic website, landing page,
  portfolio, or UI component — trigger on "Y2K," "Y2K aesthetic," "iMac
  G3 style," "Aqua UI," "frutiger aero," "2000s nostalgia site," or
  synonyms like "chrome word art," "translucent plastic UI," "bubble
  gel buttons," "holographic foil website." Also trigger on a look
  description even when unnamed: a light iridescent pastel background,
  chunky rounded gel/plastic buttons with a glossy highlight, chrome or
  holographic-foil text, pill-shaped nav and chips, and a cursor that
  leaves a trail of sparkles. "Make it look like early-2000s Apple," "shiny
  bubble buttons and chrome text," or "translucent blue plastic UI" should
  trigger this without the words "Y2K aesthetic." Apply even without
  those exact words.
---

# Y2K Aesthetic

Translucent iMac G3 plastic, Apple's Aqua interface, and chrome WordArt
rendered as a website: a light iridescent ground, wet-plastic gel
buttons, chrome or holographic-foil headlines, and a cursor that leaves
a trail of sparkles behind it. This traces to 1998–2003 and was revived
as an internet aesthetic starting around 2019.

## Core Rules

1. Keep the page light and iridescent — a conic pastel ground, never a
   dark one. Y2K is optimistic, not dystopian; a dark version of this
   palette reads as cybercore or cyberpunk instead, not as Y2K.
2. Give every clickable element the Aqua gel recipe: a hard mid-stop
   gradient (light through roughly 46%, dark from roughly 54%), an inset
   white top highlight, an inset bottom shadow, a colored cast shadow,
   and a separate top-light highlight lozenge layered on top — the wet,
   moulded-plastic look comes from stacking all of these, not any one of
   them alone.
3. Set all display type as clipped, multi-stop chrome or holographic
   gradient text with stacked drop-shadows for the bevel — never let a
   heading be one flat color.
4. Use period-accurate body type (Verdana, or Tahoma/Geneva as
   fallbacks) at a genuinely small 12–13px with loose line-height, and
   apply pill radii to every clickable control, a constant mid-size
   corner radius (~22px) to panels.
5. Add gloss and sparkle through motion rather than static decoration:
   brightness/saturate hover filters plus a small lift (not a color
   swap) on gel buttons, a rotating holographic foil overlay on cards,
   and a cursor sparkle trail that removes its own elements so the DOM
   never grows unbounded. Drive the sparkle trail through its own
   `prefers-reduced-motion` check in script — a CSS-level reduced-motion
   rule can't reach an imperative animation API, so a script-driven
   effect needs its own guard or it won't respect the setting at all.
6. If a dark mode exists, invert only the ambient ground and the
   translucent plastic panel body — that's a real period colorway (the
   iMac's own Graphite/Smoke line), not a departure from Y2K. Chrome
   word art, gel buttons, nav pills, chips, and the foil overlay keep
   fixed values in both themes: a molded plastic button's gradient is a
   material property of the object, not something that re-lights with
   the room.

## Reference Implementation Details

**Color tokens**: `#bfe4ff` baby blue, base of the iridescent ground;
`#c8a2ff` lilac in the conic foil gradient; `#ff7ac6` bubblegum pink for
chips, sparkles, and the primary CTA; `#2aa3ff` Aqua blue for the
primary gel button; `#1d2436` ink for body text and headline shadows;
`#dfe6f0` silver plastic body; `#8d9bb5` chrome shadow stop used in
bevels and word art.

**Type**: Audiowide (or a similar wide techno face standing in for
period WordArt) for all display, paired with genuine Verdana — Tahoma
and Geneva as fallbacks, since that's authentically what the era
shipped. Body sits at 12.5–13.5px with 1.8–1.85 line-height; labels run
10–11px bold uppercase at 0.16em tracking.

**Layout**: a centered column around 1020px wide, built from rounded
panels with an 18px gap, stacked symmetrically. Panels are the unit —
nothing sits directly on the bare background — each with generous
28–52px padding so the gloss highlight has room to read.

**Signature mechanics**:
- Aqua gel button: `background` a hard two-stop gradient (light stop
  ending around 46%, dark stop starting around 54%), `box-shadow`
  stacking `inset 0 2px 0 white` with a bottom inset shadow and an
  outer colored cast shadow.
- A separate `::before` top-light lozenge, radius `18px 18px 60% 60%`,
  layered over the gel button to read as the reflected highlight.
- Chrome word art: a six-stop vertical gradient with
  `background-clip: text` plus stacked `drop-shadow` filters for the
  beveled-metal look.
- Holographic foil: a full-hue `conic-gradient` at roughly 62% opacity
  in `mix-blend-mode: soft-light` (not `overlay` — overlay pushes an
  already-past-mid-grey gloss highlight to flat white), rotated and
  scaled up on hover.
- Twinkling sparkle glyphs (✦ / ✧ / ✶) on a ~1.8s scale-and-fade loop
  with offset delays for ambient sparkle, plus the pointer-following
  sparkle trail described in Core Rule 5 — drop a glyph roughly every
  45ms of pointer movement, animate it via `element.animate()` (scale
  up, drift ~22px, fade over ~700ms), and cap the number of live
  sparkles so a very active mouse can't grow the DOM without bound. On
  touch, a `pointermove` trail never fires the same way, so give a
  `pointerdown` from a touch pointer a small fixed burst of sparkles at
  the tap point instead, so touch gets equivalent feedback.

## Common Mistakes to Avoid

Reaching for a dark or muted palette for "Y2K vibes" is the most common
failure — Y2K is explicitly optimistic and light, and a dark iridescent
treatment is actually the register of a different, related style
(cybercore or cyberpunk), not this one.

## Accessibility Notes

Gel-button hover states are driven by CSS `filter` (brightness/
saturate) rather than a color swap, and filters compound non-linearly
rather than as a simple multiplier — check contrast at the actual
rendered gradient stop boundaries on any new hover treatment, not an
estimate from the base filter values. The sparkle trail is capped in
count specifically to avoid unbounded DOM growth; keep that cap on any
reimplementation, since a copy of the effect without it risks runaway
element creation on a page with an active mouse user.

## When Not To Use This Style

Avoid this style for interfaces that need to read as contemporary or
premium. Chrome word art, chunky gel buttons, and chip textures are
specifically a period signifier — used outside a deliberate nostalgia
context, they read as dated rather than stylish.
