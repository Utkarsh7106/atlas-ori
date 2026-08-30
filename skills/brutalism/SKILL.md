---
name: brutalism
description: >-
  Use whenever the user wants a Web Brutalist website, landing page,
  portfolio, or UI component — trigger on "brutalism," "brutalist,"
  "web brutalism," "raw HTML look," "anti-design," "brutalistwebsites,"
  or synonyms like "undesigned," "unstyled," "raw document." Also
  trigger on a look description even when unnamed: default browser
  blue underlined links with visited purple, Times New Roman body
  text, Courier New for machine/meta text, 1px solid black borders on
  every block with zero radius and zero shadow, hover states that snap
  instantly with no transition, buttons that are just bracketed text
  like "[ Explore ]." "Make it look like the browser did it," "no
  styling, just structure," or "like an old HTML document" should
  trigger this without the word "brutalist." Distinct from
  Neo-Brutalism (colorful, thick borders, heavy shadows) — this is
  the OPPOSITE of decorated. Apply without those exact words.
---

# Brutalism (Web Brutalism)

The honest document. Nothing is designed away: default link blue,
underlines, Times New Roman, visible structure, no radius, no shadow, no
easing. It looks like the browser won. Ugly is not the goal — indifference
to beauty is. This is web brutalism, roughly 2014–2018 (brutalistwebsites.com,
Bloomberg, Balenciaga), named after 1950s béton brut architecture, which
exposed raw material rather than cladding it.

## Core Rules

1. Load no webfonts. Use Times New Roman for content and Courier New for machine text, at browser-default sizes.
2. Leave links at `#0000ee`, underlined, with visited purple (`#551a8b`) intact — never restyle an anchor into a button.
3. Give every block a 1px solid black border, 8px padding, no radius, no shadow, no margin, and let borders touch their neighbors.
4. Ban all transitions and animations except strictly utilitarian ones (a blinking cursor, a live counter); hover states must snap instantly, never fade.
5. Expose structure instead of hiding it — print tag names as visible labels, use real `<table>` markup for tabular data, and let the page read as a document rather than a product.

## Reference Implementation Details

**Color tokens**: `#ffffff` page background (never tinted); `#000000` for
all text and every 1px border; `#0000ee` the browser's default unvisited
link blue, deliberately untouched; `#551a8b` the default visited purple;
`#ff0000` pure red for a hover-state background inversion (text switches
to the page's darkest neutral on top of it); `#c0c0c0` system grey for
table headers and nav bands. A blinking-cursor accent, if used, should sit
close to `#e60000` on a white background so it clears AA contrast on its
own — don't reuse the hover red directly for that purpose without checking
contrast, since the two colors serve different backgrounds.

**Type**: Times New Roman for everything structural (headings, body,
labels), Courier New for anything that describes the document rather than
being it (structural tags, status lines, bracketed control labels) — both
system defaults, no webfont loaded at all. Only weights 400 and 700.
Sizes come straight off a plain document scale: ~48px h1, ~36px h2, ~22px
h3, 16px body, 11–13px mono. Line-height is a cramped 1.35 (tighter than
WCAG's 1.5 guidance — a deliberate inherited default, not a fix-later
bug) and no letter-spacing is applied anywhere.

**Layout**: no grid, no `max-width`. Every section is full-bleed with an
8px pad and a 1px black border, stacked in source order with zero margin
so borders collide into shared 2px seams. Tabular content is a real
`<table>` with `border-collapse:collapse`, because a table is the honest
element for tabular data — not a styled grid of divs.

**Signature mechanics**:
- Default browser link styling, fully intact: blue, purple once visited, always underlined, never restyled into a pill or a filled button.
- Structural self-annotation: print the element's tag name as small mono text directly above or inside the block it labels (e.g. a literal `<nav>` string before the nav), so the page documents its own markup for the reader.
- Buttons are bracketed text links — `[ Explore ]` — generated with `::before{content:"[ "}` / `::after{content:" ]"}`, not styled boxes.
- Hover states snap instantly to an inverted color (red background, dark text) with zero transition duration.
- A utilitarian live status line (viewport size, timestamp) and/or a blinking text cursor are acceptable — but a blinking cursor driven by `setInterval` must be paired with a `prefers-reduced-motion` check in the script itself (CSS-level reduced-motion rules can't reach a JS interval), and per WCAG 2.2.2 should stop blinking (render solid) rather than loop forever once that preference is set.

## Common Mistakes to Avoid

The most common failure is restyling links or adding a webfont "for
polish." The entire point is unmodified browser defaults — `#0000ee`
links, Times New Roman. The moment either is touched, this stops being
brutalism and becomes a plain page with a brutalist theme layered on top,
which is a different (weaker) thing.

## Accessibility Notes

This is one of the safer styles by construction: default link colors and
states are exactly what a screen reader or a user stylesheet already
expects, so don't override them even for "consistency." The one real risk
is the 1.35 body line-height, tighter than WCAG's 1.5 recommendation —
it's an inherited document default this style deliberately never
overrides, so if a build needs to clear that guideline, that's a genuine,
disclosed trade-off against the style's own premise, not an oversight to
silently fix.

## When Not To Use This Style

Avoid this style for consumer e-commerce or any context where trust
signals matter. A deliberately raw, undesigned page can read as broken or
unfinished to a non-technical audience rather than as an intentional
statement, which is a real risk anywhere the audience doesn't already
know "brutalism" is a genre.
