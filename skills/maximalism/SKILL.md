---
name: maximalism
description: >-
  Use whenever the user wants a Maximalist website, landing page,
  portfolio, or UI component — trigger on "maximalism," "maximalist,"
  "more is more," "loud design," "neo-brutalist marketing site,"
  "Gumroad-style," "Memphis Group," "rave flyer," or synonyms like
  "chaotic," "clashing colors," "in your face." Also trigger on a look
  description even when unnamed: five-plus saturated colors with no
  neutral ground, three disagreeing typefaces in one headline, thick
  black outlines with hard zero-blur drop shadows, everything tilted
  off axis, layered patterns behind every block, constant small motion
  (marquee, bobbing sticker). "Make it chaotic and colorful," "like a
  SaaS rebrand that went feral," or "outlined in black with a hard
  shadow" should trigger this without the word "maximalist." Distinct
  from a single-bold-accent page — one bright color on a calm layout is
  a highlight, not maximalism. Apply without those exact words.
---

# Maximalism

More is more. Every surface is patterned, every color fights the one
beside it, three typefaces argue inside the same headline, and nothing
sits at 0 degrees. Legibility survives only because of hard black outlines
and huge type. This reads today as 2020s "loud" SaaS and marketing-site
design (Gumroad's 2022 rebrand, Figma and Linear campaign pages, the
neo-brutalist template wave) — a counter-reaction to flat minimalism from
around 2018 onward — descending in turn from the Memphis Group (1981), rave
flyers, and early personal-homepage excess.

## Core Rules

1. Use at least five saturated colors with no neutral ground, and layer two or more patterns behind every major block.
2. Set three typefaces that disagree — a heavy grotesque, a high-contrast italic serif, and a mono — and mix them inside a single headline.
3. Outline everything in 4–6px black and give it a hard zero-blur drop shadow, doubled in a second color on the largest blocks.
4. Rotate every element by roughly ±1–11 degrees and let items overlap their containers rather than sitting neatly inside them.
5. Keep something moving at all times — a marquee, a bob, or a hover that changes rotation — and stack multi-color text-shadows so type reads even against pattern.

## Reference Implementation Details

**Color tokens**: these loud hues are the identity and should not shift
between light/dark — `#ff2d95` (hot pink, page ground / shadow layer),
`#ffe600` (electric yellow, nav / display type), `#00e5ff` (cyan, pills /
offsets / clashing text-shadows), `#6a00f4` (purple, stripes / heading
fills), `#b6ff00` (lime, primary button / marquee text), `#0b0b0b` (the
black outline that makes the chaos survivable). If a dark mode is needed,
invert only the *neutral* surfaces (white callout boxes → near-black,
their outline, the halo behind card titles) — the six saturated hues stay
fixed in both themes.

**Type**: Archivo Black for display and buttons; Playfair Display at
weight 900 italic for a CTA headline and for isolated emphasized words
inside a display headline; a monospace (Space Mono or similar) at weight
700 for all body and UI text. Display runs uppercase, large
(`clamp(34px,7.6vw,86px)` for a hero), at ~0.92 line-height. There is no
mid-range size — type is either shouting or fine print. Every headline
carries a stacked, multi-color `text-shadow` (e.g. `4px 4px 0 <color-a>, 8px 8px 0 <color-b>`).

**Signature mechanics**:
- Layered backgrounds: a diagonal stripe overlay on top of a checkerboard or pattern on top of a flat saturated color, so no surface is ever a single flat color.
- Doubled hard drop shadows with zero blur on every card, button, and panel — e.g. `box-shadow:10px 10px 0 #000, 20px 20px 0 <accent>`.
- Small persistent rotation on nearly everything (logo, cards, pills, badges) between about −3deg and +11deg; hover often snaps an element toward 0deg and scales it up slightly as the "settle" interaction.
- A looping marquee ticker (CSS `translateX` on an infinite linear loop) pinned near the top, plus `inset` box-shadow used as a second internal border on large blocks.
- Optional: a small celebratory particle/confetti burst on primary CTA clicks, implemented via the Web Animations API (not CSS) so it can be explicitly gated behind `prefers-reduced-motion` — CSS-only `prefers-reduced-motion` rules cannot reach a JS-driven animation, so a script-based effect like this needs its own `matchMedia` check.

## Common Mistakes to Avoid

The most common failure is adding one loud element to an otherwise calm
page and calling it maximalist. The actual rule is at least five saturated
colors with no neutral ground, plus two or more layered patterns behind
every major block. A single bold accent color on a quiet layout is a
highlight, not maximalism — if you can point to "the loud part" of the
page, the rest of the page isn't loud enough yet.

## Accessibility Notes

Stacked multi-color text-shadows aren't just decoration here — they exist
specifically so headline text stays readable against a patterned or
saturated background, which is a real, load-bearing contrast mitigation
for a genuinely hostile background. Any new text placed over a patterned
area needs that same stacked-shadow treatment, not a plain color, to stay
legible. Separately, because this style keeps something moving at all
times (marquee, bobbing stickers, rotation snaps, particle bursts), every
motion effect must be gated behind `prefers-reduced-motion` — and if any
of that motion is driven by JavaScript (a Web Animations API burst, for
example) rather than pure CSS, it needs its own explicit `matchMedia`
check, since a sitewide CSS reduced-motion rule cannot reach into a script.

## When Not To Use This Style

Avoid this style for anything requiring sustained visual focus — forms,
long-form reading, data entry, dense comparison tasks. Five or more
competing colors, three conflicting typefaces, and constant motion are the
opposite of what a concentration-heavy task needs; reach for something
calmer wherever accuracy or sustained attention matters more than energy.
