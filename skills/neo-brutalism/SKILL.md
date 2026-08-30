---
name: neo-brutalism
description: >-
  Use whenever the user wants a Neo-Brutalist website, landing page,
  portfolio, or UI component — trigger on "neo-brutalism," "neo-
  brutalist," "Gumroad-style," "flat block design," or synonyms like
  "thick black outlines," "hard offset shadows," "punchy blocks." Also
  trigger on a look description even when unnamed: flat saturated
  color blocks (no gradients, no textures) with a uniform 4px solid
  black border and a 6px hard zero-blur offset shadow, one geometric
  sans at exactly two weights, everything axis-aligned with no
  rotation, buttons that physically "press" into their own shadow on
  click. "Chunky outlined cards with a hard shadow," "like a Figma
  community template," or "flat colors, thick borders, no gradients"
  should trigger this without the word "brutalist." Distinct from
  plain Brutalism (unstyled browser defaults, no color) and Maximalism
  (rotated, five-plus colors, clashing typefaces) — this is orderly,
  grid-aligned, one typeface, one shadow system. Apply without exact words.
---

# Neo-Brutalism

Brutalism after a design system got hold of it. Raw honesty is kept as an
*aesthetic* — thick outlines, flat fills, hard shadows — but everything is
now deliberate: one typeface, a fixed palette, an orderly grid, and
nothing rotated. This reads as circa-2020-onward product marketing
(Gumroad's redesign, Figma community kits, Tailwind-era landing pages),
borrowing brutalism's rawness as decoration rather than as ideology.

## Core Rules

1. Define one block primitive — flat fill, 4px black border, 0 border-radius, 6px hard black offset shadow with no blur — and build the entire page from variants of it.
2. Use one geometric sans at exactly two weights (roughly 500 and 700); never mix typefaces.
3. Fill blocks with flat saturated color from a fixed 3-color set plus white/off-white; ban gradients, textures, and patterns outright.
4. Keep every element axis-aligned on a strict grid with one repeated gap value — no rotation, no overlap, no collage.
5. Make interaction physical: hover lifts the element and grows its shadow; pressing translates it into its own shadow until the shadow disappears, all at a short, linear (non-eased) duration around 80ms.

## Reference Implementation Details

**Color tokens**: a warm off-white page ground (e.g. `#fdf6e3`); a single
fixed dark edge/text/shadow color (e.g. `#101010`) used for every border,
every shadow, and all text; three fixed bright block fills — a primary
yellow (`#ffd93d`), a secondary coral (`#ff6b6b`), a tertiary mint
(`#7bf1a8`) — plus a neutral white/off-white block for text-heavy
surfaces. If a dark mode is needed, flip only the page ground, the
neutral block, and the edge color (the edge goes light — a dark outline
on a dark block is invisible); the three bright fills and the text-on-fill
color stay fixed in both themes, since they're already bright enough to
read against either ground.

**Type**: one geometric sans (Space Grotesk or similar; fallback to a
system UI sans) at exactly two weights — 700 for every heading, button,
badge, and nav item, 500 for body. One family is the whole point: the
outlines and shadows carry the personality, so type must stay boring and
consistent. Headings run large and fluid (`clamp(36px,5.6vw,62px)` for a
hero) at around −0.035em tracking and 1.0–1.02 line-height; body sits at
15.5–17px; labels/badges are 12px uppercase at 0.1em tracking.

**Layout**: a centered wrapper (~1080px) on an explicit grid — a hero
split like `1.55fr 1fr`, feature cards on a strict `repeat(3,1fr)` — with
one repeated gap value used everywhere (e.g. 26px). Everything sits flush
to its grid cell at 0 degrees; the style's energy comes from weight and
color, never from tilt or overlap (that's Maximalism's territory).

**Signature mechanics**:
- The `.block` primitive (flat fill, 4px border, 0 radius, 6px hard offset shadow) is reused for every surface — nav, cards, CTA band, footer, dialog — never a one-off exception.
- Nested outlines establish hierarchy by border *weight*, not by size or color alone: a 3px-bordered badge or pill sitting inside a 4px-bordered block reads as subordinate to it.
- A button's hover state moves it up-and-left a couple of pixels and grows its shadow (e.g. 6px → 9px); its active/press state translates it fully into its own shadow so the shadow reads as 0 and the element appears physically depressed into the page.
- On a dark-filled CTA button that needs to stay legible sitting on a bright block, a double-offset shadow (a light layer, then the dark layer further out) keeps the button readable against its own background.
- Because CSS `:active` doesn't reliably fire on a touchscreen tap before the browser decides the gesture isn't a scroll, a physical "press" effect needs a small amount of JS (pointerdown/pointerup with a short minimum hold) to guarantee the depression is visible on touch, not just with a mouse.

## Common Mistakes to Avoid

The most common failure is adding a gradient or a soft blurred shadow "to
make it pop." The rule is strictly flat color — no gradient, texture, or
pattern anywhere. A single gradient undoes the entire flat-color-plus-
hard-shadow logic that gives this style its graphic punch; if something
needs to "pop" further, make the shadow offset bigger or the block bigger,
never softer.

## Accessibility Notes

Border weight is doing double duty here as both decoration and hierarchy
signal — a 3px badge border sitting inside a 4px block border is how this
style says "this is subordinate." A screen-magnifier user zoomed in tight
may not perceive that 1px weight difference as meaningfully distinct from
ordinary zoom rendering artifacts, so don't rely on border-weight alone to
carry a hierarchy relationship that also matters functionally — pair it
with a real size or position difference too. Also give every interactive
element a hard offset focus ring in the same vocabulary (a solid outline
with an offset, no blur, no radius) rather than a default browser ring
that would clash with the rest of the system.

## When Not To Use This Style

Avoid this style for long-form content or data-heavy interfaces. Hard
shadows and thick borders on every block get visually loud fast once
there are more than a handful of blocks on screen at once — it's a style
for a small number of confident, high-impact blocks, not for dense grids
of many small ones.
