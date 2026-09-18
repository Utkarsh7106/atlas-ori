---
name: swiss-design
description: >-
  Use whenever the user wants a Swiss Design / International Typographic
  Style website, landing page, portfolio, or UI component — trigger on
  "Swiss," "Swiss Style," "International Typographic Style," "Swiss
  modernism," "Basel school," "Zürich school," "Müller-Brockmann-style,"
  or synonyms like "grid-based," "editorial grid," "grotesque
  typography," "Helvetica-style," "structured minimalist." Also trigger
  on a natural-language look description even when the style isn't
  named: a strict 12-column grid, flush-left ragged-right uppercase
  headlines at tight negative tracking, exactly one saturated accent
  color (commonly red) spent only on the primary action and a few marks,
  heavy black rules dividing sections, sequential numbered labels (01 /
  02 / 03), asymmetric wide-block-against-narrow-column composition.
  "Design museum poster," "clean grid, one accent color, no shadows," or
  "precise, typography-led, uncluttered" should trigger this even if the
  user never says "Swiss." Apply even without those exact words.
---

# Swiss Design (International Typographic Style)

Everything on the page is subordinate to a 12-column grid. Objectivity beats
expression: one grotesque typeface, flush-left ragged-right setting,
mathematical spacing, exactly one signal color, and geometric shapes used as
information rather than decoration. The style originates with Switzerland's
International Typographic Style of the 1950s–60s — Josef Müller-Brockmann,
Armin Hofmann, and the Basel and Zürich schools — and reads today as
disciplined, confident, and deliberately unemotional.

## Core Rules

1. Declare a 12-column grid with a fixed gutter first, then place every element by explicit column span — never let a block size itself to its content.
2. Use one neo-grotesque (Helvetica, Inter Tight, Univers) plus one monospace for numerals; cap yourself at two weights, 400 and 700.
3. Set all display type uppercase, flush left, at −0.04 to −0.05em tracking and under 0.9 line-height; never centre a headline.
4. Allow exactly one accent color — a saturated red — and spend it narrowly: the primary action, organizing numerals, one geometric mark, and state indicators (the current nav item, a pressed/active control) — never as a general decorative color.
5. Structure with rules of two weights (4px for sections, 2px for items) and build asymmetry by pairing a wide type block against a narrow offset column.

## Reference Implementation Details

**Grid**: `display:grid; grid-template-columns:repeat(12,1fr); gap:24px;`
inside a `max-width:1400px` centered container. Every block — nav, hero,
cards, CTA — declares an explicit `grid-column` span; nothing is left to
auto-size.

**Color tokens (light)**:
- `#ffffff` — page background
- `#111111` — type, heavy rules, secondary button
- `#d31f16` — the single signal color: primary action, numerals, one geometric mark (5.28:1 contrast on white)
- `#707070` — metadata and caption text (4.95:1 contrast on white)
- `#dcdcdc` — hairline rule, used only where a 2px rule would read too loud

**Color tokens (dark, optional)**: if the build supports a dark mode, invert
only these values rather than re-skinning: background `#111111`, ink
`#f2f2f2` (16.87:1), accent lifted to `#ff4438` (5.52:1 on black — same hue,
raised so it still clears 4.5:1), grey `#9a9a9a` (6.71:1), hairline
`#3a3a3a`. Every other rule in the system references these six values, so
the whole page re-themes from one attribute flip.

**Type stacks**: body/display `"Inter Tight","Helvetica Neue",Helvetica,Arial,sans-serif`;
numerals, metadata, and grid labels only in `"IBM Plex Mono",monospace`.
Display sizes run on a `clamp()` fluid scale (e.g. `clamp(46px,9.2vw,124px)`
for a hero headline) at `font-weight:700`, `letter-spacing:-.048em`,
`line-height:.88`, uppercase. Captions and labels run 10–12px at
`+0.1em` to `+0.16em` tracking, uppercase. Deliberately leave the ramp
discontinuous — nothing between roughly 15px and 46px — rather than filling
in an intermediate size.

**Rule weights**: 4px solid rules open/close major sections (nav divider,
footer divider, CTA top border); 2px solid rules head individual cards or
list items. Never introduce a third rule weight.

**Signature mechanics**:
- Sequential numerals (`01`, `02`, `03…`) set in mono, in the accent color, as a recurring organizing device for cards, rows, and numbered lists.
- One pure geometric mark (a filled circle is the reference case, ~84px) placed on the grid as actual content, not as decoration — it takes a real column span.
- Full-column-width solid-color buttons that fill their grid cell edge to edge, sized by the grid cell rather than by their label's intrinsic width.
- Asymmetric composition: pair a wide type block (e.g. a headline spanning columns 1–10) against a narrow offset column (e.g. a short deck or metadata spanning 10–13) rather than centering or balancing evenly.
- State indication also earns the accent color: a toggle's pressed/active state, or the current item in a real multi-page nav, colors itself with the accent rather than getting a separate highlight color or a background fill.

## Common Mistakes to Avoid

The most common failure is applying the grid to type sizes but not to
placement — using a "roughly 12-column-ish" layout without actually
declaring an explicit column span for every block. The discipline is that
every single element — headline, deck, card, button, metadata line — states
its own `grid-column` range. If a block is centered, sized to its content,
or "eyeballed" into alignment, it isn't Swiss Design yet.

## Accessibility Notes

The single accent color carries real meaning (it marks the primary action,
organizing numerals, the geometric mark, and active/current state), so a
viewer with red-green
color vision deficiency loses that "this is the signal" cue if color is the
only carrier. Back the accent color with position and weight as a
redundant cue — the accent should always land on the element that is also
the boldest, largest, or most structurally prominent item in its group,
never on a plain-weight element that would otherwise look identical to its
neighbors without the color.

## When Not To Use This Style

Avoid this style for content-first reading experiences — long-form
articles, documentation, anything where prose is the point — because rigid
12-column column-span placement fights natural text measure rather than
serving it. Reach for a simpler single-column or narrower-measure layout
instead when the deliverable is mostly running text.
