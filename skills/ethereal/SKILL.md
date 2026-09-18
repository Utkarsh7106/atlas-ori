---
name: ethereal
description: >-
  Use whenever the user wants an Ethereal website, landing page,
  portfolio, or UI component — trigger on "ethereal," "dreamy site,"
  "aurora aesthetic," "soft glow design," or synonyms like "wellness
  brand site," "fragrance brand aesthetic," "weightless UI," "hazy
  gradient website." Also trigger on a look description even when
  unnamed: a near-white ground washed with soft blurred color veils, no
  cards or borders or filled buttons anywhere, gradient-filled glowing
  display type, halos of light instead of containers, drifting motes,
  and everything moving slowly and softly. "Make it look soft and
  dreamlike," "glowing gradient text with no boxes," or "like a
  fragrance ad website" should trigger this without the word
  "ethereal." Apply even without those exact words.
---

# Ethereal

A weightless, glowing mood built entirely from soft blurred color and
light — no cards, no borders, no filled buttons anywhere, only
proximity and halo. It isn't a historical movement but a contemporary
one, descended from Pre-Raphaelite and Pictorialist soft focus, current
in fragrance, wellness, and ambient-music design since the late 2010s.

## Core Rules

1. Remove every container: no cards, no borders, no filled buttons
   anywhere on the page. Group content purely by proximity, by a halo of
   light behind it, or by spacing — a single bordered box anywhere
   breaks the weightless premise for the whole layout, and is the most
   common way this style gets broken.
2. Build the ground from two or more viewport-scale, heavily blurred
   color veils, plus a radial haze layered on top that washes the edges
   back toward near-white — the "high-key key light" that keeps the page
   feeling lit from within rather than just colored.
3. Cap every font weight at 400 or below and track all type openly,
   always pairing `letter-spacing` with an equal `text-indent` — in both
   the resting CSS value and any hover transition. If the two ever
   change out of lockstep, the tracked text visibly drifts mid-transition
   instead of just widening in place.
4. Fill display type with a soft multi-stop gradient via
   `background-clip: text`, and give it a wide, colored `drop-shadow` so
   headlines read as emitting light rather than sitting flat on the
   page.
5. Keep every transition slow, roughly 1–2s, and animate only weightless
   properties — opacity, letter-spacing, the scale of a glow — never a
   hard translate or an instant color snap.
6. Treat the palette's contrast as a real, structural risk rather than
   something to eyeball: an all soft-violet-grey-on-near-white palette
   can fail body-text contrast without ever looking obviously wrong.
   Check every secondary-text color against its actual ground at the
   real rendered size before shipping — don't estimate from how the
   display type looks, and don't reuse a value tuned for one context
   (e.g. large hero type) in a smaller one without re-checking it there.

## Reference Implementation Details

**Color tokens**: `#fbfaff` near-white ground with a violet cast;
`#e9e4fb` lavender aurora veil; `#fde8f0` blush aurora veil; `#e0f4f7`
aqua aurora veil; `#4a4266` soft violet-grey ink, never true black;
`#726a95` for secondary text (nav, hero note, card copy, icon labels) —
this needs to clear 4.5:1 against the near-white ground at actual body
size, since a lighter, more "on-mood" violet-grey can look fine at a
glance while quietly failing AA; a value in the high-4xx:1 range against
`#fbfaff` is a good target. `#c9b8f5` is the glow color, used only in
shadows and halos, never as a text or fill color. For any new interface
element added later (a footer, a dialog, a settings panel) that isn't
one of the original hero/card contexts, use a slightly deepened variant
of the secondary-text color rather than reusing the standard one
as-is — a value tuned to clear contrast at the sizes this style was
originally built for isn't guaranteed to still clear it in a new,
possibly smaller context. If dark mode exists, invert the ground and the
three washes into deepened jewel tones (the same aurora at night, not a
different palette), turn ink to pale lavender, and re-check both
secondary-text values against the new dark ground independently — a
value safe in light mode is not automatically safe after inversion.

**Type**: a high-contrast display serif with hairline strokes (e.g.
Italiana) for every heading, paired with a light-weight geometric sans
(e.g. Montserrat at 200–300) for all small text — nothing on the page
heavier than 400. Tracking is extreme and always paired with a matching
`text-indent`: around 0.4em on logo/buttons, 0.26–0.36em on labels,
0.06–0.14em even on display type. Body line-height runs unusually loose
(2.1–2.2) so the text column reads as vapor rather than a solid block.

**Layout**: a narrow centered column (~980px), with viewport-relative
padding running up to ~210px so most of the page stays light rather
than filled with content. Any repeating feature set sits on an even
grid with a very large gutter (`clamp(28px, 6vw, 80px)`).

**Signature mechanics**:
- Two or more viewport-scale aurora veils blurred heavily (~90px),
  each drifting and scaling on its own slow, independent loop (roughly
  30–38s).
- A radial haze layer over the aurora washing the page back toward
  white at the edges.
- Gradient-filled display type (`background-clip: text`) with a wide
  (~34px) violet `drop-shadow` so headlines glow.
- Halos instead of cards: a soft radial-gradient circle behind each
  feature, a different hue per item, scaling up (~1.35×) on hover — this
  is the style's substitute for a bordered container.
- Buttons as tracked capitals over a hairline rule (never a filled
  shape), with the hover state animating `letter-spacing` and
  `text-indent` together so the control appears to breathe outward
  without the tracking and indent visibly drifting apart.
- Drifting motes of light spawned at random positions, each animating
  upward and sideways over 14–26s on its own loop and re-seeding itself
  when it finishes, so the air never looks still. Drive this through its
  own explicit `prefers-reduced-motion` check in script rather than
  relying on a sitewide CSS mute — an imperative animation API isn't
  reachable by a CSS-level reduced-motion rule, so a script-driven loop
  needs its own guard or it won't respect the setting at all. Skip
  spawning the motes outright under reduced motion rather than spawning
  them motionless, since a field of static dots isn't the point of the
  effect.

## Common Mistakes to Avoid

Adding a container "just this once" — a card, a border, a filled
button — is the most common failure. The style is defined by having
none of these; a single bordered box anywhere undoes the weightless,
floating premise for the whole page, not just that one element.

## Accessibility Notes

This palette's contrast risk is structural, not hypothetical: an
all-soft-violet-grey-on-near-white treatment can fail body-text contrast
while still looking correct at a glance, because the failure is subtle
rather than jarring. Check every secondary-text color against its actual
ground at real rendered size before shipping, and re-check independently
any time that color is reused in a new context (a smaller size, a new
component, dark mode) rather than assuming a value that passed once
still passes everywhere.

## When Not To Use This Style

Avoid this style for information-dense or task-driven interfaces. With
no cards, no borders, and no filled buttons, it has no built-in way to
group or separate competing content once there's more than a handful of
items on screen.
