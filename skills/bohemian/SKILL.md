---
name: bohemian
description: >-
  Use whenever the user wants a Bohemian website, landing page,
  portfolio, or UI component — trigger on "bohemian," "boho," "boho
  chic," "Southwestern style," "Moroccan interior style," or synonyms
  like "adobe aesthetic," "macramé website," "earthy handcraft site."
  Also trigger on a look description even when unnamed: arched
  doorway-shaped containers instead of rectangles, a warm terracotta and
  ochre palette on limewashed sand, a woven thread-texture background,
  condensed hand-lettering paired with an old-style serif, and hanging
  macramé fringe or beaded trim. "Make it feel like a desert adobe
  room," "warm earthy tones with an arched doorway shape," or "macramé
  fringe and hand-lettering" should trigger this without the word
  "bohemian." Apply even without those exact words.
---

# Bohemian

A limewashed adobe room built in CSS: arched doorway containers, a
sun-warmed earth palette, a woven thread-texture ground, and hand-knotted
macramé fringe. It descends from 19th-century Parisian bohème by way of
1960s–70s counterculture and today's interiors revival — and its actual
visual vocabulary comes from specific living craft traditions worth
naming rather than folding into one generic "boho" surface: Amazigh and
other North African weaving, Diné and Pueblo textile and architecture,
and Latin American macramé.

## Core Rules

1. Build every container as an arch, not a rectangle: top corners
   rounded to roughly 34–50%, bottom corners squared off — a doorway
   shape rather than a card. The arch is the layout module this style is
   built from; using plain rectangular cards anywhere undercuts the
   entire premise.
2. Use a sun-warmed earth palette — terracotta, ochre, dusty rose, olive
   — set on limewashed sand, with a warm walnut brown for text rather
   than black.
3. Weave the background from fine repeating gradients rather than a flat
   fill — the ground should read as woven cloth or plaster, never as a
   solid color block.
4. Pair condensed hand-lettering with an old-style serif that has a true
   italic, and always set the hand-lettering larger than the body copy
   it introduces — the handwriting labels, the serif reads.
5. Add at least one real craft element — fringe, beads, or a
   block-printed border — generated as repeated DOM elements with
   randomized length and timing per element, so it reads as hand-made
   rather than a single stamped, identical pattern.
6. Treat this as a specific cultural reference, not a generic mood board.
   Name the actual craft traditions being drawn on (the ones above, or
   whichever apply to the specific motifs used) rather than presenting
   the look as an undifferentiated "boho" surface — this is a direct,
   deliberate design decision on the reference page, not incidental
   flavor text.

## Reference Implementation Details

**Color tokens**: `#f3e7d8` limewashed adobe, the page ground; `#c56b4a`
terracotta for arches, beads, and fringe; `#9e563b` a deeper terracotta
for CTA fields, held at a fixed value regardless of theme; `#d9a441`
ochre for sun motifs and inset rings; `#c98b8b` dusty rose for textile
motifs; `#626642` olive for small labels and beads — pick an olive dark
enough to clear AA on the ground rather than a brighter one that reads
better in isolation but fails at label size; `#4a3627` walnut ink for
body text. If dark mode exists, invert the ground, panel surfaces, and
ink together (the same limewashed room after dark, not a different
palette), lifting terracotta/ochre/rose/olive a shade so they stay warm
against the darker ground — but hold small "lit" elements like a CTA
field and its solid buttons at fixed values in both themes, the way
lamplight indoors doesn't change color with the hour. Any new
interactive element needs an explicit choice about which behavior it
follows (inverting with the theme, or fixed like lamplight) rather than
drifting into whichever happens by default.

**Type**: three faces with distinct jobs — a condensed hand-lettering
face (e.g. Amatic SC) for the logo, card titles, and large CTA text; an
old-style serif with a true italic (e.g. Cardo) for headlines, body
copy, and nav links; a light-weight geometric sans (e.g. Outfit Light)
for small uppercase labels and buttons. Card titles run large in the
hand-lettering face (around 40px at tight ~0.9 leading) against smaller
serif body copy (around 16px at ~1.75 line-height) — the hand-lettering
is always the larger of the two. Labels sit at 10–13px with 0.22–0.26em
tracking.

**Layout**: a centered column around 1080px wide, everything
center-aligned, since the whole composition reads as a series of
doorways. Separate sections generously (60–64px), and use a comfortable
gutter (~26px) in any card grid.

**Signature mechanics**:
- Adobe arch: split `border-radius`, e.g. `50% 50% 12px 12px / 34% 34%
  12px 12px` — rounded top, squared base.
- Woven ground: two fine thread gradients at 90° and 0° layered over a
  warm ochre light wash.
- Block-print rule: two offset radial-dot patterns tiled at ~32px, plus
  a fine vertical warp line.
- Inset ring: an `inset 0 0 0 7px` ochre ring just inside a terracotta
  arch's border, imitating a painted doorway surround.
- Macramé fringe: DOM-generate a row of cord elements (a real page uses
  around 48) with randomized length (roughly 18–52px) and randomized
  animation delay each, swaying a few degrees on a slow (~4.6s)
  ease-in-out loop so the row ripples rather than moving as one block. A
  static, pre-authored fringe graphic loses the uneven, hand-knotted
  quality this randomization exists to produce — generate it, don't draw
  it once.

## Common Mistakes to Avoid

Treating "boho" as one generic pattern-and-fringe look, without
attributing the actual craft traditions the visual devices come from, is
the most common failure. Name the specific traditions being referenced
rather than folding everything into an undifferentiated surface texture.

## Accessibility Notes

The CTA field and its solid buttons hold fixed colors in both light and
dark themes, unlike the rest of the palette, which inverts. Any new
interactive element needs an explicit decision about which behavior it
follows — fixed or inverting — or it will drift out of the pattern this
style establishes and create an inconsistent theming experience.

## When Not To Use This Style

Avoid this style for minimal or corporate-neutral products. The warm
earth palette, arch-shaped containers, and hand-craft texture are
maximally specific cultural signifiers; used generically, without the
sourcing care this style calls for, it risks reading as costume rather
than reference.
