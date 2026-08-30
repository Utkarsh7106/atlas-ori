---
name: cybercore
description: >-
  Use whenever the user wants a Cybercore website, landing page,
  portfolio, or UI component — trigger on "cybercore," "terminal
  aesthetic," "phosphor CRT style," "hacker terminal website," or
  synonyms like "green screen UI," "BBS aesthetic," "Matrix terminal
  look," "ASCII terminal design." Also trigger on a look description
  even when unnamed: true black with a single glowing green (or other
  phosphor) hue at a few brightness levels, everything set in monospace
  with a soft text-shadow bloom, ASCII box-drawing character borders,
  scanlines, and a headline that decodes from random glyphs into text.
  "Make it look like an old green phosphor terminal," "Matrix-style
  hacker screen," or "ASCII box borders with a CRT glow" should trigger
  this without the word "cybercore." Apply even without those exact
  words. Do not use this for a general neon-on-dark look with multiple
  bright colors — that is cyberpunk, a related but distinct style.
---

# Cybercore

The machine's own interface, not the neon world around it: true black,
exactly one glowing phosphor hue at a few brightness levels, everything
in monospace, and structure drawn from literal ASCII box-drawing
characters. It's a late-2010s internet aesthetic built from 1980s
phosphor terminals, BBS and demoscene ASCII art, and The Matrix (1999).

## Core Rules

1. Use exactly one phosphor hue on true black, at three brightness
   levels (a dim trace tone for rules and metadata, a mid tone for body
   copy, a bright tone carrying primary information), plus a single
   separate error/glitch color — never a second neon. This is what
   separates the style from cyberpunk: reaching for a second bright hue
   for variety is "cyberpunk but green," not this style, and is the
   single most common way to get it wrong.
2. Set the entire page in monospace, including display type — nothing
   may have proportional metrics anywhere. Give every glyph a soft,
   same-hue text-shadow to simulate phosphor bloom, except structural
   frames and borders, which stay deliberately unlit.
3. Draw structure from literal ASCII box-drawing characters (┌─┐│└┘) set
   in a real `<pre>` element rather than CSS borders, and label each
   container with a small tag (e.g. `stdout`, `0x01`, `exec`) notched
   into its top-left border edge.
4. Degrade the signal deliberately: scanlines (roughly 1px every 3px), a
   rolling luminance band drifting down the viewport, a subtle
   mains-flicker opacity keyframe, and a periodic channel-split glitch
   burst on the headline.
5. Make every transition instantaneous — `steps(1)`, never an eased
   curve — since a machine switches state, it doesn't ease. Print
   machine-generated text (hex dumps, session IDs, error counts) as
   ambient decoration throughout the page.

## Reference Implementation Details

**Color tokens**: `#000000` true black, the unlit CRT; `#00ff41` P1
phosphor green, carrying almost all information; `#2f9a45` a dim trace
tone for rules, ASCII frames, and metadata — this needs real contrast
headroom above black even at its dimmest use, since a true-black,
single-hue palette has very little room before a dim tone silently fails
contrast (this page's own dim trace was raised from an earlier value
that measured only 1.69:1); `#b6ffcb` a pale green for body copy, one
step brighter than the trace tone; `#ff003c` the only non-green hue on
the page, reserved strictly for the glitch channel and error states. If
a light/dark toggle exists, model it as reverse video — a real terminal
feature, not an invented "daylight" reading: normal video is true black
with bright phosphor (the default), reverse video swaps the field to a
lit pale-green screen with dark ink. Because the background/panel fields
and the phosphor/error hues invert in opposite directions, every
existing fill-and-text pairing stays correctly matched across both
without needing a fixed literal color anywhere.

**Type**: a bitmap CRT display face (e.g. VT323) for all display type,
paired with a monospace body face (e.g. JetBrains Mono) for body copy,
labels, and ASCII frames. Display runs `clamp(38px, 7.4vw, 88px)`
uppercase at tight (0.98) leading; body sits at a flat 13–14px with
1.6–1.75 line-height; metadata is small (10–11px) in the dim trace
color.

**Layout**: a narrow terminal column around 1000px wide, a uniform 20px
gutter, laid out as equal panes. Every block reads as a labelled box: a
1px trace border with its tag notched into the top-left edge. Real
`<pre>` blocks of box-drawing characters can open and close the page, so
the layout's frame is literally text rather than CSS decoration.

**Signature mechanics**:
- Channel-split glitch: two pseudo-element copies of the headline text
  (via `attr(data-text)` or similar), clipped to a top band and a bottom
  band, offset in the error color and pale green respectively —
  triggered as a periodic burst (roughly every 2.6–6s) rather than
  running continuously.
- A headline decode-on-load effect: each character resolves from random
  glyphs (e.g. `#$%&@01`) to its final letter over a short window
  (~900ms). Since this is a `setInterval`-driven text rewrite, it needs
  its own explicit `prefers-reduced-motion` check — a CSS-level mute
  can't reach it — and should render the final text immediately and
  stay still under that preference, same as the glitch burst.
- CRT stack: scanlines, a rolling luminance band (~130px, looping over
  roughly 7s), and a mains-flicker opacity keyframe on the page body —
  these are pure CSS `animation`s, so the sitewide reduced-motion rule
  mutes them automatically.
- A blinking block cursor at `steps(1)` on a ~1s cycle.
- Hover on nav items or buttons inverts them instantly to black-on-
  phosphor with no easing, consistent with Core Rule 5.

## Common Mistakes to Avoid

Treating this as "cyberpunk but green" is the most common failure. The
organizing idea is the machine's own interface, not the neon world
around it: exactly one phosphor hue at three brightness levels plus one
error color, monospace everywhere, and ASCII box-drawing for structure —
a second neon hue or a proportional font anywhere breaks that premise.

## Accessibility Notes

A true-black, single-phosphor-hue palette has very little headroom to
place a second, dimmer tone before it silently fails contrast — this
page's own dim trace color had to be raised for exactly that reason. Any
new "quieter" variant of the phosphor green needs the same explicit
contrast-ratio check, not an assumption that a dimmer green is
automatically safe. Also make sure both the decode-on-load and the
glitch-burst effects are gated behind their own live
`prefers-reduced-motion` check in script, since neither is reachable by
a CSS-level reduced-motion rule alone.

## When Not To Use This Style

Avoid this style for any consumer-facing or broad-audience product. A
true-black, single-hue, monospace-only interface reads as a specialist
tool by design, and using it for a general audience actively signals
"not for you" through genre convention alone.
