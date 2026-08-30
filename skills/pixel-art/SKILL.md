---
name: pixel-art
description: >-
  Use whenever the user wants a Pixel Art / retro-console website,
  landing page, portfolio, or UI component — trigger on "pixel art,"
  "pixel UI," "8-bit," "16-bit," "retro console," or synonyms like
  "arcade style," "bitmap font," "NES/SNES look." Also trigger on a
  look description even when unnamed: a small fixed palette (8–16
  colors) with chamfered pixel borders drawn from stacked hard
  box-shadow steps instead of border-radius, dithered checkerboard
  patterns standing in for gradients, genuine bitmap typefaces with
  anti-aliasing disabled, single hard-offset (never blurred) drop
  shadows, sprites built from box-shadow bitmaps, and every animation
  stepping instantly with no interpolation. "Make it look like a retro
  video game," "chunky pixel borders, no smooth edges," or "8-bit
  console screen" should trigger this without the word "pixel."
  Apply even without those exact words.
---

# Pixel Art

A 16-color console screen. Everything snaps to a 4px pixel: borders are
drawn as chamfered box-shadow steps, gradients are replaced by
dithering, sprites are box-shadow bitmaps, and every animation uses
`steps()` because there are no in-betweens. This traces to 1977–1995
console and arcade hardware — Atari VCS through the SNES — where limited
memory forced fixed palettes and tile grids, deliberately revived by
indie games from the late 2000s onward.

## Core Rules

1. Define one pixel unit as a custom property (e.g. `--px: 4px`) and express every dimension on the page — padding, gaps, margins, shadow offsets — as `calc(var(--px) * n)`. No arbitrary, non-multiple values anywhere.
2. Ban `border-radius`, blur, and anti-aliasing outright: draw borders and bevels with stacked hard `box-shadow` steps and disable font smoothing (`-webkit-font-smoothing: none`).
3. Fix a small palette (8–16 colors, named by role) and replace every gradient with a dither pattern instead.
4. Use genuine bitmap typefaces (Press Start 2P, Silkscreen, or similar) at whole-pixel sizes only, with a single hard-offset text-shadow (never blurred).
5. Make all motion use `steps()` and every hover/active state instant — interpolation is the one thing that immediately breaks the illusion.

## Reference Implementation Details

**Color tokens**: a small fixed set assigned by role rather than
decoration — e.g. `#1a1c2c` void (darkest value, panel fill), `#29366f`
deep blue (secondary field), `#ffcd75` yellow (logo/highlights/primary
CTA), `#b13e53` red (used sparingly, e.g. only as a text drop-shadow
pixel), `#ef7d57` orange, `#38b764` green (a second action color),
`#41a6f6` cyan (body accents, dithering), `#566c86` slate (bevel/muted
labels), `#f4f4f4` white (default ink). For a dark/"brightness down"
variant, don't recolor the lit palette — deepen only the darkest ground
tones further toward black (the same screen at lower brightness), since
the 8–16 "lit" colors were already chosen to read against a near-black
tube and moving them breaks the fixed-palette premise.

**Type**: one bitmap display face (Press Start 2P or similar) for all
headings and UI labels, paired with a second bitmap face (Silkscreen or
similar) for body copy — both genuinely pixel-based, with font smoothing
disabled so the browser can't anti-alias them. Restrict sizes to values
that land on whole pixels (8, 9, 10, 12, 14, 20px are good anchors).
Line-height runs unusually loose (1.6–1.75) since bitmap capitals have
minimal descender room. Every heading gets exactly one hard text-shadow
offset by one pixel unit — never a blur.

**Layout**: everything derives from the one `--px` token via `calc()`,
so the whole layout snaps to a grid. A simple multi-column layout with a
gutter that's also a `--px` multiple is enough — the discipline is in
the units, not a special grid system.

**Signature mechanics**:
- Chamfered panel border: eight stacked `box-shadow` steps forming two concentric rings (e.g. a 1px-scaled white inner ring, a 2px-scaled slate outer ring) — `0 -1px 0 0 white, 0 1px 0 0 white, -1px 0 0 0 white, 1px 0 0 0 white, 0 -2px 0 0 slate, ...` and so on, all in `--px` multiples. No `border` property, no `border-radius`, anywhere.
- Dithering instead of gradients: `repeating-conic-gradient(<color> 0% 25%, transparent 0% 50%) 0 0/8px 8px` produces a checkerboard that reads as a mid-tone at a distance — use it for skies, meters, and anywhere a smooth gradient would otherwise go.
- Beveled buttons: a lighter pixel-offset shadow on the top/left, a darker one on the bottom/right, plus a small hard cast shadow — reads as a raised 3D button — and the button translates exactly one pixel down-right on `:active`, with `transition:none` so the press is instant.
- A sprite generated from an ASCII bitmap: map each character in a small grid (e.g. 12×12) to a palette color, then build one element's `box-shadow` list where each non-empty cell becomes one `<x>px <y>px 0 0 <color>` entry — this draws a whole sprite from a single element with no image asset.
- `image-rendering: pixelated` on the root plus disabled font smoothing so nothing on the page is ever interpolated by the browser.

## Common Mistakes to Avoid

The most common failure is using a gradient anywhere "for smoothness."
Every gradient must be replaced by a dithering pattern specifically
because a smooth gradient contradicts the fixed 8–16-color hardware
constraint the whole style is simulating — a single smooth gradient
undoes the illusion immediately, no matter how correct everything else
is.

## Accessibility Notes

Disabled font smoothing and `image-rendering: pixelated` are load-bearing
for the aesthetic, but they also opt the page out of the browser's own
text-rendering optimizations — a low-vision user relying on OS-level font
smoothing gets bitmap type that can't benefit from those system settings.
This is a real, disclosed trade-off of the style rather than an
oversight; keep body copy modest in length and generous in line-height
to partially compensate, per the "when not to use" guidance below.

## When Not To Use This Style

Avoid this style for interfaces with real body-copy reading demands.
Genuine bitmap faces at small fixed sizes with no anti-aliasing are
legible in short UI bursts but fatiguing for sustained reading — reserve
this style for marketing pages, game UIs, and short-form content, not
long-form articles or documentation.
