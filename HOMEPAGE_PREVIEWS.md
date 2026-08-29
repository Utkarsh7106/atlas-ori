# Homepage card previews — scoping recommendation

Scoping only. No implementation in this doc or this pass — see DECISIONS NEEDED
in the accompanying report before any of this gets built.

## The ask

Each homepage card currently shows 5 colour swatches per style. The goal is a
small, recognizable visual preview of the actual style page — something a
visitor can read before clicking in, not just its palette.

## Constraint

This repo has zero build tooling: no `package.json`, no bundler, no CI. Any
approach either has to respect that at runtime, or make an explicit case for
where it doesn't.

## Approaches considered

### A. Live scaled iframe embeds

`<iframe src="styles/minimalism.html">` scaled down with `transform`, one per
card.

- **Generation/maintenance:** none — it's the real page, always in sync,
  free for every future style.
- **Performance:** the worst option by a wide margin. Each iframe is a full
  document load: its own JS, its own ambient motion (sparkle trails, torch
  tracking, blink timers, drag handlers, `IntersectionObserver`s), its own
  now-self-hosted webfonts. 29 of those on one page, or even the handful
  visible in a viewport at once, is a real CPU/memory/paint cost, not a
  theoretical one.
- **Interaction/accessibility hazards:** real and severe. Each iframe is a
  separate document with its own focus order — a keyboard user tabbing
  through the grid would tab into 29 nested pages' worth of nav links,
  toggles and buttons before reaching the next card, unless every iframe is
  made inert (at which point "live" buys nothing). Nested scrollable content
  can trap scroll/wheel input. Text at a 4x-or-more shrink is close to
  unreadable, undercutting "recognizable" on its own terms.
- **Verdict:** rejected. The one genuine advantage (real motion, always
  current) doesn't come close to justifying the performance and
  accessibility cost.

### B. Statically pre-rendered screenshot images

A one-time script (headless browser) renders each style page and saves a
cropped image; the homepage swaps swatches for `<img>` tags.

- **Generation/maintenance:** a maintainer-run script, not a build step —
  closer to "regenerate the favicon" than to introducing a bundler. Needed
  once per style, and again only when that style's visual language changes
  materially (not on every commit). New styles get a preview by running the
  same script against the one new page.
- **Performance:** excellent. A handful of small, cacheable images with
  native `loading="lazy"` and explicit `width`/`height` to avoid layout
  shift — cheaper than the current swatch markup in every way that matters
  at runtime.
- **Interaction/accessibility hazards:** minimal. An `<img>` inside the
  existing full-card `<a>` is exactly the pattern the swatches already use;
  give it real `alt` text (or keep it `aria-hidden` and let the card's own
  heading carry the name, matching how the swatches work today).
- **Real cost:** a static frame cannot show motion at all. On a site where
  *every single page's own Motion/Interaction field* treats animation as a
  signature device — not decoration — this is a real loss, not a nitpick:
  Y2K's sparkle trail, Cyberpunk's rain, Gothic's torchlight, Wabi Sabi's
  near-stillness are each central to how that style actually reads, and a
  frozen frame won't convey any of them.

### C. CSS-only miniature reconstructions

Hand-authored small CSS "sketches" of each style's signature devices,
directly on the card (an extension of what the swatches already are).

- **Generation/maintenance:** the worst of the three on this axis. Every one
  of the 29 (and every future) style needs its own bespoke miniature built
  and kept in sync *by hand* with the real page — and unlike a screenshot,
  nothing mechanically links the two, so drift between "what the mini-card
  shows" and "what the real page now looks like" has no automatic detection.
- **Performance:** the best of the three — pure CSS, no image decode, no
  script.
- **Interaction/accessibility hazards:** minimal, same profile as today's
  swatches.
- **Real cost:** recognizability is capped by how much bespoke per-style
  artistry gets invested, and for the more visually dense styles (Victorian's
  damask-and-gilt framing, Y2K's chrome word art, Surrealism's impossible-
  object collage) a miniature abstraction risks reading as a generic mood
  chip rather than "what that page actually looks like" — which is the
  explicit ask. It also can't show motion either, for the same reason B
  can't, while costing more to build and maintain than B does.

### D. Pre-rendered short looping preview clips (recommended)

Same generation model as B — a one-time/occasional script using a headless
browser — but capturing a few seconds of looping motion (an animated
AVIF/WebP, or a short muted `<video>`) instead of a single frame, plus a
static poster frame captured the same run.

- **Generation/maintenance:** identical story to B: a maintainer script, run
  once per style and again only on a material visual change; a new style
  gets a preview by running it against that one new page. Slightly more
  moving parts than a plain screenshot (recording + encoding a loop instead
  of one capture), but the same operational shape — closer in spirit to this
  session's own font self-hosting step (an offline fetch/generate step whose
  *output* is a committed static asset) than to a build pipeline.
- **Performance:** very good, not quite as cheap as a still image but nowhere
  near iframe territory. An animated AVIF/WebP behaves like any other
  `<img>` to the browser — no JS, native lazy-loading, browser-managed
  play/loop. A `<video autoplay muted loop playsinline>` needs a couple more
  attributes but still no iframe-style document/script cost. A few seconds
  of small, muted, silent loops across 29 cards is a modest, boundable
  payload — smaller than what this session's font self-hosting pass already
  added to the repo.
- **Interaction/accessibility hazards:** same low profile as B — no nested
  focus context, no scroll-trapping. `prefers-reduced-motion` support is a
  natural fit, not a bolt-on: this project already gates every page's own
  ambient motion behind that exact media query, so shipping the static
  poster frame instead of the loop for reduced-motion users is the same
  discipline applied one level up, at the homepage.
- **Real cost:** more generation complexity than B (recording/encoding a
  loop vs. one screenshot), larger files than B (though still small next to
  a live iframe or the current font payload), and the preview still isn't
  interactive — clicking a card to actually open its dialog demo or toggle
  its theme still requires visiting the real page, which is fine, since
  recognition (not interaction) is the stated goal.

## Recommendation

**D — short looping preview clips, with a static poster frame as the
`prefers-reduced-motion` fallback and the pre-loop first paint.** It is the
only option that shows what most of these styles' Motion/Interaction fields
say is central to the style, without paying anything close to an iframe's
performance or accessibility cost, and its generation/maintenance shape
mirrors a step this project has already adopted once this session (offline
capture → committed static asset, no runtime build step).

If the added generation complexity over a plain screenshot (B) isn't worth
it, B is a fully credible fallback recommendation — same performance and
accessibility profile, same "regenerate on visual change" maintenance story,
just without motion. C is not recommended: it costs more to build and
maintain than either B or D while capping out lower on the stated
"recognizable" bar, and A is not recommended at any point on this trade-off
— its performance and accessibility cost is disqualifying on its own.

## Rough implementation plan (D), for review only — not started

1. A small Node script (`scripts/capture-previews.js` or similar),
   Playwright-based, run manually/offline — never part of the live site or
   any CI, since none exists. Takes a style page path, loads it at a fixed
   small viewport, records ~3–4s (enough for one loop of most pages' ambient
   motion — sparkle interval, torch drift, blink cycle), and also grabs one
   static frame.
2. Encode the recording to a small animated AVIF or WebP (no audio track
   needed) plus a WebP/AVIF poster frame; write both to
   `assets/previews/<style>.avif` and `assets/previews/<style>-poster.webp`,
   committed like `assets/fonts/` already is.
3. On the homepage, swap each card's swatch row for the animated preview
   wrapped in a fixed-aspect-ratio container (explicit width/height to avoid
   layout shift), `loading="lazy"`, with the poster as its initial/`prefers-
   reduced-motion` state.
4. Document the regeneration step (which script, when to re-run it) the same
   way this session documented the font self-hosting step, so it's an
   obvious, repeatable maintainer action rather than tribal knowledge.

Nothing above is implemented. Confirm the approach (and B vs. D, if the
trade-off reads differently to you) before any of it gets built.
