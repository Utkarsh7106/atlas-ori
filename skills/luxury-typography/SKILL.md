---
name: luxury-typography
description: >-
  Use whenever the user wants a Luxury Typography website, landing page,
  portfolio, or UI component — trigger on "luxury typography," "luxury
  fashion site," "maison," "fragrance brand site," "haute couture web,"
  "high fashion editorial," or synonyms like "Vogue style," "Bodoni
  site," "Didot headline," "didone," "tracked capitals." Also trigger on
  a look description even when unnamed: a single huge serif didone
  headline set against tiny, extremely tracked sans-serif capitals with
  almost nothing in between, one full-bleed black field used exactly
  once, roman numerals as section markers, and a page that stays mostly
  empty on purpose. "Make it look expensive and restrained," "like a
  perfume brand's website," or "huge serif headline, tiny spaced-out
  labels" should trigger this without the words "luxury typography."
  Apply even without those exact words.
---

# Luxury Typography

The house style of European fashion and fragrance maisons: one huge
didone headline against 9px tracked-capital labels, almost nothing on
the scale between them, and a page that stays mostly empty on purpose.
It descends from Bodoni and Didot's 1790s didones by way of mid-century
Vogue, and has been the default for luxury web identity since roughly
2015.

## Core Rules

1. Set exactly two typefaces: one didone (Bodoni, Didot, or similar) for
   display, one geometric sans at a light weight (around 300) for
   everything else — never a third face, and never bold anywhere; italic
   in the metallic accent color is the only emphasis.
2. Build hierarchy from scale contrast alone: a display headline well
   above 90px against 9px capitals tracked to roughly 0.42–0.46em, with
   almost nothing occupying the middle of that ramp.
3. Pair every large element with a small tracked label sitting in an
   opposing narrow column — an asymmetric two-track grid (a slim label
   column against a wide content column), never a centered composition.
4. Restrict the palette to ivory, near-black, and one metallic accent —
   no third color, no ornament, no border-radius anywhere. The accent
   needs two different token values depending on where it sits: a
   lighter value for text on the black field, a deepened value for every
   other, ivory-background use — a single value cannot clear AA contrast
   in both places, so reusing only one token risks silently failing
   contrast wherever it wasn't tuned for that background.
5. Leave at least a third of the page empty and slow every transition to
   600ms or more — restraint and unhurried motion are what make the
   style read as expensive. Filling that empty space with another CTA
   or badge undoes the whole effect, and it's the single most common way
   to break this style.

## Reference Implementation Details

**Color tokens**: `#f7f4ef` ivory page ground (warmer than white);
`#12100e` near-black ink, also the one full-bleed black field's fill;
`#b09a72` champagne, used only for hover text sitting on the black
field — the one context this lighter value clears AA; `#78694e`
champagne-ink, the same accent deepened, used everywhere else on the
ivory ground (headline emphasis, roman numerals, button-hover text);
`#6a655e` warm grey for secondary/body text; `#ddd7cc` for hairline
rules. Keep the two champagne values distinct in code (e.g.
`--champagne` and `--champagne-ink`) rather than collapsing them to one
token, per Core Rule 4.

**Type**: a didone display face at `clamp(42px, 8.4vw, 116px)` with
tight leading (~0.98), capped to roughly 13 characters wide so a
substantial share of the hero stays empty. Labels run at 9px with
0.42–0.46em letter-spacing and a matching `text-indent` of the same
value, so the trailing tracked space doesn't throw off alignment against
other text. Body copy sits at 14.5–15px with generous 1.75–1.85
line-height. Card or sub-section titles are the one intermediate size
allowed, around 30px — everything else on the page is either the huge
display size or the tiny tracked-label size.

**Layout**: an asymmetric two-track grid — a narrow `minmax(120px,
1fr)` label column against a wide `4.4fr` content column — reused
consistently in the hero and any CTA band. Vertical padding is
viewport-relative and large, around `clamp(72px, 13vh, 150px)`.

**Signature mechanics**:
- Buttons are tracked capitals sitting over a 1px underline — no fill,
  no border-radius, no box. On hover, the rule recolors to the deepened
  champagne and the button gains extra horizontal padding, so the whole
  control appears to breathe outward; keep this transition slow (600–
  700ms) to match the rest of the style's pacing.
- Underlines wipe out to one side and back in from the other on hover,
  over roughly 700ms — never an instant color swap.
- Roman numerals in champagne italic replace plain digits as section
  markers.
- The one full-bleed black field escapes the content wrapper via
  negative margins so it reaches the true viewport edge, and appears
  exactly once on the page — using it more than once cancels its impact
  as a singular gesture.
- A headline reveal that splits text into per-word spans and fades/rises
  each one in sequence (roughly 14px rise + fade, ~1s per word,
  staggered ~90ms apart) reads as the line assembling itself. Drive this
  through a CSS transition triggered by one discrete class toggle rather
  than a scripted animation loop — that way `prefers-reduced-motion`
  mutes it to an instant, imperceptible appearance for free, with no
  separate script-side guard needed.

## Common Mistakes to Avoid

Filling the page's deliberately empty third with another CTA, badge, or
piece of content is the most common failure — the empty space is the
point, not a gap to be filled, and using it undoes the restraint the
whole style depends on.

## Accessibility Notes

Extreme letter-spacing (0.42–0.46em) at a 9px size is aggressive by any
standard. It doesn't affect screen readers, but a sighted low-vision
user relying on browser zoom can see label alignment break, since the
matching `text-indent` is tuned to that exact tracking value at default
zoom and drifts out of sync at high zoom levels. Also keep the two
champagne token values (Core Rule 4) scoped correctly — using the
lighter, black-field-only value on the ivory ground fails contrast
silently, since nothing about the color itself signals which background
it was tuned for.

## When Not To Use This Style

Avoid this style for data-dense or information-first products. A scale
ratio this extreme — roughly 13:1 with almost nothing in between — and
this much reserved empty space actively fight any interface that needs
to show many things at once.
