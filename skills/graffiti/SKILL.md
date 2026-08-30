---
name: graffiti
description: >-
  Use whenever the user wants a Graffiti-styled website, landing page,
  portfolio, or UI component — trigger on "graffiti," "graffiti style,"
  "spray paint aesthetic," "street art website," or synonyms like
  "aerosol lettering," "subway tag style," "wildstyle typography,"
  "stencil and drip design." Also trigger on a look description even
  when unnamed: heavy outlined bubble or block lettering with a hard
  drop shadow and a soft color glow, painted on a grainy concrete wall,
  paint drips running down under the letters, slapped-on chalk-white
  nav stickers at odd angles, and a scrawled handstyle tag layered on
  top. "Make it look like a spray-painted subway wall," "bold outlined
  street-art lettering with drips," or "stencil and sticker aesthetic"
  should trigger this without the word "graffiti." Apply even without
  those exact words.
---

# Graffiti

A wall painted in passes: heavy outlined letterforms with hard shadows
and aerosol glow, over a grainy concrete ground, with drips, stickers,
and a handstyle tag layered on top as the final pass. It originates in
New York and Philadelphia, late 1960s–70s, as handstyle tags on subway
cars evolving into throw-ups and full-color pieces — specifically Black
and Puerto Rican youth culture, one of hip-hop's four elements. The same
marks used here as decoration carry a long history of being
criminalized, which is worth naming rather than treating this purely as
a texture to borrow.

## Core Rules

1. Paint the wall first: a grainy, blotched, unevenly lit concrete
   ground. Graffiti rendered on a flat color background reads as clip
   art, not paint on a surface — the wall texture is foundational, not
   decorative.
2. Outline every letterform in heavy black using `-webkit-text-stroke`
   with `paint-order: stroke fill` (so the outline sits behind the fill
   rather than eating into it), then add a hard offset shadow and a
   soft same-hue glow to simulate aerosol overspray.
3. Rotate everything roughly ±1–3deg, and let layers sit in the order
   they were "applied" — finished pieces first, handstyle tags on top
   of everything else, as the last pass.
4. Use four or five saturated aerosol colors against grey; never tint
   the wall itself with those colors — the wall stays neutral concrete
   underneath the paint.
5. Add paint drips and randomize their position, height, and width on
   every load. Paint that runs identically every time reads as a font,
   not a can — this randomization is what actually sells the effect,
   not an optional flourish.
6. Treat this as a specific cultural reference with real weight, not a
   generic decorative texture. Naming where the visual language comes
   from — and that it carries a real history — belongs in any
   production use of this aesthetic, not just as a one-off caveat on a
   demo page.

## Reference Implementation Details

**Color tokens**: `#3c3c40` concrete wall, the surface everything is
painted on; `#0c0c0e` outline black, used on every letterform without
exception; `#12c8ff` cyan for a main piece fill; `#ffd400` yellow for a
second fill and the logo; `#ff2f3c` red for a throwie and the primary
CTA; `#a83bff` violet for a handstyle tag layered over the top; `#f2f2ef`
chalk ink for body text, sticker fills, and highlights. If dark mode
exists, invert only the wall — the same daylight concrete going into
shadow — while the outline, fills, chalk, and every sticker or chip
surface stay fixed regardless of theme: spray paint and a slapped-on
sticker don't change color when the ambient light does.

**Type**: a heavy display face that survives a thick stroke (e.g.
Bungee) for all piece lettering; a script/marker face (e.g. Permanent
Marker) for handstyle tags; a condensed sans (e.g. Oswald, light and
bold weights) for body copy and labels. Display runs
`clamp(38px, 8vw, 104px)` uppercase at tight (0.94) leading, always with
the stroke-behind-fill technique from Core Rule 2. Keep body copy modest
(15.5–17px) — on a wall, the letters are the artwork and the text is
just information.

**Layout**: a wall around 1120px wide, content stacked flush left, with
every element carrying its own rotation. Cards can sit on a normal
three-column grid (24px gutter) but each one should carry a different
rotation and a different accent color cap (~10px) rather than uniform
styling. Tags are absolutely positioned over the top of everything as
the final layer.

**Signature mechanics**:
- Layered letterforms: color fill, black stroke outline, a hard offset
  shadow, and a wide same-hue glow for overspray — all four layers,
  applied in that order.
- A multi-layer concrete wall: two blotch patterns on offset tiles, two
  directional grain textures, and a diagonal base gradient, combined.
- Drips as individual elements with a rounded bottom and a small
  circular bead at the tip, per Core Rule 5 — generate them
  programmatically with randomized position/height/width, don't draw a
  single fixed drip graphic and reuse it.
- Nav links styled as slapped-on stickers: chalk-white boxes, thick
  (~3px) black borders, hard offset shadows, each at its own angle.
- A stencil block: a dashed chalk outline (~5px) with a 135° hatch
  pattern inside, standing in for a spray-through card.
- An optional aerosol-burst interaction (a scatter of colored particles
  fired from a click point) needs its own live
  `prefers-reduced-motion` check at the moment of the interaction, not
  just once at page load — a user can enable that preference mid-session,
  and an imperative animation API isn't reachable by a CSS-level mute.

## Common Mistakes to Avoid

Drawing every paint drip identically is the most common failure. Drips
need randomized position, height, and width generated per load — paint
that runs the same way every time reads as a font, not a can, and
undercuts the whole illusion of a hand-painted surface.

## Accessibility Notes

Beyond the standard motion-reduction concerns (an aerosol-burst
interaction needs a live, click-time reduced-motion check, not just a
load-time one), this style carries real cultural weight beyond
decoration: handstyle writing began as Black and Puerto Rican youth
culture, and the marks referenced here carry a long history of being
criminalized. That context is worth naming explicitly in any production
use of this aesthetic, not treated as a one-off note on a single page.

## When Not To Use This Style

Avoid this style for any brand or product context without a genuine
connection to the culture and history it comes from. Borrowing aerosol
and handstyle visual language as pure decoration, without the kind of
acknowledgment described above, is exactly the "texture to borrow"
framing this style's own origins warn against.
