---
name: cyberpunk
description: >-
  Use whenever the user wants a Cyberpunk website, landing page,
  portfolio, or UI component — trigger on "cyberpunk," "Blade Runner
  style," "Neuromancer aesthetic," "Ghost in the Shell UI," or synonyms
  like "neon megacity website," "hacker HUD interface," "corporate
  dystopia UI." Also trigger on a look description even when unnamed: a
  wet near-black background, two competing neon colors (cyan against
  magenta) plus amber hazard stripes, chamfered corners instead of
  rounded ones, dense HUD status readouts crammed into the corners,
  animated diagonal rain, and a second script like katakana alongside
  Latin text. "Make it look like a rain-soaked neon megacity," "hacker
  terminal HUD with warning stripes," or "cyan and magenta neon with
  Japanese text" should trigger this without the word "cyberpunk." Apply
  even without those exact words.
---

# Cyberpunk

A rain-lit corporate megacity rendered as a dense, busy HUD: two neon
colors that deliberately fight, chamfered panels bolted together with no
breathing room, and decorative telemetry crammed into every corner. It
dates from 1982 onward — Ridley Scott's Blade Runner and William
Gibson's Neuromancer, refreshed by Ghost in the Shell and Cyberpunk
2077.

## Core Rules

1. Build on a wet near-black ground with two neon colors that
   deliberately fight each other (cyan against magenta is the reference
   pairing), plus a third amber reserved strictly for hazard tape and
   warnings — never used decoratively elsewhere. A page with only one
   neon color reads closer to synthwave or generic neon branding than to
   this style; the color conflict is the point.
2. Set a technical, squarish sans in uppercase for display and buttons,
   and a monospace face for everything machine-generated — body copy,
   status strings, readouts. Put a second script (katakana, Cyrillic, or
   similar) on the page at small size alongside the Latin text — this
   two-script pairing is the style's core typographic signal, not
   decoration.
3. Chamfer corners with `clip-path` instead of using `border-radius`
   anywhere, and give every neon element two stacked shadows: one tight
   (roughly 12–16px) and one wide (roughly 34–44px), both in the same
   hue.
4. Fill the page with density rather than whitespace: tight gaps
   (~14px) between modules that butt against each other like bolted
   panels, hazard-tape dividers instead of plain margins, and status
   strings occupying corners that would otherwise sit empty.
5. Add weather over the whole viewport — animated diagonal rain, haze,
   or scanlines — since this style is an atmosphere before it's a color
   scheme; a static version with the right palette but no weather layer
   is missing the thing that actually sells the effect.

## Reference Implementation Details

**Color tokens**: `#07070c` wet asphalt ground; `#0e1018` chassis panel
for modules and nav; `#00fff5` primary sign neon (logo, CTA, active
borders); `#ff2e88` secondary neon for the second language and meters;
`#ffb700` hazard amber, reserved for warning stripes and similar fixed
elements; `#7b8496` stencilled steel grey for machine text; `#dfe6f0`
bone ink for headlines and body copy. If dark mode exists, invert the
street/chassis/ink together (the same block by day, overcast rather than
wet-black at night) — but where a neon is used as text (a logo, a
headline span, a card icon, a CTA heading) deepen it into an unlit,
daylight-legible shade of the same hue rather than simply dimming it
uniformly. Keep hazard tape and any solid, fully-saturated buttons at
fixed lit values in both themes — treat them as physical fixed objects,
not surfaces that re-light with the hour.

**Type**: a squarish technical sans (e.g. Rajdhani) for display and
buttons, a mono face (e.g. Share Tech Mono) for body copy, status
strings, and the second-script text. Display type is uppercase at
0.04–0.24em tracking with tight (1.0) leading; mono runs 10–14px at a
looser 1.75 line-height. Latin sits at large display sizes while the
second script (e.g. katakana) stays small, 9–13px.

**Layout**: a wrapper around 1180px, packed tight with a 14px gap
throughout — no generous whitespace anywhere. Cards split into a
distinct title bar and body rather than being uniform boxes. Blocks are
separated by 7px hazard-tape rules rather than plain margins. Keep
content flush left, and use absolute-positioned status strings to fill
corners that would otherwise be empty.

**Signature mechanics**:
- Corner-cut chamfers via `clip-path` — e.g. bottom-right cut on primary
  buttons, top-left cut on secondary — so nothing on the page reads as a
  plain rectangle.
- Two-layer neon glow: a tight text-shadow (~12–16px) plus a wide bloom
  (~34–44px) in the same hue, on any neon-colored text or border.
- 45° hazard tape, alternating amber and near-black, used as a
  structural divider between sections.
- Two drifting diagonal rain sheets at different angles, speeds, and
  opacities layered over the whole viewport — keep them as two separate
  layers rather than consolidating to one; the offset between them is
  what reads as depth, since a single sheet flattens back into a
  repeating texture.
- HUD furniture: status strings (e.g. `SYS.404 // NO SIGNAL`), `OK`
  readouts, and glowing progress meters presented as ambient telemetry
  that carries no real information — purely atmospheric. If this kind of
  meter/readout is animated (filling on scroll into view, or a status
  line that rewrites on an interval to simulate live data), gate it
  behind its own explicit `prefers-reduced-motion` check in script — an
  interval-driven content rewrite or a scripted fill isn't reachable by
  a CSS-level reduced-motion rule, and a status line with no natural
  completion state should simply never start under reduced motion rather
  than running once and stopping.

## Common Mistakes to Avoid

Using a single neon color is the most common failure. The actual rule is
two neons that deliberately fight (cyan against magenta), plus a third
amber reserved strictly for hazard and warning use — a single-neon page
reads as synthwave or generic neon branding, not this style.

## Accessibility Notes

Two competing neon colors plus dense HUD furniture (status strings,
meters, readouts) packed into the page's corners is a lot of
simultaneously-competing visual information. A sighted user with an
attention-related condition gets the full ambient-data barrage with no
way to quiet it short of a sitewide reduced-motion toggle — keep that
toggle meaningful by actually gating every scripted motion effect behind
it, not just the CSS-driven ones.

## When Not To Use This Style

Avoid this style for interfaces where users need to find real status
information quickly. It manufactures decorative telemetry specifically
to look busy; a real monitoring or ops dashboard that adopts this
treatment literally would bury genuine alerts under decorative ones.
