---
name: minimalism
description: >-
  Use whenever the user wants a Minimalist website, landing page,
  portfolio, or UI component — trigger on "minimalism," "minimalist,"
  "minimal design," "Stripe-style," "Linear-style," "Vercel-style,"
  "SaaS minimalism," "Dieter Rams," "Braun-style," or synonyms like
  "clean," "understated," "flat," "no clutter." Also trigger on a
  natural-language look description even when unnamed: a single
  centered text column, one unpaired sans typeface at a few weights,
  zero border-radius and zero box-shadow anywhere, 1px hairline rules
  as the only separators, huge vertical whitespace between sections,
  no accent color beyond black/white/grey. "Just black text on white,"
  "lots of air, one font, no shadows," or "like a Stripe landing page"
  should trigger this even without the word "minimalist." Distinct
  from the swiss-design skill (strict 12-column grid, one saturated
  accent color) — use this one when there's no accent color and no
  visible grid, just reduction and whitespace. Apply without exact words.
---

# Minimalism

The rule is: remove until it breaks, then add one thing back. No fills, no
shadows, no border-radius, no color beyond black, white, and two greys.
Hierarchy is carried entirely by size, weight, and empty space. This reads
today as the idiom of post-2015 SaaS and developer-tool interfaces (Stripe,
Linear, Vercel) — a neutral grotesque, fluid type, hairline-separated
sections, no ornament — descended from 1960s–70s minimal art and Dieter
Rams' product design at Braun, but the closer, more accurate lineage is the
last decade of interface work.

## Core Rules

1. Use one typeface at no more than three weights, and never let a decorative face in.
2. Restrict color to white, near-black, one grey for secondary text, and one lighter grey for rules — no accent hue at all.
3. Separate content with 1px hairlines or empty space only; forbid yourself borders on all four sides, fills, radii, and shadows.
4. Set every section's vertical padding from a single large spacing token (96–160px) so the page reads as air with text in it.
5. Establish hierarchy through size and weight jumps alone — if you are reaching for color or a box to signal importance, delete something instead.

## Reference Implementation Details

**Layout**: a single column, `max-width:920px`, centered on the page but
with all content flush left inside it (ragged right edge) — nothing else
is centered. Vertical rhythm between sections comes from one large token,
`clamp(96px,14vh,160px)`; spacing inside a section uses 8px multiples.

**Color tokens (light)**:
- `#ffffff` — page background, the dominant surface
- `#0a0a0a` — headings, logo, button fill on hover
- `#5c5c5c` — body copy and nav links (6.69:1 on white)
- `#e5e5e5` — 1px hairline rules, the only drawn lines
- `#fafafa` — reserved hover tint, used sparingly

**Color tokens (dark, optional)**: background `#0a0a0a`, ink `#f5f5f5`
(18.16:1), muted `#a3a3a3` (7.85:1), hairline `#2a2a2a`, hover tint
`#141414`. As with the light set, every other color declaration should
alias back to these so a single attribute flip re-themes the page.

**Type**: one family for everything — `"Inter",-apple-system,"Helvetica Neue",Arial,sans-serif`
— deliberately unpaired; a second family is one decision too many. Weight
300 for display, 400 for body, 500 for labels and the logo. Sizes: 11px
uppercase labels at `.18em` tracking, 14–15px body and nav, 17px card/
section titles, and exactly one large jump to `clamp(38px,6.4vw,68px)` for
the hero headline — the ramp allows one big leap, not a smooth gradient of
sizes. Display type carries `-.038em` tracking; body stays untracked.
Headline copy is capped near 14 characters per line of measure, body copy
near 38 characters, so the layout keeps a ragged, deliberately unused
column of whitespace to the right rather than filling the line.

**Signature mechanics**:
- 1px hairline rules in a light grey as the *only* separator device — never a card, panel, or filled container.
- Zero `border-radius`, zero `box-shadow`, anywhere, always — depth is never simulated.
- Exactly one color event on the whole page: an outlined button (1px border, transparent fill) that inverts to a solid near-black fill with white text on hover/focus. No other element changes color on interaction beyond text-color shifts and a hairline underline growing in from the left.
- Motion is restrained and plays once: an `IntersectionObserver` fades and lifts each section by ~10px over roughly 600ms the first time it scrolls into view, then stops watching it — nothing loops, nothing re-triggers.

## Common Mistakes to Avoid

The most common failure is treating "minimal" as "less content" instead of
"less ornamentation" — cutting copy rather than cutting borders, shadows,
and radius. The actual mechanism is a page with just as much to say, but
with exactly one hairline as its only separator and zero border-radius or
shadow anywhere. If you're trimming words to make a page feel minimal,
you're solving the wrong problem.

## Accessibility Notes

Secondary text and link color typically sits in the 6.5–7:1 range against
the background, which clears AA comfortably — but the interaction cue for
links is often just a 1px underline that grows in from the left on hover,
with no other non-color affordance. Make sure that underline (or an
equivalent shape change) also appears on `:focus-visible`, not just
`:hover`, so keyboard users get the same cue mouse users do, and don't rely
on the grey/black text contrast alone to signal "this is interactive."

## When Not To Use This Style

Avoid this style for interfaces where users need to scan or compare many
similar items quickly — a dense dashboard, a comparison table, a data-heavy
admin screen. The whitespace-as-hierarchy approach that reads as confident
at three or four elements collapses information density at scale; reach
for a denser, more structured system instead.
