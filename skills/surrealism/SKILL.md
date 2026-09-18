---
name: surrealism
description: >-
  Use whenever the user wants a Surrealist website, landing page,
  portfolio, or UI component — trigger on "surrealism," "surrealist,"
  "dream logic," "Magritte," "Dalí," or synonyms like "uncanny,"
  "impossible scale," "dreamlike." Also trigger on a look description
  even when unnamed: a believable painterly sky/desert gradient
  background, flat panels floating with soft far-offset shadows that
  fall in contradictory directions (no single light source), one word
  inside a headline set at wildly different scale from its neighbors,
  small "wrong" objects (a floating eye, a door standing in open air)
  placed with total photographic plausibility, and at least one
  interaction that disobeys the user (an element that flees the
  cursor, watches it, or melts on hover). "Make it feel like a dream,"
  "believable rendering but wrong relationships," or "a button that
  runs away from my mouse" should trigger this without the word
  "surrealist." Apply even without those exact words.
---

# Surrealism

Dream logic applied to an interface. Everything is rendered plausibly —
soft light, real shadows, believable materials — but the relationships
are wrong: scale is impossible, shadows fall the wrong way, objects
float, and the page resists the cursor instead of obeying it. This
traces to Paris, 1924 — André Breton's manifesto, realized visually by
Magritte's daylight skies and Dalí's deserts — adopted into graphic
design as photographic collage with impossible relationships.

## Core Rules

1. Render everything plausibly — believable light, real cast shadows, ordinary typefaces — and put the strangeness entirely in the relationships, not the rendering technique itself.
2. Break exactly one rule per element: wrong scale, wrong shadow direction, wrong context, or wrong obedience to the user — never stack several at once on the same object.
3. Give shadows contradictory directions across sibling elements so the viewer can never locate a single consistent light source for the scene.
4. Float every plane: long, soft, far-offset shadows plus small individual rotations, so nothing reads as sitting flush on the page.
5. Make at least one interaction genuinely disobey the user — an element that flees the cursor, watches it, or melts under it — because surrealism is about the loss of control, not decoration for its own sake.
6. Any disobedient interaction is a real accessibility cost, not just a metaphor: clamp it to its container, cap how many times it can act before settling into a reachable state, and skip it outright (not just faster) under `prefers-reduced-motion` — otherwise "loss of control" becomes a literal barrier rather than a feeling.

## Reference Implementation Details

**Color tokens (light)**: a sky gradient from `#cfe0ec` (top) through
`#a8c4d8` and `#7ba0bd` (deep sky) down to `#e8d9c3` (desert sand) as the
page background; `#f6f2ea` a warm off-white panel surface for cards/nav;
`#1c2733` deep blue-black ink for text and fixed dark objects (a door, a
button fill); `#e5b5a0` an uncanny warm flesh tone reserved for small
"wrong" objects. **Fixed vs. themed matters here**: the sky, sand, and
panel surfaces should invert for dark mode (the same impossible scene,
now at night), but object colors like the flesh tone and any pure-white
"cloud" shapes should hold their exact value in both themes — they're
physical objects in the scene, not lit surfaces, the same way a felt
cutout doesn't change color when the room dims.

**Type**: one calm serif (Cormorant Garamond or similar) at a light
weight (300) for display, paired with a plain sans (Inter or similar) at
400–500 for all small text — the pairing itself should be deliberately
unremarkable, so the strangeness comes from arrangement, not lettering.
Inside a single hero headline, break the scale: one word set much larger
(e.g. 1.5em, italic), another set much smaller and raised on its
baseline, both inside a line already fluid-sized
(`clamp(40px,7.4vw,92px)`).

**Layout**: a conventional centered column that the content then
disobeys — feature cards on an ordinary grid, each individually rotated
a couple of degrees and offset vertically so the row never quite
settles; small absolutely-positioned "wrong" objects (a door, a floating
eye) hanging off the edges of a hero. The grid needs to visibly exist
first so that breaking it reads as a deliberate choice, not sloppiness.

**Signature mechanics**:
- Contradictory shadows: across three sibling cards, have one cast down-left, one cast *upward*, one cast down-right, so no consistent light source is possible.
- Long, soft, far-offset shadows (e.g. `26px 40px 40px -22px`) on flat panels, making them read as floating above the background rather than resting on it.
- Blurred, softly drifting ellipse "clouds" behind the content on slow (20–35s) loops, at least one running in reverse.
- Small uncanny objects rendered with total photographic plausibility: a standalone door shape, a circular "eye" with a tracking iris, tiny colored spheres pinned to a card corner.
- A disobedient interaction: an eye whose iris tracks the pointer within a small radius; a button that translates away when the pointer gets close, clamped to its own container and capped at a small number of dodges before it settles into a normal, catchable state; a headline whose individual letters melt (stretch and drop) on hover.

## Common Mistakes to Avoid

The most common failure is breaking every rule on one element at once —
wrong scale *and* wrong shadow *and* wrong context together. The rule is
exactly one broken rule per element; stacking several simultaneous
"impossible" devices on a single object reads as noise or a rendering
bug, not the isolated, specific wrongness that makes surrealism
unsettling. Spread the disobedience across different elements instead.

## Accessibility Notes

A fleeing or evasive element is a real accessibility cost, not just a
metaphor — treat it as a functional risk to be engineered around, not a
flourish to add unguarded. Concretely: clamp any fleeing element to its
own container so it can never become unreachable, cap the number of
times it dodges before settling into a normal catchable state, and skip
the flee behavior outright (not merely faster) under
`prefers-reduced-motion`, since a shortened-but-present dodge still
disobeys the user, just briefly. Also confirm the interaction has no
touch-specific trap: a tap doesn't generate the same pointer-move events
a mouse does, so a touch user should be able to reach the element
normally without ever triggering the evasive behavior at all.

## When Not To Use This Style

Avoid this style for any interface where the primary action must always
be reliably reachable — checkout flows, critical alerts, accessibility
settings. A button that evades the cursor, however briefly or
well-guarded, is fundamentally in tension with a "click this now"
guarantee, so reserve disobedient interactions for secondary or
exploratory actions only.
