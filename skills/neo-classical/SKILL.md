---
name: neo-classical
description: >-
  Use whenever the user wants a Neo-classical website, landing page,
  portfolio, or UI component — trigger on "neo-classical," "neo
  classicism," "classical revival," "Greco-Roman," "columns and
  symmetry," or synonyms like "marble," "inscriptional," "academy."
  Also trigger on a look description even when unnamed: everything
  centered on one vertical axis with no flush-left content anywhere,
  a warm stone/marble color palette with a single restrained gilt
  accent, an inscriptional all-caps serif (like Cinzel) for titles
  paired with a light old-style serif for body text, content divided
  into equal bays by thin vertical rules like a colonnade, and slow
  symmetrical motion. "Make it feel like a museum facade," "carved
  lettering on marble," or "formal, symmetrical, columns" should
  trigger this without the word "classical." Distinct from plain
  elegant/luxury serif styles — the defining trait here is strict
  bilateral symmetry: nothing is ever flush-left or off-center.
  Apply even without those exact words.
---

# Neo-classical

Order, symmetry, proportion. The page is an elevation drawing of a
façade: a central axis, a colonnade of equal bays, an entablature above
and a plinth below. Restraint is moral — ornament is permitted only where
structure justifies it. This is the late-18th to early-19th-century
revival of Greek and Roman order following the excavations at Pompeii and
Herculaneum, expressed in architecture, typography (Bodoni, Didot), and
civic design.

## Core Rules

1. Center everything on one vertical axis and keep the composition bilaterally symmetrical — no asymmetric or flush-left blocks anywhere.
2. Pair an inscriptional Roman capital face (Cinzel, Trajan) for titles with an old-style serif (Cormorant, Garamond) for body text, and set all capitals at 0.12–0.34em letter-spacing with a matching `text-indent` so the optical centering stays true.
3. Keep the palette to warm stone neutrals plus one restrained gilt accent, and spend the gilt only on ornament smaller than about 46px — never as a large fill.
4. Divide content into equal bays separated by 1px vertical rules, framed by an entablature (header/nav) above and a plinth (footer or CTA band) below.
5. Use italic rather than bold for emphasis, keep font weights at or below 600, and let motion be slow, centered, and symmetrical (roughly 400–450ms).

## Reference Implementation Details

**Color tokens (light)**: `#f4f1ea` aged-plaster page ground; `#e6e1d6` a
slightly deeper stone for gradients/plinths; `#1f1c17` near-black warm
brown for carved lettering; `#6b6250` sepia for secondary text; `#81693b`
a restrained gilt for small ornament only; `#c9c0ac` hairline rules and
column divisions. For a dusk/dark mode, don't simply invert — deepen the
ground to a warm near-black (not true black), lift lettering to a warm
cream (never cold white), and brighten the gilt slightly, since a lit
surface reflects more at night than a shaded one does by day.

**Type**: the inscriptional capital face for logo, nav, titles, and
buttons — always uppercase, always tracked wide (0.12–0.34em) with a
matching `text-indent` to keep optical centering true. The old-style
serif for everything else: light weight (300) for a large hero headline
(`clamp(38px,6vw,74px)`), 400 italic for a subheading/deck around 19px,
400 for body around 17px. Weight never exceeds 600 anywhere; italic is
the emphasis device, never bold.

**Layout**: a centered wrapper (~1000px) divided into equal bays (three
is the reference case) by 1px vertical rules — a literal colonnade.
Vertical spacing uses large, symmetrical intervals (56–96px) so the
composition reads as an architectural elevation rather than a scrolling
feed.

**Signature mechanics**:
- A rotated square "rosette" ornament (a small square turned 45°, with a smaller nested square inset inside it) as a pediment mark above a hero headline, drawn in 1px gilt lines only.
- A short centered rule (~120px) terminated by a small gilt lozenge (a 45°-rotated square) at each end, used as a section caesura/divider.
- An enlarged gilt `::first-letter` on card/section titles — an echo of an illuminated capital without leaving the classical, restrained register.
- Interactive text (nav links, buttons) uses a single shared motif: a gilt underline that grows outward from the center on hover/focus, never a color fill or a background swap.
- A very faint diagonal plaster-grain texture (a repeating gradient at a shallow angle, low opacity) plus a soft radial light wash from above on the page ground — subtle enough to read as material, not as decoration.

## Common Mistakes to Avoid

The most common failure is using bold weight for emphasis. This style's
rule is that italic carries emphasis and weight never exceeds 600;
reaching for bold on a headline or a highlighted word breaks the
restrained, carved-inscription register the whole style depends on. If
something needs to stand out, make it italic or give it the gilt
accent color — never make it heavier.

## Accessibility Notes

Everything is centered on a single vertical axis with no flush-left
content anywhere on the page. For screen-magnifier users panning a
zoomed viewport, centered-only layouts lose the predictable "content
starts at the left edge" scan pattern that flush-left layouts give for
free — this is a real, disclosed trade-off of the style rather than an
oversight, but it means this style needs extra care with heading
structure and landmark regions so magnifier and screen-reader users have
another way to orient themselves on the page.

## When Not To Use This Style

Avoid this style for dense, task-oriented interfaces — dashboards, admin
tools, checkout flows. The symmetrical, bay-divided composition and
generous 56–96px vertical intervals are built for a handful of stately
blocks, not a screen that needs a dozen controls placed efficiently.
