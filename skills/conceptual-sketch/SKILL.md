---
name: conceptual-sketch
description: >-
  Use whenever the user wants a Conceptual Sketch website, landing page,
  portfolio, or UI component — trigger on "conceptual sketch," "wireframe
  aesthetic," "sketch-note," "esquisse," "working drawing," "marker
  drawing," "lo-fi wireframe look," "Balsamiq style," or synonyms like
  "architect's sketch," "design-process diary," "unfinished blueprint."
  Also trigger on a look description even when unnamed: a visible graph-
  paper grid, hand-drawn boxes with wobbly asymmetric corners, a
  handwriting face paired with a monospace face where the split means
  something (decisions vs. measurements), dimension lines with tick
  marks, crossed-out placeholder boxes, and blue/red marginalia notes
  scrawled in the margins as if a person were still thinking out loud on
  the page. "Make it look like a designer's working sketch," "show the
  grid and the redlines," or "like a wireframe that never got cleaned up"
  should trigger this without the words "conceptual sketch." Apply even
  without those exact words.
---

# Conceptual Sketch

A working document, not a finished one: a visible graph-paper grid,
hand-drawn boxes with asymmetric wobble instead of clean rectangles, and
marginalia in blue and red pencil that reads like a person is still
mid-decision. This traces to architectural esquisse and industrial-design
marker drawing, carried into digital product work as lo-fi wireframing
(Balsamiq, 2008) and the sketch-note tradition — process exposed rather
than resolved.

## Core Rules

1. Show the grid and keep every block aligned to it — the module (minor
   rule + major rule) must be visible on the page, not just implied by
   spacing.
2. Draw boxes with asymmetric corner radii and a second, fainter inset
   stroke, and re-roll the radii per element (and per page load) so no
   two boxes are identical — a single fixed "hand-drawn" radius reused
   everywhere is the style's defining failure, since repetition is what
   gives a fake sketch away.
3. Split typography semantically, never just aesthetically: a
   handwriting face for anything a person decided (headings, buttons,
   marginalia) and a monospace face for anything the process generates
   (body copy, dimension labels, box tags). Reversing the split breaks
   the working-document metaphor even if both faces are still present.
4. Leave process visible: crossed-out placeholder boxes, dimension lines
   with end ticks and a measurement label, small mono tags like
   "02 / card," and unresolved margin notes.
5. Marginalia is a required signature, not decoration — and at least one
   note must annotate real page content (the actual headline, a genuine
   claim, a real piece of copy), not only the surrounding chrome. A page
   where every note comments on a placeholder or a card and none ever
   touches the actual words on the page is missing the device's whole
   point: it's supposed to read as a person still second-guessing the
   real content, not just labeling boxes.
6. Restrict color to graphite (ink), one blue pencil (annotation), and
   one red pencil (redline) — never fill a shape with color; color is
   for marks on the page, not decoration of it.

## Reference Implementation Details

**Color tokens**: `#fcfcfa` cartridge-paper ground; `#e3e7ec` minor graph
rule (~22px grid); `#d2d8e0` major graph rule (~110px, every 5th line
heavier); `#2b2b2b` graphite for strokes and headings; `#3f6fd8` blue
pencil for annotation notes; a red pencil for redlines — pick a red that
clears 4.5:1 against the paper ground (e.g. `#d52c20` rather than a
brighter, lower-contrast red) since redline text is real content, not
decoration. Dark mode is not an inversion — treat it as a night session
at the drafting table: paper drops to a near-black blueprint blue (e.g.
`#12161f`), the grid stays one shade lighter than the paper, and both
pencils brighten so they still read as pencil, not paper going grey.

**Type**: a handwriting face (e.g. Architects Daughter) for headings,
buttons, and marginalia, paired with a monospace face (e.g. Courier
Prime) for body copy, dimension labels, and box tags — this pairing is
semantic as described in Core Rule 3, not a stylistic pick. Headings run
large and loose, roughly `clamp(32px, 5.4vw, 60px)`; mono type stays
small, 11–14px, with noticeably wide tracking (0.1–0.16em) so it reads as
a label rather than prose. Nothing is ever bold — a pencil has one
weight.

**Layout**: a single sheet (around 1080px) laid over the visible graph
grid described above; blocks snap to the grid and stay strictly
axis-aligned even though their borders wobble; a consistent gutter (~26px)
between blocks; an asymmetric hero split (roughly 1.35fr content to 1fr
figure) reads more like a working layout than a centered, resolved one.

**Signature mechanics**:
- Hand-drawn box: 2px solid graphite border with asymmetric corner
  radii (e.g. `255px 14px 225px 16px / 16px 225px 14px 255px`, re-rolled
  within ranges per element on load) over a translucent tint of the
  box's own accent color, plus a second, fainter stroke inset a few
  pixels to suggest a re-drawn line.
- Crossed placeholder: two diagonal hairline gradients forming an X
  inside a box, with a centered mono label identifying what belongs
  there — used for content that doesn't exist yet, never for finished
  content.
- Dimension line: a thin rule with small end ticks running outside the
  block it measures, carrying a mono measurement label sitting in a gap
  in the rule.
- Marginalia: short blue or red handwriting-face notes, absolutely
  positioned outside the normal content flow so they read as
  annotations layered on top of the page rather than part of it — but
  per Core Rule 5, at least one must comment on real page content, not
  just chrome.
- Marker-scrawl underline: an angled repeating gradient at reduced
  opacity (~55%) standing in for a hand-drawn underline stroke.
- Re-roll on load: a small script randomizes each hand-drawn box's eight
  corner-radius values within set ranges every time the page loads, so
  the "hand-drawn" quality never repeats identically — this is what Core
  Rule 2 depends on structurally, not just visually.

## Common Mistakes to Avoid

Using one fixed hand-drawn radius on every box instead of re-rolling it
per element (and per load) is the most common failure — it's what turns
a convincing sketch into an obviously templated shape the moment two
boxes are compared side by side.

## Accessibility Notes

Marginalia is visual context laid outside the normal reading order, so
in the reference build every note is `aria-hidden` and decorative-only —
sighted users pick up nuance a screen-reader user doesn't get. That's an
acceptable trade-off while notes stay commentary, but if marginalia ever
needs to carry load-bearing information (a real warning, a required
instruction), it needs an accessible equivalent instead of being hidden
outright. Keep body copy in the monospace face at a comfortable size and
line-height, since mono type at small sizes is harder to scan than a
regular text face.

## When Not To Use This Style

Avoid this style for final, production-facing UI. The entire premise is
a visibly unresolved working document mid-decision — crossed-out
placeholders, redlines, and second-guessing margin notes — which
actively undermines confidence in anything meant to look finished and
ready to ship.
