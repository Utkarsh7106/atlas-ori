---
name: scrapbook
description: >-
  Use whenever the user wants a Scrapbook-style website, landing
  page, portfolio, or UI component — trigger on "scrapbook,"
  "scrapbooking," "craft paper," "washi tape," "cut and paste," or
  synonyms like "collage," "journal page," "zine layout." Also
  trigger on a look description even when unnamed: a warm kraft-paper
  or cork background with lighter paper rectangles laid on top, torn
  or ragged edges cut with clip-path, strips of translucent colored
  tape holding pieces down, a handwriting typeface paired with a worn
  typewriter face, and every element tilted a few degrees off-axis in
  a non-repeating pattern. "Make it look like a physical scrapbook,"
  "taped-down paper cutouts," "handwritten notes and typewriter
  text," or "like a craft journal page" should trigger this without
  the word "scrapbook." Apply even without those exact words.
---

# Scrapbook

An analogue page: kraft board, paper cut-outs, washi tape, biro
handwriting, and a tired typewriter. Every element is a physical object
placed by hand — slightly crooked, casting a soft shadow, held down by
tape. This traces to Victorian commonplace books and 1990s craft-store
scrapbooking, revived digitally through zine culture and Pinterest-era
collage layouts.

## Core Rules

1. Start from a textured warm ground (kraft, linen, cork) and place every content block as a lighter paper rectangle on top of it — never let content touch the ground directly.
2. Rotate every object by roughly ±0.5–3deg using distinct values, and never repeat the same rotation angle twice in a row.
3. Pair one handwriting typeface with one typewriter typeface, and set the handwriting larger than the body text — the annotation should outrank the document.
4. Fasten each paper element with a visible physical device — tape, a paperclip, a staple, a pin — positioned with negative offsets so it visibly overhangs the element's edge.
5. Give every paper element two shadows (a hard offset for physical thickness, a soft blur for lift off the board), and draw rules, margins, and paper grain with repeating gradients rather than images.

## Reference Implementation Details

**Color tokens**: `#d8c3a5` kraft board (the surface everything sits on);
`#fdf6e8` cut paper / index-card stock; `#f6efdd` a second, slightly
warmer cut-out stock for variety; `#2f3a4a` biro navy for handwriting and
body text; `#c1483b` a faded red for margin rules, stamps, and doodles;
`#8a9a7b` a muted craft sage, good for one cut-out accent (like a button);
a translucent warm yellow (~`rgba(238,214,140,.72)`) for washi tape,
which stays the same color in both light and dark modes since it's "the
same roll of tape either way." If a dark mode is needed, don't just
invert — this is a physical-object metaphor, so think about what
actually changes when the light dims: the board goes to shadow, cut
paper stops being white, but you can't write on a dark page with a biro
— ink color should flip to a light gel-pen tone while the papers around
it merely dim.

**Type**: a handwriting face (Caveat or similar) for every heading, set
large — `clamp(40px,7.6vw,84px)` for a hero, ~38px for card titles, all
at weight 700. A worn typewriter face (Special Elite or similar) for all
body copy and labels, 13–14px with generous 1.9–2 line-height so text
sits convincingly on ruled lines, and ~11px at wide (0.22em) tracking for
small stamped labels.

**Layout**: a centered board (~1060px) with loosely stacked paper
objects and generous kraft showing between them (40–78px of gap).
Feature cards can sit on an `auto-fit`/`minmax(240px,1fr)` grid, but
every card still carries its own distinct rotation.

**Signature mechanics**:
- Torn paper edges: a many-point `clip-path: polygon(...)` running along the top and bottom of a strip, giving it a hand-torn silhouette instead of a straight rectangle.
- Washi tape: absolutely-positioned translucent rectangles, rotated anywhere from about −28deg to +23deg, with a dashed line down each short edge to suggest the tape's woven texture, placed at a parent's corner with negative offsets so it overhangs.
- Ruled/margined paper drawn entirely with `repeating-linear-gradient` — evenly spaced horizontal rule lines (e.g. every ~31px) plus a single vertical margin rule near the left edge — never an image.
- A two-part paper shadow on every "paper" element: a small hard offset (e.g. `2px 4px 0 <edge-color>`) for physical thickness, plus a separate soft blurred shadow for lift off the board.
- Small analogue props built from pure CSS: a paperclip (a bordered, border-radius'd box with one side's border color removed), a rotated double-bordered "rubber stamp," a marker highlight (a skewed translucent bar behind a headline).

## Common Mistakes to Avoid

The most common failure is rotating every paper object by the same
angle. The rule is distinct rotation values every time, and never
repeating the same angle back to back — uniform rotation reads as a
"tilted template" effect applied to the whole page at once, rather than
individually placed pieces that were actually handled one at a time.

## Accessibility Notes

If any element uses free-form pointer dragging as its primary
interaction (like a repositionable card), that interaction typically has
no keyboard equivalent — a keyboard-only user can still reach the
content and any standard controls, but can't reproduce the drag itself.
That's an acceptable trade-off only when the drag is purely decorative
(rearranging is not required to use the page); flag it explicitly rather
than silently shipping it if the drag ever becomes load-bearing for a
real task. Also, because paper and background use closely related warm
tones, check every text/background pairing against the real contrast
ratio rather than assuming "kraft plus navy ink" is automatically
legible — some paper-on-paper combinations sit closer than they look.

## When Not To Use This Style

Avoid this style for data-driven or frequently-updated content sets.
Hand-placed rotation, tape, and paperclip positioning are authored per
object by a human eye; content that changes often or is user-generated
can't be art-directed at that level of individual attention and needs a
randomized-but-bounded approach instead, which reads noticeably
different from a genuinely hand-arranged board.
