---
name: bento-grid
description: >-
  Use whenever the user wants a Bento Grid website, landing page,
  portfolio, or UI component — trigger on "bento grid," "bento box
  layout," "Apple keynote style," or synonyms like "modular tile
  grid," "compartmented layout." Also trigger on a look description
  even when unnamed: a page built entirely from rounded rectangular
  tiles of varying size packed edge to edge on one grid with a single
  uniform gap and no other page whitespace, tiles differentiated by
  surface color (white/dark/accent/tint) rather than borders, a
  two-layer soft shadow that lifts on hover, and one or two
  non-content filler tiles (a dot lattice, a bar chart, a big numeral)
  used purely to complete the packing. "Make it look like an Apple
  keynote slide," "modular tile layout like Linear or Vercel's
  homepage," or "everything in rounded boxes packed together" should
  trigger this without the words "bento grid." Apply even without
  those exact words.
---

# Bento Grid

Every piece of content is a tile. Tiles differ in span, never in
gutter. The page has no "sections" — only a packed lattice of soft
rectangles on a recessed grey ground. This is an early-2020s product-
marketing layout, named for the compartmented Japanese bento box and
popularized by Apple keynote slides, Vercel, and Linear.

## Core Rules

1. Put every piece of content inside a tile — navigation and CTAs included — and let the grid gutter be the only whitespace on the page; nothing exists outside a tile.
2. Use one grid (4–6 columns), one gap value, and one auto-row height; vary only `grid-column`/`grid-row` span to create hierarchy.
3. Give every tile the same large border-radius and the same two-layer soft shadow, then differentiate tiles by surface color (white, dark, accent, tint) rather than by borders.
4. Add one or two non-content filler tiles (a small chart, a dot lattice, an oversized numeral) so the lattice packs completely without stretching real content to fill leftover space.
5. Keep motion to the tile itself — a small lift plus an optional pointer-tracked spotlight — and never animate type or reflow the grid (grow bars via `transform: scaleY()`, never an animated `height`, since animating layout-affecting properties reflows every other tile on the same grid).

## Reference Implementation Details

**Color tokens**: `#edeef2` recessed page ground the tiles sit on;
`#ffffff` default tile surface; `#101014` heading text and the one
"dark" tile variant; `#6e7079` body copy inside tiles; one fixed accent
(`#4f46e5`) for the single vivid tile, primary buttons, and icon chips,
paired with a light tint of it (`#dfe3ff`) for chips and chart bars. The
accent and its tint should stay fixed across light/dark themes — the
page's identity is the lattice and its span-based hierarchy, and the
Design Points already describe the palette by *role* ("one vivid
tile"), not by exact hue, so holding the accent constant keeps that
role-based description true in both themes. Ground, tile surface, and
ink invert for dark mode; on a dark ground, add a thin inset rim to
tiles, since a shadow alone can't separate a dark tile from a dark
ground the way it does on a light one.

**Type**: one geometric-humanist sans (Plus Jakarta Sans or similar)
throughout — the tiles already provide visual variety, so the type
family stays singular. Weight 700 for tile headings, 600 for buttons/
chips, 500 for nav, 400 for body. Size type *per tile*, not per page: a
hero tile might run `clamp(30px,3.9vw,50px)`, card tiles ~19px, body
14.5–16px, chips/captions 11–12px uppercase at 0.1em. Headings run
tight (−0.02 to −0.035em tracking, ~1.04 line-height).

**Layout**: one CSS grid (`grid-template-columns:repeat(6,1fr)` is the
reference case) with `grid-auto-rows:minmax(112px,auto)` and a single
uniform gap (e.g. 14px) — this grid IS the page's `<main>` or content
root; don't wrap it in an extra generic container, since a wrapper with
its own layout rules can fight the grid's own sizing. Example spans: a
hero at 4×2, a decorative "mark" tile at 2×2, cards at 2×1, a CTA at
4×1, a stat tile at 2×1 — unequal spans are what carries hierarchy,
never inconsistent gap values.

**Signature mechanics**:
- A single generous radius token (e.g. 22px) on every tile, with pill radii (99px) for buttons and small radii (7–8px) for elements nested inside a tile.
- A two-part soft shadow — a subtle 1px "contact" shadow plus a wider, more diffuse ambient shadow with negative spread — that both deepen slightly on hover alongside a small upward lift (translateY).
- `overflow:hidden` on every tile so any internal gradient, spotlight, or decorative lattice bleeds cleanly to the tile's rounded corner instead of square-cornering past it.
- A pointer-tracked radial "spotlight" per tile: on `pointermove`, write the cursor's tile-relative x/y into CSS custom properties, and drive a radial-gradient positioned at those coordinates in the tile's `::after`, fading in on hover.
- Non-content filler tiles: a small grid of colored dots ("lattice"), a simple bar chart that grows in on load via `scaleY` from a bottom transform-origin (staggered per bar), or one oversized statistic. Mark these `aria-hidden="true"` since they carry no real information for assistive tech.

## Common Mistakes to Avoid

The most common failure is varying the gap value between tiles "for
breathing room." The packing logic depends on exactly one uniform gap
and equal auto-row height across the whole grid; hierarchy comes from
span alone. Inconsistent spacing between different tile pairs breaks
the illusion that this is one lattice rather than several unrelated
boxes near each other.

## Accessibility Notes

Any purely decorative filler tile (a dot lattice, a bar chart used only
for rhythm, not real data) must be marked `aria-hidden="true"`. Without
it, a screen-reader user navigating tile by tile hits a meaningless node
with no actual content to announce, right in the middle of otherwise
real navigation.

## When Not To Use This Style

Avoid this style for content sets with genuinely unpredictable item
counts or lengths. The style depends on a curated, fixed set of spans
chosen deliberately for a known content set; user-generated or
dynamically-lengthed content breaks the packing math fast, leaving
either awkward gaps or forced content truncation.
