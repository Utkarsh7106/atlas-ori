---
name: gothic
description: >-
  Use whenever the user wants a Gothic-styled website, landing page,
  portfolio, or UI component — trigger on "gothic," "gothic cathedral
  style," "blackletter design," "dark medieval aesthetic," or synonyms
  like "cathedral website," "stained glass UI," "medieval manuscript
  style." Also trigger on a look description even when unnamed: a
  near-black page with pointed lancet-arch shaped containers, blackletter
  display type paired with an old-style serif, bone-white ink as the
  only bright value, color appearing only as jewel-toned "stained glass"
  in one ornamental spot, and a single soft light source that reveals
  stone texture as the pointer moves. "Make it look like a gothic
  cathedral," "pointed arches with blackletter type," or "dark medieval
  manuscript website" should trigger this without the word "gothic."
  Apply even without those exact words.
---

# Gothic

A cathedral nave rendered as a page: pointed lancet arches, blackletter
display type, a near-black ground lit by one soft moving light, and
color admitted only as stained glass. It draws on 12th–16th century
European cathedral architecture and blackletter manuscript hands,
filtered through the 19th-century Gothic Revival of Pugin and Ruskin.
Blackletter also carries a second, more recent history beyond its
ecclesiastical use: 20th-century nationalist movements, most notoriously
Nazi Germany, adopted it as a national script before banning it as
"un-German" in 1941 — worth naming rather than treating the letterform as
a neutral, decorative "spooky" font.

## Core Rules

1. Make the page vertical: cut every container with a pointed
   `clip-path` arch whose shoulders curve inward to meet at a point
   (use extra vertices for that curve — a plain triangular point reads
   as a house roof, not a cathedral arch). Give containers tall top
   padding so the arch has room to rise through, and divide sections
   with thin vertical rules rather than horizontal bands.
2. Set display type in genuine blackletter at 27px or larger with no
   letter-spacing — the dense verticals close up and become illegible
   below that size, so a smaller "authentic-looking" blackletter is
   actually the most common way to break this style. Pair it with an
   old-style serif for running text and Roman small caps for
   navigation.
3. Keep the ground near-black with a heavy inset vignette crushing the
   edges toward black, and let bone-white type be the only bright value
   on the page otherwise.
4. Admit color only as "stained glass": deep oxblood and sapphire
   confined to one ornamental element (a rose window, glass accents) and
   to hover states — never as a page-wide fill or a general accent
   color.
5. Use long transitions (around 500ms) and a single soft light source
   that reveals stone texture as it moves — nothing should snap or
   bounce, with the narrow exception of immediate press/tap feedback on
   touch, which needs a fast response to feel responsive.

## Reference Implementation Details

**Color tokens**: `#0b0a0d` nave darkness, the page ground; `#16141a`
stone panels and arch fills; `#e9e3d6` bone limewash, used for all
lettering; `#7a1f2b` stained-glass oxblood, used only in glass elements
and on hover; `#2b3a6b` stained-glass sapphire, used in a rose window;
`#b39355` tarnished gold for tracery lines, rules, and small caps.

**Type**: a textura blackletter (e.g. UnifrakturMaguntia) for the logo,
headline, card titles, and CTA; an old-style serif (e.g. EB Garamond)
for running text; a small-caps serif (e.g. Cinzel) for navigation and
buttons. Blackletter is never tracked and never set below 27px (per
Core Rule 2); Cinzel capitals run small (10–11px) at very wide tracking
(0.30–0.34em). Body copy sits at 16.5–19px, italic for a deck line, at
1.7 line-height, so the light column of text reads clearly against the
dark ground.

**Layout**: centered on a single axis inside a ~980px wrapper, with
deliberately vertical proportions — cards carry roughly 88px of top
padding above their content, and sections are separated by 78–90px. Nav
items are divided by 1px vertical rules rather than gaps, forming a
"rood screen" of thin columns rather than a horizontal list.

**Signature mechanics**:
- Lancet arch: a 13-vertex `clip-path: polygon()` with shoulders that
  curve inward to a point (per Core Rule 1); a shallower 5-vertex gable
  works for smaller elements like buttons.
- A rose window: a 12-stop `conic-gradient` with two concentric inset
  rings and an outward oxblood glow — the page's one dedicated stained-
  glass showpiece.
- Stone texture: a 1px vertical striation gradient layered over 2px
  horizontal courses, both at very low alpha, standing in for carved
  masonry.
- A heavy vignette (e.g. `inset 0 0 240px 60px`) crushing the page edges
  to black.
- A small rotated square straddling a section's top border as a
  "crocket," marking the apex of that section — an architectural
  flourish, not a generic decoration.
- A single moving light source: a fixed radial wash (a soft, wide glow
  at low opacity in the bone color) that tracks the pointer directly —
  written straight to custom properties from the pointer position with
  no easing, damping, or animation loop. Because it never moves on its
  own once the pointer stops, this specific implementation is direct
  manipulation rather than motion, and doesn't need a
  `prefers-reduced-motion` guard — but that exemption is narrow: adding
  any easing, damping, or a persistent animation loop to the effect
  would require one, since at that point it would keep moving without
  further input.

## Common Mistakes to Avoid

Setting blackletter at small sizes "for authenticity" is the most
common failure. Blackletter's dense verticals close up and become
illegible below roughly 27px — small blackletter body text isn't more
authentic, it's just unreadable.

## Accessibility Notes

Blackletter carries a real 20th-century political history beyond its
ecclesiastical origin — adopted, then banned, by Nazi Germany — and that
context deserves the same care in any real product as other historically
loaded imagery choices, not a "spooky font" pick made without
acknowledging it.

## When Not To Use This Style

Avoid this style for products needing broad legibility at small sizes or
fast scanning — mobile-first utility apps, dense data tables. A 27px
display-type floor and a centered single-axis layout are built for a
stately hero moment, not compact, information-dense screens.
