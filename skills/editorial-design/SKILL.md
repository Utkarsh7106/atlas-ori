---
name: editorial-design
description: >-
  Use whenever the user wants an Editorial Design website, landing page,
  portfolio, or long-form article layout — trigger on "editorial
  design," "magazine layout," "magazine style," "newspaper site,"
  "longform article design," or synonyms like "Bazaar style," "print
  magazine on the web," "New York Times style article." Also trigger on
  a look description even when unnamed: a masthead-style header, a
  kicker line above a large serif headline, a standfirst deck, drop
  caps, columns separated by hairline rules instead of gaps, a byline
  and dateline, a centered italic pull quote, and one accent color used
  only on small apparatus text, never on body copy. "Make it read like a
  real magazine article," "add a drop cap and byline," or "columns
  divided by rules, not gaps" should trigger this without the words
  "editorial design." Apply even without those exact words.
---

# Editorial Design

A digital longform article dressed in real magazine furniture: kicker,
standfirst, byline, drop cap, pull quote, folio — with almost no motion
beyond a reading-progress indicator, because text should be readable the
instant it renders. It descends from mid-20th-century magazine art
direction (Brodovitch at Harper's Bazaar, Fleckhaus at Twen), carried
into digital longform by outlets like the NYT, The Guardian, and
Bloomberg through the 2010s.

## Core Rules

1. Install the magazine furniture first, before worrying about layout:
   dateline, kicker, a standfirst deck with a left bar, byline, a pull
   quote, and a folio line closing the piece. This apparatus — not the
   grid — is what actually reads as editorial.
2. Pair exactly one text serif for content (headline, body, pull quote)
   with one grotesque sans for apparatus (kicker, byline, buttons,
   folio) — serif carries content, sans carries metadata, and the two
   never swap roles.
3. Divide columns with 1px vertical rules and zero gap, so the grid
   reads as printed rulework rather than a CSS grid with gutters.
   Encode hierarchy in rule weight alone: a heavier rule (~3px) closes
   the masthead and frames the pull quote; a hairline (~1px) separates
   columns and minor blocks.
4. Set body copy at a real reading size (~17px) with generous line
   height (~1.6) and hyphenation enabled, and use a floated drop cap on
   the opening paragraph — the text block itself is the design, not
   filler around other elements.
5. Allow exactly one accent color, restricted to apparatus only (kicker,
   quote marks, a progress bar, buttons) and never applied to body text
   or headlines — using it as a general accent collapses editorial
   hierarchy into decoration, and is the most common way to break this
   style. Keep motion to a minimum: nothing fades in or parallaxes, and
   the only animation earned is a scroll-driven reading-progress
   indicator tied to actual content length.

## Reference Implementation Details

**Color tokens**: `#fbfaf7` warm paper stock (never pure white);
`#16161a` text ink, also used for heavy 3px rules; `#c8322b` editorial
red for kickers, quote marks, and the progress bar; `#6d6b66` grey for
byline, dateline, and folio; `#d9d5cc` hairline column rules; `#f1ede4`
a tinted box background for a standing CTA.

**Type**: an optical-size serif (e.g. Source Serif 4) for masthead,
headlines, body, and pull quote; a grotesque sans (e.g. Archivo) for
every piece of apparatus. Headline runs `clamp(36px, 5.8vw, 74px)` at
weight 700, roughly −0.028em tracking and 1.02 leading; standfirst sits
at 20px/1.45; body at 17px/1.62 with `hyphens: auto`; apparatus text
stays small and uppercase, 10–11px at 0.14–0.18em tracking.

**Layout**: a measure around 1160px wide; an asymmetric 7fr/4fr hero
pairing the headline against the standfirst; a three-column feature well
with zero gap, columns divided only by 1px vertical rules.

**Signature mechanics**:
- Full furniture set: dateline, kicker, standfirst (with a 3px left
  bar), byline, a centered italic pull quote framed by a 3px rule above
  and a 1px rule below, and a folio line closing the page.
- A floated `::first-letter` drop cap sized around 3.1em, spanning
  roughly three lines of body text.
- A fixed reading-progress bar (~3px, in the one accent color) whose
  width is driven from scroll position on a passive scroll listener,
  clamped to 0–100% to survive rubber-band overscroll. Hide it outright
  — don't just freeze it at 0% — whenever the content already fits the
  viewport (`scrollHeight - innerHeight <= 0`), since a bar with no
  progress to report is just dead furniture on a short page; this is a
  named production caveat on the real page, not an edge case to skip.
- Nav links reveal a 2px accent-colored underline on hover/focus, and
  buttons swap between ink and the accent color over ~200ms — the only
  other motion on the page besides the progress bar.

## Common Mistakes to Avoid

Using the accent color as a general decorative accent — on headlines,
body copy, or anywhere beyond kicker/quote-marks/progress-bar/buttons —
is the most common failure. The rule is deliberately narrow: apparatus
only, never content, because that's what keeps color reading as
editorial signal rather than decoration.

## Accessibility Notes

The near-total absence of motion is a deliberate accessibility-adjacent
principle, not an oversight: text should be readable the instant it
renders, with nothing fading in or parallaxing on scroll. Treat any
future addition that reveals text on scroll or hover as a regression
against this style's own stated discipline, not just a stylistic
deviation.

## When Not To Use This Style

Avoid this style for short-form or glanceable content like notifications
or status updates. The full magazine apparatus — dateline, kicker,
standfirst, byline, pull quote, folio — assumes a genuine long-form
reading commitment that a two-sentence card can't support.
