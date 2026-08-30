---
name: wabi-sabi
description: >-
  Use whenever the user wants a Wabi Sabi-styled website, landing page,
  portfolio, or UI component — trigger on "wabi sabi," "wabi-sabi
  aesthetic," "Japanese tea ceremony style," "imperfect minimalism," or
  synonyms like "rustic Japanese design," "kintsugi website," "asymmetric
  earthen design." Also trigger on a look description even when unnamed:
  a warm plaster-toned page with deliberately uneven, asymmetric
  columns, hand-formed irregular edges instead of true circles or
  rectangles, an enormous amount of unequal whitespace, warm earthen
  neutrals with a single gold accent appearing only along cracks, and
  everything moving very slowly. "Make it feel like a Japanese tea
  ceremony," "asymmetric earthy layout with a kintsugi gold crack," or
  "imperfect, handmade-feeling minimalism" should trigger this without
  the words "wabi sabi." Apply even without those exact words.
---

# Wabi Sabi

A composition where deliberate, systematic asymmetry and enormous empty
space are the material, not decoration around content: hand-formed
irregular edges, warm earthen neutrals, a single gold accent that only
appears along a repaired break, and motion slow enough to be felt rather
than seen. It comes from 15th–16th century Japan — the tea aesthetic of
Murata Jukō and Sen no Rikyū, valuing the weathered, asymmetric, and
incomplete over the new and symmetrical. Wabi-sabi is inseparable from
Zen Buddhist thought — Rikyū, its tea-ceremony source, was a religious
figure and philosopher, not a decorator — worth naming rather than
letting the term circulate as Westernized lifestyle-marketing shorthand
for "rustic minimalism."

## Core Rules

1. Make asymmetry systematic, not occasional: give no two columns in a
   layout the same width, and no two sibling blocks the same vertical
   offset. This has to be deliberate and calculated throughout the whole
   page — a layout that's symmetric everywhere except one accent block
   isn't this style.
2. Never use a true circle or a plain rectangle for any rounded form.
   Give every button, card, and vessel shape its own eight-value
   asymmetric `border-radius` so no edge reads as a true arc — and treat
   this as a real per-component cost: each new rounded element needs its
   own bespoke set of values, not one reused token, or the "no true arc"
   premise quietly collapses back to a symmetric radius under deadline
   pressure.
3. Treat empty space as the main material, not padding around the
   content. Use viewport-relative section spacing and generous
   line-heights (around 2 on body copy) so the interval between elements
   carries as much presence as the elements themselves.
4. Use warm earthen neutrals throughout, with a single metallic accent
   (gold) that appears only along cracks and breaks — never as a general
   accent color. Keep ink warm rather than true black; a cold, pure
   `#000` fights the whole palette.
5. Make everything slow — transitions in the 1.1–2.4s range — and let
   imperfection change rather than resolve: an irregular edge should
   morph into a *different* irregular shape on interaction, never snap
   to a clean, perfect one. The one deliberate exception is press
   feedback on touch: a tap needs to register instantly, since a finger
   lifts long before a slow ease would finish, so pressed states apply
   immediately and only ease back out at the page's own slow pace on
   release.

## Reference Implementation Details

**Color tokens**: `#e9e3d7` lime-washed plaster wall, the page ground;
`#33302a` sumi ink for type — warm, never true black; `#5f5b52` ash grey
for body copy and small labels; `#bda98f` unglazed clay, for vessel
shapes; `#7d8471` aged bronze-green; `#a9884f` kintsugi gold, used only
along breaks and cracks per Core Rule 4. Warm sumi-ink text on this
lime-washed ground sits close enough to the contrast floor that any new
secondary-text color needs an explicit contrast check — don't assume it
inherits enough contrast just because it fits the warm-neutral palette
visually.

**Type**: a Japanese mincho with visibly uneven stroke weight (e.g.
Shippori Mincho) for headings, paired with a light humanist sans (e.g.
Karla Light) for body — nothing set above weight 500 anywhere. Line-
height runs unusually generous: around 1.62 on headlines, 2.05–2.1 on
body. Headings carry slightly open tracking (0.02–0.3em) with a matching
`text-indent`. Keep navigation labels lowercase rather than capitalized —
capitals assert, and this style deliberately doesn't.

**Layout**: asymmetry expressed in real numbers, per Core Rule 1 — for
example a hero split around 1.42fr/0.58fr, a three-card row around
1.06/0.92/1.02fr, a CTA split around 0.44/1.56fr, with sibling cards
pushed down by different amounts (e.g. 0px, 46px, 18px) so their tops
never align. Vertical rhythm is enormous and viewport-relative (roughly
`clamp(90px, 17vh, 190px)` for section gaps).

**Signature mechanics**:
- Hand-formed rims: an eight-value asymmetric `border-radius` (e.g.
  `48% 52% 47% 53% / 54% 46% 55% 45%`) on every rounded button or vessel
  shape, per Core Rule 2.
- A kintsugi seam: a thin (~2px) gold gradient with a visible gap in it,
  running through a headline or divider — repairing a break rather than
  hiding it, the style's central metaphor made literal.
- An ensō: a circle drawn with one border side removed and another
  faded, left deliberately open rather than closed — if animated, a
  very slow single rotation (on the order of 90 seconds) so the motion
  is felt rather than consciously seen.
- Plaster texture: two low-alpha repeating gradients at different
  angles (e.g. 74° and 4°) layered on the ground — never a flat fill.
- Clay vessel shapes in a few different silhouettes, each marked by a
  single hairline gold crack.
- A slow, one-shot reveal: an `IntersectionObserver` adds a class that
  triggers an 8px rise and fade over roughly 2.4s per block, staggered
  around 220ms apart, then unobserves that block so it never repeats.
  Deliberately don't gate the observer itself behind a
  `prefers-reduced-motion` check — the observer performs a single class
  write and stops, it isn't itself an animation; the actual motion is
  the CSS transition duration, which the standard sitewide reduced-
  motion rule already collapses on its own. Gating the observer away
  would strand every block at opacity:0 instead of removing motion.

## Common Mistakes to Avoid

Treating "imperfect" as "unfinished," or applying irregularity as a
filter over an otherwise-symmetric layout, is the most common failure.
This style's asymmetry is systematic — no two columns share a width, no
two sibling blocks align vertically — a deliberate, calculated
irregularity throughout, not sloppiness left unresolved in one spot.

## Accessibility Notes

Warm sumi-ink text on the lime-washed ground already sits close to the
contrast floor, so any new secondary-text color introduced later needs
its own explicit contrast check rather than an assumption that it
inherits enough contrast just because it fits the palette by eye.

## When Not To Use This Style

Avoid this style for high-density transactional UI — checkout flows,
forms, dashboards. The 1.1–2.4s transitions and generous, unequal
whitespace are the entire point of the style, and both directly cost
time and predictability exactly where users want speed and consistency
instead.
