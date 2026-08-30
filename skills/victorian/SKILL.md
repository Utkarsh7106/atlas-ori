---
name: victorian
description: >-
  Use whenever the user wants a Victorian website, landing page,
  portfolio, or UI component — trigger on "Victorian," "Victorian era
  design," "jobbing print style," "playbill aesthetic," or synonyms like
  "gaslight era website," "gilded ornate site," "old shop-sign style."
  Also trigger on a look description even when unnamed: a densely
  papered damask background, blocks framed in double gilt borders with
  fleuron corner marks, a mix of fat-face and italic serif type stacked
  like a 19th-century playbill, a dark jewel-toned palette (burgundy,
  bottle green) with gold ornament on cream paper, and drop caps. "Make
  it look like an old Victorian shop sign or playbill," "gilded frames
  and ornate typography," or "19th-century print poster style" should
  trigger this without the word "Victorian." Apply even without those
  exact words.
---

# Victorian

An industrial-era jobbing print made into a website: densely papered
damask, every block framed in a double gilt border, and type stacked
like a 19th-century playbill rather than stepped through one smooth
scale. It comes from Britain, 1837–1901, when cheap chromolithography
made ornament affordable — and therefore compulsory — in playbills and
trade cards. That ornamental print culture sat inside the height of the
British Empire, and its cheap colour and imported paper moved through
the same trade routes and industrial-era labour the era's playbills
never depicted — worth naming rather than presenting the period as
decorative nostalgia alone.

## Core Rules

1. Paper the background densely — never leave a flat field. Build it
   from tiled radial dot lattices plus a fine diagonal weave gradient,
   all at low alpha, so the ground itself reads as printed wallpaper.
2. Frame every block in a double gilt border reinforced with a 1px inset
   second frame — a frame within a frame — and mark its corners with
   fleuron glyphs (❦ ❖ ❧).
3. Stack the type hierarchy like a playbill: vary typeface, size, or
   posture between consecutive lines rather than stepping smoothly
   through one type scale. Adjacent lines looking deliberately different
   from each other is correct, not an inconsistency to fix.
4. Use a dark jewel palette (burgundy, bottle green) for fields set
   against cream paper, with gold reserved for ornament — rules, frames,
   fleurons. Body text stays a printed brown-black, never pure black.
5. Fill space rather than protecting it: pack blocks close (16–18px
   gaps), add drop caps, compound rules, and a dated establishment line.
   A sparse Victorian page with one damask pattern and generous
   whitespace reads as neo-classical restraint, not this style — the
   compulsory density from cheap chromolithography is the actual point,
   and skipping it is the most common way to miss this style entirely.
6. If any ornament "burns" rather than sitting printed and static (a
   gaslight-style flicker), treat the exact timing as load-bearing
   safety, not a stylistic detail to improvise: a slow interval floor
   (700–1400ms between changes, well clear of the ~3Hz flash-safety
   threshold) and a shallow opacity dip (roughly 0.85–1, never dropping
   low enough to also fail color contrast at its dimmest point). Stop the
   loop outright — not just invisibly in the background — when the tab
   is hidden (Page Visibility API), and skip it outright under
   `prefers-reduced-motion` rather than just slowing it down. A faster,
   deeper version of this effect is a genuine photosensitive-seizure
   risk, confirmed on the reference page itself, not a hypothetical one.

## Reference Implementation Details

**Color tokens**: `#f3e7cf` cream paper ground beneath the damask;
`#5d1f2b` burgundy field for the sign board and display type; `#24402f`
bottle-green secondary field and CTA slab; `#c39a4b` gold leaf for
rules, frames, and fleurons; `#7a5e25` a darkened "tarnished gold" for
small caps and inner rules — pick a value dark enough to clear AA rather
than a brighter gold that reads better in isolation but fails at text
size; `#2a1a10` printed brown-black for body text. If dark mode exists,
invert the paper and the two colors read directly on it (headline
burgundy/forest, tarnished gold, ink) — the same page by gaslight,
papered near-black rather than cream — but keep sign-board fields (nav,
CTA) and their gilt ornament at fixed values in both themes: a painted
shop sign doesn't repaint itself at night.

**Type**: three faces in the jobbing-printer tradition — a fat-face
display (e.g. Abril Fatface) for the logo, headlines, and card titles;
a serif suited to small caps (e.g. Playfair Display) for labels and
buttons; a text serif (e.g. IM Fell English) for running body copy, set
italic for a subheading deck. Follow a playbill size stack: ~44px logo,
`clamp(34px, 5.6vw, 66px)` headline, ~27px card titles, ~20px italic
deck, ~17px body, 10–13px letterspaced capitals at 0.24–0.4em tracking.

**Layout**: centered and symmetrical inside a ~960px wrapper, but packed
rather than restrained — blocks separated by only 16–18px, each one
framed edge to edge so the papered ground shows through only as a thin
margin. A feature row reads as three equal framed panels; every block is
its own bordered object, never a region of open space.

**Signature mechanics**:
- Damask wallpaper: three offset radial dot lattices tiled at ~120px
  plus a 45° weave gradient.
- `3px double` gilt borders reinforced with a 1px inset shadow, on every
  framed block.
- Fleuron glyphs (❦ ❖ ❧) as corner marks via `::before`/`::after`, and
  as section caesuras between blocks of text.
- Compound rules: a 1px line sitting above a 3px double line, sized to
  roughly 74% width and centered.
- A floated fat-face drop cap on body paragraphs, and a Roman-numeral
  establishment line (a founding date, styled as part of a shop sign)
  under the logo.
- The gaslight flicker (Core Rule 6): each ornament gets an independent
  randomized timer nudging its opacity within the safe range, checked
  against both `document.hidden` (via the `visibilitychange` event) and
  a live `prefers-reduced-motion` query before every tick — this is a
  script-driven effect, so a CSS-level reduced-motion rule alone cannot
  reach it.

## Common Mistakes to Avoid

Filling the page with some ornament but forgetting the compulsory
density is the most common failure. Cheap chromolithography made
ornament affordable and therefore compulsory in this print tradition —
a sparse page with a single damask pattern and lots of open whitespace
is closer to neo-classical restraint than to this jobbing-print
register.

## Accessibility Notes

If a flicker or "burning" effect is used, its interval floor and opacity
range are load-bearing safety values, not aesthetic ones — a faster,
deeper version is a documented photosensitive-seizure risk. The loop
needs to actually stop (not just continue invisibly) when the tab is
hidden, and skip outright under `prefers-reduced-motion`, holding at
full opacity instead.

## When Not To Use This Style

Avoid this style for fast-scanning utility interfaces — search results,
settings pages. The packed 16–18px block spacing and compound,
multi-line typographic stacking demand slow, deliberate reading, which
is the opposite of what a utility screen needs.
