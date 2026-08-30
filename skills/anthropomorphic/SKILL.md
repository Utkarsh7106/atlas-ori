---
name: anthropomorphic
description: >-
  Use whenever the user wants an Anthropomorphic website, landing page,
  portfolio, or UI component — trigger on "anthropomorphic," "mascot
  design," "character-led branding," "cute mascot website," or synonyms
  like "Clippy-style character," "Duolingo owl style," "kawaii mascot
  UI," "friendly character brand." Also trigger on a look description
  even when unnamed: rounded blob-shaped characters with simple dot eyes
  and a curved mouth, a flat drop shadow each character seems to stand
  on, a hero mascot with its own speech bubble, and cards that react
  with a smile or blush on hover. "Make it feel like a friendly mascot
  brand," "cute character that reacts when you hover," or "Duolingo-style
  personality-led design" should trigger this without the word
  "anthropomorphic." Apply even without those exact words.
---

# Anthropomorphic

A brand system built on personality instead of a logo: rounded,
blob-bodied characters with a shared parametric face, standing on flat
ground-line shadows, blinking on their own independent timers, and
reacting emotionally when a user hovers near them. It descends from
character-led interface design — Clippy (1997) and the Japanese kawaii
mascot tradition — matured into brand systems like Mailchimp's Freddie
and Duolingo's Duo.

## Core Rules

1. Build one reusable, parametric face component — eyes, mouth, blush —
   and scale it per character with custom properties (e.g. `--eye`,
   `--mouth`, `--blush-x`) rather than hand-drawing each character's
   face separately. This reusable system is the actual point of the
   style; treating the mascot as a static illustration instead of a
   component is the most common way to lose it.
2. Give every character a distinct, asymmetric silhouette (an
   eight-value `border-radius` body is a good default) plus at least one
   appendage — ears, arms, feet — built as a separate bordered element
   sitting outside the body's own bounding box.
3. Outline everything in one single dark ink color and drop every panel
   and character onto a flat, blur-free shadow (e.g. `0 7px 0 0`) — the
   ground line a character stands on, never a soft blur.
4. Animate idle behavior before interaction: give each character its own
   randomized, unsynchronized blink timer (roughly every 3.2–9s). A
   shared timer that blinks every character in unison looks robotic and
   undercuts the "alive" effect the randomization exists to produce —
   this is what actually separates a character from a static sticker.
5. Make hover read as an emotional response, not a generic visual
   effect: squint the eyes, widen the mouth, fade in a blush — paired
   with a rounded typeface at 600 weight or heavier, since angular
   letterforms would contradict the characters' own rounded silhouettes.
6. Reserve actual spoken dialogue for the hero mascot specifically: give
   it its own bordered speech bubble, complete with a tail, holding one
   short bespoke line that doesn't appear anywhere else on the page.
   This is the style's signature device, not an optional flourish —
   every other character can credit shared copy by sitting a small
   badge-scaled face next to plain text, but only the hero mascot
   actually "talks." Collapsing this distinction (giving every character
   a speech bubble, or giving the hero mascot none) flattens the
   hierarchy the whole cast is built around.

## Reference Implementation Details

**Color tokens**: `#fff6ec` warm cream ground; `#2c2340` ink, used for
every outline, eye, and pupil; `#ff7a59` coral for one character and the
primary button; `#3ec2b3` teal for the hero mascot's body; `#ffc94d`
sunny yellow for badges, toggle states, and small accents; `#6c4ef0`
plum for another character and CTA fields.

**Type**: a rounded-terminal display face (e.g. Fredoka) at 600 weight
for display, card titles, and buttons, paired with a rounded body face
(e.g. Nunito) at 600–700 for body copy and labels — nothing set below
600 weight anywhere, since friendliness here reads as sturdiness, not
thinness. Hero type runs `clamp(32px, 5vw, 56px)` at 1.1 leading, card
titles around 25px, body 15–16px, labels 11px uppercase at 0.14em
tracking.

**Layout**: a column around 1060px wide, built from large-radius panels
(26–40px), with a 24–26px gutter. The hero uses an asymmetric split
(roughly 1.3fr content to 0.7fr mascot) that reserves a real, dedicated
slot for the mascot rather than treating it as decoration layered on
top. Center-align cards so each character faces the reader head-on, and
give every panel bottom-heavy padding so a character has room for feet
and body language.

**Signature mechanics**:
- The `.face` component: eyes, mouth, and blush positioned via custom
  properties so the same markup and CSS produces every character's
  face at whatever size it's used.
- Mouths drawn as a bottom-only 3px border with a 999px bottom radius —
  changing just the element's width and height turns the same technique
  into a different expression.
- A small, badge-scaled `.face` sitting beside plain shared text credits
  that copy to a character without staging it as dialogue — reserve an
  actual bordered speech bubble (with a tail) exclusively for the hero
  mascot, per Core Rule 6.
- The mascot breathes on a slow (~3.4s) loop and waves one arm (roughly
  −34deg to +8deg) on a faster (~1.5s) loop, both as plain CSS
  `animation` so a sitewide reduced-motion rule mutes them automatically
  with no extra script-side handling needed.
- Idle blinking is `setTimeout`-driven per character rather than a CSS
  animation, so it is invisible to a CSS-level reduced-motion rule —
  guard it with its own live `prefers-reduced-motion` check (queried
  inside the loop, not just once) so a face simply holds still under
  that preference, since an unstoppable, indefinitely-repeating timer is
  exactly the kind of motion that preference exists to suppress.
- Hover reactions (squint, widen, blush-fade) run over roughly 220ms
  with a spring-like easing, alongside a small card lift (~8px) and
  slight tilt (~−1.5deg) — the whole card responds, not just the face.

## Common Mistakes to Avoid

Treating the mascot as a static illustration rather than a component is
the most common failure. The actual system is one reusable face
primitive scaled per character with custom properties; hand-drawing each
character's face separately loses the reusable personality system that
is the whole point of building it this way.

## Accessibility Notes

A face that blinks on its own and reacts on hover is exactly the kind of
ambient motion that's disorienting for vestibular- or attention-sensitive
users, even at small scale. The `prefers-reduced-motion` guard on the
blink timer is doing real accessibility work, not standing in as a
formality — it needs to actually stop the loop's visible effect, and
needs to be checked live (not just once at page load) so a preference
changed mid-session takes effect on the next cycle.

## When Not To Use This Style

Avoid this style for regulated or high-stakes contexts — healthcare,
legal, financial services — where a character reacting to the user can
undercut perceived authority, and for any broad professional B2B
audience where personality-led UI reads as consumer rather than
credible.
