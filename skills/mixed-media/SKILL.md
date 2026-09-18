---
name: mixed-media
description: >-
  Use whenever the user wants a Mixed Media-styled website, landing
  page, portfolio, or UI component — trigger on "mixed media,"
  "collage style," "cut-and-paste design," "zine aesthetic," or
  synonyms like "riso print style," "photocopy collage," "punk zine
  website," "ransom note typography." Also trigger on a look
  description even when unnamed: a newsprint-colored sheet with pasted,
  slightly rotated cuttings, a halftone dot screen, overlapping riso
  color plates that blend into new colors where they cross, photocopy
  grain, torn paper edges, and a headline where every word uses a
  different typeface, size, and angle. "Make it look like a punk zine
  collage," "riso-printed layered look with a ransom-note headline," or
  "cut-and-paste photocopy aesthetic" should trigger this without the
  words "mixed media." Apply even without those exact words.
---

# Mixed Media

A sheet built from several reproduction processes deliberately colliding
at once: halftone screens, riso color plates that blend where they
overlap, photocopy grain, and torn, pasted cuttings, all kept visible
rather than smoothed into one clean layer. It draws on Dada and Cubist
papier collé (1912–20s) by way of punk photocopy zines (1976 onward) and
the contemporary riso-print revival.

## Core Rules

1. Combine at least three different reproduction processes — halftone
   dot screen, a flat riso color plate, photocopy grain, torn paper —
   and let every one of them stay visible at once. A page using only
   one of these techniques is a poster, not this style.
2. Set color plates to `mix-blend-mode: multiply` so overlapping plates
   produce a new third color rather than one plate simply covering
   another — that overprint interaction is the actual mechanism of the
   style, not an incidental effect. Multiply only holds up on light
   stock; over a dark/black stock it resolves to solid black, so a dark
   theme needs to swap the same token to `screen` blend mode instead —
   the equivalent move for ink layered on a dark ground.
3. Build headlines as ransom notes: change typeface, size, background
   plate, and rotation on every individual word rather than applying one
   consistent style to the whole headline.
4. Give every pasted cutting a thin (~2px) keyline, a hard offset
   shadow, and a small rotation, and let painted washes bleed past their
   own container's edge rather than staying neatly contained.
5. Keep motion mechanical rather than smooth: `steps()` transitions so
   state changes jump like a two-pass print instead of easing, plus
   one-shot "misregistration" offsets (a plate nudging slightly out of
   alignment) rather than continuous animation — the subject here is
   printing, not motion design.

## Reference Implementation Details

**Color tokens**: `#ece7dd` newsprint stock, the base sheet; `#141414`
photocopy black for type, keylines, and the halftone screen; `#ff4f79`
riso fluorescent pink plate; `#0f4cf0` riso blue plate; `#ffd400` riso
yellow plate. If a dark "stock" variant exists, keep the same three ink
colors but switch their blend mode from multiply to screen (per Core
Rule 2), screen back painted washes to a lower density on that stock,
and give every small cutting a keyline — even ones that didn't need one
on light stock — since a black cutting on black stock otherwise has no
edge of its own to read against.

**Type**: three families used simultaneously, assigned per-word rather
than per-role — a condensed poster face (e.g. Bebas Neue), a book serif
with a real italic (e.g. Libre Baskerville), and a grotesque sans (e.g.
DM Sans). In a ransom-note headline, each word independently gets its
own face, size multiplier, background plate color, and rotation. Body
copy stays a modest 12.5–14px in the serif at 1.8 line-height; labels
run 10–13px in the bold grotesque at 0.12–0.2em tracking.

**Layout**: a sheet around 1080px wide holding cuttings pasted at slight
angles (roughly −2.4deg to +2.6deg) with a 22px gutter. Stacking order
is explicit and consistent: colored plates sit at the bottom, the
halftone screen layers over them, and all type sits above both — every
block should declare its own z-index, because the style is fundamentally
about layers meeting in a defined order.

**Signature mechanics**:
- Halftone screen: a small (~6px) `radial-gradient(#141414 34%,
  transparent 36%)` tile, laid over blocks in `mix-blend-mode: multiply`.
- Riso overprint: irregular color blot shapes, also set to multiply, so
  a pink blot crossing a blue one produces a visible third color at the
  overlap rather than one hiding the other.
- Photocopy grain: two fine repeating gradients at very low alpha
  (roughly 3.5–5%), layered across the whole page.
- Torn edges: a many-vertex `clip-path` on strip-like elements (e.g. a
  nav bar), combined with 2px keylines and hard offset shadows on every
  individual cutting.
- Painted washes: oversized ellipses with asymmetric `border-radius`,
  deliberately bleeding past their own container's edge.
- Misregistration on hover: a card's colored plate (a purely decorative,
  `aria-hidden` layer, never real type) offsets by a small random amount
  on both axes on pointer-enter and snaps back on pointer-leave — a
  one-shot write on a discrete event, not a loop, so it needs no
  `prefers-reduced-motion` guard beyond the sitewide CSS mute already
  covering its `steps()` transition.

## Common Mistakes to Avoid

Layering color plates with normal blend mode instead of multiply is the
most common failure. The "new color where plates overlap" effect is
entirely a `mix-blend-mode: multiply` property — stacking colored layers
at normal blend mode just produces flat overlap, not the riso-overprint
interaction that actually defines this style.

## Accessibility Notes

The misregistration hover effect must stay on a decorative,
`aria-hidden` layer — never let real body copy or headline text
participate in that offset. Letting actual text jitter on hover instead
of a decorative plate underneath it would make copy harder to read at
exactly the moment a user is interacting with it.

## When Not To Use This Style

Avoid this style for brand contexts that need visual consistency across
touchpoints. Three simultaneous typefaces per word, randomized plate
misregistration, and grain layered per element are deliberately
inconsistent by design, which actively fights template-based or
multi-channel systems that need predictable, repeatable output.
