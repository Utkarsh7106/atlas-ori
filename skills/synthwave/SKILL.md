---
name: synthwave
description: >-
  Use whenever the user wants a Synthwave website, landing page,
  portfolio, or UI component — trigger on "synthwave," "outrun style,"
  "retrowave design," "80s neon sunset aesthetic," or synonyms like
  "Miami Vice title card style," "Tron-inspired UI," "retro arcade sunset
  website." Also trigger on a look description even when unnamed: a
  striped neon sun sitting on a violet-to-magenta sky, an animated
  perspective grid floor rushing toward the viewer, chrome gradient
  text, and every panel glowing in cyan or pink. "Make it look like an
  80s retro sunset with a grid floor," "neon chrome text over a striped
  sun," or "Outrun arcade aesthetic" should trigger this without the
  word "synthwave." Apply even without those exact words.
---

# Synthwave

A 2010s revival of imagined 1984: a striped neon sun over an animated
perspective grid, chrome gradient headlines, and every panel glowing
twice. It draws from Miami Vice title cards, Outrun arcade cabinets and
Tron, rebuilt around synth albums by artists like Kavinsky and Com
Truise.

## Core Rules

1. Build the sky first, as a fixed vertical gradient running from
   near-black through violet to magenta, and place a striped sun and a
   glowing cyan horizon line on top of it — the sky is the backdrop
   everything else sits on, not an afterthought.
2. Add a perspective grid floor: a repeating gradient tilted with
   `rotateX` between roughly 70 and 75deg, animated by shifting its
   `background-position` so the lines appear to rush continuously toward
   the viewer.
3. Center everything on a single vertical axis. This is a one-point
   perspective scene, and the vanishing point has to stay on that axis
   or the whole illusion breaks.
4. Give display type a chrome gradient via `background-clip: text` plus
   a hard offset drop-shadow, and track all-caps type outward (positive
   letter-spacing) — synthwave type spreads, it never tightens.
5. Glow every container twice — an outer glow plus a matching `inset`
   glow, in cyan or pink — and keep the overall mood warm and
   optimistic. This is a genre of nostalgic optimism, not grime or
   dystopia; that tonal difference is what separates it from cyberpunk
   or cybercore even though all three share neon-on-dark palettes.

## Reference Implementation Details

**Color tokens**: `#160b2e` upper night sky; `#3d1157` mid-sky dusk in
the fixed gradient; `#ff2d95` primary neon pink, used for glow, grid
depth lines, and borders; `#ff7a18` the sun's lower band; `#ffd166` the
sun's upper band; `#22e0ff` grid cyan, used for the horizon line and a
secondary CTA; `#f4ecff` pale lavender ink for body text sitting on dark
tinted panels. If dark mode exists, invert only the sky gradient — the
same drive at a different hour, golden and bright by default, deepened
to midnight neon under the toggle — while the sun, grid, horizon, and
every tinted-glass panel (nav, hero plate, cards, CTA) hold fixed values
in both themes: neon and a windshield's tint don't change color with the
sky behind them.

**Type**: three faces with fixed jobs — a neon-tube display face (e.g.
Monoton) for the logo and CTA heading, a heavy geometric sans (e.g.
Orbitron at 700–900) for headlines, card titles, and buttons, and a
technical sans (e.g. Chakra Petch) for body copy. All display type is
uppercase with positive tracking (0.02–0.28em). Hero runs
`clamp(32px, 6.4vw, 74px)` at weight 900; card titles ~23px; body
15–17px at weight 600 with 0.1em tracking. Nothing on the page goes
below 10px.

**Layout**: centered throughout on a ~1080px column. The scene layer
(sun, horizon, grid) is `position: fixed`, with the sun sitting around
26% down the viewport and the horizon around 62%, so page content
scrolls over a stationary landscape. Give the hero generous
viewport-relative padding so the headline sits visually on the sun.

**Signature mechanics**:
- Infinite perspective floor: `perspective(320px) rotateX(72deg)` (or
  similar) on a two-axis repeating gradient, animated by shifting
  `background-position` rather than translating a large image or
  element — this is dramatically cheaper to paint and composite per
  frame than animating a big background image for the same effect.
- Striped sun: a circular gradient with a two-part `mask-image` that
  cuts horizontal slits into its lower half. This mask is what actually
  produces the genre's signature striped-sun look; a flat gradient
  circle with no mask is a plain sunset, not this style.
- Chrome type: a five-stop vertical gradient through white, cyan, pink,
  and violet with `background-clip: text`, hardened by a solid (not
  blurred) drop-shadow around 3px in violet.
- Double-sided neon: every container gets both an outer glow and a
  matching inset glow in the same hue (per Core Rule 5).
- A 2px cyan horizon line with a wide, soft spread shadow (roughly
  26px blur / 6px spread), and a translucent plate sitting behind any
  deck text that crosses the sun, so the copy stays legible against the
  busy background.

## Common Mistakes to Avoid

Rendering the sun as a flat gradient circle is the most common failure.
The actual technique is a `mask-image` that cuts horizontal slits into
its lower half over a circular gradient — skipping that mask produces a
plain sunset graphic, not the genre's signature striped sun.

## Accessibility Notes

The grid-scroll and sun-glow-breathing loops are permanent, always-on
ambient motion — not triggered by scroll or hover — which is exactly the
category `prefers-reduced-motion` exists to address. That guard is
load-bearing given how much of this style's identity rests on constant
background motion; muting it needs to actually stop the motion, not just
slow it down.

## When Not To Use This Style

Avoid this style for content-first or long-session reading contexts.
Permanent background motion behind readable text becomes fatiguing well
past landing-page length, and the chrome-gradient headline treatment
trades away text contrast flexibility for the effect.
