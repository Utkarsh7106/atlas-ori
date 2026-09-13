# Atlas — Full Site Audit

**Date:** 2026-09-13  
**Scope:** homepage + all 29 style pages, repo structure, deploy plumbing  
**Nature:** AUDIT ONLY. No existing file was modified, restyled, refactored or fixed as part of 
this pass. This report is the only artifact added. Every item below that reads as a problem is 
**reported, not resolved** — including the ones whose fix would be a one-line change.

---

## How the numbers here were produced

Contrast figures are measured, not read off the stylesheet, using a **differential render** in 
headless Chromium. Each probed element is screenshotted twice: once as rendered, and once with its 
own text rendering neutralised — `-webkit-text-fill-color` and `color` set transparent (killing both 
a plain fill and any `background-clip:text` gradient), plus `text-shadow` and `-webkit-text-stroke` 
removed. Everything that is genuinely *background* — page gradient, paper texture, blend mode, 
`backdrop-filter`, the element's own box fill, scanline overlays — is still painted in the second 
shot. Differencing the two isolates the glyph pixels, and contrast is computed **per pixel** against 
the background that pixel actually sits on.

Removing the shadow and stroke matters: they are part of how the *text* is drawn, not part of its 
background, and leaving them in means measuring glowing type against its own glow.

The foreground is taken from the element's computed `color`. Deriving it from the rendered pixels 
instead was tried and rejected — where an element contains a filled child box (a terminal cursor 
block, a label chip) those pixels are not text at all, and scoring them as text produces failures 
that do not exist.

**Five earlier methods were tried and each produced false results on this site.** They are recorded 
here so the same wrong numbers are not re-derived later:

1. Walking the DOM for the first non-transparent ancestor background misreads any page with a 
   translucent texture layer, treating `rgba(0,0,0,0)` as black. It scored Conceptual Sketch, 
   Victorian and Bohemian as near-total failures; all three are fine.
2. Taking an element box's most common colour as the background breaks on heavy display type, where 
   glyphs cover more of their own bounding box than the background does — it compared text against 
   itself and returned exactly 1.00:1.
3. Taking the most common *non*-background colour as the text colour breaks under LCD subpixel 
   antialiasing, whose coloured fringes outnumber the solid stroke on small text. It scored 
   Minimalism's nav links at 1.34:1; they are 6.69:1. Subpixel AA is disabled for the final run.
4. Applying one computed `color` to every glyph in an element breaks on headings with mixed-colour 
   runs — it measured Mixed Media's white "START" against the yellow highlight behind "building."
5. Leaving `text-shadow` in the background render measures glowing text against its own halo. This 
   one produced the single worst false finding of the audit: Cybercore's hero copy scored 1.74:1 and 
   was briefly written up as the site's largest miss. Measured against the actual mint ground it is 
   **8.33:1** and passes comfortably. Gothic's nav links (falsely 4.03:1, actually 14.25:1) and 
   Graffiti's logo and card headings were wrong for the same reason.

Every failure reported below was additionally re-verified individually, both with the foreground 
forced to the computed colour and with it derived per-pixel, and checked against a rendered crop. 
Where the method still cannot decide, the entry says so instead of asserting a number.

**Thresholds:** 4.5:1 normal text, 3:1 large text (>=18.66px, or >=14px at weight >=700). Both the 
worst-case pixel (`min`) and the median across the stroke are given; `min` governs the pass/fail 
call, matching how WCAG treats text on a variable background.

---

## STEP 0 — Plumbing

### Live URL

| Question | Finding |
|---|---|
| Current repo | `Utkarsh7106/atlas-ori` |
| Renamed how many times | **Once**, not twice. `website-designs` -> `atlas-ori`. |
| Live Pages URL | **`https://utkarsh7106.github.io/atlas-ori/`** |
| Source of that URL | GitHub API `repos/Utkarsh7106/atlas-ori` -> `homepage`, `has_pages: true` |

The brief anticipated a second rename to `atlas`. **That rename has not happened**, or at least has 
not happened in a way this session can see:

- `GET /repos/Utkarsh7106/website-designs` -> `301` redirecting to repository id `1345715599` 
  (the rename to `atlas-ori`).
- `GET /repos/Utkarsh7106/atlas-ori` -> `200`, `name: atlas-ori`.
- `GET /repos/Utkarsh7106/atlas` -> `403`, *"GitHub access to this repository is not enabled for 
  this session"*. That is an authorisation refusal, **not** a 404, so it is not proof either way: 
  an `atlas` repo may exist and simply be outside this session's grant. It cannot be confirmed 
  from here.

Practical consequence: the live site is served from `/atlas-ori/`, and every in-page link is 
relative, so the pages link to each other correctly under any repo name. The only place the repo 
name is hardcoded is the footer "Source" link — see the broken-link finding below.

### Deploy branch

**The deploy branch is no longer `claude/design-styles-showcase-96zcl5`.** It is **`add-designs`**, 
which is also the repository's `default_branch`.

Pages deployment history (workflow `pages build and deployment`):

| Run | Branch | Commit | Result | When |
|---|---|---|---|---|
| 119 | `add-designs` | `841c72c` | success | 2026-09-13T13:05:36Z |
| 118 | `add-designs` | `8a0bcbd` | success | 2026-09-13T12:56:18Z |
| 117 | `add-designs` | `8a0bcbd` | success | 2026-09-12T09:23:46Z |
| 116 | `add-designs` | `8a0bcbd` | cancelled | 2026-09-12T09:23:12Z |
| 115 | `claude/design-styles-showcase-96zcl5` | `8a0bcbd` | success | 2026-08-31T05:06:59Z |

Run 115 is the last deployment from the old branch. The old branch still exists locally and on the 
remote but is **stale** — it does not contain the Brutalism revision.

### `.nojekyll`

**Absent.** There is no `.nojekyll` at the repo root (nor anywhere else in the tree).

No file in this site currently starts with an underscore, so Jekyll's default exclusion rules are 
not dropping anything today. This is reported as a latent fragility, not a live breakage: the 
moment anyone adds `_assets/`, `_fonts/` or similar, it would be silently omitted from the build.

### Limitation — live URLs could not be fetched

This session's network egress proxy **blocks `utkarsh7106.github.io`** (gateway answers `403` to 
`CONNECT`; `curl` returns `000`, `WebFetch` returns `EGRESS_BLOCKED`). Both were attempted.

Consequence for Step 1: the per-page requirement to *"fetch the LIVE deployed URL directly and 
report actual HTTP status"* **could not be carried out**. No HTTP status codes from the live host 
appear in this report, and none should be inferred from it. What was verified instead, for every 
page, is the strongest available substitute:

1. the link target resolves to a real file in the working tree, and
2. that same path exists in the **deployed commit** (`git ls-tree origin/add-designs`).

That establishes the files are present in what Pages built. It does **not** establish the live 
server returns 200 for them. Confirming that needs either a session whose egress allows 
`*.github.io`, or a manual check in a browser.

---

## STEP 1 — Per-page findings

All 30 pages are reported individually below, in the order given in the brief.

---

### Homepage

`index.html` — 28,155 bytes

**Content parity.**

Not applicable in the same sense — the homepage is the index of the other 29, not another 
instance of the shared page. It carries the shared `Atlas` wordmark and its own nav. It 
holds 29 style cards, each with a `View style` affordance (29 occurrences).

**Design Points.** None — the homepage carries no Design Points section by design. 
(`data-style` sections exist only on the 29 style pages.)

**Colour tokens actually used in this page's CSS.**

12 distinct hex values; 2 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#111114` `#111111` `#1a1a20` `#2f2f37` `#6b6b73` `#6c6c74` `#8a8a92` `#9a9aa4` `#e6e6ea` `#f2f2f4` `#f7f7f9`

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Arial`, `Brush Script MT`, `Dancing Script`, `Helvetica`, `Inter`, `Roboto`, `Segoe Script`, `Segoe UI`, `cursive`, `sans-serif`

Explicit `font-weight` values: `400`, `500`, `600`, `700`

`@font-face` declarations (8) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Dancing Script` | 700 | normal | swap | `assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Inter` | 400 | normal | swap | `assets/fonts/inter/inter-400.woff2` |
| `Inter` | 400 | normal | swap | `assets/fonts/inter/inter-400-ext.woff2` |
| `Inter` | 500 | normal | swap | `assets/fonts/inter/inter-400.woff2` |
| `Inter` | 500 | normal | swap | `assets/fonts/inter/inter-400-ext.woff2` |
| `Inter` | 600 | normal | swap | `assets/fonts/inter/inter-400.woff2` |
| `Inter` | 600 | normal | swap | `assets/fonts/inter/inter-400-ext.woff2` |

**Images / media.**

29 `<img>` elements — the 29 style-card preview screenshots, every one carrying 
`loading="lazy"`. `<svg>`: zero. `<canvas>`: zero.

CSS `background`/`background-image` declarations using `url()` or a gradient: 0.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | no |
| Native `<dialog>` | no |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | yes, 29 |
| CSS `transition` declarations | 14 |
| `@keyframes` blocks | 0 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 1 |
| `localStorage` references | 2 |

**WCAG AA contrast.**

Not measured — the homepage was not in the contrast sweep, which targeted the shared style-page 
chrome. Its nav, card titles and body copy sit on flat tokens and are not flagged by the 
stylesheet review, but this is stated as *not measured*, not as *passing*.

---

### Minimalism

`styles/minimalism.html` — 34,909 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Minimalism

**Era / Origin**

> Post-2015 SaaS and developer-tool minimalism — Stripe, Linear, Vercel — which is what this page actually builds: a neutral grotesque (Inter), fluid clamp() type, hairline-separated cards, no ornament. That idiom descends from 1960s–70s minimal art and Dieter Rams' product design at Braun, but the closer and more accurate lineage is the last decade of interface work.

**Color Palette**

> #ffffff — page background, the dominant surface #0a0a0a — headings, logo, button fill on hover #5c5c5c — body copy and nav links #e5e5e5 — 1px hairline rules, the only drawn lines #fafafa — reserved hover tint

**Typography**

> Inter for everything (fallback: Helvetica Neue, Arial) — deliberately unpaired; a second family would be one decision too many. Weights limited to 300 for display, 400 for body, 500 for labels and the logo. Sizing is a narrow ramp: 11px labels, 14–15px body, 17px card titles, and one large jump to clamp(38px, 6.4vw, 68px) for the hero. Display sizes get −0.038em tracking; body stays at 0.

**Layout Logic**

> A single 920px centred column, all content flush left with a ragged right edge; no element is centred except the column itself. Vertical rhythm is one large token — clamp(96px, 14vh, 160px) — between sections and 8px multiples inside them, so whitespace, not boxes, does the grouping.

**Signature Techniques**

> 1px hairline rules in #e5e5e5 as the only separators — no cards, panels, or filled containers anywhere. Zero border-radius and zero box-shadow; depth is never simulated. Measure capped at 14ch for the headline and 38ch for body copy, forcing generous unused space at the right. Uppercase 11px labels at 0.18em tracking as the sole ornamental device. An outlined button that inverts to solid on hover — the page's single colour event.

**Motion/Interaction**

> Restrained and short. Nav links grow a 1px underline from the left over 280ms (scaleX with a left transform-origin). The button crossfades background and text colour over 220ms. An IntersectionObserver reveals the hero, cards, CTA and component reference once each with a 10px rise and fade over 600ms, then unobserves — nothing animates twice, nothing loops. Two controls sit in the nav at the page's 11px label size: one moves the nav between a top bar and a fixed left rail by changing a single --rail token, the other flips data-theme so the whole page re-resolves through five colour tokens; both persist to localStorage and reflow over 280ms. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background; it fades in over 220ms and returns focus to its trigger. Every transition here is CSS, so prefers-reduced-motion mutes all of it.

**Common Mistake** *(upgraded field)*

> Treating "minimal" as "less content" rather than less ornamentation — cutting copy instead of cutting borders, shadows and radius, when the actual mechanism is one hairline as the only separator and zero border-radius or shadow anywhere.

**Production Caveat** *(upgraded field)*

> One unpaired typeface at three weights means every hierarchy decision rides on size and the single accent-colour event (the outline-to-solid button). Adding a second surface without that same discipline — a second font, a shadow "just this once" — erodes the whole system fast.

**Accessibility Risk** *(upgraded field)*

> Body copy sits at #5c5c5c on white and the nav's hover cue is a 1px underline that grows from the left — both legible, but low-affordance: a user relying on link-shape recognition rather than colour has almost no non-colour cue until hover or focus reveals the underline.

**When Not To Use** *(upgraded field)*

> Interfaces where users need to scan or compare many similar items quickly, like a dense dashboard or comparison table. The whitespace-as-hierarchy approach that works at three cards collapses information density at scale.

**Replication Rules**

> Use one typeface at no more than three weights, and never let a decorative face in. Restrict colour to white, near-black, one grey for secondary text, and one lighter grey for rules — no accent hue at all. Separate content with 1px hairlines or empty space only; forbid yourself borders on all four sides, fills, radii, and shadows. Set every section's vertical padding from a single large spacing token (96–160px) so the page reads as air with text in it. Establish hierarchy through size and weight jumps alone — if you are reaching for colour or a box to signal importance, delete something instead.

**Colour tokens actually used in this page's CSS.**

11 distinct hex values; 3 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#0a0a0a` `#fafafa` `#111111` `#141414` `#2a2a2a` `#5c5c5c` `#737373` `#a3a3a3` `#e5e5e5` `#f5f5f5`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-paper` | `#ffffff` |
| `--th-ink` | `#0a0a0a` |
| `--th-muted` | `#5c5c5c` |
| `--th-rule` | `#e5e5e5` |
| `--th-tint` | `#fafafa` |
| `--th-paper` | `#0a0a0a` |
| `--th-ink` | `#f5f5f5` |
| `--th-muted` | `#a3a3a3` |
| `--th-rule` | `#2a2a2a` |
| `--th-tint` | `#141414` |

**Typography.**

Families referenced: `-apple-system`, `11px/1.4 "Inter`, `11px/1.5 "Inter`, `14px/1.2 system-ui`, `Arial`, `Brush Script MT`, `Consolas`, `Dancing Script`, `Helvetica Neue`, `Inter`, `Menlo`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `300`, `400`, `500`, `700`

`@font-face` declarations (8) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Inter` | 300 | normal | swap | `../assets/fonts/inter/inter-400.woff2` |
| `Inter` | 300 | normal | swap | `../assets/fonts/inter/inter-400-ext.woff2` |
| `Inter` | 400 | normal | swap | `../assets/fonts/inter/inter-400.woff2` |
| `Inter` | 400 | normal | swap | `../assets/fonts/inter/inter-400-ext.woff2` |
| `Inter` | 500 | normal | swap | `../assets/fonts/inter/inter-400.woff2` |
| `Inter` | 500 | normal | swap | `../assets/fonts/inter/inter-400-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background-image` / gradient declarations: **zero**.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | yes — observer adds .in to .reveal elements |
| `View style` affordance | n/a |
| CSS `transition` declarations | 17 |
| `@keyframes` blocks | 1 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 2 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/minimalism/SKILL.md` | exists | yes |
| Example website | `../examples/minimalism/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

0 of 26 probed pairs fail; 1 could not be resolved automatically.

| Mode | Element | min | median | Needs | Verdict |
|---|---|---|---|---|---|
| light | CTA heading | — | — | — | UNRESOLVED — no glyph pixels isolated |


- **light / CTA heading** — no glyph pixels isolated. The glyph fill could not be neutralised, which means the visible letterform is not being painted by `color` or a `background-clip` fill: it is drawn by `text-shadow` and/or `-webkit-text-stroke`. Automated measurement does not apply; this pair needs a human judgement call.

---

### Maximalism

`styles/maximalism.html` — 44,341 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Maximalism

**Era / Origin**

> 2020s "loud" SaaS and marketing-site design — Gumroad's 2022 rebrand, Figma and Linear's campaign pages, the neo-brutalist template wave — which is what this page's actual technique is: stacked zero-blur shadows, a deliberately broken type scale, saturated fills behind hard black outlines. That idiom is a counter-reaction to flat minimalism from roughly 2018 onward, and it descends in turn from Memphis Group (1981), rave flyers, and early personal-homepage excess.

**Color Palette**

> #ff2d95 — hot pink page ground and shadow layer #ffe600 — electric yellow for the nav bar and display type #00e5ff — cyan for pills, offsets, and clashing text shadows #6a00f4 — purple stripes and heading fills #b6ff00 — lime for the primary button and marquee text #0b0b0b — the black outline that makes the chaos survivable

**Typography**

> Three families deliberately in conflict: Archivo Black for display and buttons, Playfair Display Black Italic for the CTA and one word inside the hero headline, Space Mono 700 for all body and UI text. Display runs uppercase at clamp(34px, 7.6vw, 86px) with 0.92 leading; body copy is bold 14–15px mono. There is no mid-range size — type is either shouting or fine print, and every headline carries stacked multi-colour text-shadows.

**Layout Logic**

> A centred 1120px shell holds full-width blocks stacked vertically, but nothing inside them is axis-aligned: cards sit on auto-fit columns at −2deg, +1.5deg and −1deg, and stickers are absolutely positioned over the hero's corners. Spacing is generous and irregular (24–52px) precisely so the offset shadows have room to land.

**Signature Techniques**

> Layered backgrounds — a 45° stripe overlay on a conic checkerboard on a flat pink — so no surface is a single colour. Doubled hard drop shadows (14px 14px 0 black, 26px 26px 0 yellow) with zero blur on every block. Stacked text-shadows in three colours to give headlines a chromatic ghost. Rotations between −3deg and +11deg on the logo, cards, pills, and stickers; nothing rests at 0deg. A looping black-and-lime marquee ticker pinned above the nav, plus inset box-shadow used as a second internal border.

**Motion/Interaction**

> Constant and unapologetic. The marquee translates −50% on an 18s linear loop; stickers bob 7px on a 3.2s ease-in-out loop. Hovering a nav pill rotates it 4deg and scales it 1.08; hovering a card snaps it back to 0deg and scales it 1.04; the button flips rotation and swaps its shadow stack. Clicking Explore or Get in touch fires a JS confetti burst of 18 hard-outlined squares that fall with randomised velocity and rotation, cleaned up after 1.2s — the burst is driven by the Web Animations API rather than CSS, so it is guarded explicitly and skipped when prefers-reduced-motion is set. Two pill controls sit in the nav: one moves the nav between a top bar and a fixed left rail by changing a single --rail token, the other flips data-theme so the whole page re-resolves through a handful of colour tokens; both persist to localStorage and turn lime when pressed. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background; it rises 10px over 160ms and returns focus to its trigger.

**Common Mistake** *(upgraded field)*

> Adding one loud element to an otherwise calm page. The rule is at least five saturated colours with no neutral ground and two or more layered patterns behind every major block; a single bold accent on a quiet page is a highlight, not maximalism.

**Production Caveat** *(upgraded field)*

> Confetti bursts and the marquee/bob loops are all explicitly guarded behind prefers-reduced-motion via the Web Animations API. Copying the visual chaos without the matching matchMedia guards ships a page that is aggressively animated with no way to turn any of it down.

**Accessibility Risk** *(upgraded field)*

> Stacked multi-colour text-shadows exist specifically so headlines "read even against pattern" — a real accessibility mitigation for a genuinely hostile background. New text added to a patterned area needs the same stacked-shadow treatment, not just a plain colour, to stay legible.

**When Not To Use** *(upgraded field)*

> Anything requiring sustained visual focus — forms, reading, data entry. Five-plus competing colours, three conflicting typefaces and constant motion are the opposite of what a concentration-heavy task needs.

**Replication Rules**

> Use at least five saturated colours with no neutral ground, and layer two or more patterns behind every major block. Set three typefaces that disagree — a heavy grotesque, a high-contrast italic serif, and a mono — and mix them inside a single headline. Outline everything in 4–6px black and give it a hard zero-blur drop shadow, doubled in a second colour on the largest blocks. Rotate every element by ±1–11deg and let items overlap their containers rather than sitting inside them. Keep something moving at all times — a marquee, a bob, or a hover that changes rotation — and stack multi-colour text-shadows so type reads even against pattern.

**Colour tokens actually used in this page's CSS.**

11 distinct hex values; 3 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#0b0b0b` `#00e5ff` `#6a00f4` `#f4f4f5` `#101014` `#111111` `#5300c0` `#b6ff00` `#ff2d95` `#ffe600`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-pink` | `#ff2d95` |
| `--th-yellow` | `#ffe600` |
| `--th-cyan` | `#00e5ff` |
| `--th-purple` | `#6a00f4` |
| `--th-lime` | `#b6ff00` |
| `--th-black` | `#0b0b0b` |
| `--th-veil` | `rgba(255,255,255,.55)` |
| `--th-surface` | `#ffffff` |
| `--th-on-surface` | `#0b0b0b` |
| `--th-surface-line` | `#0b0b0b` |
| `--th-halo` | `#ffffff` |
| `--th-surface-accent` | `#6a00f4` |
| `--th-veil` | `rgba(5,5,9,.74)` |
| `--th-surface` | `#101014` |
| `--th-on-surface` | `#f4f4f5` |
| `--th-surface-line` | `#f4f4f5` |
| `--th-halo` | `#0b0b0b` |
| `--th-surface-accent` | `#00e5ff` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Archivo Black`, `Brush Script MT`, `Dancing Script`, `Playfair Display`, `Segoe Script`, `Segoe UI`, `Space Mono`, `cursive`, `monospace`, `sans-serif`, `serif`

Explicit `font-weight` values: `400`, `700`, `900`

`@font-face` declarations (12) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Archivo Black` | 400 | normal | swap | `../assets/fonts/archivo-black/archivo-black-400.woff2` |
| `Archivo Black` | 400 | normal | swap | `../assets/fonts/archivo-black/archivo-black-400-ext.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Playfair Display` | 700 | italic | swap | `../assets/fonts/playfair-display/playfair-display-700-italic.woff2` |
| `Playfair Display` | 700 | italic | swap | `../assets/fonts/playfair-display/playfair-display-700-italic-ext.woff2` |
| `Playfair Display` | 900 | italic | swap | `../assets/fonts/playfair-display/playfair-display-700-italic.woff2` |
| `Playfair Display` | 900 | italic | swap | `../assets/fonts/playfair-display/playfair-display-700-italic-ext.woff2` |
| `Space Mono` | 400 | normal | swap | `../assets/fonts/space-mono/space-mono-400.woff2` |
| `Space Mono` | 400 | normal | swap | `../assets/fonts/space-mono/space-mono-400-ext.woff2` |
| `Space Mono` | 700 | normal | swap | `../assets/fonts/space-mono/space-mono-700.woff2` |
| `Space Mono` | 700 | normal | swap | `../assets/fonts/space-mono/space-mono-700-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **5**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 10 |
| `@keyframes` blocks | 3 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 4 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/maximalism/SKILL.md` | exists | yes |
| Example website | `../examples/maximalism/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 26 probed pairs pass, in both themes. Worst pair on the page: 
`card heading` (light) at 4.68:1 against a 3.0:1 requirement.

---

### Swiss Design

`styles/swiss-design.html` — 46,313 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Swiss Design

**Era / Origin**

> Switzerland, 1950s–60s — the International Typographic Style of Josef Müller-Brockmann, Armin Hofmann and the Basel and Zürich schools.

**Color Palette**

> #ffffff — page background #111111 — type, 4px rules, secondary button #d31f16 — single signal colour: CTA, numerals, circle mark #707070 — metadata and small caption text #dcdcdc — light hairline where a 2px rule would be too loud

**Typography**

> Inter Tight as the Helvetica/Akzidenz-Grotesk stand-in (fallback: Helvetica Neue, Arial) paired with IBM Plex Mono for numerals, metadata, and grid labels only. Two weights carry the page: 700 for all display and 400–500 for body and labels. Display is set uppercase at −0.048em tracking and 0.88–0.9 line-height so words lock into solid blocks; captions and labels run 10–12px at +0.1 to +0.16em tracking. Nothing sits between 15px and 46px — the ramp is deliberately discontinuous.

**Layout Logic**

> A 12-column grid with a 24px gutter governs every element, including the nav and the overlay; each block declares an explicit column span (headline 1–10, deck 10–13, cards span 4, CTA 1–9 with the button at 10–13). Alignment is flush left with a ragged right edge, and asymmetry — a wide headline against a narrow offset deck — supplies the tension that centring would kill.

**Signature Techniques**

> Heavy 4px black rules to open and close major sections, 2px rules to head each card. Sequential numerals (01 / 02 / 03) set in mono red as an organising device. A pure geometric mark — one red circle, 84px — placed on the grid as content, never as decoration. Full-column-width solid colour buttons that fill their grid cell edge to edge rather than being sized by their label. A toggleable red column overlay that exposes the underlying grid on demand.

**Motion/Interaction**

> Mechanical, not easing-heavy. Pressing G (or clicking the hint) toggles a fixed 12-column red overlay via a class, fading in over 250ms linear; it also auto-reveals for 1.1s on first load to declare the system. Buttons and nav links swap between black and red on hover over 180ms linear. No transforms, no scroll animation — movement would contradict the objectivity of the style.

**Common Mistake** *(upgraded field)*

> Applying the grid to type sizes but not to placement. The real discipline is that every block declares an explicit column span — headline 1–10, deck 10–13, and so on — not just "loosely aligned to 12 columns."

**Production Caveat** *(upgraded field)*

> The discontinuous type ramp (nothing between 15px and 46px) means any new component needs a deliberate size decision, not an intermediate value. Teams tend to fill that gap the first time a designer isn't looking.

**Accessibility Risk** *(upgraded field)*

> The single red signal colour carries real meaning — CTA, numerals, the mark. A user with red-green colour vision deficiency loses that "this is the signal" cue and has to rely on position and weight alone, which the grid-and-mono system does provide as a fallback.

**When Not To Use** *(upgraded field)*

> Content-first reading experiences — long-form articles, documentation — where 12-column column-span rigidity fights natural text measure rather than serving it.

**Replication Rules**

> Declare a 12-column grid with a fixed gutter first, then place every element by explicit column span — never let a block size itself to its content. Use one neo-grotesque (Helvetica, Inter Tight, Univers) plus one mono for numerals; cap yourself at two weights, 400 and 700. Set all display type uppercase, flush left, at −0.04 to −0.05em tracking and under 0.9 line-height; never centre a headline. Allow exactly one accent colour — a saturated red — and spend it only on the primary action, numerals, and one geometric mark. Structure with rules of two weights (4px for sections, 2px for items) and build asymmetry by pairing a wide type block against a narrow offset column.

**Colour tokens actually used in this page's CSS.**

11 distinct hex values; 6 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#111111` `#ffffff` `#3a3a3a` `#707070` `#8a8a8a` `#9a9a9a` `#d31f16` `#dcdcdc` `#e2231a` `#f2f2f2` `#ff4438`

**Typography.**

Families referenced: `-apple-system`, `10px/1 "IBM Plex Mono`, `11px/1 "IBM Plex Mono`, `11px/1.5 "IBM Plex Mono`, `12px/1 "Inter Tight`, `14px/1.2 system-ui`, `5.4vw`, `68px)/.9 "Inter Tight`, `9px/1.2 "IBM Plex Mono`, `9px/1.2 "Inter Tight`, `Arial`, `Brush Script MT`, `Dancing Script`, `Helvetica`, `Helvetica Neue`, `IBM Plex Mono`, `Inter Tight`, `Segoe Script`, `Segoe UI`, `clamp(46px`, `cursive`, `monospace`, `sans-serif`

Explicit `font-weight` values: `400`, `500`, `700`

`@font-face` declarations (12) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `IBM Plex Mono` | 400 | normal | swap | `../assets/fonts/ibm-plex-mono/ibm-plex-mono-400.woff2` |
| `IBM Plex Mono` | 400 | normal | swap | `../assets/fonts/ibm-plex-mono/ibm-plex-mono-400-ext.woff2` |
| `IBM Plex Mono` | 500 | normal | swap | `../assets/fonts/ibm-plex-mono/ibm-plex-mono-500.woff2` |
| `IBM Plex Mono` | 500 | normal | swap | `../assets/fonts/ibm-plex-mono/ibm-plex-mono-500-ext.woff2` |
| `Inter Tight` | 400 | normal | swap | `../assets/fonts/inter-tight/inter-tight-400.woff2` |
| `Inter Tight` | 400 | normal | swap | `../assets/fonts/inter-tight/inter-tight-400-ext.woff2` |
| `Inter Tight` | 500 | normal | swap | `../assets/fonts/inter-tight/inter-tight-400.woff2` |
| `Inter Tight` | 500 | normal | swap | `../assets/fonts/inter-tight/inter-tight-400-ext.woff2` |
| `Inter Tight` | 700 | normal | swap | `../assets/fonts/inter-tight/inter-tight-400.woff2` |
| `Inter Tight` | 700 | normal | swap | `../assets/fonts/inter-tight/inter-tight-400-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background-image` / gradient declarations: **zero**.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 21 |
| `@keyframes` blocks | 1 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 1 |
| `localStorage` references | 2 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/swiss-design/SKILL.md` | exists | yes |
| Example website | `../examples/swiss-design/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 26 probed pairs pass, in both themes. Worst pair on the page: 
`card label/icon` (light) at 4.95:1 against a 4.5:1 requirement.

---

### Brutalism

`styles/brutalism.html` — 37,066 bytes

**Content parity.**

Nav `Atlas / Work / About / Contact`, headline "Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `[ Explore ]`, CTA "Start building." / `[ Get in touch ]` — all at baseline.

The three feature cards are **not** `<article class="card">` here — they are the three rows of a 
real `<table>`, each `<th scope="row">` carrying the label and the `<td>` the heading and body. 
Text is verbatim baseline: Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed lines. 
Content parity holds; only the element carrying it differs, which is the page's whole argument.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Brutalism

**Era / Origin**

> Web brutalism, roughly 2014–2018 (brutalistwebsites.com, Bloomberg, Balenciaga) — named after 1950s béton brut architecture, which exposed raw material rather than cladding it.

**Color Palette**

> #f2efe9 — page background, a warm cream rather than stark white #0a0a0a — text and every 1px border, near-black rather than pure #6b6b6b — secondary text: tag annotations, feature and dialog copy, anything describing the page rather than acting on it. 4.64:1 on paper #cc2f1a — the accent, used on paper: feature-row labels, the Design Points field column, one word of the headline, and (as a fill under white text) the hero's hover state. 4.59:1 as text on paper, 5.26:1 as a fill under white #ff5a3c — the same accent's counterpart for ink-coloured surfaces: the CTA panel's own link and status line sit on ink rather than paper, so they need a value tuned against ink instead (6.39:1) Dark mode doesn't swap these in wholesale — it swaps the roles. #0a0a0a/#f2efe9 trade places as ink/paper, #9a9a9a replaces the secondary grey, and the two accents trade places too: whichever one was tuned for "on paper" becomes the "on ink" value and vice versa, because the CTA panel is always painted with --ink, and ink itself is a different colour per theme.

**Typography**

> Two registers: Archivo Black, uppercase, on every heading and dialog title; Courier New for everything else on the page — running body copy, structural tag annotations, the status/cursor line, plain links and every bracketed control. The one deliberate exception is the "Atlas" wordmark, kept in Times New Roman as a small serif mark distinct from both. Sizes come straight off a document scale: 48px h1, 36px h2, 22px h3, 16px body, 11–13px mono. Line-height sits at a cramped 1.35 and no tracking is applied anywhere except a slight -0.01em on the display headings.

**Layout Logic**

> There is no grid and no max-width: every block is a full-bleed <section> with an 8px pad and a 1px black border, stacked in source order with zero margin so borders collide into shared 2px seams. The feature row is a real <table> with border-collapse, because a table is the honest element for tabular content.

**Signature Techniques**

> The accent is spent with intent, not sprayed everywhere: plain nav and footer links stay ink, and red marks only the things that are actually acting on the reader — feature labels, the headline's one accented word, the status line, and the page's two calls to action. The CTA section is a full reverse-video panel (ink background, paper text) rather than a coloured block — which inverts correctly in dark mode for free, since ink and paper already swap roles per theme. Visible structural annotations (<nav>, <section id="cta">) printed in mono above each block, so the page documents its own markup. Buttons rendered as bracketed text links — [ Explore ] via ::before/::after — rather than as styled objects. Uniform 1px black borders with no radius, no shadow, and no margin collapse control. A live mono status line and a blinking READY_ cursor driven by setInterval, in the register of a terminal rather than a product.

**Motion/Interaction**

> Deliberately unrefined: there is not a single transition on the page, including on everything added since. Most hover states snap to a plain ink/paper invert — nav links, the nav's own toggles, the dialog's close control, the Design Points actions. The page's two calls to action snap to the accent instead, since they're what the accent exists to point at: "Explore" flashes to a red fill on hover, and "Get in touch" (already sitting on the CTA's inverted ink panel) flashes back to paper. JS blinks the READY_ cursor by toggling visibility every 600ms — because that is a script-driven interval rather than CSS, it is guarded by a matchMedia check and the cursor is left solid when prefers-reduced-motion is set — and writes the document's real viewport width and load timestamp into the mono status line, updating on resize; information, not decoration. Two bracketed controls sit in the nav, written in the same [ ] form as every other action: one moves the nav between a stacked box and a fixed left rail by changing a single --rail token, the other flips data-theme, and both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger on close.

**Common Mistake** *(upgraded field)*

> Two, in opposite directions. Restyling every link red "for consistency" — the accent's whole point is that it marks the handful of things actually worth marking; give it to every link and it stops meaning anything, exactly like the browser-default blue it replaced. The opposite failure is treating the surviving structural rules as loose: reach for a soft shadow, a rounded corner or an eased hover "for polish" and this stops being brutalism and becomes a plain page with a brutalist theme layered on top — hard 1px borders, zero radius, zero shadow and zero transitions (but the cursor and status line) are still the whole floor this page stands on.

**Production Caveat** *(upgraded field)*

> There is not a single CSS transition on the page by design. Any future interactive state added without matching that constraint — a smooth hover fade, an eased reveal — will visually contradict the rest of the page immediately.

**Accessibility Risk** *(upgraded field)*

> Every colour here is now custom rather than a browser default, so every pairing was measured rather than inherited for free: #cc2f1a reads 4.59:1 on the cream paper, #ff5a3c reads 6.39:1 on ink, and #6b6b6b's secondary text reads 4.64:1 on paper — all comfortably clear AA, and each swaps to the value tuned for its surface's counterpart colour in dark mode rather than reusing the same hex. The 1.35 body line-height is still tighter than WCAG's 1.5 recommendation, and is inherited unchanged from the document default this page deliberately never overrides.

**When Not To Use** *(upgraded field)*

> Consumer e-commerce or any context where trust signals matter. Deliberately raw, undesigned pages can read as broken or unfinished to a non-technical audience rather than as an intentional statement.

**Replication Rules**

> Load at most one bold, uppercase display face for headings. Use one monospace face for everything else — body copy, machine text, every plain link and bracketed control — with at most one small serif exception for a wordmark, kept deliberately apart from both. Pick one accent colour and spend it only on things that act — labels, one accented word, a status line, the calls to action — never on plain navigational or footer links. Verify it at 4.5:1 wherever it lands as text, and derive a second value tuned for the opposite (ink vs. paper) surface rather than reusing the same hex everywhere. Give every block a 1px solid black border, 8px padding, no radius, no shadow, no margin, and let borders touch. Links stay underlined text, never restyled into buttons. Ban all transitions and animations except utilitarian ones (a blinking cursor, a live counter); hover states must snap. Expose structure instead of hiding it — print tag names, use real tables for tabular data, and let the page read as a document rather than a product.

**Colour tokens actually used in this page's CSS.**

10 distinct hex values; 1 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#0a0a0a` `#cc2f1a` `#f2efe9` `#ff5a3c` `#000000` `#111111` `#141414` `#6b6b6b` `#9a9a9a`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-paper` | `#f2efe9` |
| `--th-ink` | `#0a0a0a` |
| `--th-grey` | `#6b6b6b` |
| `--th-accent` | `#cc2f1a` |
| `--th-on-accent` | `#ffffff` |
| `--th-accent-on-ink` | `#ff5a3c` |
| `--th-paper` | `#141414` |
| `--th-ink` | `#f2efe9` |
| `--th-grey` | `#9a9a9a` |
| `--th-accent` | `#ff5a3c` |
| `--th-on-accent` | `#0a0a0a` |
| `--th-accent-on-ink` | `#cc2f1a` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Archivo Black`, `Brush Script MT`, `Courier`, `Courier New`, `Dancing Script`, `Segoe Script`, `Segoe UI`, `Times`, `Times New Roman`, `cursive`, `monospace`, `sans-serif`, `serif`

Explicit `font-weight` values: `400`, `700`

`@font-face` declarations (4) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Archivo Black` | 400 | normal | swap | `../assets/fonts/archivo-black/archivo-black-400.woff2` |
| `Archivo Black` | 400 | normal | swap | `../assets/fonts/archivo-black/archivo-black-400-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background-image` / gradient declarations: **zero**.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | **yes** |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 1 |
| `@keyframes` blocks | 0 |
| `setInterval` | 1 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 3 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/brutalism/SKILL.md` | exists | yes |
| Example website | `../examples/brutalism/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 24 probed pairs pass, in both themes. Worst pair on the page: 
`card label/icon` (light) at 4.59:1 against a 4.5:1 requirement.

---

### Surrealism

`styles/surrealism.html` — 43,327 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Surrealism

**Era / Origin**

> Paris, 1924 — André Breton's manifesto, realised visually by Magritte's daylight skies and Dalí's deserts; adopted into graphic design as photographic collage with impossible relationships.

**Color Palette**

> #a8c4d8 — Magritte daylight sky, the page ground #7ba0bd — deeper sky toward the horizon #e8d9c3 — desert sand at the bottom of the gradient #e5b5a0 — uncanny flesh tone for the small impossible objects #f6f2ea — cloud white, fixed on every floating cloud and the eye's sclera regardless of hour #1c2733 — deep blue-black for type, the door and cast shadows Sky, sand, panel surfaces (nav/cards/hero note) and ink invert under dark mode — the daylight scene becomes the same dream after dark; flesh and cloud hold their values in both themes, since they're objects in the scene rather than lit surfaces.

**Typography**

> Cormorant Garamond at 300 for display, Inter at 400–500 for all small text — a deliberately calm, plausible pairing so the strangeness comes from arrangement rather than lettering. Inside a single headline the scale breaks: one word at 1.5em italic, another at 0.34em raised on a 0.9em baseline shift and tracked to 0.2em, sitting in a line already set at clamp(40px, 7.4vw, 92px). Body is 13.5–14px at 1.8 with 0.06em tracking.

**Layout Logic**

> A conventional 1060px column that the content then disobeys: cards on a normal three-column grid are individually rotated −2 to +1.4deg and pushed +26px, 0 and −22px vertically so the row never settles, and absolutely positioned objects (an eye, a door) hang off the hero's edges. The grid exists precisely so that breaking it reads as intentional.

**Signature Techniques**

> Contradictory shadows — one card casts down-left, one casts upward, one casts down-right — so no single light source can exist. Long, soft, far-offset shadows (26px 40px 40px -22px) that make flat planes float above the sky. Impossible scale inside one line of type, with a tiny sans word wedged into a large serif headline. Blurred cloud ellipses drifting on 21–34s loops behind the content, with one reversed. Objects that belong to another picture entirely: a door standing in the sky, a floating eye, small flesh-toned spheres pinned to card corners.

**Motion/Interaction**

> The page refuses to behave, within limits. JS makes the eye's iris track the pointer within an 11px radius, so it watches the visitor — muted under reduced motion, since the tracking is a discrete style write each pointermove rather than a running loop. The Explore button flees: when the pointer comes within 130px it translates away over 900ms on cubic-bezier(.16,1,.3,1), clamped so it can never leave its own container, and only for three dodges — the fourth approach lets it settle back to place and stay put, catchable, rather than fleeing forever. Under reduced motion the flee behaviour is skipped outright rather than merely sped up, so the button never moves at all; on touch, a tap does not generate the pointermove the flee logic listens for, so the button is reachable normally without ever needing to be caught. The CTA heading is split into per-character spans that melt on hover — each letter stretches to scaleY(1.9) and slides down with a staggered delay, muted the same way as every other transition-driven effect on the page. Nav links and the two controls beside them leap upward and rotate on hover. One control relocates the bar between the top strip and a fixed left column by moving a single --rail token; the other moves the hour between day and night on data-theme. Both persist to localStorage. The cursor itself is a crosshair everywhere except real interactive elements, which show a pointer on hover so the crosshair never hides what is clickable. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger on close.

**Common Mistake** *(upgraded field)*

> Breaking every rule on one element at once — wrong scale and wrong shadow and wrong context together. This page's own rule is exactly one broken rule per element; stacking several simultaneous "impossible" devices on one object reads as noise, not the isolated wrongness that makes surrealism unsettling.

**Production Caveat** *(upgraded field)*

> The fleeing Explore button is explicitly clamped to its own container and capped at three dodges before it settles catchable. Copying the "flees from cursor" idea without both limits is a functional trap — an unclamped or infinitely-fleeing button can become genuinely unusable, not just surreal.

**Accessibility Risk** *(upgraded field)*

> Already documented directly on the page as a real, named cost rather than a footnote: "a fleeing element is a real accessibility cost, not just a metaphor," which is why it's clamped, capped, and skipped outright — not merely sped up — under prefers-reduced-motion.

**When Not To Use** *(upgraded field)*

> Any interface where the primary action must always be reliably reachable — checkout, critical alerts, accessibility settings. A button that evades the cursor, however briefly or well-guarded, is fundamentally in tension with a "click this now" guarantee.

**Replication Rules**

> Render everything plausibly — believable light, real cast shadows, ordinary typefaces — and put the strangeness in the relationships, not the rendering. Break exactly one rule per element: wrong scale, wrong shadow direction, wrong context, wrong obedience — never all four at once. Give shadows contradictory directions across sibling elements so the viewer cannot locate a light source. Float every plane: long soft offset shadows and small rotations, so nothing sits on the page. Make at least one interaction disobey the user — an element that flees, watches, or melts — because surrealism is about the loss of control, not decoration. A fleeing element is a real accessibility cost, not just a metaphor: clamp it to its container, cap the number of dodges before it settles catchable, and skip the flee outright (not just faster) under reduced motion — otherwise "loss of control" becomes a literal barrier rather than a feeling.

**Colour tokens actually used in this page's CSS.**

19 distinct hex values; 17 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#1c2733` `#f6f2ea` `#ffffff` `#10162a` `#111111` `#1c2540` `#232838` `#2e3a58` `#3a2f22` `#4f7ea3` `#5a6b7d` `#7ba0bd` `#9fb0c2` `#a04f2c` `#a8c4d8` `#cfe0ec` `#e5b5a0` `#e8d9c3` `#eceff4`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-sky-top` | `#cfe0ec` |
| `--th-sky` | `#a8c4d8` |
| `--th-sky-deep` | `#7ba0bd` |
| `--th-sand` | `#e8d9c3` |
| `--th-panel` | `#f6f2ea` |
| `--th-ink` | `#1c2733` |
| `--th-shadow` | `#5a6b7d` |
| `--th-sky-top` | `#2e3a58` |
| `--th-sky` | `#1c2540` |
| `--th-sky-deep` | `#10162a` |
| `--th-sand` | `#3a2f22` |
| `--th-panel` | `#232838` |
| `--th-ink` | `#eceff4` |
| `--th-shadow` | `#9fb0c2` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Arial`, `Brush Script MT`, `Consolas`, `Cormorant Garamond`, `Dancing Script`, `Georgia`, `Helvetica Neue`, `Inter`, `Menlo`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `cursive`, `monospace`, `sans-serif`, `serif`, `ui-monospace`

Explicit `font-weight` values: `300`, `400`, `500`, `700`

`@font-face` declarations (12) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Cormorant Garamond` | 300 | normal | swap | `../assets/fonts/cormorant-garamond/cormorant-garamond-300.woff2` |
| `Cormorant Garamond` | 300 | normal | swap | `../assets/fonts/cormorant-garamond/cormorant-garamond-300-ext.woff2` |
| `Cormorant Garamond` | 300 | italic | swap | `../assets/fonts/cormorant-garamond/cormorant-garamond-300-italic.woff2` |
| `Cormorant Garamond` | 300 | italic | swap | `../assets/fonts/cormorant-garamond/cormorant-garamond-300-italic-ext.woff2` |
| `Cormorant Garamond` | 500 | normal | swap | `../assets/fonts/cormorant-garamond/cormorant-garamond-300.woff2` |
| `Cormorant Garamond` | 500 | normal | swap | `../assets/fonts/cormorant-garamond/cormorant-garamond-300-ext.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Inter` | 400 | normal | swap | `../assets/fonts/inter/inter-400.woff2` |
| `Inter` | 400 | normal | swap | `../assets/fonts/inter/inter-400-ext.woff2` |
| `Inter` | 500 | normal | swap | `../assets/fonts/inter/inter-400.woff2` |
| `Inter` | 500 | normal | swap | `../assets/fonts/inter/inter-400-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **2**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 10 |
| `@keyframes` blocks | 3 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 2 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/surrealism/SKILL.md` | exists | yes |
| Example website | `../examples/surrealism/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 30 probed pairs pass, in both themes. Worst pair on the page: 
`nav link` (light) at 4.91:1 against a 4.5:1 requirement.

---

### Neo-Brutalism

`styles/neo-brutalism.html` — 38,050 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Neo-Brutalism

**Era / Origin**

> Circa 2020 onward — Gumroad's redesign, Figma community kits and Tailwind-era product marketing, borrowing brutalism's rawness as a decorative language rather than an ideology.

**Color Palette**

> #fdf6e3 — warm off-white page ground #101010 — every outline, every shadow, all text #ffd93d — primary yellow block (nav, CTA, card one) #ff6b6b — coral secondary block and primary button #7bf1a8 — mint tertiary block #ffffff — neutral block for text-heavy surfaces

**Typography**

> Space Grotesk alone (fallback: system UI sans) at exactly two weights — 700 for every heading, button, badge and nav item, 500 for body. One family is the point: the outlines carry the personality, so the type stays consistent. Headings run clamp(36px, 5.6vw, 62px) for the hero and a flat 30px on cards, all at −0.035em with 1.0–1.02 leading; body sits at 15.5–17px; labels are 12px uppercase at 0.1em.

**Layout Logic**

> A 1080px centred wrapper on an explicit grid: the hero is a 1.55fr / 1fr split, the cards a strict repeat(3, 1fr), and every gap in the page is the same 26px. Everything is axis-aligned at 0deg and flush to its cell — the style's energy comes from weight and colour, never from tilt or overlap.

**Signature Techniques**

> A single reusable .block primitive: flat fill, 4px solid black border, zero radius, and a 6px hard-offset black shadow with no blur. Strictly flat colour — no gradient, no texture, no pattern anywhere on the page. Nested outlines: 3px-bordered badges and pills sitting inside 4px-bordered blocks, establishing hierarchy by border weight. A double-offset shadow on the dark CTA button (white layer then black layer) to keep it readable on a yellow block. Bar-stack graphics built from bordered <i> elements of decreasing width, using fill colour as data.

**Motion/Interaction**

> Physical and mechanical, all at 80ms linear — no easing curves. Hovering a card or button moves it −2px on both axes and grows the shadow to 9px; pressing it translates +6px into its own shadow, which collapses to 0 so the element appears to depress into the page. Every interactive element also carries a hard 3px offset focus ring in the same vocabulary — no blur, no radius. JS counts the hero badge number from 00 up on load using requestAnimationFrame, padded to two digits, reading its target from a data-target attribute; because that is a script-driven animation rather than CSS, it is guarded by a matchMedia check and the final figure is written immediately when prefers-reduced-motion is set. Two controls sit in the nav as the same block primitive at pill scale: one moves the nav between a top bar and a fixed left rail through a single --rail token, the other flips data-theme; pressed state is a flat fill swap, never a tint, and both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger.

**Common Mistake** *(upgraded field)*

> Adding a gradient or soft shadow "to make it pop." The rule is strictly flat colour — no gradient, texture or pattern anywhere; one gradient undoes the entire flat-colour-plus-hard-shadow logic that gives the style its graphic punch.

**Production Caveat** *(upgraded field)*

> The single reusable .block primitive (4px border, 6px hard shadow, 0 radius) needs every new component to be built as a variant of it. A one-off "this button doesn't need the full block treatment" breaks the visual system's consistency immediately.

**Accessibility Risk** *(upgraded field)*

> 3px and 4px border weight is doing double duty as both decoration and hierarchy signal — badges at 3px sit inside 4px blocks. A screen-magnifier user zoomed in tight may not perceive that weight difference as meaningfully distinct from ordinary zoom artefacts.

**When Not To Use** *(upgraded field)*

> Long-form content or data-heavy interfaces. Hard shadows and thick borders on every block get visually loud fast once there are more than a handful of blocks on screen at once.

**Replication Rules**

> Define one block primitive — flat fill, 4px black border, 0 radius, 6px hard black shadow — and build the entire page from it. Use one geometric sans at two weights only (500 / 700); never mix typefaces. Fill blocks with flat saturated colour from a fixed 3-colour set plus white; ban gradients, textures and patterns outright. Keep every element axis-aligned on a strict grid with one repeated gap value — no rotation, no overlap, no collage. Make interaction physical: hover lifts and grows the shadow, active translates into the shadow until it disappears, all at ~80ms linear.

**Colour tokens actually used in this page's CSS.**

10 distinct hex values; 2 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#101010` `#ffffff` `#f2ede0` `#fdf6e3` `#111111` `#161410` `#221f18` `#7bf1a8` `#ff6b6b` `#ffd93d`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-bg` | `#fdf6e3` |
| `--th-card` | `#ffffff` |
| `--th-edge` | `#101010` |
| `--th-on-card` | `#101010` |
| `--th-bg` | `#161410` |
| `--th-card` | `#221f18` |
| `--th-edge` | `#f2ede0` |
| `--th-on-card` | `#f2ede0` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Brush Script MT`, `Consolas`, `Dancing Script`, `Menlo`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `Space Grotesk`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `500`, `700`

`@font-face` declarations (6) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Space Grotesk` | 500 | normal | swap | `../assets/fonts/space-grotesk/space-grotesk-500.woff2` |
| `Space Grotesk` | 500 | normal | swap | `../assets/fonts/space-grotesk/space-grotesk-500-ext.woff2` |
| `Space Grotesk` | 700 | normal | swap | `../assets/fonts/space-grotesk/space-grotesk-500.woff2` |
| `Space Grotesk` | 700 | normal | swap | `../assets/fonts/space-grotesk/space-grotesk-500-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background-image` / gradient declarations: **zero**.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 10 |
| `@keyframes` blocks | 0 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 2 |
| `prefers-reduced-motion` guards | 4 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/neo-brutalism/SKILL.md` | exists | yes |
| Example website | `../examples/neo-brutalism/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 24 probed pairs pass, in both themes. Worst pair on the page: 
`hero Explore btn` (light) at 6.86:1 against a 3.0:1 requirement.

---

### Neo-classical

`styles/neo-classical.html` — 35,106 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Neo-classical

**Era / Origin**

> Late 18th to early 19th century — the revival of Greek and Roman order following the excavations at Pompeii and Herculaneum, in architecture, typography (Bodoni, Didot) and civic design.

**Color Palette**

> #f4f1ea — aged plaster page ground #e6e1d6 — deeper stone for the plinth gradient #1f1c17 — carved lettering, near-black warm brown #6b6250 — sepia secondary text #81693b — restrained gilt, used only for small ornament #c9c0ac — hairline rules and column divisions

**Typography**

> Cinzel (a Roman inscriptional capital) for the logo, nav, card titles and CTA, paired with Cormorant Garamond for all running text. Every Cinzel setting is uppercase with wide 0.12–0.34em letter-spacing plus a matching text-indent so the optical centring stays true. Cormorant runs light — 300 for the hero at clamp(38px, 6vw, 74px), 400 italic for the subheading at 19px, 400 for body at 17px. Weight never exceeds 600, and italic carries emphasis instead of bold.

**Layout Logic**

> Everything is centred on a single vertical axis; there is no flush-left content anywhere on the page. A 1000px wrapper divides into three equal bays — a literal colonnade — separated by 1px vertical rules, with the nav acting as entablature and a full-bleed gradient CTA as plinth. Vertical spacing follows large symmetrical intervals (56px, 88px, 96px) so the composition reads as an elevation drawing.

**Signature Techniques**

> A doubled hairline beneath the nav — one border plus an offset ::after — imitating a cornice moulding. A rotated square rosette with a nested inner square as the pediment ornament, in gilt at 1px. A 120px centred rule terminated by small gilt lozenges at each end, used as a section caesura. Enlarged gilt ::first-letter on each card title, echoing an illuminated capital without leaving the classical register. A faint 102° plaster grain drawn with a repeating gradient, plus a light-from-above radial wash on the ground.

**Motion/Interaction**

> Two inscribed controls sit in the nav, styled with the page's own hover-underline motif — a gilt rule growing outward from centre, the same one nav links already use — so nothing new was invented for them. One relocates the same bar between an entablature strip and a fixed left pier by moving a single --rail token, which shifts the whole page's own padding so nothing sits beneath it; the other moves the hour between day and dusk across data-theme, deepening the ground and brightening the gilt so it still reads against a night marble rather than simply inverting. Both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger on close. This is now the only JavaScript on the page — three state toggles, nothing animated by script — every transition remains the original slow, symmetrical 450ms CSS the style was built on.

**Common Mistake** *(upgraded field)*

> Using bold weight for emphasis. This page's rule is that italic carries emphasis and weight never exceeds 600; reaching for bold on a headline breaks the restrained, carved-inscription register the style depends on.

**Production Caveat** *(upgraded field)*

> This page carries less JavaScript than any other style here — three state toggles, nothing animated by script. Extending it with a typical animated micro-interaction library fights the style's central premise (an elevation drawing, not a live interface) rather than working with it.

**Accessibility Risk** *(upgraded field)*

> Everything is centred on a single vertical axis with no flush-left content anywhere. For screen-magnifier users panning a zoomed viewport, centred-only layouts lose the predictable "content starts at the left edge" scan pattern that flush-left layouts give for free.

**When Not To Use** *(upgraded field)*

> Dense, task-oriented interfaces — dashboards, admin tools, checkout flows. The symmetrical, bay-divided composition and generous 56–96px vertical intervals are built for a handful of stately blocks, not a screen with a dozen controls to place efficiently.

**Replication Rules**

> Centre everything on one vertical axis and keep the composition bilaterally symmetrical — no asymmetric or flush-left blocks. Pair an inscriptional Roman capital (Cinzel, Trajan) for titles with an old-style serif (Cormorant, Garamond) for text, and set all capitals at 0.12–0.34em tracking with a matching text-indent. Keep the palette to warm stone neutrals plus one restrained gilt, and spend the gilt only on ornament smaller than 46px. Divide content into equal bays separated by 1px vertical rules, and frame the page with an entablature above and a plinth below. Use italic rather than bold for emphasis, keep weights at or below 600, and let motion be slow, centred, and symmetrical.

**Colour tokens actually used in this page's CSS.**

15 distinct hex values; 2 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#111111` `#17140f` `#1f1c17` `#221e17` `#3a3327` `#6b6250` `#81693b` `#a8894f` `#a89a84` `#bb9658` `#c9c0ac` `#e6e1d6` `#ece4d3` `#f4f1ea`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-marble` | `#f4f1ea` |
| `--th-stone` | `#e6e1d6` |
| `--th-ink` | `#1f1c17` |
| `--th-sepia` | `#6b6250` |
| `--th-gilt` | `#81693b` |
| `--th-line` | `#c9c0ac` |
| `--th-marble` | `#17140f` |
| `--th-stone` | `#221e17` |
| `--th-ink` | `#ece4d3` |
| `--th-sepia` | `#a89a84` |
| `--th-gilt` | `#bb9658` |
| `--th-line` | `#3a3327` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Brush Script MT`, `Cinzel`, `Consolas`, `Cormorant Garamond`, `Dancing Script`, `Georgia`, `Menlo`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `Times New Roman`, `cursive`, `monospace`, `sans-serif`, `serif`, `ui-monospace`

Explicit `font-weight` values: `300`, `400`, `500`, `600`, `700`

`@font-face` declarations (14) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Cinzel` | 400 | normal | swap | `../assets/fonts/cinzel/cinzel-400.woff2` |
| `Cinzel` | 400 | normal | swap | `../assets/fonts/cinzel/cinzel-400-ext.woff2` |
| `Cinzel` | 600 | normal | swap | `../assets/fonts/cinzel/cinzel-400.woff2` |
| `Cinzel` | 600 | normal | swap | `../assets/fonts/cinzel/cinzel-400-ext.woff2` |
| `Cormorant Garamond` | 300 | normal | swap | `../assets/fonts/cormorant-garamond/cormorant-garamond-300.woff2` |
| `Cormorant Garamond` | 300 | normal | swap | `../assets/fonts/cormorant-garamond/cormorant-garamond-300-ext.woff2` |
| `Cormorant Garamond` | 400 | normal | swap | `../assets/fonts/cormorant-garamond/cormorant-garamond-300.woff2` |
| `Cormorant Garamond` | 400 | normal | swap | `../assets/fonts/cormorant-garamond/cormorant-garamond-300-ext.woff2` |
| `Cormorant Garamond` | 500 | normal | swap | `../assets/fonts/cormorant-garamond/cormorant-garamond-300.woff2` |
| `Cormorant Garamond` | 500 | normal | swap | `../assets/fonts/cormorant-garamond/cormorant-garamond-300-ext.woff2` |
| `Cormorant Garamond` | 600 | normal | swap | `../assets/fonts/cormorant-garamond/cormorant-garamond-300.woff2` |
| `Cormorant Garamond` | 600 | normal | swap | `../assets/fonts/cormorant-garamond/cormorant-garamond-300-ext.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **2**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 10 |
| `@keyframes` blocks | 1 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 0 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/neo-classical/SKILL.md` | exists | yes |
| Example website | `../examples/neo-classical/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

1 of 24 probed pairs fail; 0 could not be resolved automatically.

| Mode | Element | min | median | Needs | Verdict |
|---|---|---|---|---|---|
| light | card label/icon | 3.97 | 4.63 | 4.5 | FAIL |

- **light / card label/icon** — rgb(129,105,59) on rgb(227,224,217), 3.97:1 worst pixel (median 4.63:1) against 4.5:1 required. Text is 10px at weight 400.

---

### Neumorphism

`styles/neumorphism.html` — 35,022 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Neumorphism

**Era / Origin**

> 2019–2020, coined from "new skeuomorphism" after a widely shared Dribbble concept by Alexander Plyuto; a short-lived reaction to flat design's total lack of affordance.

**Color Palette**

> #e0e5ec — the single surface colour: page, cards, buttons, nav, all identical #ffffff — top-left highlight shadow #a3b1c6 — bottom-right cast shadow #4a5568 — primary text, soft slate rather than black #576272 — secondary text and inactive labels #5b4ed6 — the only hue on the page, on button labels only

**Typography**

> Poppins throughout (fallback: system UI sans) — a geometric face whose round bowls match the soft extrusions. Weights stop at 600; true bold would break the low-contrast illusion. Hero at clamp(30px, 4.6vw, 52px)/600, card titles 19px/600, body 14.5–16px/400 in the muted slate, labels 10px uppercase at 0.1em. Headings carry a two-part text-shadow (1px white, −1px grey) so even the type looks embossed into the surface.

**Layout Logic**

> A 1020px centred column with everything centre-aligned — symmetry keeps the light source consistent, and off-centre content would betray the fixed top-left illumination. Blocks are stacked with a uniform 30–38px rhythm and a 32px card gap; padding is generous (34–64px) because shadows need clear space to read as depth.

**Signature Techniques**

> Paired shadows on every element — -7px -7px 16px #ffffff plus 8px 8px 18px #a3b1c6 — implying one fixed light source at the top left. The same shadow pair rewritten with inset to produce the pressed, concave state; there is no third state. Zero borders and zero fills: element and background are literally the same colour, so only shadow defines edges. Large soft radii (14–34px) scaled to element size, with circular inset wells for icons. Embossed type via a two-direction text-shadow that mirrors the surface lighting.

**Motion/Interaction**

> Two controls sit in the nav: one relocates the same bar between a top strip and a fixed left rail by moving a single --rail token, which also shifts the page's own padding so nothing sits underneath it; the other flips data-theme across the whole page. Both persist to localStorage. Clicking Explore toggles a pressed class on <body>, which flips the hero and all three cards from convex to concave over 400ms — the clearest demonstration of the style's single idea — and the control now carries role="button" and a live aria-pressed so the state is announced, not just shown. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger on close. Dark mode does not just recolour the shadow pair: the cast side of every pair, invisible once a dark shadow lands on an already-dark surface, becomes a soft violet glow drawn from the page's one accent hue instead, so elements still read as raised or pressed rather than flattening into the surface.

**Common Mistake** *(upgraded field)*

> Adding a border or a third shadow state "to make buttons clearer." The technique is exactly two shadow recipes — light top-left/dark bottom-right, and the same values inset — with zero borders and zero fills; extra shadows or a border reintroduce the depth cues the style deliberately withholds.

**Production Caveat** *(upgraded field)*

> Element and background being literally the same colour means every new component needs the paired-shadow treatment from day one. An unstyled native element (a <select>, a third-party embed) looks broken rather than neutral, since there's no fallback "flat" state in this system.

**Accessibility Risk** *(upgraded field)*

> Already flagged directly in this page's own Replication Rules: at capped weights (≤600), 14px body text never reaches WCAG's large-text exemption, so every text token has to independently clear 4.5:1 against the single surface colour — low native contrast is structural to the style, not an edge case.

**When Not To Use** *(upgraded field)*

> Interfaces where users need to identify what's clickable at a glance — forms, dense toolbars. The core idea (element and background as one colour) is directly opposed to strong affordance, which costs real usability past a small number of controls.

**Replication Rules**

> Pick one mid-light desaturated surface colour (around #e0e5ec) and give it to the page background and every element without exception. Define exactly two shadow recipes — outer (light top-left, dark bottom-right) and the same values with inset — and use only those for depth. Never use borders, fills, or dark text; keep text a soft slate and reserve any hue for a single accent on labels. Keep the light source constant at the top left, which means centre-aligned symmetrical layouts and generous padding around every element. Animate only box-shadow — convex to concave on press — and treat the low native contrast as a hard constraint, not a trade-off to shrug off: at these capped weights (≤600), 14px never reaches WCAG's large-text exemption, so every text token still has to clear the full 4.5:1 against the one surface colour on its own.

**Colour tokens actually used in this page's CSS.**

13 distinct hex values; 7 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#6d5dfc` `#111111` `#2a2e38` `#4a5568` `#576272` `#5b4ed6` `#8494ab` `#9aa3b4` `#a3b1c6` `#a996ff` `#d6dbe3` `#e0e5ec`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-surface` | `#e0e5ec` |
| `--th-light` | `#ffffff` |
| `--th-dark` | `#a3b1c6` |
| `--th-text` | `#4a5568` |
| `--th-muted` | `#576272` |
| `--th-accent` | `#5b4ed6` |
| `--th-emboss` | `rgba(163,177,198,.55)` |
| `--th-surface` | `#2a2e38` |
| `--th-light` | `rgba(255,255,255,.82)` |
| `--th-dark` | `rgba(169,150,255,.68)` |
| `--th-text` | `#d6dbe3` |
| `--th-muted` | `#9aa3b4` |
| `--th-accent` | `#a996ff` |
| `--th-emboss` | `rgba(0,0,0,.6)` |

**Typography.**

Families referenced: `-apple-system`, `12px/1 "Poppins`, `12px/1.5 "Poppins`, `14px/1.2 system-ui`, `Brush Script MT`, `Consolas`, `Dancing Script`, `Menlo`, `Poppins`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `400`, `500`, `600`, `700`

`@font-face` declarations (8) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Poppins` | 400 | normal | swap | `../assets/fonts/poppins/poppins-400.woff2` |
| `Poppins` | 400 | normal | swap | `../assets/fonts/poppins/poppins-400-ext.woff2` |
| `Poppins` | 500 | normal | swap | `../assets/fonts/poppins/poppins-500.woff2` |
| `Poppins` | 500 | normal | swap | `../assets/fonts/poppins/poppins-500-ext.woff2` |
| `Poppins` | 600 | normal | swap | `../assets/fonts/poppins/poppins-600.woff2` |
| `Poppins` | 600 | normal | swap | `../assets/fonts/poppins/poppins-600-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background-image` / gradient declarations: **zero**.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 10 |
| `@keyframes` blocks | 1 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 0 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/neumorphism/SKILL.md` | exists | yes |
| Example website | `../examples/neumorphism/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 24 probed pairs pass, in both themes. Worst pair on the page: 
`hero Explore btn` (light) at 4.73:1 against a 4.5:1 requirement.

---

### Scrapbook

`styles/scrapbook.html` — 50,538 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Scrapbook

**Era / Origin**

> Victorian commonplace books and 1990s craft-store scrapbooking, revived digitally through zine culture and Pinterest-era collage layouts.

**Color Palette**

> #d8c3a5 — kraft board, the surface everything is glued to #fdf6e8 — cut paper and index cards #2f3a4a — biro navy for handwriting and body text #c1483b — faded red for margin rules, stamps, and doodles #8a9a7b — muted craft sage for the cut-out button #eed68c — washi tape at 72% opacity

**Typography**

> Caveat (handwriting) paired with Special Elite (worn typewriter) — no neutral sans anywhere. Caveat 700 takes every heading at large sizes: clamp(40px, 7.6vw, 84px) for the hero, 38px for card titles. Special Elite handles all body copy and labels at 13–14px with 1.9–2 line-height so text sits on the ruled lines, and 11px at 0.22em tracking for the stamped labels. Handwriting is always bigger than the typing — the annotation outranks the document.

**Layout Logic**

> A 1060px board holds loosely stacked paper objects with 40–78px of kraft showing between them, and cards on an auto-fit minmax(240px) grid. Alignment is intentionally imperfect: every object carries its own rotation between −2.4deg and +1.6deg, and tape, clips, and stamps hang outside their parent's bounds using negative offsets.

**Signature Techniques**

> Torn-edge cut-outs built with a many-point clip-path: polygon() along the top and bottom of the nav strip. Washi tape as absolutely positioned translucent rectangles rotated −28deg to +23deg, with dashed side edges. Ruled and margined paper drawn purely with repeating-linear-gradient — 31px blue rules plus a single red vertical margin at 44px. Two-part paper shadow: a hard 2px offset for thickness plus a soft blurred one for lift off the board. Analogue props as pure CSS — a paperclip from a border-radius'd bordered box, a rotated double-ruled rubber stamp, a marker highlight made from a skewed translucent bar.

**Motion/Interaction**

> The three cards are physically draggable: pointer events set position offsets so a card can be pulled anywhere on the board, gaining a lifted shadow and a raised z-index while held, with the cursor switching from grab to grabbing. On release each card keeps a small random re-rotation so it never lands perfectly straight, and a gesture that is taken away mid-drag — an OS swipe, a system dialog — ends through the same path rather than leaving a card stranded at its held size. Hovers add lift only — paper does not glow, slide, or fade. Everything that is not a drag now answers a press the way paper does: the soft blur goes, the hard paper edge tightens, and the object drops a pixel onto the board, held a minimum 170ms so a brief tap still registers. That press is scoped to controls alone — the drag keeps sole ownership of pointerdown on a card — and every duration on the page is a CSS transition, so the sitewide reduced-motion rule mutes all of it without the page testing for it. Two filing tabs are stuck to the strip: one stands that strip in the gutter down the binding edge, moving the whole board by a single --gutter token and turning its torn edge through ninety degrees with it; the other takes the lamp off. A tab that is set is not tinted but stamped, taking the same ink block the card labels use. Lamp off is the same desk late rather than a different palette: the kraft goes to shadow and every prop dims with it, except that you cannot write on a dark page with a biro, so the hand switches to a white gel pen — and the washi tape is the one thing that does not change, because it is the same roll. Both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger.

**Common Mistake** *(upgraded field)*

> Rotating every paper object by the same angle. The rule is distinct values every time, never repeating the same angle twice in a row; uniform rotation reads as a "tilted template" effect rather than genuinely scattered, individually-placed pieces.

**Production Caveat** *(upgraded field)*

> Cards are genuinely pointer-draggable, with explicit handling for an interrupted drag — an OS swipe or system dialog mid-gesture — so a card can't get stranded at its held size. A simplified port that drops that interruption handling can leave draggable elements visibly broken after any OS-level interrupt.

**Accessibility Risk** *(upgraded field)*

> Free-form pointer dragging is the primary interaction with no stated keyboard equivalent in this page's own Motion/Interaction field. A keyboard-only user can still reach all content and the standard controls, but can't reproduce the drag itself — worth flagging explicitly if this pattern is ever used for something that isn't purely decorative.

**When Not To Use** *(upgraded field)*

> Data-driven or frequently-updated content sets. Hand-placed rotation, tape and paperclip positioning are authored per object; content that changes often or is user-generated can't be art-directed at that level and needs a randomised-but-bounded approach instead.

**Replication Rules**

> Start from a textured warm ground (kraft, linen, cork) and place every content block as a lighter paper rectangle on top of it — never let content touch the ground directly. Rotate every object by ±0.5–3deg using distinct values, and never repeat the same angle twice in a row. Pair one handwriting face with one typewriter face and set the handwriting larger than the body text. Fasten each paper element with a visible physical device — tape, a paperclip, a staple, a pin — positioned with negative offsets so it overhangs the edge. Give paper two shadows (a hard offset for thickness, a soft blur for lift) and draw rules, margins, and grain with repeating gradients rather than images.

**Colour tokens actually used in this page's CSS.**

16 distinct hex values; 42 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#1e1a15` `#fdf6e8` `#ffffff` `#111111` `#2f3a4a` `#39322a` `#413930` `#4d5e44` `#7d858d` `#8a9a7b` `#9aa3ab` `#c1483b` `#d8c3a5` `#f08d7e` `#f0e9dc` `#f6efdd`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-board` | `#d8c3a5` |
| `--th-card` | `#fdf6e8` |
| `--th-card-2` | `#f6efdd` |
| `--th-ink` | `#2f3a4a` |
| `--th-on-stamp` | `#fdf6e8` |
| `--th-red` | `#c1483b` |
| `--th-sage` | `#8a9a7b` |
| `--th-lamp` | `rgba(255,255,255,.30)` |
| `--th-shade` | `rgba(120,90,50,.16)` |
| `--th-grain` | `rgba(140,110,70,.05)` |
| `--th-edge` | `rgba(90,66,40,.22)` |
| `--th-lift` | `rgba(60,42,22,.6)` |
| `--th-lift-hi` | `rgba(60,42,22,.75)` |
| `--th-cut` | `rgba(60,45,25,.45)` |
| `--th-cut-edge` | `transparent` |
| `--th-tape-shadow` | `rgba(80,60,30,.28)` |
| `--th-tape-edge` | `rgba(255,255,255,.55)` |
| `--th-emboss` | `rgba(255,255,255,.8)` |
| `--th-rule` | `rgba(47,58,74,.16)` |
| `--th-rule-2` | `rgba(47,58,74,.13)` |
| `--th-margin` | `rgba(193,72,59,.4)` |
| `--th-marker` | `rgba(193,72,59,.32)` |
| `--th-dash` | `rgba(47,58,74,.4)` |
| `--th-metal` | `#9aa3ab` |
| `--th-metal-shadow` | `rgba(0,0,0,.25)` |
| `--th-stamp-frame` | `rgba(193,72,59,.78)` |
| `--th-swatch-edge` | `rgba(47,58,74,.62)` |
| `--th-cut-line` | `rgba(47,58,74,.62)` |
| `--th-board` | `#1e1a15` |
| `--th-card` | `#39322a` |
| `--th-card-2` | `#413930` |
| `--th-ink` | `#f0e9dc` |
| `--th-on-stamp` | `#1e1a15` |
| `--th-red` | `#f08d7e` |
| `--th-sage` | `#4d5e44` |
| `--th-lamp` | `rgba(255,236,200,.06)` |
| `--th-shade` | `rgba(0,0,0,.34)` |
| `--th-grain` | `rgba(230,210,175,.035)` |
| `--th-edge` | `rgba(0,0,0,.5)` |
| `--th-lift` | `rgba(0,0,0,.72)` |
| `--th-lift-hi` | `rgba(0,0,0,.85)` |
| `--th-cut` | `rgba(0,0,0,.6)` |
| `--th-cut-edge` | `rgba(240,233,220,.17)` |
| `--th-tape-shadow` | `rgba(0,0,0,.45)` |
| `--th-tape-edge` | `rgba(255,255,255,.4)` |
| `--th-emboss` | `rgba(0,0,0,.6)` |
| `--th-rule` | `rgba(240,233,220,.15)` |
| `--th-rule-2` | `rgba(240,233,220,.12)` |
| `--th-margin` | `rgba(240,141,126,.45)` |
| `--th-marker` | `rgba(240,141,126,.3)` |
| `--th-dash` | `rgba(240,233,220,.34)` |
| `--th-metal` | `#7d858d` |
| `--th-metal-shadow` | `rgba(0,0,0,.6)` |
| `--th-stamp-frame` | `rgba(240,141,126,.75)` |
| `--th-swatch-edge` | `rgba(240,233,220,.55)` |
| `--th-cut-line` | `rgba(240,233,220,.5)` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Brush Script MT`, `Caveat`, `Consolas`, `Courier`, `Dancing Script`, `Menlo`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `Special Elite`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `400`, `500`, `700`

`@font-face` declarations (8) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Caveat` | 500 | normal | swap | `../assets/fonts/caveat/caveat-500.woff2` |
| `Caveat` | 500 | normal | swap | `../assets/fonts/caveat/caveat-500-ext.woff2` |
| `Caveat` | 700 | normal | swap | `../assets/fonts/caveat/caveat-500.woff2` |
| `Caveat` | 700 | normal | swap | `../assets/fonts/caveat/caveat-500-ext.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Special Elite` | 400 | normal | swap | `../assets/fonts/special-elite/special-elite-400.woff2` |
| `Special Elite` | 400 | normal | swap | `../assets/fonts/special-elite/special-elite-400-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **6**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 10 |
| `@keyframes` blocks | 0 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 0 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/scrapbook/SKILL.md` | exists | yes |
| Example website | `../examples/scrapbook/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 24 probed pairs pass, in both themes. Worst pair on the page: 
`CTA button` (light) at 4.59:1 against a 4.5:1 requirement.

---

### Glassmorphism

`styles/glassmorphism.html` — 40,614 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Glassmorphism

**Era / Origin**

> 2020–2021, named by Michal Malewicz after Apple's macOS Big Sur and iOS control-centre materials, with roots in Windows Vista Aero (2007).

**Color Palette**

> #0d0b1f — deep ground behind the light sources #7b2ff7 — violet orb, top left #f107a3 — magenta orb, mid right #00d4ff — cyan orb, bottom centre #ffffff — all glass fills and borders, used only at 10–28% alpha

**Typography**

> Manrope alone (fallback: system UI sans) across a wide weight range — 300 for large display type, 400 for body, 500 for nav, 700 for buttons and card titles. The weight contrast inside a single headline (light with one word at 700) replaces colour contrast, which glass cannot provide. Hero at clamp(34px, 5.6vw, 64px) at −0.03em; body 14.5–17px in white at 72% alpha; labels 11px uppercase at 0.12em.

**Layout Logic**

> A 1060px centred column of stacked panes with a tight uniform 22px gap, so panes overlap the same orbs and read as parallel sheets at one depth. Content is flush left inside generous 32–78px padding; the fixed orb layer sits at z-index: 0, grain at 1, and all content at 2.

**Signature Techniques**

> backdrop-filter: blur(18px) saturate(160%) on a 10% white fill — the saturate boost is what stops glass looking grey. A 1px rgba(255,255,255,.68) border plus an inset 0 1px 0 white top highlight to catch the light on the pane's upper edge. A diagonal specular streak drawn in a ::before overlay, fading out by 42%. Three large blurred colour orbs (90px blur) as the only saturated content on the page. A 3px dot-grid grain layer over everything to keep the gradients from banding.

**Motion/Interaction**

> JS reads pointer position and translates each orb by its own data-depth factor (+26, −34, +18), so the field behind the glass parallaxes as the cursor moves and every pane's refraction shifts with it; movement is damped by lerping toward the target each frame in requestAnimationFrame. Because that loop is script-driven rather than CSS, it is guarded by a matchMedia check and the orbs are left at rest when prefers-reduced-motion is set. Panes lift −6px and raise their fill alpha on hover over 350ms; buttons brighten and lift 2px, and every control takes a pointer-driven pressed state held briefly so a touch tap registers. Two glass pill controls sit in the nav: one stands that same nav pane on end as a fixed rail through a single --rail token, the other flips data-theme, which deepens the void and raises the glass alpha together so the panes keep reading as sheets rather than flattening into dark cards. Both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger.

**Common Mistake** *(upgraded field)*

> Applying blur and transparency over a flat or static background. Glass needs something saturated and moving behind it — the page's own replication rule says so directly; glass over nothing reads as flat grey, not glass.

**Production Caveat** *(upgraded field)*

> backdrop-filter is GPU-expensive, especially layered (blur plus saturate) across multiple stacked panes. A real product with many glass panels on one screen, not just three cards, can visibly tax a lower-end device's compositor.

**Accessibility Risk** *(upgraded field)*

> Body text sits at 72% white alpha over a blurred, moving background. Contrast is only guaranteed against the specific orb positions this page tests; a differently-coloured or user-inverted background could push some text below 4.5:1 without any code change flagging it.

**When Not To Use** *(upgraded field)*

> Data-dense enterprise software or anything read for long stretches. Semi-transparent text over moving colour is fatiguing well before the novelty wears off, and any forced-contrast accessibility override breaks the effect entirely.

**Replication Rules**

> Put something saturated and moving behind the glass first — blurred colour orbs on a dark ground — because glass with nothing behind it reads as flat grey. Build panes from rgba(255,255,255,.10) plus backdrop-filter: blur(18px) saturate(160%); always include the saturate component. Edge every pane with a 1px white border at ~28% alpha and an inset top highlight, then add a soft downward shadow for separation. Keep radii moderate (18–32px) and panes at one consistent depth — glass is about layers, not extrusion. Carry hierarchy with type weight and white alpha levels rather than colour, and never place body text below 14px on a blurred surface.

**Colour tokens actually used in this page's CSS.**

9 distinct hex values; 27 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#05040e` `#0d0b1f` `#00d4ff` `#0b0418` `#111111` `#1a0b2e` `#7b2ff7` `#f107a3`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-void` | `#0d0b1f` |
| `--th-glass` | `rgba(255,255,255,.10)` |
| `--th-glass-strong` | `rgba(255,255,255,.24)` |
| `--th-edge` | `rgba(255,255,255,.68)` |
| `--th-muted` | `rgba(255,255,255,.72)` |
| `--th-hi` | `rgba(255,255,255,.35)` |
| `--th-streak` | `rgba(255,255,255,.22)` |
| `--th-grain` | `rgba(255,255,255,.09)` |
| `--th-drop` | `rgba(0,0,0,.6)` |
| `--th-btn-hi` | `rgba(255,255,255,.4)` |
| `--th-btn-drop` | `rgba(0,0,0,.7)` |
| `--th-solid` | `rgba(255,255,255,.9)` |
| `--th-on-solid` | `#1a0b2e` |
| `--th-scrim` | `rgba(13,11,31,.68)` |
| `--th-void` | `#05040e` |
| `--th-glass` | `rgba(255,255,255,.14)` |
| `--th-glass-strong` | `rgba(255,255,255,.30)` |
| `--th-edge` | `rgba(255,255,255,.64)` |
| `--th-muted` | `rgba(255,255,255,.78)` |
| `--th-hi` | `rgba(255,255,255,.42)` |
| `--th-streak` | `rgba(255,255,255,.26)` |
| `--th-grain` | `rgba(255,255,255,.11)` |
| `--th-drop` | `rgba(0,0,0,.78)` |
| `--th-btn-hi` | `rgba(255,255,255,.48)` |
| `--th-btn-drop` | `rgba(0,0,0,.85)` |
| `--th-solid` | `rgba(255,255,255,.94)` |
| `--th-on-solid` | `#0b0418` |
| `--th-scrim` | `rgba(5,4,14,.72)` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Brush Script MT`, `Consolas`, `Dancing Script`, `Manrope`, `Menlo`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `300`, `400`, `500`, `700`

`@font-face` declarations (10) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Manrope` | 300 | normal | swap | `../assets/fonts/manrope/manrope-300.woff2` |
| `Manrope` | 300 | normal | swap | `../assets/fonts/manrope/manrope-300-ext.woff2` |
| `Manrope` | 400 | normal | swap | `../assets/fonts/manrope/manrope-300.woff2` |
| `Manrope` | 400 | normal | swap | `../assets/fonts/manrope/manrope-300-ext.woff2` |
| `Manrope` | 500 | normal | swap | `../assets/fonts/manrope/manrope-300.woff2` |
| `Manrope` | 500 | normal | swap | `../assets/fonts/manrope/manrope-300-ext.woff2` |
| `Manrope` | 700 | normal | swap | `../assets/fonts/manrope/manrope-300.woff2` |
| `Manrope` | 700 | normal | swap | `../assets/fonts/manrope/manrope-300-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **5**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 12 |
| `@keyframes` blocks | 0 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 2 |
| `prefers-reduced-motion` guards | 3 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/glassmorphism/SKILL.md` | exists | yes |
| Example website | `../examples/glassmorphism/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 24 probed pairs pass, in both themes. Worst pair on the page: 
`card label/icon` (dark) at 6.24:1 against a 4.5:1 requirement.

---

### Claymorphism

`styles/claymorphism.html` — 47,783 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Claymorphism

**Era / Origin**

> 2021–2022, emerging from 3D clay-render illustration trends (Blender, Spline) and named in a Michal Malewicz essay as the friendly successor to neumorphism.

**Color Palette**

> #dcd6ff — lavender base of the multi-stop ground #ffe3f1 — pink radial wash in the ground #6d55e0 — purple clay: primary button and CTA slab #ff8fab — pink clay card #ffd166 — yellow clay card and secondary button #7ee0c9 — mint clay card #3d3563 — deep violet-grey ink for all type on a pale clay body

**Typography**

> Baloo 2 for all display type (fallback: cursive/system) paired with Quicksand for body — both rounded-terminal faces chosen so the letterforms match the moulded shapes. Weights 700 for headings and buttons, 500–600 for body and nav. Hero at clamp(34px, 5.4vw, 62px)/1.08, card titles 26px, body 15–17px, icon labels 11px uppercase. Type is centred and never tracked tightly — clay type stays open and friendly.

**Layout Logic**

> A 1040px centred column of symmetrical, centre-aligned blocks with a 26–44px vertical rhythm and a 30px card gap. Padding is deliberately oversized (38–66px) so each shape reads as inflated rather than filled, and the fixed-attachment gradient ground plus three drifting blobs sit behind everything at z-index: 0.

**Signature Techniques**

> The three-part clay shadow on every object: inset 0 10px 16px white highlight, inset 0 -12px 18px darker tint, and a wide 0 26px 40px -16px drop shadow tinted with the object's own hue. Very large radii — 30px on the nav, 38–40px on cards, 48px on hero and CTA — scaled up with element size so nothing reads as a rectangle. Coloured shadows rather than grey ones, so each object appears to glow onto the ground. Blurred pastel blobs (46px blur) drifting on a fixed-attachment multi-radial gradient background. Circular inset wells for icons, using the same recipe at reduced scale.

**Motion/Interaction**

> Bouncy, with overshoot: every hover uses cubic-bezier(.34, 1.56, .64, 1) over ~320ms, lifting cards −10px with a −1deg tilt and buttons −6px at 1.05 scale. Pressing any control applies a JS squish class that scales it to 1.06 × 0.9 so the clay visibly deforms and springs back — driven from pointerdown and held a minimum 170ms, because a touchscreen resolves a click only after the finger has gone, and the deformation has to happen while it is still there. Three background blobs drift and scale on 13–21s loops. Every one of those is a CSS transition or animation and a single class write per press, so the sitewide reduced-motion rule mutes all of it and no motion here needs to test for it. Two small lumps are set into the bar: one turns the bar on its side to stand in a shelf down the left margin, moving the whole page by a single --shelf token; the other takes the studio lights down. A control that is on is clay pressed into the bar rather than sitting on it — the same three-part recipe run backwards, highlight and shade swapped ends and the cast turned inward. Lights down keeps the four pigments exactly as they are, because loudly pastel is the point, and rebuilds the extrusion instead: a cast shadow is an absence of light and cannot carry depth on a dark ground, so it becomes a coloured glow, which is what the coloured shadow was already described as doing. Both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger.

**Common Mistake** *(upgraded field)*

> Applying neumorphism's monochrome logic to clay's inflated radii. The actual differentiator, per this page's own rules, is that clay objects use colours that differ from the ground — bright pastels on a soft gradient; one hue everywhere produces neumorphism with rounder corners, not clay.

**Production Caveat** *(upgraded field)*

> The squish-on-press interaction is a JS class held a minimum 170ms specifically to survive touch's "finger already gone" timing. Copying only the CSS cubic-bezier easing without that minimum-hold logic makes the press feedback disappear on real touch devices even though it works fine with a mouse.

**Accessibility Risk** *(upgraded field)*

> Shadows are tinted to each card's own hue, which adds a contrast surface to check per card colour. A card colour introduced later without re-checking its own tinted-shadow-adjacent text is exactly the kind of one-off value this project's per-page palette review exists to catch.

**When Not To Use** *(upgraded field)*

> Serious or professional B2B tooling. The bouncy overshoot easing and inflated, toy-like forms read as playful in a way that undercuts perceived trustworthiness for high-stakes tasks.

**Replication Rules**

> Build every object from one three-part shadow: an inset white highlight at the top, an inset darker tint at the bottom, and a large soft drop shadow tinted with the object's own colour. Use radii of 30–48px, scaling with the element, and oversize padding so shapes look inflated rather than filled. Give objects colours that differ from the ground — bright pastels on a soft gradient — which is what separates clay from neumorphism. Pick rounded-terminal typefaces (Baloo, Quicksand, Nunito) and centre the composition. Animate with spring easing and let elements deform on press — squash and stretch, never a linear fade.

**Colour tokens actually used in this page's CSS.**

22 distinct hex values; 50 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#1e1938` `#3d3563` `#efe9ff` `#111111` `#132a2c` `#241e42` `#2b1c33` `#322b57` `#3d3566` `#6248d6` `#635b85` `#6d55e0` `#7ee0c9` `#b0a8d8` `#bfb2ff` `#d9f5ee` `#dcd6ff` `#f3f0ff` `#ff8fab` `#ffd166` `#ffe3f1`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-ground1` | `#dcd6ff` |
| `--th-ground2` | `#ffe3f1` |
| `--th-ground3` | `#d9f5ee` |
| `--th-ground-mid` | `#efe9ff` |
| `--th-clay` | `#ffffff` |
| `--th-ink` | `#3d3563` |
| `--th-muted` | `#635b85` |
| `--th-accent-ink` | `#6248d6` |
| `--th-chip` | `#f3f0ff` |
| `--th-ground1` | `#1e1938` |
| `--th-ground2` | `#2b1c33` |
| `--th-ground3` | `#132a2c` |
| `--th-ground-mid` | `#241e42` |
| `--th-clay` | `#322b57` |
| `--th-ink` | `#efe9ff` |
| `--th-muted` | `#b0a8d8` |
| `--th-accent-ink` | `#bfb2ff` |
| `--th-chip` | `#3d3566` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Baloo 2`, `Brush Script MT`, `Consolas`, `Dancing Script`, `Menlo`, `Quicksand`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `500`, `600`, `700`

`@font-face` declarations (12) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Baloo 2` | 500 | normal | swap | `../assets/fonts/baloo-2/baloo-2-500.woff2` |
| `Baloo 2` | 500 | normal | swap | `../assets/fonts/baloo-2/baloo-2-500-ext.woff2` |
| `Baloo 2` | 600 | normal | swap | `../assets/fonts/baloo-2/baloo-2-500.woff2` |
| `Baloo 2` | 600 | normal | swap | `../assets/fonts/baloo-2/baloo-2-500-ext.woff2` |
| `Baloo 2` | 700 | normal | swap | `../assets/fonts/baloo-2/baloo-2-500.woff2` |
| `Baloo 2` | 700 | normal | swap | `../assets/fonts/baloo-2/baloo-2-500-ext.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Quicksand` | 500 | normal | swap | `../assets/fonts/quicksand/quicksand-500.woff2` |
| `Quicksand` | 500 | normal | swap | `../assets/fonts/quicksand/quicksand-500-ext.woff2` |
| `Quicksand` | 600 | normal | swap | `../assets/fonts/quicksand/quicksand-500.woff2` |
| `Quicksand` | 600 | normal | swap | `../assets/fonts/quicksand/quicksand-500-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **1**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 10 |
| `@keyframes` blocks | 1 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 0 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/claymorphism/SKILL.md` | exists | yes |
| Example website | `../examples/claymorphism/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 24 probed pairs pass, in both themes. Worst pair on the page: 
`card body copy` (light) at 5.17:1 against a 4.5:1 requirement.

---

### Bento Grid

`styles/bento-grid.html` — 40,902 bytes

**Content parity.**

Deviates from the shared baseline:

- hero button reads `Explore →` (baseline `Explore`)

**No `CONTENT-PARITY OVERRIDE` comment is present at the point of use.** 
`CONTRIBUTING.md` requires every deviation to be justified in one sentence, in a code 
comment on the deviating markup, naming the device and why the shared content could not 
carry it. This deviation is undocumented.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Bento Grid

**Era / Origin**

> Early 2020s product-marketing layout, named for the compartmented Japanese bento box and popularised by Apple keynote slides, Vercel, and Linear.

**Color Palette**

> #edeef2 — recessed page ground the tiles sit on #ffffff — default tile surface #101014 — heading text and the one dark tile #6e7079 — body copy inside tiles #4f46e5 — accent tile, primary button, icon chips #dfe3ff — accent tint for chips and chart bars

**Typography**

> Plus Jakarta Sans throughout (fallback: system UI stack) — a single geometric-humanist family, since the tiles already provide the variety. Weights: 700 for tile headings, 600 for buttons and chips, 500 for nav, 400 for body. Type is sized per tile, not per page: the hero tile takes clamp(30px, 3.9vw, 50px), card tiles 19px, body 14.5–16px, chips and captions 11–12px uppercase at 0.1em. Headings run −0.02 to −0.035em tracking with tight 1.04 leading.

**Layout Logic**

> One six-column CSS grid with grid-auto-rows: minmax(112px, auto) and a single uniform 14px gap; nothing on the page exists outside a tile, including the nav. Hierarchy comes from unequal spans — hero 4×2, dark mark 2×2, cards 2×1, CTA 4×1, stat 2×1 — so the lattice packs edge to edge with no section padding and no page-level whitespace beyond the gutter.

**Signature Techniques**

> A single generous radius token (22px) applied to every tile, with pill radii (99px) for buttons and 7–8px for elements nested inside tiles. Two-part soft shadow — a 1px contact shadow plus a wide negative-spread ambient shadow — that lifts on hover. Tiles carry meaning through surface, not border: white, dark, accent, and tint variants replace headings-as-dividers. Non-content filler tiles (a dot lattice, a bar chart, a big numeral) used to complete the packing and set rhythm. overflow: hidden on every tile so gradients and lattices bleed to the rounded edge.

**Motion/Interaction**

> JS tracks the pointer over each tile and writes --mx/--my custom properties, driving a 320px radial spotlight in the tile's ::after that fades in on hover. CSS adds a −4px lift with a deepened shadow over 250ms, the CTA arrow slides 3px, and on load the stat tile's bars grow from zero with a staggered 60ms delay — as a transform: scaleY() from a bottom origin rather than an animated height, since animating height would reflow the grid, which rule 5 below forbids. That intro is script-driven, so it is guarded by a matchMedia check and the bars are simply drawn at full height when prefers-reduced-motion is set. The nav is itself a tile spanning the full six columns (.t-nav{grid-column:span 6}), and two pill controls sit inside it: one re-places that same tile as a fixed standing rail by changing a single --rail token, the other flips data-theme so every surface re-resolves through the theme tokens; both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger. All easing is cubic-bezier(.2,.8,.3,1).

**Common Mistake** *(upgraded field)*

> Varying the gap value between tiles for "breathing room." The packing logic depends on one uniform gap and equal auto-rows; hierarchy comes from span alone, not from inconsistent spacing, or the lattice stops reading as one grid.

**Production Caveat** *(upgraded field)*

> Every future addition — nav and CTA included — has to be authored as a tile with an explicit column/row span. A component built outside that model (a modal, a toast) needs deliberate exception-handling, since the whole page assumes everything lives in the grid.

**Accessibility Risk** *(upgraded field)*

> Non-content filler tiles (the dot lattice, the bar chart) are decorative and marked aria-hidden. Any future filler tile added without that attribute puts a meaningless node in front of screen-reader users navigating tile by tile.

**When Not To Use** *(upgraded field)*

> Content sets with genuinely unpredictable item counts or lengths. The style depends on a curated, fixed set of spans (hero 4×2, cards 2×1, and so on) chosen for a known content set; user-generated or dynamically-lengthed content breaks the packing math fast.

**Replication Rules**

> Put every piece of content inside a tile — navigation and CTAs included — and let the grid gutter be the only whitespace on the page. Use one grid (4–6 columns), one gap value, and one auto-row height; vary only span to create hierarchy. Give every tile the same large radius and the same two-layer soft shadow, then differentiate tiles by surface colour: white, dark, accent, tint. Add one or two non-content tiles (chart, dot lattice, oversized numeral) so the lattice packs completely without stretched content. Keep motion to the tile itself — a small lift plus a pointer-tracked spotlight — and never animate type or reflow the grid.

**Colour tokens actually used in this page's CSS.**

13 distinct hex values; 19 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#0c0c10` `#101014` `#08080b` `#111111` `#1c1c24` `#4f46e5` `#6e7079` `#8b83ff` `#a2a4b0` `#dfe3ff` `#edeef2` `#f2f2f5`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-ground` | `#edeef2` |
| `--th-tile` | `#ffffff` |
| `--th-ink` | `#101014` |
| `--th-on-ink` | `#ffffff` |
| `--th-muted` | `#6e7079` |
| `--th-shadow` | `0 1px 2px rgba(16,16,20,.05), 0 10px 26px -16px rgba(16,16,20,.35)` |
| `--th-shadow-hi` | `0 2px 4px rgba(16,16,20,.06), 0 22px 44px -22px rgba(16,16,20,.5)` |
| `--th-rim` | `transparent` |
| `--th-spot` | `rgba(79,70,229,.10)` |
| `--th-spot-inv` | `rgba(255,255,255,.10)` |
| `--th-mark-1` | `rgba(255,255,255,.16)` |
| `--th-mark-2` | `rgba(255,255,255,.42)` |
| `--th-mark-3` | `#ffffff` |
| `--th-ctl-edge` | `transparent` |
| `--th-ground` | `#08080b` |
| `--th-tile` | `#1c1c24` |
| `--th-ink` | `#f2f2f5` |
| `--th-on-ink` | `#0c0c10` |
| `--th-muted` | `#a2a4b0` |
| `--th-shadow` | `0 1px 2px rgba(0,0,0,.55), 0 10px 26px -16px rgba(0,0,0,.9)` |
| `--th-shadow-hi` | `0 2px 4px rgba(0,0,0,.6), 0 22px 44px -22px rgba(0,0,0,1)` |
| `--th-rim` | `rgba(255,255,255,.07)` |
| `--th-spot` | `rgba(124,116,255,.16)` |
| `--th-spot-inv` | `rgba(12,12,16,.12)` |
| `--th-mark-1` | `rgba(12,12,16,.18)` |
| `--th-mark-2` | `rgba(12,12,16,.45)` |
| `--th-mark-3` | `#0c0c10` |
| `--th-ctl-edge` | `#8b83ff` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Brush Script MT`, `Consolas`, `Dancing Script`, `Menlo`, `Plus Jakarta Sans`, `Roboto`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `400`, `500`, `600`, `700`

`@font-face` declarations (10) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Plus Jakarta Sans` | 400 | normal | swap | `../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-400.woff2` |
| `Plus Jakarta Sans` | 400 | normal | swap | `../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-400-ext.woff2` |
| `Plus Jakarta Sans` | 500 | normal | swap | `../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-400.woff2` |
| `Plus Jakarta Sans` | 500 | normal | swap | `../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-400-ext.woff2` |
| `Plus Jakarta Sans` | 600 | normal | swap | `../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-400.woff2` |
| `Plus Jakarta Sans` | 600 | normal | swap | `../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-400-ext.woff2` |
| `Plus Jakarta Sans` | 700 | normal | swap | `../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-400.woff2` |
| `Plus Jakarta Sans` | 700 | normal | swap | `../assets/fonts/plus-jakarta-sans/plus-jakarta-sans-400-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **2**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 15 |
| `@keyframes` blocks | 0 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 1 |
| `prefers-reduced-motion` guards | 2 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/bento-grid/SKILL.md` | exists | yes |
| Example website | `../examples/bento-grid/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 12 probed pairs pass, in both themes. Worst pair on the page: 
`card label/icon` (light) at 4.96:1 against a 4.5:1 requirement.

---

### Pixel Art

`styles/pixel-art.html` — 35,730 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Pixel Art

**Era / Origin**

> 1977–1995 console and arcade hardware — Atari VCS through the SNES — where limited memory forced fixed palettes and tile grids; revived deliberately by indie games from the late 2000s.

**Color Palette**

> #1a1c2c — void, the darkest value and panel fill #29366f — deep blue for the sky and CTA field #ffcd75 — yellow: logo, highlights, CTA button #b13e53 — red used only as the 4px text drop-pixel #ef7d57 — orange for the second card's icon chip and dither #38b764 — green primary action #41a6f6 — cyan for body accents and dithering #566c86 — slate for the outer bevel ring and muted labels #f4f4f4 — white ink: default body text, headings and the inner bevel ring

**Typography**

> Press Start 2P for all display and UI, Silkscreen for body — two genuine bitmap faces, with -webkit-font-smoothing: none so the browser cannot anti-alias them. Sizes are restricted to multiples that land on whole pixels: 8, 9, 10, 12, 14 and 20px, with the hero at clamp(16px, 2.9vw, 30px). Line-height is unusually loose (1.6–1.75) because bitmap capitals have no descender room. Every heading carries a single 4px hard shadow — one pixel of offset, never a blur.

**Layout Logic**

> One custom property, --px: 4px, defines the pixel, and every dimension on the page is calc(var(--px) * n) — padding, gaps, margins, shadow offsets. Nothing uses an arbitrary value, so the whole layout snaps to a 4px lattice. Panels sit on a three-column grid with a 24px (6px) gutter, and the hero splits content against a sprite slot.

**Signature Techniques**

> Chamfered borders drawn as eight stacked box-shadow steps (white inner ring, slate outer ring) — no border, no border-radius anywhere. Dithering instead of gradients: a repeating-conic-gradient checker on an 8px tile, used for the sky and for card meters. Buttons lit as bevels — lighter pixel on the top and left, darker on the bottom and right, plus a 2-pixel cast shadow. A sprite generated in JS from an ASCII bitmap and rendered as a single element's box-shadow list. image-rendering: pixelated and disabled font smoothing so nothing on the page is ever interpolated.

**Motion/Interaction**

> Every animation uses steps() — there are no in-between frames on this hardware. JS parses a 12×12 character bitmap into 80 box-shadow offsets to draw the sprite, which bobs one pixel on a 1s steps(2) loop at a 7px sprite scale; both loops are muted by the sitewide reduced-motion rule with nothing extra to guard, since neither is driven by script. Hovering a nav item reveals a blinking ▶ menu cursor at steps(1), the press start line blinks on a 1.1s cycle, and buttons translate exactly one pixel down-right on :active. Two menu items now sit in the nav, reusing that same ▶ cursor language rather than inventing a second one: held lit rather than blinking when their alternate state is active. One relocates the bar between the top menu and a fixed side panel by moving a single --px-multiple --rail token; the other turns the brightness down across data-theme — the sixteen lit colours hold their exact values, only the void and the sky deepen further toward black, the same screen at lower brightness rather than a different cabinet. Both persist to localStorage. The component reference opens a native <dialog>, which supplies the focus trap, Escape and an inert background and returns focus to its trigger — deliberately without an open/close animation, since this page's own law is that hover states are instant and interpolation breaks the illusion.

**Common Mistake** *(upgraded field)*

> Using a gradient anywhere "for smoothness." The page replaces every gradient with a dithering pattern specifically because a smooth gradient contradicts the fixed 8/16-colour hardware constraint the whole style simulates.

**Production Caveat** *(upgraded field)*

> Every dimension on the page derives from one --px custom property via calc(), so the whole layout snaps to a 4px lattice. Introducing even one arbitrary, non-multiple value anywhere breaks the "everything is a multiple of one pixel" claim the page makes about itself.

**Accessibility Risk** *(upgraded field)*

> -webkit-font-smoothing: none and image-rendering: pixelated are load-bearing for the aesthetic, but they also opt the page out of the browser's own text-rendering optimisations — low-vision users relying on OS-level font smoothing get bitmap type that can't benefit from those system settings.

**When Not To Use** *(upgraded field)*

> Interfaces with real body-copy reading demands. Genuine bitmap faces at small fixed sizes with no anti-aliasing are legible in short UI bursts but fatiguing for sustained reading, which is why even this page keeps its own body copy modest with generous line-height to compensate.

**Replication Rules**

> Define one pixel unit as a custom property and express every dimension as a multiple of it — no arbitrary values anywhere. Ban border-radius, blur and anti-aliasing: draw borders and bevels with stacked hard box-shadow steps and disable font smoothing. Fix a small palette (8–16 colours) and replace every gradient with a dither pattern. Use genuine bitmap typefaces at whole-pixel sizes only, with single hard-offset text shadows. Make all motion steps() and all hover states instant — interpolation is the one thing that instantly breaks the illusion.

**Colour tokens actually used in this page's CSS.**

18 distinct hex values; 6 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#1f7a42` `#6ee49a` `#b8913f` `#ffe6b0` `#ffffff` `#0d0e17` `#111111` `#1a1c2c` `#1c2454` `#22253a` `#29366f` `#38b764` `#41a6f6` `#566c86` `#b13e53` `#ef7d57` `#f4f4f4` `#ffcd75`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-void` | `#1a1c2c` |
| `--th-deep` | `#29366f` |
| `--th-red` | `#b13e53` |
| `--th-orange` | `#ef7d57` |
| `--th-yellow` | `#ffcd75` |
| `--th-green` | `#38b764` |
| `--th-cyan` | `#41a6f6` |
| `--th-slate` | `#566c86` |
| `--th-white` | `#f4f4f4` |
| `--th-void` | `#0d0e17` |
| `--th-deep` | `#1c2454` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Brush Script MT`, `Consolas`, `Dancing Script`, `Menlo`, `Press Start 2P`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `Silkscreen`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `400`, `700`

`@font-face` declarations (8) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Press Start 2P` | 400 | normal | swap | `../assets/fonts/press-start-2p/press-start-2p-400.woff2` |
| `Press Start 2P` | 400 | normal | swap | `../assets/fonts/press-start-2p/press-start-2p-400-ext.woff2` |
| `Silkscreen` | 400 | normal | swap | `../assets/fonts/silkscreen/silkscreen-400.woff2` |
| `Silkscreen` | 400 | normal | swap | `../assets/fonts/silkscreen/silkscreen-400-ext.woff2` |
| `Silkscreen` | 700 | normal | swap | `../assets/fonts/silkscreen/silkscreen-700.woff2` |
| `Silkscreen` | 700 | normal | swap | `../assets/fonts/silkscreen/silkscreen-700-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **4**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 5 |
| `@keyframes` blocks | 2 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 0 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/pixel-art/SKILL.md` | exists | yes |
| Example website | `../examples/pixel-art/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

2 of 24 probed pairs fail; 0 could not be resolved automatically.

| Mode | Element | min | median | Needs | Verdict |
|---|---|---|---|---|---|
| light | card body copy | 3.12 | 3.12 | 4.5 | FAIL |
| dark | card body copy | 3.56 | 3.56 | 4.5 | FAIL |

- **light / card body copy** — rgb(86,108,134) on rgb(26,28,44), 3.12:1 worst pixel (median 3.12:1) against 4.5:1 required. Text is 14px at weight 400.
- **dark / card body copy** — rgb(86,108,134) on rgb(13,14,23), 3.56:1 worst pixel (median 3.56:1) against 4.5:1 required. Text is 14px at weight 400.

---

### Conceptual Sketch

`styles/conceptual-sketch.html` — 36,412 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Conceptual Sketch

**Era / Origin**

> Not a period style but a working one: architectural esquisse and industrial-design marker drawing, adopted by digital product teams as lo-fi wireframing (Balsamiq, 2008) and the sketch-note tradition.

**Color Palette**

> #fcfcfa — cartridge paper ground #e3e7ec — 22px minor graph rule #d2d8e0 — 110px major graph rule #2b2b2b — graphite for strokes and headings #3f6fd8 — blue annotation pencil for margin notes #e03b2f — redline for corrections and emphasis

**Typography**

> Architects Daughter for everything written by the designer's hand — headings, buttons, marginalia — paired with Courier Prime for everything the process generates: body copy, dimension labels, and box tags. The split is semantic: handwriting means a decision, monospace means a measurement. Headings run clamp(32px, 5.4vw, 60px); mono sits at 11–14px with 0.1–0.16em tracking; nothing is bold, because a pencil has one weight.

**Layout Logic**

> A 1080px sheet over a visible 22px graph grid with a 110px major rule, so the underlying module is exposed rather than implied. Blocks snap to that grid and stay axis-aligned — the drawing is loose but the thinking is not — with a 26px gutter, an asymmetric 1.35fr / 1fr hero, and dimension lines hanging outside the block they measure.

**Signature Techniques**

> Hand-drawn boxes from asymmetric corner radii (255px 14px 225px 16px / 16px 225px 14px 255px), doubled with a fainter inset second stroke so the pen looks gone-over twice. Content placeholders drawn as crossed boxes using two diagonal linear-gradient hairlines with a label knocked out of the middle. Dimension lines with end ticks and a mono measurement sitting in a gap in the rule. Marginalia in blue and red — too big?, tighten ↑, final copy pending, and one note that actually annotates the real headline (keep — reads well) rather than only the surrounding chrome — positioned outside the content flow. A marker-scrawl underline built from an angled repeating gradient at 55% opacity.

**Motion/Interaction**

> On load, JS re-rolls the eight corner radii of every hand-drawn box within set ranges, so no two boxes on the page are identical and a reload produces a different drawing — the machine-repeat that gives fake hand-drawing away is removed. Two controls sit in the nav, styled as the same dashed annotation pill the page already uses for its icon tags, so nothing new was invented for them: one relocates the drawn nav from a strip across the top to a tall margin column down the left by moving a single --rail token, the other moves the sheet from day to a dark drafting-table night across data-theme. Both persist to localStorage. The component reference opens a native <dialog>, itself another hand-drawn box with its own re-rolled corners, which supplies the focus trap, Escape and an inert background and returns focus to its trigger on close. Hovering a card fades in its redline annotation over 300ms; the CTA button rotates −1.5deg on hover; links pick up a red underline. Nothing else moves — a sketch is a still document.

**Common Mistake** *(upgraded field)*

> Using a single fixed "hand-drawn-looking" radius everywhere. The actual technique re-rolls all eight corner radii on every page load specifically so no two boxes are identical — a fixed value is exactly the "machine-repeat that gives fake hand-drawing away" this page's own Motion/Interaction field names.

**Production Caveat** *(upgraded field)*

> The type split is semantic, not aesthetic: handwriting means a human decision, monospace means a measurement. Reaching for the handwriting face on a data label, or the mono face on a heading, breaks the one legibility rule that makes the working-document metaphor function rather than just look sketchy.

**Accessibility Risk** *(upgraded field)*

> Marginalia ("too big?", "tighten ↑") sits outside the content flow, kept separate from the shared copy. A screen reader gets the real content cleanly, but a sighted user relying on the marginalia for context sees information a screen-reader user does not — worth being deliberate about if a marginalia note ever becomes load-bearing rather than decorative.

**When Not To Use** *(upgraded field)*

> Final, production-facing UI. The whole premise is a working, unresolved document — dimension lines, "final copy pending" notes; shipping it as the actual finished interface undercuts user confidence that the product is complete.

**Replication Rules**

> Show the grid you are working on — visible graph paper — and keep every block aligned to it; looseness belongs to the stroke, not the structure. Draw boxes with asymmetric corner radii and a second fainter inset stroke, then randomise those radii per element so no two repeat. Split the type semantically: a handwriting face for anything a person decided, a monospace face for anything measured. Leave the process visible — crossed placeholder boxes, dimension lines, tags like 02 / card, and unresolved margin notes. Restrict colour to graphite plus a blue annotation pencil and a red redline; never fill a shape with colour.

**Colour tokens actually used in this page's CSS.**

18 distinct hex values; 0 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#111111` `#12161f` `#232b3a` `#2b2b2b` `#2c3648` `#3f6fd8` `#6b6f76` `#7a7f86` `#8aa4fb` `#98a1b0` `#d2d8e0` `#d52c20` `#e03b2f` `#e3e7ec` `#eef0f2` `#fcfcfa` `#ff8577`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-paper` | `#fcfcfa` |
| `--th-grid` | `#e3e7ec` |
| `--th-grid-major` | `#d2d8e0` |
| `--th-graphite` | `#2b2b2b` |
| `--th-soft` | `#6b6f76` |
| `--th-blue` | `#3f6fd8` |
| `--th-red` | `#d52c20` |
| `--th-paper` | `#12161f` |
| `--th-grid` | `#232b3a` |
| `--th-grid-major` | `#2c3648` |
| `--th-graphite` | `#eef0f2` |
| `--th-soft` | `#98a1b0` |
| `--th-blue` | `#8aa4fb` |
| `--th-red` | `#ff8577` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Architects Daughter`, `Brush Script MT`, `Comic Sans MS`, `Consolas`, `Courier`, `Courier Prime`, `Dancing Script`, `Menlo`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `400`, `700`

`@font-face` declarations (8) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Architects Daughter` | 400 | normal | swap | `../assets/fonts/architects-daughter/architects-daughter-400.woff2` |
| `Architects Daughter` | 400 | normal | swap | `../assets/fonts/architects-daughter/architects-daughter-400-ext.woff2` |
| `Courier Prime` | 400 | normal | swap | `../assets/fonts/courier-prime/courier-prime-400.woff2` |
| `Courier Prime` | 400 | normal | swap | `../assets/fonts/courier-prime/courier-prime-400-ext.woff2` |
| `Courier Prime` | 700 | normal | swap | `../assets/fonts/courier-prime/courier-prime-700.woff2` |
| `Courier Prime` | 700 | normal | swap | `../assets/fonts/courier-prime/courier-prime-700-ext.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **3**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 10 |
| `@keyframes` blocks | 1 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 1 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/conceptual-sketch/SKILL.md` | exists | yes |
| Example website | `../examples/conceptual-sketch/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

1 of 34 probed pairs fail; 0 could not be resolved automatically.

| Mode | Element | min | median | Needs | Verdict |
|---|---|---|---|---|---|
| light | card label/icon | 4.44 | 4.57 | 4.5 | FAIL |

- **light / card label/icon** — rgb(63,111,216) on rgb(248,249,248), 4.44:1 worst pixel (median 4.57:1) against 4.5:1 required. Text is 11px at weight 400.

---

### Luxury Typography

`styles/luxury-typography.html` — 37,661 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Luxury Typography

**Era / Origin**

> The house style of European fashion and fragrance maisons — descended from Bodoni and Didot's 1790s didones by way of mid-century Vogue, and standard for luxury web identity since roughly 2015.

**Color Palette**

> #f7f4ef — ivory page ground, warmer than white #12100e — near-black ink and the single black field #b09a72 — champagne, scoped to the one black field's hover text, the only context it clears AA against #78694e — champagne-ink, the same accent deepened for every other, ivory-background use (headline em, numerals, button-hover text) #6a655e — warm grey for all secondary text #ddd7cc — hairline rules

**Typography**

> Bodoni Moda (optical-size didone) for all display, paired with Jost at 300–400 for every piece of small text. The style lives in the gap between them: the headline runs clamp(42px, 8.4vw, 116px) at 0.98 leading while labels sit at 9px with 0.42em letter-spacing and a matching text-indent — a ratio of roughly 13:1 with nothing in between except 30px card titles. Body is 14.5–15px at 1.75–1.85 line-height. Italic in champagne is the only emphasis; bold is never used.

**Layout Logic**

> An asymmetric two-track grid — minmax(120px, 1fr) for a label column against 4.4fr for content — repeated in the hero and the CTA, so a small tracked capital always sits opposite a large serif. Vertical padding is viewport-relative and enormous (clamp(72px, 13vh, 150px)), and the headline is capped at 13ch so at least a third of the page stays empty.

**Signature Techniques**

> Extreme letter-spacing (0.42–0.46em) on 9px capitals, always paired with an equal text-indent so the trailing space does not break alignment. Buttons as tracked capitals over a 1px underline — no fill, no radius, no box. Roman numerals in champagne italic as section markers instead of digits. One full-bleed black field, escaped from the wrapper with negative margins, used exactly once on the page. Underlines that wipe out to the right and back in from the left on hover, over 700ms.

**Motion/Interaction**

> JS splits the headline into individual words wrapped in .word spans and reveals them in sequence — 14px rise plus fade, 1s each on cubic-bezier(.16, 1, .3, 1), staggered 90ms apart — so the line assembles itself rather than appearing. That stagger is untouched from before this pass. The actual motion is a CSS transition triggered by a discrete class write, so reduced-motion mutes every word to an instant, imperceptible appearance without any script-side guard — confirmed, not assumed. Hovers are unusually slow at 600–700ms; buttons gain 14px of horizontal padding as their rule recolours to champagne, so the type appears to breathe outward. Two controls join the nav in the same tracked-capital, wipe-underline language as every other link. One relocates the bar between the top strip and a fixed left column by moving a single --rail token — the CTA's full-bleed math carries an extra term so its black field still reaches the true viewport edge once the column shifts the page's centre; the other moves the hour between day and dusk on data-theme. Both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger on close.

**Common Mistake** *(upgraded field)*

> Filling the empty third of the page with something. The point, per this page's own Layout Logic and Replication Rules, is that at least a third of the page stays empty; using that space for another CTA or badge directly undoes the restraint the style is built on.

**Production Caveat** *(upgraded field)*

> The champagne accent uses two different token values depending on context — a lighter one scoped to the one black field's hover text, a deepened one everywhere else on ivory — because a single value can't clear AA in both. Reusing only one of the two tokens in a new component risks silently failing contrast wherever it wasn't tuned for.

**Accessibility Risk** *(upgraded field)*

> 0.42–0.46em letter-spacing at 9px is extreme by any standard. Screen readers are unaffected, but sighted low-vision users relying on browser zoom will see labels break their fixed text-indent alignment at high zoom, since the indent is tuned to a specific tracking value at default zoom.

**When Not To Use** *(upgraded field)*

> Data-dense or information-first products. A scale ratio this extreme — roughly 13:1, nothing in between — and this much reserved emptiness actively fight any interface that needs to show many things at once.

**Replication Rules**

> Set one didone (Bodoni, Didot) for display and one geometric sans at 300 weight for everything else — never a third face. Create hierarchy from scale contrast alone: display above 90px against 9px capitals tracked to 0.42em, with almost nothing in the middle of the ramp. Pair every large element with a small tracked label in an opposing narrow column; never centre the composition. Keep the palette to ivory, near-black and one metallic accent used only on italics and hover states — no third colour, no ornament, no border radius. Leave at least a third of the page empty and slow all motion to 600ms or more; luxury reads as unhurried.

**Colour tokens actually used in this page's CSS.**

13 distinct hex values; 4 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#b09a72` `#12100e` `#a89060` `#f7f4ef` `#ffffff` `#111111` `#171310` `#332d24` `#6a655e` `#78694e` `#a49b8c` `#ddd7cc` `#f0ebe0`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-ivory` | `#f7f4ef` |
| `--th-ink` | `#12100e` |
| `--th-grey` | `#6a655e` |
| `--th-hair` | `#ddd7cc` |
| `--th-champagne-ink` | `#78694e` |
| `--th-ivory` | `#171310` |
| `--th-ink` | `#f0ebe0` |
| `--th-grey` | `#a49b8c` |
| `--th-hair` | `#332d24` |
| `--th-champagne-ink` | `#a89060` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Arial`, `Bodoni Moda`, `Brush Script MT`, `Consolas`, `Dancing Script`, `Didot`, `Helvetica Neue`, `Jost`, `Menlo`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `Times New Roman`, `cursive`, `monospace`, `sans-serif`, `serif`, `ui-monospace`

Explicit `font-weight` values: `300`, `400`, `500`, `700`

`@font-face` declarations (14) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Bodoni Moda` | 400 | normal | swap | `../assets/fonts/bodoni-moda/bodoni-moda-400.woff2` |
| `Bodoni Moda` | 400 | normal | swap | `../assets/fonts/bodoni-moda/bodoni-moda-400-ext.woff2` |
| `Bodoni Moda` | 400 | italic | swap | `../assets/fonts/bodoni-moda/bodoni-moda-400-italic.woff2` |
| `Bodoni Moda` | 400 | italic | swap | `../assets/fonts/bodoni-moda/bodoni-moda-400-italic-ext.woff2` |
| `Bodoni Moda` | 500 | normal | swap | `../assets/fonts/bodoni-moda/bodoni-moda-400.woff2` |
| `Bodoni Moda` | 500 | normal | swap | `../assets/fonts/bodoni-moda/bodoni-moda-400-ext.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Jost` | 300 | normal | swap | `../assets/fonts/jost/jost-300.woff2` |
| `Jost` | 300 | normal | swap | `../assets/fonts/jost/jost-300-ext.woff2` |
| `Jost` | 400 | normal | swap | `../assets/fonts/jost/jost-300.woff2` |
| `Jost` | 400 | normal | swap | `../assets/fonts/jost/jost-300-ext.woff2` |
| `Jost` | 500 | normal | swap | `../assets/fonts/jost/jost-300.woff2` |
| `Jost` | 500 | normal | swap | `../assets/fonts/jost/jost-300-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background-image` / gradient declarations: **zero**.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 13 |
| `@keyframes` blocks | 1 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 0 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/luxury-typography/SKILL.md` | exists | yes |
| Example website | `../examples/luxury-typography/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 24 probed pairs pass, in both themes. Worst pair on the page: 
`nav link` (light) at 5.26:1 against a 4.5:1 requirement.

---

### Editorial Design

`styles/editorial-design.html` — 38,794 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Editorial Design

**Era / Origin**

> Mid-20th-century magazine art direction — Alexey Brodovitch at Harper's Bazaar, Willy Fleckhaus at Twen — carried into digital longform by the 2010s (NYT, The Guardian, Bloomberg).

**Color Palette**

> #fbfaf7 — warm paper stock, never pure white #16161a — text ink and heavy 3px rules #c8322b — editorial red for kickers, quote marks and the progress bar #6d6b66 — byline, dateline and folio grey #d9d5cc — hairline column rules #f1ede4 — tinted box for the standing CTA

**Typography**

> Source Serif 4 (optical-size axis) for masthead, headlines, body and pull quote, paired with Archivo for every piece of apparatus — kickers, bylines, buttons, folio. Serif carries content, sans carries metadata; the two never swap roles. Headline clamp(36px, 5.8vw, 74px)/700 at −0.028em and 1.02 leading; standfirst 20px/1.45; body 17px/1.62 with hyphens: auto; apparatus 10–11px uppercase at 0.14–0.18em.

**Layout Logic**

> A 1160px measure with an asymmetric 7fr / 4fr hero — headline against standfirst — then a three-column feature well with zero gap, columns divided by 1px vertical rules the way a printed page divides them. Rule weight encodes hierarchy: 3px closes the masthead and opens the pull quote, 1px separates columns and minor blocks.

**Signature Techniques**

> Full magazine furniture: dateline, kicker, standfirst with a 3px left bar, byline, pull quote, and a folio line closing the page. Floated ::first-letter drop caps at 3.1em over three lines of text. Columns separated by borders rather than gaps, so the grid reads as printed rulework. Red used only on apparatus — kicker, quote marks, progress bar, button — never on body text. A centred italic pull quote framed by a 3px rule above and a 1px rule below.

**Motion/Interaction**

> Almost none, by discipline. A 3px red reading-progress bar is fixed at the top and its width is set from scrollTop / (scrollHeight − innerHeight) on a passive scroll listener, clamped to 0–100% and hidden outright when the article already fits the viewport and there is no progress to report — the only motion tied to content length rather than decoration. Nav links reveal a 2px red underline and buttons swap between ink and red over 200ms. Nothing fades in, nothing parallaxes: text should be readable the instant it renders. Two controls are set on the masthead's left to mirror the dateline on its right, in the same 10px Archivo caps the rest of the apparatus uses: one re-sets the masthead as a fixed left-hand standing column by changing a single --rail token, the other switches the edition between day and night, which re-resolves every colour on the page through six tokens; both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger.

**Common Mistake** *(upgraded field)*

> Using red as a general accent throughout the page. The rule is red used only on apparatus — kicker, quote marks, progress bar, button — never on body text; colouring headlines or body copy red collapses editorial hierarchy into decoration.

**Production Caveat** *(upgraded field)*

> The reading-progress bar computes width from scroll position and is explicitly hidden when the article already fits the viewport. A copy of just the progress-bar CSS without that content-length check shows a permanently-full or nonsensical bar on any short page.

**Accessibility Risk** *(upgraded field)*

> Nothing fades in and nothing parallaxes, "by discipline," specifically so text is readable the instant it renders. Any future addition that reveals text on scroll or hover would be a regression against this page's own stated principle, not just a style deviation.

**When Not To Use** *(upgraded field)*

> Short-form or glanceable content (notifications, status updates). The full magazine apparatus — dateline, kicker, standfirst, byline, pull quote, folio — assumes a genuine long-form reading commitment that a two-sentence card can't support.

**Replication Rules**

> Install the furniture first — dateline, kicker, standfirst, byline, pull quote, folio — because that apparatus, not the layout, is what reads as editorial. Pair one text serif for content with one grotesque for metadata, and never let them swap roles. Divide columns with 1px vertical rules and no gap, and encode hierarchy in rule weight (3px major, 1px minor). Set body at 17px on a 1.6 line-height with hyphenation and drop caps; the text block is the design, not a filler. Allow exactly one accent colour on apparatus only, and keep motion limited to a reading indicator — never animate the text itself.

**Colour tokens actually used in this page's CSS.**

14 distinct hex values; 2 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#111111` `#131316` `#16161a` `#1c1c21` `#2e2e33` `#6d6b66` `#a5a29b` `#c8322b` `#d9d5cc` `#e5564d` `#f0efec` `#f1ede4` `#fbfaf7`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-paper` | `#fbfaf7` |
| `--th-ink` | `#16161a` |
| `--th-red` | `#c8322b` |
| `--th-grey` | `#6d6b66` |
| `--th-rule` | `#d9d5cc` |
| `--th-tint` | `#f1ede4` |
| `--th-paper` | `#131316` |
| `--th-ink` | `#f0efec` |
| `--th-red` | `#e5564d` |
| `--th-grey` | `#a5a29b` |
| `--th-rule` | `#2e2e33` |
| `--th-tint` | `#1c1c21` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Archivo`, `Brush Script MT`, `Dancing Script`, `Georgia`, `Segoe Script`, `Segoe UI`, `Source Serif 4`, `Times New Roman`, `cursive`, `sans-serif`, `serif`

Explicit `font-weight` values: `400`, `500`, `600`, `700`

`@font-face` declarations (16) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Archivo` | 500 | normal | swap | `../assets/fonts/archivo/archivo-500.woff2` |
| `Archivo` | 500 | normal | swap | `../assets/fonts/archivo/archivo-500-ext.woff2` |
| `Archivo` | 600 | normal | swap | `../assets/fonts/archivo/archivo-500.woff2` |
| `Archivo` | 600 | normal | swap | `../assets/fonts/archivo/archivo-500-ext.woff2` |
| `Archivo` | 700 | normal | swap | `../assets/fonts/archivo/archivo-500.woff2` |
| `Archivo` | 700 | normal | swap | `../assets/fonts/archivo/archivo-500-ext.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Source Serif 4` | 400 | normal | swap | `../assets/fonts/source-serif-4/source-serif-4-400.woff2` |
| `Source Serif 4` | 400 | normal | swap | `../assets/fonts/source-serif-4/source-serif-4-400-ext.woff2` |
| `Source Serif 4` | 400 | italic | swap | `../assets/fonts/source-serif-4/source-serif-4-400-italic.woff2` |
| `Source Serif 4` | 400 | italic | swap | `../assets/fonts/source-serif-4/source-serif-4-400-italic-ext.woff2` |
| `Source Serif 4` | 600 | normal | swap | `../assets/fonts/source-serif-4/source-serif-4-400.woff2` |
| `Source Serif 4` | 600 | normal | swap | `../assets/fonts/source-serif-4/source-serif-4-400-ext.woff2` |
| `Source Serif 4` | 700 | normal | swap | `../assets/fonts/source-serif-4/source-serif-4-400.woff2` |
| `Source Serif 4` | 700 | normal | swap | `../assets/fonts/source-serif-4/source-serif-4-400-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background-image` / gradient declarations: **zero**.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 11 |
| `@keyframes` blocks | 0 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 0 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/editorial-design/SKILL.md` | exists | yes |
| Example website | `../examples/editorial-design/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 24 probed pairs pass, in both themes. Worst pair on the page: 
`card label/icon` (light) at 5.10:1 against a 4.5:1 requirement.

---

### Y2K Aesthetic

`styles/y2k-aesthetic.html` — 38,877 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Y2K Aesthetic

**Era / Origin**

> 1998–2003 — translucent iMac G3 plastic, Apple's Aqua interface, chrome WordArt and holographic foil, revived as an internet aesthetic from about 2019.

**Color Palette**

> #bfe4ff — baby blue, base of the iridescent ground #c8a2ff — lilac in the conic foil gradient #ff7ac6 — bubblegum pink for chips, sparkles and the CTA #2aa3ff — Aqua blue for the primary gel button #1d2436 — ink for body text and headline shadows #dfe6f0 — silver plastic body #8d9bb5 — chrome shadow stop in bevels and word art Only the ambient ground and the translucent plastic panel body invert under dark mode — the Graphite/Smoke colourway the iMac actually shipped, not a departure from Y2K. Chrome word art, the Aqua and pink gel buttons, nav pills, icon chips and the foil overlay keep fixed values in both themes: a moulded button's gradient is a material property, not something that re-lights with the room.

**Typography**

> Audiowide for all display (a wide techno face standing in for period WordArt) paired with Verdana — genuinely Verdana, with Tahoma and Geneva as fallbacks, because that is what the era shipped. Body sits at an authentically small 12.5–13.5px with a loose 1.8–1.85 line-height; labels are 10–11px bold uppercase at 0.16em. Display never gets a flat colour: every heading is a five-to-six-stop vertical gradient clipped to the text.

**Layout Logic**

> A 1020px column of centre-aligned rounded panels with an 18px gap, everything stacked symmetrically. Panels are the unit — nothing sits directly on the background — and each has generous 28–52px padding so the gloss highlight has room. Corner radius is a constant 22px, with pills at 999px for anything clickable.

**Signature Techniques**

> Aqua gel: a hard mid-stop gradient (light 0–46%, dark 54–100%) plus inset 0 2px 0 white and a bottom inner shadow, giving the wet-plastic split. A separate top-light ::before with a 18px 18px 60% 60% radius — the reflected highlight lozenge of the era. Chrome word art via a six-stop vertical gradient with background-clip: text and stacked drop-shadow filters for the bevel. Holographic foil: a full-hue conic-gradient at 62% opacity in mix-blend-mode: soft-light, rotated and scaled on hover — soft-light rather than overlay, since overlay pushed the panel's own gloss highlight (already past mid-grey) to flat white. Twinkling ✦ sparkles on a 1.8s scale-and-fade loop with offset delays.

**Motion/Interaction**

> JS drops a sparkle at the pointer roughly every 45ms of movement — a ✦ or ✧ that scales up, drifts 22px and fades over 700ms before removing itself via the Web Animations API, capped so the DOM never accumulates. That call is checked live against prefers-reduced-motion and skipped outright under it, since a CSS mute can't reach an imperative element.animate(). A pointermove trail has no equivalent on a tap, so a pointerdown from a touch pointer drops a small fixed burst of sparkles at the tap point instead, giving touch the same feedback a mouse gets for free. Hover states use filter: brightness() saturate() plus a 2px lift rather than colour changes, so plastic looks catch the light; the foil layer on cards rotates 38deg and scales 1.5 over 600ms. Buttons depress on :active by swapping their outer shadow for an inset one. Two gel pills beside the nav links match that language: one moves the nav between the top strip and a fixed left column on a single --rail token, the other swaps the plastic's colourway on data-theme; both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger on close.

**Common Mistake** *(upgraded field)*

> Using a dark or muted palette for "Y2K vibes." The page's own rule states this directly: Y2K is optimistic, not dystopian, and needs a light iridescent ground; a dark Y2K page is actually reaching for cybercore or cyberpunk's register instead.

**Production Caveat** *(upgraded field)*

> The sparkle-trail cursor effect drops a new element roughly every 45ms of pointer movement, capped so the DOM never accumulates. A copy of the visual idea without that cap risks unbounded DOM growth on a page with a very active mouse user.

**Accessibility Risk** *(upgraded field)*

> Hover states on gel buttons use CSS filter (brightness/saturate) rather than a colour swap, and filters compound non-linearly rather than as a simple combined multiplier. Any new hover treatment on this page needs its worst-case contrast checked at the actual gradient stop boundaries, not estimated from the filter values alone.

**When Not To Use** *(upgraded field)*

> Interfaces trying to read as contemporary or premium. Chrome word art, chunky gel buttons and chip textures are specifically a period signifier; using them outside a deliberate nostalgia context reads as dated rather than stylish.

**Replication Rules**

> Keep the page light and iridescent — a conic pastel ground, never a dark one; Y2K is optimistic, not dystopian. Give every clickable thing the Aqua gel recipe: a hard mid-stop gradient, an inset white top line, an inset bottom shadow and a coloured cast shadow. Set display type as clipped multi-stop chrome or foil gradients with stacked drop-shadows; never let a heading be one flat colour. Use period body type — Verdana or Tahoma at 12–13px with loose leading — and pill radii on all controls. Add gloss and sparkle as motion: brightness/saturate hovers, a rotating holographic overlay, and a cursor sparkle trail that cleans up after itself.

**Colour tokens actually used in this page's CSS.**

52 distinct hex values; 42 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#12467d` `#e0409f` `#5a0f3c` `#ffd9ef` `#0a6fd0` `#7fb2e8` `#a9cdf3` `#d7e8fb` `#e6f2ff` `#ff7ac6` `#ff9fd6` `#fff0f8` `#0063ad` `#2aa3ff` `#c8a2ff` `#111111` `#122c30` `#141b32` `#1d2436` `#221733` `#252c40` `#2b3550` `#331a2c` `#3c4e74` `#3fb5ff` `#41537a` `#7488ad` `#7d92b6` `#8098bd` `#8ba2c4` `#8d9bb5` `#8ed3ff` `#a1a1aa` `#b81f70` `#bfe4ff` `#c3cbe2` `#c3d6ee` `#c7daf2` `#cfe9ff` `#d6fbff` `#d9358f` `#dde7f5` `#dfe6f0` `#e3eefb` `#e7d6ff` `#e8ecf5` `#e9f2ff` `#ff8fcf` `#ffb3e0` `#ffc2e4` `#ffe6f4`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-ink` | `#1d2436` |
| `--th-ink-soft` | `#2b3550` |
| `--th-panel-1` | `rgba(255,255,255,.96)` |
| `--th-panel-2` | `rgba(233,241,252,.9)` |
| `--th-panel-3` | `rgba(206,220,240,.92)` |
| `--th-panel-border` | `#ffffff` |
| `--th-panel-hi` | `rgba(255,255,255,1)` |
| `--th-panel-lo` | `rgba(141,155,181,.28)` |
| `--th-panel-cast` | `rgba(52,68,102,.45)` |
| `--th-bg-hi` | `rgba(255,255,255,.95)` |
| `--th-bg-glow` | `rgba(255,122,198,.35)` |
| `--th-c1` | `#cfe9ff` |
| `--th-c2` | `#e7d6ff` |
| `--th-c3` | `#ffd9ef` |
| `--th-c4` | `#d6fbff` |
| `--th-dp-bg` | `#dde7f5` |
| `--th-ink` | `#e8ecf5` |
| `--th-ink-soft` | `#c3cbe2` |
| `--th-panel-1` | `rgba(74,82,104,.94)` |
| `--th-panel-2` | `rgba(46,52,72,.9)` |
| `--th-panel-3` | `rgba(26,30,44,.94)` |
| `--th-panel-border` | `rgba(190,200,220,.3)` |
| `--th-panel-hi` | `rgba(255,255,255,.28)` |
| `--th-panel-lo` | `rgba(0,0,0,.4)` |
| `--th-panel-cast` | `rgba(0,0,0,.6)` |
| `--th-bg-hi` | `rgba(255,255,255,.1)` |
| `--th-bg-glow` | `rgba(255,122,198,.22)` |
| `--th-c1` | `#141b32` |
| `--th-c2` | `#221733` |
| `--th-c3` | `#331a2c` |
| `--th-c4` | `#122c30` |
| `--th-dp-bg` | `#252c40` |

**Typography.**

Families referenced: `-apple-system`, `14px/1 "Audiowide`, `14px/1.2 system-ui`, `Audiowide`, `Brush Script MT`, `Consolas`, `Dancing Script`, `Geneva`, `Menlo`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `Tahoma`, `Verdana`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `400`, `700`

`@font-face` declarations (4) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Audiowide` | 400 | normal | swap | `../assets/fonts/audiowide/audiowide-400.woff2` |
| `Audiowide` | 400 | normal | swap | `../assets/fonts/audiowide/audiowide-400-ext.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **16**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 10 |
| `@keyframes` blocks | 3 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 2 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/y2k-aesthetic/SKILL.md` | exists | yes |
| Example website | `../examples/y2k-aesthetic/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

0 of 28 probed pairs fail; 6 could not be resolved automatically.

| Mode | Element | min | median | Needs | Verdict |
|---|---|---|---|---|---|
| light | logo | — | — | — | UNRESOLVED — no glyph pixels isolated |
| light | hero h1 | — | — | — | UNRESOLVED — no glyph pixels isolated |
| light | CTA heading | — | — | — | UNRESOLVED — no glyph pixels isolated |
| dark | logo | — | — | — | UNRESOLVED — no glyph pixels isolated |
| dark | hero h1 | — | — | — | UNRESOLVED — no glyph pixels isolated |
| dark | CTA heading | — | — | — | UNRESOLVED — no glyph pixels isolated |


- **light / logo** — no glyph pixels isolated. The glyph fill could not be neutralised, which means the visible letterform is not being painted by `color` or a `background-clip` fill: it is drawn by `text-shadow` and/or `-webkit-text-stroke`. Automated measurement does not apply; this pair needs a human judgement call.
- **light / hero h1** — no glyph pixels isolated. The glyph fill could not be neutralised, which means the visible letterform is not being painted by `color` or a `background-clip` fill: it is drawn by `text-shadow` and/or `-webkit-text-stroke`. Automated measurement does not apply; this pair needs a human judgement call.
- **light / CTA heading** — no glyph pixels isolated. The glyph fill could not be neutralised, which means the visible letterform is not being painted by `color` or a `background-clip` fill: it is drawn by `text-shadow` and/or `-webkit-text-stroke`. Automated measurement does not apply; this pair needs a human judgement call.
- **dark / logo** — no glyph pixels isolated. The glyph fill could not be neutralised, which means the visible letterform is not being painted by `color` or a `background-clip` fill: it is drawn by `text-shadow` and/or `-webkit-text-stroke`. Automated measurement does not apply; this pair needs a human judgement call.
- **dark / hero h1** — no glyph pixels isolated. The glyph fill could not be neutralised, which means the visible letterform is not being painted by `color` or a `background-clip` fill: it is drawn by `text-shadow` and/or `-webkit-text-stroke`. Automated measurement does not apply; this pair needs a human judgement call.
- **dark / CTA heading** — no glyph pixels isolated. The glyph fill could not be neutralised, which means the visible letterform is not being painted by `color` or a `background-clip` fill: it is drawn by `text-shadow` and/or `-webkit-text-stroke`. Automated measurement does not apply; this pair needs a human judgement call.

---

### Ethereal

`styles/ethereal.html` — 38,287 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Ethereal

**Era / Origin**

> Not a historical movement but a contemporary mood — descended from Pre-Raphaelite and Pictorialist soft focus, and current in fragrance, wellness and ambient-music design since the late 2010s.

**Color Palette**

> #fbfaff — near-white ground with a violet cast #e9e4fb — lavender aurora veil #fde8f0 — blush aurora veil #e0f4f7 — aqua aurora veil #4a4266 — soft violet-grey ink, never black #c9b8f5 — the glow colour, used only in shadows and halos The ground and the three washes invert under dark mode — the same aurora seen at night, deepened into jewel tones rather than a different palette; ink turns pale lavender. Secondary text (nav, hero note, card copy) keeps its original violet-grey in both themes; new interface additions (footer, dialog, this panel) use a slightly deepened variant of that same colour so they clear body-text contrast on their own (see Replication Rules).

**Typography**

> Italiana — a high-contrast display serif with hairline strokes — for every heading, paired with Montserrat at 200–300 for all small text. Nothing on the page is heavier than 400. Tracking is extreme and always paired with a matching text-indent: 0.4em on the logo and buttons, 0.26–0.36em on labels, 0.06–0.14em even on the display. Line-height runs 2.1–2.2 on body so the text column reads as vapour rather than a block. The hero is filled with a four-stop gradient rather than a solid colour.

**Layout Logic**

> A narrow 980px column, centre-aligned throughout, with viewport-relative padding up to 210px so that most of the page is light rather than content. The three features sit on an even grid with an enormous clamp(28px, 6vw, 80px) gutter. There is no container anywhere — no card, no border, no filled button — so grouping is done purely by proximity and by a halo behind each item.

**Signature Techniques**

> Three viewport-scale aurora veils at blur(90px), each drifting and scaling on its own 30–38s loop. A radial haze layer over the aurora that washes the page back toward white at the edges — the high-key key light. Gradient-filled display type via background-clip: text with a 34px violet drop-shadow so headlines emit rather than sit. Halos instead of cards: a radial-gradient circle behind each feature, in a different hue per column, that scales 1.35× on hover. Buttons as tracked capitals over a hairline rule, with letter-spacing itself animating from 0.4em to 0.56em.

**Motion/Interaction**

> Everything is long and weightless. Blocks rise 18px and fade in over 1.8s via IntersectionObserver, staggered 260ms — muted with every other CSS transition sitewide under prefers-reduced-motion. Hovers take 1–1.2s: type gains a violet glow, halos expand, and buttons breathe outward by animating letter-spacing together with text-indent, so tracking widens without the two drifting out of sync. JS spawns 26 luminous motes at random positions that drift upward and sideways for 14–26s each on individual Web Animations loops, re-seeding when they finish, so the air is never still — that spawn loop is checked live against prefers-reduced-motion and skipped outright under it, since a CSS mute can't reach an imperative element.animate() call. Two tracked-capital labels beside the nav links move the nav between the top strip and a fixed left column on a single --rail token, and move the hour between day and night on data-theme; both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger on close.

**Common Mistake** *(upgraded field)*

> Adding a container "just this once" — a card, a border, a filled button. The style is defined by having none, per its own Replication Rules; one bordered box anywhere breaks the weightless, floating premise for the whole layout.

**Production Caveat** *(upgraded field)*

> Letter-spacing and text-indent must always change together, in both the CSS value and any hover transition, or — per this page's own rules — "the two visibly fall out of step." A component that animates tracking without the matching indent will visibly drift mid-transition.

**Accessibility Risk** *(upgraded field)*

> Already named directly in this page's own Replication Rules as a structural risk, not a hypothetical: an all soft-violet-grey-on-near-white palette "risks failing body-text contrast without ever looking obviously wrong," which is why every secondary-text colour has to be checked against its actual ground rather than assumed safe.

**When Not To Use** *(upgraded field)*

> Information-dense or task-driven interfaces. With no cards, no borders and no filled buttons, the style has no built-in way to group or separate competing content once there is more than a handful of it on screen.

**Replication Rules**

> Remove every container — no cards, borders, or filled buttons; group by proximity, halo and light alone. Build the ground from two or more viewport-scale blurred colour veils plus a radial haze that returns the edges to near-white. Cap all font weights at 400 or below and track everything open, always pairing letter-spacing with an equal text-indent — in both the CSS value and the hover transition, or the two visibly fall out of step. Fill display type with a soft multi-stop gradient and give it a wide coloured drop-shadow so it glows instead of sitting. Keep every transition between 1s and 2s and animate weightless properties — opacity, letter-spacing, scale of a glow — never a hard translate or a colour snap. A page built entirely from soft violet-greys on near-white risks failing body-text contrast without ever looking obviously wrong — check every secondary-text colour against its ground at actual size before shipping, not just against the display type.

**Colour tokens actually used in this page's CSS.**

23 distinct hex values; 0 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#b3a9d1` `#111111` `#120e1f` `#1f4a52` `#3a2f66` `#4a4266` `#5a2a44` `#665e82` `#6d5fa8` `#726a95` `#7fc3cf` `#8f88ab` `#a1a1aa` `#a98bd6` `#c9b8f5` `#d4c4ff` `#e0f4f7` `#e79ec2` `#e9e4fb` `#ede9fa` `#fbfaff` `#fde8f0`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-light` | `#fbfaff` |
| `--th-mist` | `#e9e4fb` |
| `--th-blush` | `#fde8f0` |
| `--th-aqua` | `#e0f4f7` |
| `--th-ink` | `#4a4266` |
| `--th-faint` | `#726a95` |
| `--th-glow` | `#c9b8f5` |
| `--th-faint-safe` | `#665e82` |
| `--th-light` | `#120e1f` |
| `--th-mist` | `#3a2f66` |
| `--th-blush` | `#5a2a44` |
| `--th-aqua` | `#1f4a52` |
| `--th-ink` | `#ede9fa` |
| `--th-faint` | `#b3a9d1` |
| `--th-faint-safe` | `#b3a9d1` |
| `--th-glow` | `#d4c4ff` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Brush Script MT`, `Consolas`, `Dancing Script`, `Italiana`, `Menlo`, `Montserrat`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `cursive`, `monospace`, `sans-serif`, `serif`, `ui-monospace`

Explicit `font-weight` values: `200`, `300`, `400`, `700`

`@font-face` declarations (9) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Italiana` | 400 | normal | swap | `../assets/fonts/italiana/italiana-400.woff2` |
| `Montserrat` | 200 | normal | swap | `../assets/fonts/montserrat/montserrat-200.woff2` |
| `Montserrat` | 200 | normal | swap | `../assets/fonts/montserrat/montserrat-200-ext.woff2` |
| `Montserrat` | 300 | normal | swap | `../assets/fonts/montserrat/montserrat-200.woff2` |
| `Montserrat` | 300 | normal | swap | `../assets/fonts/montserrat/montserrat-200-ext.woff2` |
| `Montserrat` | 400 | normal | swap | `../assets/fonts/montserrat/montserrat-200.woff2` |
| `Montserrat` | 400 | normal | swap | `../assets/fonts/montserrat/montserrat-200-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **5**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | yes — observer adds .in |
| `View style` affordance | n/a |
| CSS `transition` declarations | 11 |
| `@keyframes` blocks | 5 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 3 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/ethereal/SKILL.md` | exists | yes |
| Example website | `../examples/ethereal/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

10 of 32 probed pairs fail; 1 could not be resolved automatically.

| Mode | Element | min | median | Needs | Verdict |
|---|---|---|---|---|---|
| light | nav link | 4.4 | 4.4 | 4.5 | FAIL |
| light | hero h1 | — | — | — | UNRESOLVED — no glyph pixels isolated |
| light | hero body copy | 4.48 | 4.67 | 4.5 | FAIL |
| light | card label/icon | 3.69 | 3.73 | 4.5 | FAIL |
| light | 1a:--faint nav links | 4.4 | 4.4 | 4.5 | FAIL |
| light | 1a:--faint hero note | 4.48 | 4.67 | 4.5 | FAIL |
| light | 1a:--faint icon labels | 3.69 | 3.73 | 4.5 | FAIL |
| dark | hero h1 | 2.97 | 3.1 | 3 | FAIL |
| dark | card label/icon | 2.29 | 2.36 | 4.5 | FAIL |
| dark | 1a:--faint hero note | 1.21 | 7.75 | 4.5 | FAIL |
| dark | 1a:--faint icon labels | 2.29 | 2.36 | 4.5 | FAIL |

- **light / nav link** — rgb(114,106,149) on rgb(241,238,251), 4.40:1 worst pixel (median 4.40:1) against 4.5:1 required. Text is 10.5px at weight 300.
- **light / hero body copy** — rgb(114,106,149) on rgb(248,241,248), 4.48:1 worst pixel (median 4.67:1) against 4.5:1 required. Text is 13px at weight 200.
- **light / card label/icon** — rgb(114,106,149) on rgb(217,208,247), 3.69:1 worst pixel (median 3.73:1) against 4.5:1 required. Text is 9.5px at weight 300.
- **light / 1a:--faint nav links** — rgb(114,106,149) on rgb(241,238,253), 4.40:1 worst pixel (median 4.40:1) against 4.5:1 required. Text is 10.5px at weight 300.
- **light / 1a:--faint hero note** — rgb(114,106,149) on rgb(245,238,244), 4.48:1 worst pixel (median 4.67:1) against 4.5:1 required. Text is 13px at weight 200.
- **light / 1a:--faint icon labels** — rgb(114,106,149) on rgb(218,208,247), 3.69:1 worst pixel (median 3.73:1) against 4.5:1 required. Text is 9.5px at weight 300.
- **dark / hero h1** — rgb(122,115,145) on rgb(50,41,84), 2.97:1 worst pixel (median 3.10:1) against 3.0:1 required. Text is 86px at weight 400.
- **dark / card label/icon** — rgb(179,169,209) on rgb(110,109,144), 2.29:1 worst pixel (median 2.36:1) against 4.5:1 required. Text is 9.5px at weight 300.
- **dark / 1a:--faint hero note** — rgb(179,169,209) on rgb(157,158,164), 1.21:1 worst pixel (median 7.75:1) against 4.5:1 required. Text is 13px at weight 200.
- **dark / 1a:--faint icon labels** — rgb(179,169,209) on rgb(110,109,144), 2.29:1 worst pixel (median 2.36:1) against 4.5:1 required. Text is 9.5px at weight 300.

- **light / hero h1** — no glyph pixels isolated. The glyph fill could not be neutralised, which means the visible letterform is not being painted by `color` or a `background-clip` fill: it is drawn by `text-shadow` and/or `-webkit-text-stroke`. Automated measurement does not apply; this pair needs a human judgement call.

---

### Bohemian

`styles/bohemian.html` — 39,507 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Bohemian

**Era / Origin**

> 19th-century Parisian bohème by way of the 1960s–70s counterculture, and its current interiors revival — Moroccan and Southwestern textile, adobe architecture and macramé craft. The textile, macramé and adobe forms borrowed here come from living craft traditions — Amazigh and other North African weaving, Diné and Pueblo textile and architecture, Latin American macramé — worth naming rather than folding into one generic "boho" surface.

**Color Palette**

> #f3e7d8 — limewashed adobe, the page ground #c56b4a — terracotta for arches, beads and the fringe #9e563b — deep terracotta for the CTA field, fixed regardless of theme #d9a441 — ochre sun and inset ring #c98b8b — dusty rose in the textile motif #626642 — olive for small labels and beads, darkened from an earlier #7a7f52 that failed AA #4a3627 — walnut ink for body text Ground, panel surfaces and ink invert under dark mode — the limewashed room by daylight becomes the same room after dark, with terracotta, ochre, rose and olive lifting a shade to stay warm against it. The CTA field, its text and the two solid buttons (Explore, Close) hold fixed values in both themes — small lit pills that read the same colour regardless of the hour, like lamplight indoors.

**Typography**

> Three faces with distinct jobs: Amatic SC (condensed hand-lettering) for the logo, card titles and the CTA at large sizes; Cardo (an old-style serif with a true italic) for headlines, body copy and nav links; Outfit Light for small uppercase labels and buttons. Card titles run 40px Amatic at 0.9 leading against 16px Cardo body at 1.75 — the handwriting is always larger than the text it labels. Labels are 10–13px at 0.22–0.26em.

**Layout Logic**

> A 1080px centred column with everything centre-aligned, since the composition is built from doorways and each block is a symmetrical opening. Sections are separated by 60–64px and the card grid uses a 26px gutter. Structure comes from arched containers rather than rules — the arch is the layout module.

**Signature Techniques**

> Adobe arches from split border-radius — 50% 50% 12px 12px / 34% 34% 12px 12px — rounded at the top, squared at the base. A woven ground: two fine thread gradients at 90° and 0° over a warm ochre light wash. A block-print rule built from two offset radial dot patterns on a 32px tile plus a fine vertical warp. An inset ochre ring (inset 0 0 0 7px) inside the terracotta arch border, imitating a painted doorway surround. Macramé fringe — DOM-generated cords of varying length hanging below the arch, swaying on offset delays.

**Motion/Interaction**

> JS builds the macramé fringe: 48 cords of randomised length (18–52px) with randomised animation delays, each swaying ±3deg on a 4.6s ease-in-out loop so the row ripples rather than moving as a block — muted with everything else on the page under prefers-reduced-motion sitewide. Everything else is soft and slow at 350–400ms: cards lift 5px onto a hard offset shadow, buttons rise 3px and warm from sienna to terracotta, nav links change colour under their dotted underline. Two controls sit beside the nav links in the same dotted-underline language: one moves the nav between the top strip and a fixed left column by setting a single --rail token, the other moves the hour between day and night on data-theme; both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger on close.

**Common Mistake** *(upgraded field)*

> Treating "boho" as one generic pattern-and-fringe look. This page's own Era/Origin field already makes the point directly: the textile, macramé and adobe devices come from specific living craft traditions — Amazigh weaving, Diné and Pueblo textile, Latin American macramé — worth naming rather than folding into one undifferentiated surface.

**Production Caveat** *(upgraded field)*

> The 48 macramé fringe cords are DOM-generated with randomised length and per-cord delay specifically so the row ripples rather than moving as one block. A static, pre-authored fringe graphic loses the hand-knotted, uneven quality the randomisation exists to produce.

**Accessibility Risk** *(upgraded field)*

> The CTA field and its two solid buttons hold fixed colour values in both themes, unlike the rest of the palette, which inverts. Any new interactive element needs an explicit decision about which behaviour it follows, or it will drift out of the fixed-vs-inverting pattern this page establishes.

**When Not To Use** *(upgraded field)*

> Minimal or corporate-neutral products. The warm earth palette, arch-shaped containers and hand-craft texture are maximally specific cultural signifiers; used generically, without the sourcing care this page itself models, the style risks reading as costume rather than reference.

**Replication Rules**

> Build containers as arches — top corners rounded to 34–50%, bottom corners squared — and let the arch replace the rectangle everywhere. Use a sun-warmed earth palette (terracotta, ochre, dusty rose, olive) on limewashed sand, with walnut rather than black for text. Weave the background from fine repeating gradients; never leave a flat fill. Pair condensed hand-lettering with an old-style serif and set the hand-lettering larger than the body it introduces. Add one piece of real craft — fringe, beads, a block-printed border — generated as repeated elements with randomised length and delay so it never looks stamped.

**Colour tokens actually used in this page's CSS.**

22 distinct hex values; 1 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#4a3627` `#d9a441` `#dd8058` `#f3e7d8` `#ffffff` `#111111` `#221812` `#2b1f17` `#626642` `#7a3f22` `#7a7f52` `#96a069` `#9a4e32` `#9c4f2f` `#9e563b` `#c56b4a` `#c97a4f` `#c98b8b` `#d69f9f` `#e6b662` `#f1e6d6` `#fffaf2`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-sand` | `#f3e7d8` |
| `--th-paper` | `#fffaf2` |
| `--th-walnut` | `#4a3627` |
| `--th-terracotta` | `#c56b4a` |
| `--th-ochre` | `#d9a441` |
| `--th-rose` | `#c98b8b` |
| `--th-olive` | `#626642` |
| `--th-sienna` | `#9c4f2f` |
| `--th-terracotta-nav` | `#9a4e32` |
| `--th-sand` | `#221812` |
| `--th-paper` | `#2b1f17` |
| `--th-walnut` | `#f1e6d6` |
| `--th-terracotta` | `#dd8058` |
| `--th-ochre` | `#e6b662` |
| `--th-rose` | `#d69f9f` |
| `--th-olive` | `#96a069` |
| `--th-sienna` | `#c97a4f` |
| `--th-terracotta-nav` | `#dd8058` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Amatic SC`, `Brush Script MT`, `Cardo`, `Consolas`, `Dancing Script`, `Menlo`, `Outfit`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `cursive`, `monospace`, `sans-serif`, `serif`, `ui-monospace`

Explicit `font-weight` values: `300`, `400`, `500`, `700`

`@font-face` declarations (14) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Amatic SC` | 700 | normal | swap | `../assets/fonts/amatic-sc/amatic-sc-700.woff2` |
| `Amatic SC` | 700 | normal | swap | `../assets/fonts/amatic-sc/amatic-sc-700-ext.woff2` |
| `Cardo` | 400 | normal | swap | `../assets/fonts/cardo/cardo-400.woff2` |
| `Cardo` | 400 | normal | swap | `../assets/fonts/cardo/cardo-400-ext.woff2` |
| `Cardo` | 400 | italic | swap | `../assets/fonts/cardo/cardo-400-italic.woff2` |
| `Cardo` | 400 | italic | swap | `../assets/fonts/cardo/cardo-400-italic-ext.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Outfit` | 300 | normal | swap | `../assets/fonts/outfit/outfit-300.woff2` |
| `Outfit` | 300 | normal | swap | `../assets/fonts/outfit/outfit-300-ext.woff2` |
| `Outfit` | 400 | normal | swap | `../assets/fonts/outfit/outfit-300.woff2` |
| `Outfit` | 400 | normal | swap | `../assets/fonts/outfit/outfit-300-ext.woff2` |
| `Outfit` | 500 | normal | swap | `../assets/fonts/outfit/outfit-300.woff2` |
| `Outfit` | 500 | normal | swap | `../assets/fonts/outfit/outfit-300-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **4**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 10 |
| `@keyframes` blocks | 3 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 1 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/bohemian/SKILL.md` | exists | yes |
| Example website | `../examples/bohemian/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

1 of 27 probed pairs fail; 0 could not be resolved automatically.

| Mode | Element | min | median | Needs | Verdict |
|---|---|---|---|---|---|
| dark | hero body copy | 4.46 | 4.65 | 4.5 | FAIL |

- **dark / hero body copy** — rgb(201,122,79) on rgb(53,37,26), 4.46:1 worst pixel (median 4.65:1) against 4.5:1 required. Text is 16px at weight 300.

---

### Dark Mode UI

`styles/dark-mode-ui.html` — 30,871 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Dark Mode UI

**Era / Origin**

> 2018 onward — system-level dark themes in iOS 13, Android 10 and macOS Mojave, codified by Material Design's dark theme guidance and the Linear/Vercel/GitHub generation of product interfaces.

**Color Palette**

> #0b0d12 — app background, deliberately not pure black #12151c — surface-1: nav, cards, CTA #1a1f29 — surface-2: hover, chips, secondary button #e7eaf0 — primary text at ~91% white, never #ffffff #98a2b6 — secondary text, still above 4.5:1 on the background #6d8fff — accent, desaturated for dark surfaces

**Typography**

> The platform UI stack — system-ui, San Francisco, Segoe UI, Roboto — paired with ui-monospace (SF Mono, Menlo, Consolas) for the icon glyphs and the theme label. No webfont is loaded, because a product interface should paint on first frame. Weights are 500/600/650 only; true 700 bloats on dark backgrounds. Sizes come from a tight ramp: 12–13.5px labels, 14–15px body, 16px card titles, clamp(32px, 4.6vw, 52px) hero, with −0.012 to −0.028em tracking on headings.

**Layout Logic**

> A 1080px application shell on a 4px spacing scale (8/16/22/40/88), with a consistent 16px gutter between all cards and sections. Content is flush left and the hero measure is capped at 44rem. Radii step with element size — 8–9px for controls, 12px for containers, 999px for pills — and every container carries a 1px hairline border rather than relying on shadow alone.

**Signature Techniques**

> An elevation ladder built from surface tints (bg → surface-1 → surface-2) instead of drop shadows, since shadows barely read on dark grounds. Hairline borders at rgba(255,255,255,.09), strengthening to .16 on hover — the primary way edges are defined. A desaturated accent plus a 14%-alpha "quiet" variant of the same hue for chip backgrounds. An inset 0 1px 0 rgba(255,255,255,.14) top highlight on the primary button to imply a light source without a glow. Explicit :focus-visible rings at 2px with 2–3px offset on every interactive element.

**Motion/Interaction**

> Deliberately quiet: 150ms on hover states, 200–250ms on theme and dialog transitions, nothing longer. The fixed docs-style theme switch stays exactly where it was — outside the nav, so the navigation stays exactly three links — and still flips data-theme on <html> between dark and light; because every colour is a token, the entire page re-renders from that one attribute. A second control now sits inside the nav, a token-styled Nav button that moves the navigation between the top strip and a fixed left column on a single --rail token, exactly as it does on every other style in this set. Both choices read from and persist to localStorage before first paint, in a try/catch, under the shared atlas-theme key this page already used and a page-scoped atlas-dmui-nav key for the new nav mode — dark is this page's own fallback where every other style falls back to light. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger on close.

**Common Mistake** *(upgraded field)*

> Inverting a light design — white to black, black to white — rather than building tokenised surfaces. This page aliases every colour through custom properties so the light theme is a second token block over the same components, never a fork; a literal invert produces the pure-black/pure-white values its own rules explicitly ban.

**Production Caveat** *(upgraded field)*

> The whole system depends on nothing being a hardcoded literal. A new component shipped with a literal hex value instead of reading the existing tokens will silently fail to re-theme when data-theme flips, and won't be caught until someone actually toggles the switch.

**Accessibility Risk** *(upgraded field)*

> The page treats halation — glow around light text on dark grounds — as a first-class concern by capping text at ~91% white instead of pure #fff. Reaching for #ffffff "for extra contrast" actually makes large blocks of text harder to read at night, not easier.

**When Not To Use** *(upgraded field)*

> Print-adjacent or content-heavy reading contexts. Dark backgrounds fight established reading conventions, and printing a dark-mode-designed page produces unreadable output without a dedicated print stylesheet.

**Replication Rules**

> Define every colour as a custom property under a [data-theme] selector, and write the light theme as a second token block over the same component CSS — never fork the components. Never use pure black backgrounds or pure white text: start around #0b0d12 and cap text at ~91% white to cut halation. Build elevation from surface tints plus 1px hairline borders, not from shadows, and strengthen the border rather than the shadow on hover. Desaturate the accent for dark surfaces and keep a low-alpha variant of it for chip and badge backgrounds. Keep motion under 250ms, ship visible :focus-visible rings, and load no webfont — use the platform UI stack.

**Colour tokens actually used in this page's CSS.**

16 distinct hex values; 13 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#12151c` `#3559e0` `#000000` `#0b0d12` `#111111` `#12855c` `#1a1f29` `#2e5fff` `#3ddc97` `#5c6577` `#6d8fff` `#98a2b6` `#e7eaf0` `#f0f2f6` `#f6f7f9`

**Typography.**

Families referenced: `-apple-system`, `12px/1 system-ui`, `12px/1.5 system-ui`, `13.5px/1 inherit`, `14px/1.2 system-ui`, `Arial`, `Consolas`, `Helvetica Neue`, `Menlo`, `Roboto`, `SFMono-Regular`, `Segoe UI`, `monospace`, `sans-serif`, `system-ui`, `ui-monospace`

Explicit `font-weight` values: `500`, `550`, `600`, `650`

**Zero `@font-face` declarations** — this page uses only system/stack fonts, so it loads no 
webfont files at all.

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background-image` / gradient declarations: **zero**.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | NO |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 20 |
| `@keyframes` blocks | 2 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 0 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/dark-mode-ui/SKILL.md` | exists | yes |
| Example website | `../examples/dark-mode-ui/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 13 probed pairs pass, in both themes. Worst pair on the page: 
`hero Explore btn` (light) at 5.00:1 against a 4.5:1 requirement.

---

### Cyberpunk

`styles/cyberpunk.html` — 41,276 bytes

**Content parity.**

Deviates from the shared baseline:

- nav labels are `Atlasアトラス / Work / About / Contact` (baseline `Atlas / Work / About / Contact`)

**No `CONTENT-PARITY OVERRIDE` comment is present at the point of use.** 
`CONTRIBUTING.md` requires every deviation to be justified in one sentence, in a code 
comment on the deviating markup, naming the device and why the shared content could not 
carry it. This deviation is undocumented.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Cyberpunk

**Era / Origin**

> 1982 onward — Ridley Scott's Blade Runner and William Gibson's Neuromancer, refreshed by Ghost in the Shell and Cyberpunk 2077; a rain-lit Asian megacity under corporate signage.

**Color Palette**

> #07070c — wet asphalt ground #0e1018 — chassis panel for modules and nav #00fff5 — primary sign neon: logo, CTA, active borders #ff2e88 — secondary neon for the second language and meters #ffb700 — hazard amber for warning stripes and the footer CTA #7b8496 — stencilled steel grey for machine text #dfe6f0 — bone ink for headlines and body copy The street, the chassis and the ink invert under dark mode — the same block seen by day, overcast rather than wet-black at night. Read as text (logo, headline span, card icon, CTA heading), the three neons deepen into unlit, daylight-legible shades of the same hue rather than simply dimming. Hazard tape and the two solid buttons (Explore, dialog Close) keep their lit, fully-saturated colour in both themes — fixed objects, not surfaces that re-light with the hour.

**Typography**

> Rajdhani (a squarish technical sans) for display and buttons, Share Tech Mono for every piece of machine text — body copy, status strings, the Japanese sign. All display is uppercase at 0.04–0.24em tracking with 1.0 leading; mono runs 10–14px at 1.75 line-height. Two scripts share the page deliberately: Latin at large size, katakana at 9–13px, which is the style's core typographic signal.

**Layout Logic**

> A 1180px wrapper packed with a tight 14px gap — modules butt against each other like bolted panels, with no generous whitespace anywhere. Cards are split into a title bar and a body rather than being uniform boxes, and blocks are separated by 7px hazard-tape rules instead of margins. Content is flush left; absolute-positioned status strings occupy the corners that would otherwise be empty.

**Signature Techniques**

> Corner-cut chamfers via clip-path — bottom-right on primary buttons, top-left on secondary — so nothing is a plain rectangle. Two-layer neon: a tight 12–16px text-shadow plus a wide 34–44px bloom in the same hue. 45° hazard tape in amber and near-black as a structural divider. Two drifting diagonal rain sheets at different angles, speeds and opacities over the whole viewport. HUD furniture: status strings (SYS.404 // NO SIGNAL), OK readouts and glowing progress meters presented as ambient data.

**Motion/Interaction**

> Rain falls continuously on two CSS loops (1.6s and 2.4s linear, offset angles) — muted with every other CSS animation sitewide under prefers-reduced-motion; kept as two layers rather than consolidated to one, since the offset angle, speed and opacity between them is what reads as depth (a single sheet flattens back into a repeating texture, and the guard already stops both outright, so there is no motion cost to keeping two). JS drives an IntersectionObserver that fills each card's magenta meter to its data-w value over 1.4s when the card scrolls into view — a CSS width transition, also muted by the same sitewide rule — and rewrites the hero's status string on a setInterval every 2.4s from a fixed list of system messages, so the page reads as live telemetry; that interval is checked live against prefers-reduced-motion and never starts under it, so the line holds on its first message rather than cycling text a user asked to keep still. Hovers are hard-edged at 150ms linear — borders and glows snap on; nothing eases. Two HUD tiles beside the nav links move the nav between the top strip and a fixed left column on a single --rail token, and move the sky between day and night on data-theme; both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger on close.

**Common Mistake** *(upgraded field)*

> Using one neon colour. The page's actual rule is two neons that fight — cyan against magenta — plus a third amber reserved strictly for hazard and warning; a single-neon page is closer to synthwave or generic neon branding than to this style's deliberate colour conflict.

**Production Caveat** *(upgraded field)*

> The hero's status string rewrites every 2.4s from a fixed message list specifically to read as live telemetry. A real product pulling this from an actual live data source needs the same reduced-motion gating this page already applies to the fake version.

**Accessibility Risk** *(upgraded field)*

> Two neons plus dense HUD furniture (status strings, meters, readouts) in the page corners is a lot of simultaneously-competing information. Sighted users with attention-related conditions get the full ambient-data barrage with no way to quiet it short of the sitewide reduced-motion toggle.

**When Not To Use** *(upgraded field)*

> Interfaces where users need to find real status information quickly. This style manufactures decorative telemetry specifically to look busy; a monitoring or ops dashboard adopting this treatment literally would bury real alerts under decorative ones.

**Replication Rules**

> Build on wet near-black with two neons that fight (cyan against magenta) plus a third amber reserved strictly for hazard and warning. Set a technical sans uppercase for display and a mono for everything machine-generated, and put a second script (katakana, Cyrillic) on the page at small size. Chamfer corners with clip-path and give every neon element two shadows — one tight, one wide. Fill the page with density: tight 14px gaps, hazard-tape dividers, status strings in the corners, meters and readouts that carry no real information. Add weather — animated rain, haze or scanlines over the entire viewport — because cyberpunk is an atmosphere before it is a colour scheme.

**Colour tokens actually used in this page's CSS.**

20 distinct hex values; 7 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#00fff5` `#07070c` `#ff2e88` `#ffb700` `#ffffff` `#004f4c` `#080a10` `#0b0b0f` `#111111` `#131722` `#14161e` `#4a5164` `#6e4707` `#7b8496` `#7c0d47` `#8b92a2` `#c7cbd6` `#d5d9e2` `#dfe6f0` `#eef0f4`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-tar` | `#c7cbd6` |
| `--th-panel` | `#eef0f4` |
| `--th-panel-lo` | `#d5d9e2` |
| `--th-bone` | `#14161e` |
| `--th-steel` | `#4a5164` |
| `--th-cyan` | `#004f4c` |
| `--th-magenta` | `#7c0d47` |
| `--th-amber` | `#6e4707` |
| `--th-tar` | `#07070c` |
| `--th-panel` | `#131722` |
| `--th-panel-lo` | `#080a10` |
| `--th-bone` | `#dfe6f0` |
| `--th-steel` | `#8b92a2` |
| `--th-cyan` | `#00fff5` |
| `--th-magenta` | `#ff2e88` |
| `--th-amber` | `#ffb700` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Brush Script MT`, `Consolas`, `Dancing Script`, `Menlo`, `Rajdhani`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `Share Tech Mono`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `400`, `600`, `700`

`@font-face` declarations (9) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Rajdhani` | 400 | normal | swap | `../assets/fonts/rajdhani/rajdhani-400.woff2` |
| `Rajdhani` | 400 | normal | swap | `../assets/fonts/rajdhani/rajdhani-400-ext.woff2` |
| `Rajdhani` | 600 | normal | swap | `../assets/fonts/rajdhani/rajdhani-600.woff2` |
| `Rajdhani` | 600 | normal | swap | `../assets/fonts/rajdhani/rajdhani-600-ext.woff2` |
| `Rajdhani` | 700 | normal | swap | `../assets/fonts/rajdhani/rajdhani-700.woff2` |
| `Rajdhani` | 700 | normal | swap | `../assets/fonts/rajdhani/rajdhani-700-ext.woff2` |
| `Share Tech Mono` | 400 | normal | swap | `../assets/fonts/share-tech-mono/share-tech-mono-400.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **8**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | yes — observer adds no class (drives inline style) |
| `View style` affordance | n/a |
| CSS `transition` declarations | 11 |
| `@keyframes` blocks | 3 |
| `setInterval` | 1 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 3 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/cyberpunk/SKILL.md` | exists | yes |
| Example website | `../examples/cyberpunk/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 26 probed pairs pass, in both themes. Worst pair on the page: 
`1a:.card .bar em` (dark) at 4.75:1 against a 4.5:1 requirement.

---

### Anthropomorphic

`styles/anthropomorphic.html` — 44,893 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Anthropomorphic

**Era / Origin**

> Character-led interface design — Clippy (1997) and the Japanese kawaii mascot tradition, matured into Mailchimp's Freddie and Duolingo's Duo as brand systems built on a personality rather than a logo.

**Color Palette**

> #fff6ec — warm cream ground #2c2340 — ink for every outline, eye and pupil #ff7a59 — coral character and primary button #3ec2b3 — teal, the hero mascot's body #ffc94d — sunny yellow for badges, toggle states and accents #6c4ef0 — plum character and CTA field

**Typography**

> Fredoka 600 for display, card titles and buttons, Nunito 600–700 for body and labels — both rounded-terminal faces, because angular letterforms would contradict the characters' silhouettes. Nothing is set below 600 weight: friendliness reads as sturdiness, not thinness. Hero at clamp(32px, 5vw, 56px)/1.1, card titles 25px, body 15–16px, labels 11px uppercase at 0.14em.

**Layout Logic**

> A 1060px column of large-radius panels (26–40px) with a 24–26px gutter, and a 1.3fr / 0.7fr hero that reserves a real slot for the mascot rather than treating it as decoration. Cards are centre-aligned so each character faces the reader head-on, and every panel has bottom-heavy padding to leave room for feet and body language.

**Signature Techniques**

> One reusable .face component — eyes, mouth and blush — scaled per character by custom properties (--eye, --mouth, --blush-x) rather than duplicated CSS. Mouths drawn as a bottom-only 3px border with a 999px bottom radius, so a single width/height change becomes a different expression. Asymmetric eight-value border-radius bodies, each character a different silhouette, with ears, arms and feet as separate bordered elements. A flat 0 7px 0 0 ink shadow on every panel and button — the ground line a character stands on, never a blur. A small badge-scaled .face credits shared copy to a character without staging it as dialogue — the shared subheading stays plain text beside a face. Actual dialogue is reserved for the hero mascot: a bordered speech bubble with its own tail, holding one short bespoke line the shared content block doesn't carry.

**Motion/Interaction**

> Idle life first: JS blinks each face independently on a randomised 3.2–9s timer by adding a blinking class for 130ms, and every character has its own offset so they never blink in unison. Because that timer is script-driven rather than CSS, it is guarded by a matchMedia check and every face simply holds still when prefers-reduced-motion is set. The mascot breathes on a 3.4s loop and waves one arm from −34deg to +8deg on a 1.5s loop, both plain CSS animation, so the sitewide reduced-motion rule mutes them on its own. Reaction second: hovering a card adds happy, which squints the eyes, widens the mouth by 1.35× and fades in the blush over 220ms with spring easing, while the card lifts 8px and tilts −1.5deg. Buttons depress into their flat shadow on :active. Two controls in the nav reuse the links' own hop-and-tilt hover: one moves the nav from a top bar to a left rail by relocating its flat shadow to the opposite edge, the other dims the backstage between panels from day to night, leaving every character's own colour untouched. Both persist to localStorage. The component reference opens a native <dialog>, another card in the same system, which supplies the focus trap, Escape and an inert background and returns focus to its trigger on close.

**Common Mistake** *(upgraded field)*

> Treating the mascot as a static illustration rather than a component. The actual system is one reusable .face primitive (eyes, mouth, blush) scaled per character with custom properties (--eye, --mouth, --blush-x); hand-drawing each character separately loses the reusable personality system that is the actual point.

**Production Caveat** *(upgraded field)*

> Idle blinking runs on independent, randomised per-character timers (3.2–9s) specifically so characters never blink in sync. A shared timer across all characters looks robotic and synchronised, undercutting the "alive" effect the randomisation exists to create.

**Accessibility Risk** *(upgraded field)*

> A face that blinks and reacts on hover is exactly the kind of ambient motion that is disorienting for vestibular- or attention-sensitive users, even at small scale. The matchMedia guard checked before the blink timer starts is doing real work here, not standing in as a formality.

**When Not To Use** *(upgraded field)*

> Regulated or high-stakes contexts (healthcare, legal, financial services) where a character reacting to the user can undercut perceived authority, or any broad professional B2B audience where personality-led UI reads as consumer rather than credible.

**Replication Rules**

> Build one parametric face component (eyes, mouth, blush) and scale it with custom properties so every character is the same system at a different size. Give each character a distinct asymmetric silhouette and at least one appendage — ears, arms, feet — that exists outside the body's bounding box. Outline everything in a single dark ink and drop it onto a flat, blur-free shadow so characters stand on a ground line. Animate idle behaviour before interaction: randomised, unsynchronised blinking is what separates a character from a sticker. Make hover an emotional response — squint, smile, blush — not a visual effect, and pair rounded typefaces at 600 weight or heavier with it.

**Colour tokens actually used in this page's CSS.**

12 distinct hex values; 3 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#fff6ec` `#111111` `#171225` `#2c2340` `#3ec2b3` `#5b5170` `#6c4ef0` `#e32d00` `#e7e0d6` `#ff7a59` `#ffc94d`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-stage` | `#fff6ec` |
| `--th-stage` | `#171225` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Brush Script MT`, `Consolas`, `Dancing Script`, `Fredoka`, `Menlo`, `Nunito`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `400`, `500`, `600`, `700`, `800`

`@font-face` declarations (16) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Fredoka` | 400 | normal | swap | `../assets/fonts/fredoka/fredoka-400.woff2` |
| `Fredoka` | 400 | normal | swap | `../assets/fonts/fredoka/fredoka-400-ext.woff2` |
| `Fredoka` | 500 | normal | swap | `../assets/fonts/fredoka/fredoka-400.woff2` |
| `Fredoka` | 500 | normal | swap | `../assets/fonts/fredoka/fredoka-400-ext.woff2` |
| `Fredoka` | 600 | normal | swap | `../assets/fonts/fredoka/fredoka-400.woff2` |
| `Fredoka` | 600 | normal | swap | `../assets/fonts/fredoka/fredoka-400-ext.woff2` |
| `Fredoka` | 700 | normal | swap | `../assets/fonts/fredoka/fredoka-400.woff2` |
| `Fredoka` | 700 | normal | swap | `../assets/fonts/fredoka/fredoka-400-ext.woff2` |
| `Nunito` | 400 | normal | swap | `../assets/fonts/nunito/nunito-400.woff2` |
| `Nunito` | 400 | normal | swap | `../assets/fonts/nunito/nunito-400-ext.woff2` |
| `Nunito` | 600 | normal | swap | `../assets/fonts/nunito/nunito-400.woff2` |
| `Nunito` | 600 | normal | swap | `../assets/fonts/nunito/nunito-400-ext.woff2` |
| `Nunito` | 700 | normal | swap | `../assets/fonts/nunito/nunito-400.woff2` |
| `Nunito` | 700 | normal | swap | `../assets/fonts/nunito/nunito-400-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **1**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 13 |
| `@keyframes` blocks | 4 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 4 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/anthropomorphic/SKILL.md` | exists | yes |
| Example website | `../examples/anthropomorphic/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 26 probed pairs pass, in both themes. Worst pair on the page: 
`card body copy` (light) at 7.35:1 against a 4.5:1 requirement.

---

### Victorian

`styles/victorian.html` — 39,475 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Victorian

**Era / Origin**

> Britain, 1837–1901 — industrial-era jobbing printing, playbills and trade cards, where cheap chromolithography made ornament affordable and therefore compulsory. This ornamental print culture sat inside the height of the British Empire — its cheap colour and imported paper moved through the same trade routes and industrial-era labour the era's playbills never depicted — worth naming rather than presenting the period as decorative nostalgia alone.

**Color Palette**

> #f3e7cf — cream paper ground beneath the damask #5d1f2b — burgundy field for the sign board and display type #24402f — bottle-green secondary field and CTA slab #c39a4b — gold leaf for rules, frames and fleurons #7a5e25 — tarnished gold for small caps and inner rules, darkened from an earlier #8d6c2c that failed AA #2a1a10 — printed brown-black body text The paper and the two colours read directly on it (headline burgundy/forest, tarnished gold, ink) invert under dark mode — the same page by gaslight, papered near-black rather than cream. The sign-board fields (nav, CTA) and their gilt ornament keep fixed values in both themes: a painted shop sign doesn't repaint itself at night.

**Typography**

> Three faces in the jobbing-printer tradition: Abril Fatface (a fat-face display) for the logo, headlines and card titles; Playfair Display for small caps, labels and buttons; IM Fell English for running text, set italic in the subheading. Sizing is a playbill stack — 44px logo, clamp(34px, 5.6vw, 66px) headline, 27px card titles, 20px italic deck, 17px body, 10–13px letterspaced capitals at 0.24–0.4em. Adjacent lines often vary in face, size or posture rather than stepping through one smooth scale.

**Layout Logic**

> Centred and symmetrical inside a 960px wrapper, but unlike neo-classical restraint the page is packed: blocks are separated by only 16–18px, each one framed edge to edge so the papered ground shows through as a thin margin. The feature row is three equal framed panels; every block is its own bordered object rather than a region of open space.

**Signature Techniques**

> Damask wallpaper built from three offset radial dot lattices on a 120px tile plus a 45° weave gradient. 3px double gilt borders reinforced with a 1px inset shadow — a frame within a frame on every block. Typographic fleurons (❦ ❖ ❧) as corner marks via ::before/::after and as section caesuras. Compound rules: a 1px line above a 3px double line, sized to 74% width and centred. Floated fat-face drop caps on body paragraphs, plus a Roman-numeral establishment line under the logo.

**Motion/Interaction**

> JS gives the gilt fleurons a gaslight flicker: each .lamp element is driven by a randomised timer that nudges opacity between 0.94 and 1, with an occasional shallower dip to 0.85, so the ornament reads as burning rather than printed. The interval floor sits well above the flash-safety threshold — 700–1400ms between ticks, not the 90ms this used to run at — and the opacity range itself was narrowed rather than only slowed, since 90ms swinging as low as 0.55 opacity was a real photosensitive-seizure risk as well as the reason the fleuron colour underneath it couldn't hold AA at its dimmest point. The loop also now stops entirely while the tab is hidden (checked via the Page Visibility API) and resumes on return, rather than ticking forever in the background, and is skipped outright under prefers-reduced-motion, holding at full opacity. Hovers are period-appropriate and slow at 300ms — nav links warm to gold with a soft glow, buttons swap their field and gilt colours. Two more sign-board words beside the nav links move the nav between the top strip and a fixed left column on a single --rail token, and move the shop between day and gaslit evening on data-theme; both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger on close.

**Common Mistake** *(upgraded field)*

> Filling the page with ornament but forgetting the compulsory density. Per this page's own Era/Origin field, cheap chromolithography made ornament "affordable and therefore compulsory" — a sparse Victorian page with one damask pattern and lots of whitespace is closer to neo-classical restraint than to this jobbing-print register.

**Production Caveat** *(upgraded field)*

> The gaslight flicker was a genuine photosensitive-seizure risk at a 90ms interval swinging to 0.55 opacity before this page's own fix. Copying the "flickering ornament" idea without also copying the interval floor (700–1400ms) and narrowed opacity range (0.85–1) reintroduces a real safety issue, not just a stylistic one.

**Accessibility Risk** *(upgraded field)*

> Documented directly on the page: the flicker loop stops entirely while the tab is hidden and is skipped outright under prefers-reduced-motion — both load-bearing, not defensive extras, given the flash-safety history above.

**When Not To Use** *(upgraded field)*

> Fast-scanning utility interfaces — search results, settings pages. The packed 16–18px block spacing and compound multi-line typographic stacking demand slow, deliberate reading, the opposite of what a utility screen needs.

**Replication Rules**

> Paper the background — never leave a flat field — using tiled radial dot lattices and a fine diagonal weave at very low alpha. Frame every block in a double gilt border with a 1px inset second frame, and mark its corners with fleuron glyphs. Stack the hierarchy like a playbill: vary typeface, size or posture between consecutive lines rather than stepping through one scale. Use a dark jewel palette (burgundy, bottle green) for fields with cream paper and gold for all ornament; body text stays brown-black, never pure black. Fill space rather than protecting it — 16px gaps between framed blocks, drop caps, compound rules, and a dated establishment line.

**Colour tokens actually used in this page's CSS.**

17 distinct hex values; 6 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#24402f` `#5d1f2b` `#8d6c2c` `#c39a4b` `#e0be76` `#f3e7cf` `#ffffff` `#111111` `#20392a` `#211610` `#2a1a10` `#5a4420` `#7a5e25` `#7fb894` `#c9a35f` `#d98fa0` `#ecdfc7`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-paper` | `#f3e7cf` |
| `--th-ink` | `#2a1a10` |
| `--th-burgundy` | `#5d1f2b` |
| `--th-forest` | `#24402f` |
| `--th-gilt-lo` | `#7a5e25` |
| `--th-fleuron-paper` | `#5a4420` |
| `--th-paper` | `#211610` |
| `--th-ink` | `#ecdfc7` |
| `--th-burgundy` | `#d98fa0` |
| `--th-forest` | `#7fb894` |
| `--th-gilt-lo` | `#c9a35f` |
| `--th-fleuron-paper` | `#e0be76` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Abril Fatface`, `Brush Script MT`, `Consolas`, `Dancing Script`, `Georgia`, `IM Fell English`, `Menlo`, `Playfair Display`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `cursive`, `monospace`, `sans-serif`, `serif`, `ui-monospace`

Explicit `font-weight` values: `400`, `500`, `700`

`@font-face` declarations (12) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Abril Fatface` | 400 | normal | swap | `../assets/fonts/abril-fatface/abril-fatface-400.woff2` |
| `Abril Fatface` | 400 | normal | swap | `../assets/fonts/abril-fatface/abril-fatface-400-ext.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `IM Fell English` | 400 | normal | swap | `../assets/fonts/im-fell-english/im-fell-english-400.woff2` |
| `IM Fell English` | 400 | italic | swap | `../assets/fonts/im-fell-english/im-fell-english-400-italic.woff2` |
| `Playfair Display` | 500 | normal | swap | `../assets/fonts/playfair-display/playfair-display-500.woff2` |
| `Playfair Display` | 500 | normal | swap | `../assets/fonts/playfair-display/playfair-display-500-ext.woff2` |
| `Playfair Display` | 500 | italic | swap | `../assets/fonts/playfair-display/playfair-display-500-italic.woff2` |
| `Playfair Display` | 500 | italic | swap | `../assets/fonts/playfair-display/playfair-display-500-italic-ext.woff2` |
| `Playfair Display` | 700 | normal | swap | `../assets/fonts/playfair-display/playfair-display-500.woff2` |
| `Playfair Display` | 700 | normal | swap | `../assets/fonts/playfair-display/playfair-display-500-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **1**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 10 |
| `@keyframes` blocks | 2 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 3 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/victorian/SKILL.md` | exists | yes |
| Example website | `../examples/victorian/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 26 probed pairs pass, in both themes. Worst pair on the page: 
`CTA button` (light) at 4.79:1 against a 4.5:1 requirement.

---

### Cybercore

`styles/cybercore.html` — 36,656 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Cybercore

**Era / Origin**

> An internet aesthetic of the late 2010s built from 1980s phosphor terminals, BBS and demoscene ASCII art, and The Matrix (1999) — the machine's own interface rather than the world around it.

**Color Palette**

> #000000 — true black, the unlit CRT #00ff41 — P1 phosphor green, carries almost all information #2f9a45 — dim trace for rules, ASCII frames and metadata, raised from an earlier #0a3d17 (1.69:1) — see below #b6ffcb — pale green for body copy, one step brighter than the trace #ff003c — the only non-green hue, reserved for the glitch channel and error states The toggle is reverse video, a real terminal feature — not an invented daylight reading. Normal video (dark default) is this page as shipped: true black, bright phosphor. Reverse video swaps the field to a lit pale-green screen with dark ink; because the void/panel fields and the phosphor/error hues invert in opposite directions, every existing fill-and-text pairing (buttons, hovers) stays correctly matched across both without any fixed literal colour.

**Typography**

> VT323 (a bitmap CRT face) for all display, paired with JetBrains Mono for body, labels and ASCII frames — both monospaced, because nothing on this page may have proportional metrics. Display runs clamp(38px, 7.4vw, 88px) uppercase at 0.98 leading; body is a flat 13–14px at 1.6–1.75; metadata is 10–11px in the dim trace colour. Every glyph on the page carries a 0 0 6px green text-shadow to simulate phosphor bloom, except the frames, which are deliberately unlit.

**Layout Logic**

> A narrow 1000px terminal column with a uniform 20px gutter and three equal panes. Every block is a labelled box: a 1px trace border with its tag (stdout, 0x01, exec) notched into the top-left edge via ::before. Real <pre> blocks of box-drawing characters open and close the page, so the layout's frame is literally text.

**Signature Techniques**

> Channel-split glitch: two attr(data-text) pseudo-element copies of the headline, clipped to the top 32% and bottom 28%, offset in red and pale green. ASCII box-drawing rules (┌─┐│└┘) set in a real <pre> rather than drawn with CSS borders. CRT stack: 1px scanlines every 3px, a 130px luminance band rolling down the viewport on a 7s loop, and a mains-flicker opacity keyframe on <body>. All transitions use steps(1) so state changes are digital — there is no interpolation anywhere on the page. Hex dumps of the card copy printed underneath it as burnt-in trace text.

**Motion/Interaction**

> JS decodes the headline on load — each character resolves from random glyphs (#$%&@01) to its final letter over ~900ms — then fires a channel-split glitch burst at randomised 2.6–6s intervals by toggling a glitching class that runs both offset keyframes twice at steps(2). Both the decode loop and the glitch scheduler are checked live against prefers-reduced-motion and skipped outright under it — a CSS mute can't reach a setInterval-driven text rewrite or a class toggle, so the headline instead renders its final text immediately and stays still. The CRT's own mains-flicker keyframe on <body> is CSS-only and already muted by the sitewide rule. A block cursor blinks at 1s steps(1), also sitewide-muted. Hovering a nav item or button inverts it instantly to black-on-phosphor with no easing. Two more bracketed tokens beside the nav links move the nav between the top strip and a fixed left column on a single --rail token, and swap the CRT between reverse and normal video on data-theme; both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger on close.

**Common Mistake** *(upgraded field)*

> Treating this as "cyberpunk but green." The organising idea, per its own Era/Origin field, is the machine's own interface rather than the world around it: exactly one phosphor hue at three brightness levels plus one error colour, monospace everywhere, ASCII box-drawing for structure — a second neon or a proportional font breaks that premise.

**Production Caveat** *(upgraded field)*

> Every transition uses steps() specifically so state changes read as digital, never eased. Reusing an easing curve from elsewhere in a component library immediately contradicts the page's one formal rule: "there is no interpolation anywhere on the page."

**Accessibility Risk** *(upgraded field)*

> This page already had to raise its dim-trace colour from an earlier #0a3d17 (1.69:1) for contrast — a true-black, single-phosphor-hue palette has very little room to place a second, dimmer tone before it silently fails. Any future "quieter" variant of the phosphor green needs the same explicit ratio check this page's own colour-palette comment documents.

**When Not To Use** *(upgraded field)*

> Any consumer-facing or broad-audience product. A true-black, single-hue, monospace-only interface reads as a specialist tool by design, and using it for a general audience actively signals "not for you" through genre convention alone.

**Replication Rules**

> Use exactly one phosphor hue on true black, at three brightness levels, plus a single error colour — never a second neon. Set the entire page in monospace, including display type, and give every glyph a soft same-hue text-shadow for bloom. Draw structure with ASCII box characters in a <pre> and label each container with a tag notched into its border. Degrade the signal: scanlines, a rolling luminance band, mains flicker, and a periodic channel-split glitch on the headline. Make every transition steps(1) — a machine switches state, it does not ease — and print machine text (hex, session IDs, error counts) as ambient decoration.

**Colour tokens actually used in this page's CSS.**

14 distinct hex values; 2 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#000000` `#00ff41` `#050a06` `#06210d` `#111111` `#1c4d2c` `#286338` `#2f9a45` `#b6ffcb` `#c8002e` `#d9f3e3` `#eafbf0` `#ff003c`

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Brush Script MT`, `Consolas`, `Dancing Script`, `JetBrains Mono`, `Menlo`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `VT323`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `400`, `700`

`@font-face` declarations (8) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `JetBrains Mono` | 400 | normal | swap | `../assets/fonts/jetbrains-mono/jetbrains-mono-400.woff2` |
| `JetBrains Mono` | 400 | normal | swap | `../assets/fonts/jetbrains-mono/jetbrains-mono-400-ext.woff2` |
| `JetBrains Mono` | 700 | normal | swap | `../assets/fonts/jetbrains-mono/jetbrains-mono-400.woff2` |
| `JetBrains Mono` | 700 | normal | swap | `../assets/fonts/jetbrains-mono/jetbrains-mono-400-ext.woff2` |
| `VT323` | 400 | normal | swap | `../assets/fonts/vt323/vt323-400.woff2` |
| `VT323` | 400 | normal | swap | `../assets/fonts/vt323/vt323-400-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **2**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 6 |
| `@keyframes` blocks | 7 |
| `setInterval` | 1 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 2 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/cybercore/SKILL.md` | exists | yes |
| Example website | `../examples/cybercore/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 24 probed pairs pass, in both themes. Worst pair on the page: 
`card label/icon` (light) at 5.51:1 against a 4.5:1 requirement.

---

### Synthwave

`styles/synthwave.html` — 35,541 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Synthwave

**Era / Origin**

> A 2010s revival of imagined 1984: Miami Vice title cards, Outrun arcade cabinets and Tron, rebuilt around synth albums by Kavinsky and Com Truise.

**Color Palette**

> #160b2e — upper night sky #3d1157 — mid-sky dusk in the fixed gradient #ff2d95 — primary neon pink: glow, grid depth lines, borders #ff7a18 — sun's lower band #ffd166 — sun's upper band #22e0ff — grid cyan, horizon line and secondary CTA #f4ecff — pale lavender ink for body text on the dark chips Only the sky gradient inverts under dark mode — the same drive at a different hour, golden and bright by default, deepened to midnight neon under the toggle. The sun, grid, horizon and every tinted-glass panel (nav, hero plate, cards, CTA) hold fixed values in both themes: neon and a windshield's tint don't change colour with the sky behind them.

**Typography**

> Three faces with fixed jobs: Monoton (a neon-tube face) for the logo and CTA heading, Orbitron 700–900 for headlines, card titles and buttons, Chakra Petch for body. All display is uppercase with positive tracking (0.02–0.28em) — synthwave type spreads rather than tightens. Hero at clamp(32px, 6.4vw, 74px)/900, card titles 23px, body 15–17px at 600 weight with 0.1em tracking. Nothing is set below 10px.

**Layout Logic**

> Centre-aligned throughout on a 1080px column, because the composition is a one-point perspective and the vanishing point must stay on the axis. The scene layer is position: fixed with the sun at 26%, horizon at 62% and grid below it, so content scrolls over a stationary landscape. Generous viewport-relative hero padding keeps the headline sitting on the sun.

**Signature Techniques**

> An infinite perspective floor: perspective(320px) rotateX(72deg) on a two-axis repeating gradient, animated by shifting background-position so lines rush toward the viewer. A striped sun built from a circular gradient plus a two-part mask-image that cuts horizontal slits into its lower half. Chrome type: a five-stop vertical gradient through white, cyan, pink and violet with background-clip: text, hardened by a 3px violet drop-shadow. Double-sided neon on every container — an outer glow plus an inset glow in the same hue. A 2px cyan horizon line with a 26px/6px spread shadow, and a translucent plate behind the deck so type stays legible where it crosses the sun.

**Motion/Interaction**

> The landscape never stops: the grid's horizontal lines scroll one 62px cell every 1.9s on a linear loop, giving continuous forward motion, while the sun's drop-shadow breathes between 90px and 130px on a 4.6s ease-in-out cycle — both CSS-only, and muted with every other animation sitewide under prefers-reduced-motion. Interaction is warm and eased at 250–300ms — cards lift 6px and swap their glow from cyan to pink, the CTA button brightens to white; every hover state has a matching :active for touch. The only JavaScript on the page now is the standard toggle wiring: two neon-framed tokens beside the nav links move the nav between the top strip and a fixed left column on a single --rail token, and move the sky between golden hour and midnight on data-theme, both persisting to localStorage; the component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger on close.

**Common Mistake** *(upgraded field)*

> Rendering the sun as a flat gradient circle. The actual technique is a mask-image that cuts horizontal slits into its lower half over a circular gradient; skipping the mask produces a plain sunset graphic, not the genre's signature striped sun.

**Production Caveat** *(upgraded field)*

> The perspective floor animates background-position on a repeating gradient rather than moving a large image or element. A naive implementation that translates a big background image for the same effect costs far more paint and composite work per frame.

**Accessibility Risk** *(upgraded field)*

> The grid-scroll and sun-glow breathing loops are permanent, always-on ambient motion, not triggered by scroll or hover — exactly the category prefers-reduced-motion exists for, and this page's guard is load-bearing given how much of its identity is that constant motion.

**When Not To Use** *(upgraded field)*

> Content-first or long-session reading contexts. Permanent background motion behind readable text is fatiguing well past landing-page length, and the chrome-gradient headline trades away text contrast flexibility for the effect.

**Replication Rules**

> Build the sky first as a fixed vertical gradient from near-black through violet to magenta, and place a striped sun and a cyan horizon line on it. Add a perspective grid with rotateX between 70 and 75deg and animate its background-position so it rushes toward the viewer. Centre everything — a one-point perspective demands the vanishing point stay on the axis. Give display type a chrome gradient via background-clip: text and a hard offset shadow; track all caps outward, never inward. Glow every container twice, outside and inset, in cyan or pink — and keep the mood warm and optimistic rather than grimy.

**Colour tokens actually used in this page's CSS.**

25 distinct hex values; 66 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#000000` `#f4ecff` `#e3d5ff` `#0a0517` `#150a2c` `#160b2e` `#22e0ff` `#3d1157` `#c9b8ec` `#ff2d95` `#111111` `#6a1a63` `#7a2ff7` `#b3246c` `#e7f6ff` `#fef3dc` `#ff4d94` `#ff6f9e` `#ff7a18` `#ff9a76` `#ff9d3c` `#ffd166` `#ffd9a0` `#ffe9f7`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-sky-1` | `#fef3dc` |
| `--th-sky-2` | `#ffd9a0` |
| `--th-sky-3` | `#ff9a76` |
| `--th-sky-4` | `#ff6f9e` |
| `--th-sky-5` | `#ff4d94` |
| `--th-sky-1` | `#0a0517` |
| `--th-sky-2` | `#160b2e` |
| `--th-sky-3` | `#3d1157` |
| `--th-sky-4` | `#6a1a63` |
| `--th-sky-5` | `#b3246c` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Brush Script MT`, `Chakra Petch`, `Consolas`, `Dancing Script`, `Menlo`, `Monoton`, `Orbitron`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `400`, `500`, `600`, `700`, `900`

`@font-face` declarations (11) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Chakra Petch` | 400 | normal | swap | `../assets/fonts/chakra-petch/chakra-petch-400.woff2` |
| `Chakra Petch` | 400 | normal | swap | `../assets/fonts/chakra-petch/chakra-petch-400-ext.woff2` |
| `Chakra Petch` | 600 | normal | swap | `../assets/fonts/chakra-petch/chakra-petch-600.woff2` |
| `Chakra Petch` | 600 | normal | swap | `../assets/fonts/chakra-petch/chakra-petch-600-ext.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Monoton` | 400 | normal | swap | `../assets/fonts/monoton/monoton-400.woff2` |
| `Monoton` | 400 | normal | swap | `../assets/fonts/monoton/monoton-400-ext.woff2` |
| `Orbitron` | 500 | normal | swap | `../assets/fonts/orbitron/orbitron-500.woff2` |
| `Orbitron` | 700 | normal | swap | `../assets/fonts/orbitron/orbitron-500.woff2` |
| `Orbitron` | 900 | normal | swap | `../assets/fonts/orbitron/orbitron-500.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **6**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 10 |
| `@keyframes` blocks | 4 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 2 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/synthwave/SKILL.md` | exists | yes |
| Example website | `../examples/synthwave/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

3 of 24 probed pairs fail; 2 could not be resolved automatically.

| Mode | Element | min | median | Needs | Verdict |
|---|---|---|---|---|---|
| light | nav link | 3.06 | 3.06 | 4.5 | FAIL |
| light | hero h1 | — | — | — | UNRESOLVED — no glyph pixels isolated |
| light | hero Explore btn | 2.63 | 2.68 | 3.0 | FAIL |
| light | CTA heading | 2.66 | 2.95 | 3.0 | FAIL |
| dark | hero h1 | — | — | — | UNRESOLVED — no glyph pixels isolated |

- **light / nav link** — rgb(34,224,255) on rgb(123,110,112), 3.06:1 worst pixel (median 3.06:1) against 4.5:1 required. Text is 12px at weight 700.
- **light / hero Explore btn** — rgb(255,255,255) on rgb(239,129,98), 2.63:1 worst pixel (median 2.68:1) against 3.0:1 required. Text is 14px at weight 700.
- **light / CTA heading** — rgb(255,255,255) on rgb(249,98,158), 2.66:1 worst pixel (median 2.95:1) against 3.0:1 required. Text is 62px at weight 700.

- **light / hero h1** — no glyph pixels isolated. The glyph fill could not be neutralised, which means the visible letterform is not being painted by `color` or a `background-clip` fill: it is drawn by `text-shadow` and/or `-webkit-text-stroke`. Automated measurement does not apply; this pair needs a human judgement call.
- **dark / hero h1** — no glyph pixels isolated. The glyph fill could not be neutralised, which means the visible letterform is not being painted by `color` or a `background-clip` fill: it is drawn by `text-shadow` and/or `-webkit-text-stroke`. Automated measurement does not apply; this pair needs a human judgement call.

---

### Graffiti

`styles/graffiti.html` — 40,335 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Graffiti

**Era / Origin**

> New York and Philadelphia, late 1960s–70s — handstyle tags on subway cars evolving into throw-ups and full-colour pieces, and a global visual language by the 1980s. Handstyle writing began specifically as Black and Puerto Rican youth culture, one of hip-hop's four elements, and the same marks referenced here as decoration carry a long history of being criminalised — worth naming rather than treating purely as a texture to borrow.

**Color Palette**

> #3c3c40 — concrete wall, the surface everything is painted on #0c0c0e — outline black, on every letterform without exception #12c8ff — cyan fill of the main piece #ffd400 — yellow second fill and the logo #ff2f3c — red throwie and CTA button #a83bff — violet handstyle tag over the top #f2f2ef — chalk ink for body text, sticker fills and highlights Only the wall inverts under dark mode — the same daylight concrete going into shadow. The outline, the fills, chalk and every sticker or chip surface stay fixed regardless of theme: spray paint and a slapped-on sticker don't change colour when the ambient light does.

**Typography**

> Bungee for all piece lettering (a heavy display face that survives a 9px stroke), Permanent Marker for handstyle tags, Oswald Light/Bold for body and labels. Display runs clamp(38px, 8vw, 104px) uppercase at 0.94 leading, always with -webkit-text-stroke and paint-order: stroke fill so the outline sits behind the fill rather than eating it. Body stays a modest 15.5–17px, because on a wall the letters are the artwork and the text is just information.

**Layout Logic**

> A 1120px wall with content stacked flush left and every element rotated between −3deg and +2deg — a wall is painted in passes, not laid out. Cards sit on a normal three-column grid with a 24px gutter but each carries a different rotation and a different 10px colour cap, and tags are absolutely positioned over the top of everything as the last layer.

**Signature Techniques**

> Letterforms built in layers: colour fill, -webkit-text-stroke black outline, hard offset shadow, and a wide same-hue glow for aerosol overspray. A five-layer concrete wall — two blotch patterns on offset tiles, two directional grains, and a diagonal base gradient. Drips as elements with a rounded bottom plus a circular ::after bead, animating their height downward on hover. Nav links as slapped stickers: chalk-white boxes, 3px black borders, hard shadows, each at a different angle. A stencil block outlined in 5px dashed chalk with a 135° hatch, standing in for spray-through card.

**Motion/Interaction**

> JS generates the drip row under the piece — 11 drips at randomised x positions under the painted letters, heights (14–58px) and widths — so the paint runs differently on every load; these are static per-load shapes, not animated. Clicking Explore fires an aerosol burst: 60 particles of random size and hue scattered in a cone via the Web Animations API, fading over 700–1100ms and cleaning up after themselves — checked live against prefers-reduced-motion at click time and skipped outright under it, since a 60-particle burst is exactly the kind of motion that guard exists to stop and a CSS mute can't reach an imperative element.animate() call. Card hovers run a fresh drip down 44px over 550ms; that and every other hover transition are muted sitewide under reduced motion. All hover transitions are 120ms linear — spray paint does not ease. Two stickers beside the nav links match its own language: one moves the nav between the top strip and a fixed left column on a single --rail token, the other moves the wall between daylight and shadow on data-theme; both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger on close.

**Common Mistake** *(upgraded field)*

> Drawing every paint drip identically. The page generates 11 drips at randomised position, height and width per load specifically because "paint that runs identically every time reads as a font, not a can," per its own Replication Rules; a fixed, reused drip graphic undercuts that illusion.

**Production Caveat** *(upgraded field)*

> The aerosol burst (60 particles via the Web Animations API) is checked against prefers-reduced-motion live at the moment of the click, not just once on page load. A port that only checks the media query at load time keeps firing full bursts for a user who enables reduced motion mid-session.

**Accessibility Risk** *(upgraded field)*

> The clearest statement on this site of a style carrying real-world weight beyond decoration, now written into its own Era/Origin field: handstyle writing began as Black and Puerto Rican youth culture, and the marks referenced here carry "a long history of being criminalised" — worth naming in any production use of this aesthetic, not just this demo page.

**When Not To Use** *(upgraded field)*

> Any brand or product context without a genuine connection to the culture and history the aesthetic comes from. Borrowing aerosol and handstyle visual language as pure decoration, without the acknowledgment this page itself models, is exactly the "texture to borrow" framing its own documentation warns against.

**Replication Rules**

> Paint the wall first — a grainy, blotched, unevenly lit concrete ground — because graffiti on a flat colour reads as clip art. Outline every letterform in heavy black using -webkit-text-stroke with paint-order: stroke fill, then add a hard offset shadow and a soft same-hue glow for overspray. Rotate everything ±1–3deg and let layers sit in the order they were applied, with handstyle tags on top of finished work. Use four or five saturated aerosol colours against grey; never tint the wall itself. Add drips and randomise them per load — paint that runs identically every time reads as a font, not a can.

**Colour tokens actually used in this page's CSS.**

18 distinct hex values; 37 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#f2f2ef` `#ffffff` `#0c0c0e` `#111111` `#12c8ff` `#1c1c1e` `#2b2b2f` `#3c3c40` `#4a4a4f` `#5cff54` `#a83bff` `#a8a8a2` `#b04dff` `#c2c2bc` `#d8d8d2` `#d9d9d4` `#ff2f3c` `#ffd400`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-wall` | `#c2c2bc` |
| `--th-wall-lo` | `#a8a8a2` |
| `--th-concrete` | `#d8d8d2` |
| `--th-ink` | `#1c1c1e` |
| `--th-wall` | `#3c3c40` |
| `--th-wall-lo` | `#2b2b2f` |
| `--th-concrete` | `#4a4a4f` |
| `--th-ink` | `#f2f2ef` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Brush Script MT`, `Bungee`, `Consolas`, `Dancing Script`, `Menlo`, `Oswald`, `Permanent Marker`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `cursive`, `monospace`, `sans-serif`, `ui-monospace`

Explicit `font-weight` values: `300`, `400`, `500`, `700`

`@font-face` declarations (11) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Bungee` | 400 | normal | swap | `../assets/fonts/bungee/bungee-400.woff2` |
| `Bungee` | 400 | normal | swap | `../assets/fonts/bungee/bungee-400-ext.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Oswald` | 300 | normal | swap | `../assets/fonts/oswald/oswald-300.woff2` |
| `Oswald` | 300 | normal | swap | `../assets/fonts/oswald/oswald-300-ext.woff2` |
| `Oswald` | 500 | normal | swap | `../assets/fonts/oswald/oswald-300.woff2` |
| `Oswald` | 500 | normal | swap | `../assets/fonts/oswald/oswald-300-ext.woff2` |
| `Oswald` | 700 | normal | swap | `../assets/fonts/oswald/oswald-300.woff2` |
| `Oswald` | 700 | normal | swap | `../assets/fonts/oswald/oswald-300-ext.woff2` |
| `Permanent Marker` | 400 | normal | swap | `../assets/fonts/permanent-marker/permanent-marker-400.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **3**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 10 |
| `@keyframes` blocks | 2 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 3 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/graffiti/SKILL.md` | exists | yes |
| Example website | `../examples/graffiti/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 30 probed pairs pass, in both themes. Worst pair on the page: 
`card body copy` (light) at 4.95:1 against a 4.5:1 requirement.

---

### Gothic

`styles/gothic.html` — 43,961 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Gothic

**Era / Origin**

> 12th–16th century European cathedral architecture and blackletter manuscript hands, filtered through the 19th-century Gothic Revival of Pugin and Ruskin. Blackletter carries a second, more recent history beyond its ecclesiastical use — 20th-century nationalist movements, most notoriously Nazi Germany, adopted it as a national script before banning it as "un-German" in 1941 — worth naming rather than treating the letterform as a neutral, decorative "spooky" font.

**Color Palette**

> #0b0a0d — nave darkness, the page ground #16141a — stone panels and arch fills #e9e3d6 — bone limewash for all lettering #7a1f2b — stained-glass oxblood, used only in glass and on hover #2b3a6b — stained-glass sapphire in the rose window #b39355 — tarnished gold tracery, rules and small caps

**Typography**

> UnifrakturMaguntia (a textura blackletter) for the logo, headline, card titles and CTA, paired with EB Garamond for running text and Cinzel small caps for navigation and buttons. Blackletter is never tracked and never set below 27px because the dense verticals close up; Cinzel capitals run 10–11px at a very wide 0.30–0.34em. Body is 16.5–19px, italic in the deck, at 1.7 line-height so the light column of text contrasts the dark ground.

**Layout Logic**

> Centred on a single axis inside a 980px wrapper, with proportions deliberately vertical: cards carry 88px of top padding above their content so the arch has height to rise through, and sections are separated by 78–90px. Nav items are divided by 1px vertical rules rather than gaps, forming a rood screen of thin columns.

**Signature Techniques**

> Lancet arches cut with a 13-vertex clip-path: polygon() whose shoulders curve inward to meet at a point, with a shallower 5-vertex gable on buttons. A rose window built from a 12-stop conic-gradient with two concentric inset rings and an outward oxblood glow. Stone drawn with a 1px vertical striation gradient over 2px horizontal courses, both at very low alpha. A heavy inset 0 0 240px 60px vignette that crushes the edges of the page to black. A rotated 14px square straddling the CTA's top border as a crocket, marking the apex of the section. The Explore button's border runs on its own edge token rather than the shared tracery alpha every other line on the page draws from — gilt metal against aged stone, not another mullion.

**Motion/Interaction**

> A fixed torchlight layer tracks the pointer: JS writes --tx/--ty and a 340px radial wash at 7.5% bone lifts the stone wherever the cursor rests, leaving the rest of the nave dark. The wash is written straight from the pointer with no easing and no animation loop, so it is direct manipulation rather than motion and needs no reduced-motion guard; every other transition on the page is CSS and is muted by the sitewide rule. Transitions are long — 500ms — for a heavy, architectural feel: arches lighten their stone gradient on hover, buttons fill with oxblood and gain a red glow, nav capitals warm to gold. Press is the exception, overridden to 120ms so a touch tap is answered inside the tap. Two inscribed controls stand centred below the rood screen: one turns that same screen through ninety degrees against the north wall by changing a single --rail token, the other moves the hour between day and compline — the ground deepens, the vignette closes and the tracery tarnishes, while the lettering holds its value. Both persist to localStorage. The component reference raises a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger.

**Common Mistake** *(upgraded field)*

> Setting blackletter at small sizes for "authenticity." This page's own rule caps it at 27px minimum because the dense verticals close up below that — small blackletter body text is illegible, not authentic.

**Production Caveat** *(upgraded field)*

> The torchlight pointer-tracking wash writes custom properties directly with no easing or animation loop, so — per this page's own note — it needs no reduced-motion guard. Any future version of this effect that adds easing or a loop would need one, since that exemption is specific to the current direct-manipulation implementation.

**Accessibility Risk** *(upgraded field)*

> Named directly in this page's own Design Points now: blackletter carries a real 20th-century political history — adopted, then banned, by Nazi Germany — beyond its ecclesiastical origin, worth the same care in any real product as the imagery choices around it, not just a "spooky font" pick.

**When Not To Use** *(upgraded field)*

> Products needing broad legibility at small sizes or fast scanning (mobile-first utility apps, dense data tables). A 27px display-type floor and a centred single-axis layout are built for a stately hero, not compact, information-dense screens.

**Replication Rules**

> Make the page vertical: pointed clip-path arches on every container (curve the shoulders with extra vertices — a plain triangle reads as a house, not a cathedral), tall top padding, and sections divided by thin vertical rules rather than horizontal bands. Set display type in blackletter at 27px or larger with no letter-spacing, and pair it with an old-style serif for text and Roman capitals for navigation. Keep the ground near-black with a heavy inset vignette, and let bone-white type be the only bright value. Admit colour only as "stained glass" — deep oxblood and sapphire inside one ornamental element and on hover states, never as a page-wide fill. Use long 500ms transitions and a single soft light source that reveals texture; nothing should snap or bounce.

**Colour tokens actually used in this page's CSS.**

17 distinct hex values; 29 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#ffffff` `#050407` `#0b0a0d` `#100e14` `#111111` `#16141a` `#191722` `#221e2b` `#221f28` `#232e57` `#2b2733` `#2b3a6b` `#671a24` `#7a1f2b` `#a5854a` `#b39355` `#e9e3d6`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-night` | `#0b0a0d` |
| `--th-stone` | `#16141a` |
| `--th-stone-hi` | `#221f28` |
| `--th-stone-lit` | `#2b2733` |
| `--th-bone` | `#e9e3d6` |
| `--th-oxblood` | `#7a1f2b` |
| `--th-sapphire` | `#2b3a6b` |
| `--th-gold` | `#b39355` |
| `--th-trace-1` | `rgba(179,147,85,.55)` |
| `--th-trace-2` | `rgba(179,147,85,.35)` |
| `--th-trace-3` | `rgba(179,147,85,.22)` |
| `--th-trace-4` | `rgba(179,147,85,.18)` |
| `--th-halo` | `rgba(179,147,85,.35)` |
| `--th-halo-soft` | `rgba(179,147,85,.24)` |
| `--th-glow-red` | `rgba(122,31,43,.5)` |
| `--th-ink-2` | `rgba(233,227,214,.66)` |
| `--th-ink-3` | `rgba(233,227,214,.62)` |
| `--th-ink-4` | `rgba(233,227,214,.6)` |
| `--th-torch` | `rgba(232,227,214,.075)` |
| `--th-vignette` | `rgba(0,0,0,.92)` |
| `--th-crown` | `rgba(179,147,85,.10)` |
| `--th-scan` | `rgba(255,255,255,.014)` |
| `--th-rib` | `rgba(0,0,0,.5)` |
| `--th-btn-edge` | `rgba(179,147,85,.92)` |
| `--th-night` | `#050407` |
| `--th-stone` | `#100e14` |
| `--th-stone-hi` | `#191722` |
| `--th-stone-lit` | `#221e2b` |
| `--th-oxblood` | `#671a24` |
| `--th-sapphire` | `#232e57` |
| `--th-gold` | `#a5854a` |
| `--th-trace-1` | `rgba(165,133,74,.62)` |
| `--th-trace-2` | `rgba(165,133,74,.40)` |
| `--th-trace-3` | `rgba(165,133,74,.26)` |
| `--th-trace-4` | `rgba(165,133,74,.20)` |
| `--th-halo` | `rgba(165,133,74,.28)` |
| `--th-halo-soft` | `rgba(165,133,74,.18)` |
| `--th-glow-red` | `rgba(103,26,36,.55)` |
| `--th-torch` | `rgba(232,227,214,.055)` |
| `--th-vignette` | `rgba(0,0,0,.96)` |
| `--th-crown` | `rgba(165,133,74,.07)` |
| `--th-btn-edge` | `rgba(165,133,74,1)` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Brush Script MT`, `Cinzel`, `Consolas`, `Dancing Script`, `EB Garamond`, `Georgia`, `Menlo`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `UnifrakturMaguntia`, `cursive`, `monospace`, `sans-serif`, `serif`, `ui-monospace`

Explicit `font-weight` values: `400`, `500`, `700`

`@font-face` declarations (11) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Cinzel` | 400 | normal | swap | `../assets/fonts/cinzel/cinzel-400-0a6ccf.woff2` |
| `Cinzel` | 400 | normal | swap | `../assets/fonts/cinzel/cinzel-400-ext-aec1a9.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `EB Garamond` | 400 | normal | swap | `../assets/fonts/eb-garamond/eb-garamond-400.woff2` |
| `EB Garamond` | 400 | normal | swap | `../assets/fonts/eb-garamond/eb-garamond-400-ext.woff2` |
| `EB Garamond` | 400 | italic | swap | `../assets/fonts/eb-garamond/eb-garamond-400-italic.woff2` |
| `EB Garamond` | 400 | italic | swap | `../assets/fonts/eb-garamond/eb-garamond-400-italic-ext.woff2` |
| `EB Garamond` | 500 | normal | swap | `../assets/fonts/eb-garamond/eb-garamond-400.woff2` |
| `EB Garamond` | 500 | normal | swap | `../assets/fonts/eb-garamond/eb-garamond-400-ext.woff2` |
| `UnifrakturMaguntia` | 400 | normal | swap | `../assets/fonts/unifrakturmaguntia/unifrakturmaguntia-400.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **8**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 12 |
| `@keyframes` blocks | 0 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 0 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/gothic/SKILL.md` | exists | yes |
| Example website | `../examples/gothic/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 24 probed pairs pass, in both themes. Worst pair on the page: 
`design-points label` (dark) at 5.15:1 against a 4.5:1 requirement.

---

### Mixed Media

`styles/mixed-media.html` — 49,449 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Mixed Media

**Era / Origin**

> Dada and Cubist papier collé (1912–20s) by way of punk photocopy zines (1976 onward) and the contemporary riso-print revival — several reproduction processes deliberately colliding on one sheet.

**Color Palette**

> #ece7dd — newsprint stock, the base sheet #141414 — photocopy black for type, keylines and the halftone screen #ff4f79 — riso fluorescent pink plate #0f4cf0 — riso blue plate #ffd400 — riso yellow plate

**Typography**

> Three families used simultaneously and per-word rather than per-role: Bebas Neue (condensed poster), Libre Baskerville (book serif, roman and italic) and DM Sans (grotesque). The hero headline is a ransom note — each word gets its own face, size multiplier, background plate and rotation, so is is a smaller italic serif on yellow while Design is condensed caps knocked out of black. Body is 12.5–14px Baskerville at 1.8; labels are 10–13px DM Sans bold at 0.12–0.2em.

**Layout Logic**

> A 1080px sheet holding cuttings pasted at slight angles (−2.4deg to +2.6deg) with a 22px gutter. Depth is explicit: coloured plates sit at the bottom, the halftone screen over them, and all type at z-index: 2 — every block declares its stacking order because the style is about layers meeting.

**Signature Techniques**

> A 6px halftone screen — radial-gradient(#141414 34%, transparent 36%) — laid over blocks in mix-blend-mode: multiply. Riso overprint: irregular colour blots also set to multiply, so where pink crosses blue a third colour appears rather than one hiding the other. Photocopy grain from two fine repeating gradients at 3.5–5% alpha across the whole page. Torn edges cut with a many-vertex clip-path on the nav strip, plus 2px keylines and hard offset shadows on every cutting. Painted washes made from oversized ellipses with asymmetric border-radius, bleeding past their container's edge.

**Motion/Interaction**

> All transitions use steps(2), so state changes jump like a two-pass print rather than easing — including the pressed state on every control, which reuses that same 160ms step so a touch tap is answered inside the tap. JS handles misregistration: hovering a card offsets its coloured plate by a randomised −6 to +6px on both axes, as if that plate went through the press out of alignment, and it snaps back on leave; the plate is a decorative aria-hidden layer, so no type ever moves. Clicking Explore re-shuffles the rotation of every ransom-note word, re-pasting the headline. Both are one-shot writes driven by a discrete event rather than animation loops, so nothing keeps moving on its own; the CSS steps that carry them are muted by the sitewide reduced-motion rule. Two stamped controls are pasted onto the tape strip: one moves that strip from the head of the sheet to the left margin through a single --rail token, the other changes the stock — the same three riso inks pulled on black stock instead of newsprint, with the overprint operator following the stock so plates still build a third colour where they cross rather than hiding one another; on black stock the painted washes are screened back to a lower ink density and every small cutting takes the 2px keyline the larger ones already carry, because a black cutting on black stock has no edge of its own. Both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to its trigger.

**Common Mistake** *(upgraded field)*

> Layering effects with normal blend mode instead of multiply. The "third colour where plates overlap" effect is entirely a mix-blend-mode: multiply property; stacking coloured layers at normal blend mode just produces flat overlap, not the riso-overprint interaction that defines the style.

**Production Caveat** *(upgraded field)*

> Multiply only holds on light stock — the page explicitly swaps to screen blend mode under dark theme, since multiply resolves to solid black on a dark ground. Porting this technique into a dark-mode-capable product needs that same conditional swap, not multiply everywhere.

**Accessibility Risk** *(upgraded field)*

> The misregistration hover effect (a card's coloured plate offsets randomly on hover) is implemented as a decorative aria-hidden layer, with no real type ever moving. Letting actual text participate in that offset, instead of keeping it purely decorative, would make body copy jitter and become harder to read on hover.

**When Not To Use** *(upgraded field)*

> Brand contexts requiring visual consistency across touchpoints. Three simultaneous typefaces per word, randomised plate misregistration and grain layered per element are deliberately inconsistent by design, which fights template-based or multi-channel systems that need predictable output.

**Replication Rules**

> Combine at least three different reproduction processes — halftone, flat riso plate, photocopy grain, torn paper — and let each one stay visible. Set colour plates to mix-blend-mode: multiply so overlaps make new colours; never let one plate simply cover another. Multiply only holds on light stock — over black stock it resolves to black, so dark mode swaps the token to screen, the equivalent move for ink layered on a dark ground. Build headlines as ransom notes: change typeface, size, background and angle on every word. Give every cutting a 2px keyline, a hard offset shadow and a small rotation, and let washes bleed past the edges. Keep motion mechanical — steps() transitions and misregistration offsets — because the subject is printing, not animation.

**Colour tokens actually used in this page's CSS.**

8 distinct hex values; 12 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#141414` `#ece7dd` `#ffffff` `#0f4cf0` `#111111` `#17140f` `#ff4f79` `#ffd400`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-stock` | `#ece7dd` |
| `--th-body-ink` | `#141414` |
| `--th-keyline` | `#141414` |
| `--th-tape` | `rgba(226,222,206,.86)` |
| `--th-grain-a` | `rgba(20,20,20,.05)` |
| `--th-grain-b` | `rgba(20,20,20,.035)` |
| `--th-offset` | `rgba(20,20,20,.16)` |
| `--th-offset-s` | `rgba(20,20,20,.14)` |
| `--th-blend` | `multiply` |
| `--th-wash-y` | `.75` |
| `--th-wash-b` | `.6` |
| `--th-wash-p` | `.7` |
| `--th-chip-edge` | `transparent` |
| `--th-stock` | `#17140f` |
| `--th-body-ink` | `#ece7dd` |
| `--th-keyline` | `#ece7dd` |
| `--th-tape` | `rgba(38,34,27,.9)` |
| `--th-grain-a` | `rgba(236,231,221,.05)` |
| `--th-grain-b` | `rgba(236,231,221,.035)` |
| `--th-offset` | `rgba(236,231,221,.14)` |
| `--th-offset-s` | `rgba(236,231,221,.12)` |
| `--th-blend` | `screen` |
| `--th-wash-y` | `.22` |
| `--th-wash-b` | `.52` |
| `--th-wash-p` | `.36` |
| `--th-chip-edge` | `#ece7dd` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Bebas Neue`, `Brush Script MT`, `Consolas`, `DM Sans`, `Dancing Script`, `Libre Baskerville`, `Menlo`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `cursive`, `monospace`, `sans-serif`, `serif`, `ui-monospace`

Explicit `font-weight` values: `400`, `700`

`@font-face` declarations (12) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Bebas Neue` | 400 | normal | swap | `../assets/fonts/bebas-neue/bebas-neue-400.woff2` |
| `Bebas Neue` | 400 | normal | swap | `../assets/fonts/bebas-neue/bebas-neue-400-ext.woff2` |
| `DM Sans` | 400 | normal | swap | `../assets/fonts/dm-sans/dm-sans-400.woff2` |
| `DM Sans` | 400 | normal | swap | `../assets/fonts/dm-sans/dm-sans-400-ext.woff2` |
| `DM Sans` | 700 | normal | swap | `../assets/fonts/dm-sans/dm-sans-400.woff2` |
| `DM Sans` | 700 | normal | swap | `../assets/fonts/dm-sans/dm-sans-400-ext.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Libre Baskerville` | 400 | italic | swap | `../assets/fonts/libre-baskerville/libre-baskerville-400-italic.woff2` |
| `Libre Baskerville` | 400 | italic | swap | `../assets/fonts/libre-baskerville/libre-baskerville-400-italic-ext.woff2` |
| `Libre Baskerville` | 700 | normal | swap | `../assets/fonts/libre-baskerville/libre-baskerville-700.woff2` |
| `Libre Baskerville` | 700 | normal | swap | `../assets/fonts/libre-baskerville/libre-baskerville-700-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **2**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | no |
| `View style` affordance | n/a |
| CSS `transition` declarations | 9 |
| `@keyframes` blocks | 0 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 0 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/mixed-media/SKILL.md` | exists | yes |
| Example website | `../examples/mixed-media/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

All 24 probed pairs pass, in both themes. Worst pair on the page: 
`card body copy` (dark) at 7.85:1 against a 4.5:1 requirement.

---

### Wabi Sabi

`styles/wabi-sabi.html` — 46,156 bytes

**Content parity.**

At baseline on every checked element — nav `Atlas / Work / About / Contact`, headline 
"Design is how it feels to use.", hero copy "A study in visual language, one style at a time.", hero button `Explore`, the three cards 
(Grid/Structure, Split/Contrast, Pulse/Rhythm with their fixed body lines), and CTA 
"Start building." / "Get in touch". No override needed and none present.

**Design Points.** 12/12 fields present. All four upgraded fields 
(Common Mistake / Production Caveat / Accessibility Risk / When Not To Use) present.

**Style Name**

> Wabi Sabi

**Era / Origin**

> Japan, 15th–16th century — the tea aesthetic of Murata Jukō and Sen no Rikyū, valuing the weathered, asymmetric and incomplete over the new and symmetrical. Wabi-sabi is inseparable from Zen Buddhist thought — Rikyū, its tea-ceremony source, was a religious figure and philosopher, not a decorator — worth naming rather than letting the term circulate as Westernised lifestyle-marketing shorthand for rustic minimalism.

**Color Palette**

> #e9e3d7 — lime-washed plaster wall, the page ground #33302a — sumi ink for type; warm, never black #5f5b52 — ash grey for body copy and small labels #bda98f — unglazed clay for vessels #7d8471 — aged bronze-green #a9884f — kintsugi gold, used only along breaks

**Typography**

> Shippori Mincho — a Japanese mincho with visibly uneven stroke weight — for all headings, paired with Karla Light for body. Nothing is set above 500 weight. Line-height is unusually generous (1.62 on the headline, 2.05–2.1 on body) so the space between lines carries as much presence as the type. Headings are tracked slightly open (0.02–0.3em) with matching text-indent; body sits at 14.5–15px. Nav labels are lowercase, not capitals — capitals assert, and this style does not.

**Layout Logic**

> Asymmetry is systematic. The hero is 1.42fr / 0.58fr, the cards 1.06 / 0.92 / 1.02fr, and the CTA 0.44 / 1.56fr — no two columns share a width. The three cards are pushed down by 0px, 46px and 18px so their tops never align. Vertical space is enormous and viewport-relative (clamp(90px, 17vh, 190px)), because 間 — the interval — is the composition's main material.

**Signature Techniques**

> Hand-formed rims: buttons and vessels use eight-value asymmetric border-radius (48% 52% 47% 53% / 54% 46% 55% 45%) so no edge is a true arc. A kintsugi seam — a 2px gold gradient with a gap in it — running down the headline, repairing a break rather than hiding it. An ensō: a circle drawn with one border side removed and another faded, left deliberately open. Plaster texture from two low-alpha repeating gradients at 74° and 4°, never a flat fill. Clay vessels of three different silhouettes, each cracked by a single hairline gold line.

**Motion/Interaction**

> Slow to the point of near-stillness. An IntersectionObserver fades each block in over 2.4s with an 8px rise, staggered 220ms apart, and unobserves so nothing repeats. Hovers take 1.1–1.6s: the button's asymmetric radius morphs to a different asymmetric radius, as though the vessel were re-thrown. The ensō rotates once every 90 seconds — slow enough that motion is felt rather than seen. A press is the exception to the slowness and has to be: a finger is gone long before a 1.2s ease has moved, so pressing any control delivers the state it would otherwise settle into — the filled form, the darkened link — at once, and lets it relax back at the page's own pace when the finger lifts. Nothing here loops or carries momentum: the reveal is a single write per block that then stops observing, and every duration above is a CSS transition or animation, so the sitewide reduced-motion rule mutes all of it without the page needing to test for it. Two marks are pressed into the nav strip: one turns that strip through ninety degrees to stand in the left margin, moving the whole sheet by a single --ma token — 間, the interval, made structural; the other changes the hour. Dusk is not an inversion but the same room later: the wall goes unlit, the ink becomes the lit thing so it still reads, the matter only darkens, and the kintsugi is the one value that rises, because gold is what still catches a low light. Both persist to localStorage. The component reference opens a native <dialog> with showModal(), which supplies the focus trap, Escape and an inert background, and returns focus to the control that opened it.

**Common Mistake** *(upgraded field)*

> Treating "imperfect" as "unfinished," or applying it as a filter over an otherwise-symmetric layout. This page's asymmetry is systematic — no two columns share a width, no two cards align vertically — a deliberate, calculated irregularity, not sloppiness left unresolved.

**Production Caveat** *(upgraded field)*

> Eight-value asymmetric border-radius on every rounded form is a real per-component authoring cost — each new element needs its own bespoke set of values, not a reused token, to keep "no edge is a true arc." Easy to skip under deadline pressure and collapse back to a symmetric radius.

**Accessibility Risk** *(upgraded field)*

> Documented directly on the page: warm sumi-ink text on a lime-washed ground and its close relatives sit close enough to the contrast floor that any new secondary-text colour needs an explicit check, not an assumption it inherits enough contrast from the existing warm-neutral palette.

**When Not To Use** *(upgraded field)*

> High-density transactional UI — checkout, forms, dashboards. The 1.1–2.4s transitions and generous, unequal whitespace are the entire point of the style, and both directly cost time and predictability where users want speed and consistency.

**Replication Rules**

> Give no two columns the same width and no two sibling blocks the same vertical offset — asymmetry must be systematic, not occasional. Never use a true circle or a plain rectangle: every rounded form takes an eight-value asymmetric border-radius. Treat empty space as the main material — viewport-relative section padding and line-heights around 2. Use warm earthen neutrals with a single metallic that appears only along cracks and breaks; keep ink warm, never #000. Make everything slow: 1.1–2.4s transitions, and let imperfection change rather than resolve — a morphing irregular edge, not a snap to a perfect one.

**Colour tokens actually used in this page's CSS.**

18 distinct hex values; 20 `rgb()/rgba()` and 0 `hsl()/hsla()` declarations.

`#1f1d19` `#f2ede2` `#ffffff` `#111111` `#282520` `#33302a` `#55514a` `#5d6353` `#5f5b52` `#6f6a60` `#7d8471` `#8f7b62` `#a9884f` `#aaa398` `#bda98f` `#c9a55f` `#e7e1d4` `#e9e3d7`

Theme source-of-truth tokens (`--th-*`, the values every other token aliases):

| Token | Value |
|---|---|
| `--th-sumi` | `#33302a` |
| `--th-ash` | `#5f5b52` |
| `--th-on-ink` | `#f2ede2` |
| `--th-plaster` | `#e9e3d7` |
| `--th-washi` | `#f2ede2` |
| `--th-lit` | `rgba(255,253,247,.75)` |
| `--th-shade` | `rgba(189,169,143,.22)` |
| `--th-grain-a` | `rgba(120,105,80,.035)` |
| `--th-grain-b` | `rgba(120,105,80,.028)` |
| `--th-hair` | `rgba(51,48,42,.16)` |
| `--th-rim` | `rgba(51,48,42,.62)` |
| `--th-enso` | `rgba(51,48,42,.35)` |
| `--th-tint` | `rgba(51,48,42,.06)` |
| `--th-clay` | `#bda98f` |
| `--th-moss` | `#7d8471` |
| `--th-slip` | `#6f6a60` |
| `--th-kintsugi` | `#a9884f` |
| `--th-sumi` | `#e7e1d4` |
| `--th-ash` | `#aaa398` |
| `--th-on-ink` | `#1f1d19` |
| `--th-plaster` | `#1f1d19` |
| `--th-washi` | `#282520` |
| `--th-lit` | `rgba(255,246,225,.055)` |
| `--th-shade` | `rgba(0,0,0,.30)` |
| `--th-grain-a` | `rgba(235,226,206,.030)` |
| `--th-grain-b` | `rgba(235,226,206,.024)` |
| `--th-hair` | `rgba(231,225,212,.18)` |
| `--th-rim` | `rgba(231,225,212,.52)` |
| `--th-enso` | `rgba(231,225,212,.32)` |
| `--th-tint` | `rgba(231,225,212,.08)` |
| `--th-clay` | `#8f7b62` |
| `--th-moss` | `#5d6353` |
| `--th-slip` | `#55514a` |
| `--th-kintsugi` | `#c9a55f` |

**Typography.**

Families referenced: `-apple-system`, `14px/1.2 system-ui`, `Brush Script MT`, `Consolas`, `Dancing Script`, `Karla`, `Menlo`, `SFMono-Regular`, `Segoe Script`, `Segoe UI`, `Shippori Mincho`, `cursive`, `monospace`, `sans-serif`, `serif`, `ui-monospace`

Explicit `font-weight` values: `300`, `400`, `500`, `700`

`@font-face` declarations (10) — all self-hosted under `assets/fonts/`:

| Family | Weight | Style | `font-display` | Source |
|---|---|---|---|---|
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700.woff2` |
| `Dancing Script` | 700 | normal | swap | `../assets/fonts/dancing-script/dancing-script-700-ext.woff2` |
| `Karla` | 300 | normal | swap | `../assets/fonts/karla/karla-300.woff2` |
| `Karla` | 300 | normal | swap | `../assets/fonts/karla/karla-300-ext.woff2` |
| `Karla` | 400 | normal | swap | `../assets/fonts/karla/karla-300.woff2` |
| `Karla` | 400 | normal | swap | `../assets/fonts/karla/karla-300-ext.woff2` |
| `Shippori Mincho` | 400 | normal | swap | `../assets/fonts/shippori-mincho/shippori-mincho-400.woff2` |
| `Shippori Mincho` | 400 | normal | swap | `../assets/fonts/shippori-mincho/shippori-mincho-400-ext.woff2` |
| `Shippori Mincho` | 500 | normal | swap | `../assets/fonts/shippori-mincho/shippori-mincho-500.woff2` |
| `Shippori Mincho` | 500 | normal | swap | `../assets/fonts/shippori-mincho/shippori-mincho-500-ext.woff2` |

**Images / media.**

`<img>`: **zero**. `<svg>`: **zero**. `<canvas>`: **zero**.

CSS `background`/`background-image` declarations using `url()` or a gradient: **4**. 
These are the page's only graphics — all are CSS-generated (gradients, repeating 
patterns, data-URI noise), not linked image files.

**Interactive / motion behaviours.**

| Behaviour | Present |
|---|---|
| Skip link | yes |
| `<main>` landmark | yes |
| Theme toggle | yes (`#theme-toggle`) |
| Nav rail toggle | yes (`#nav-toggle`) |
| Native `<dialog>` | yes, opened with `showModal()` |
| Real `<table>` | no |
| `IntersectionObserver` reveal | yes — observer adds .in |
| `View style` affordance | n/a |
| CSS `transition` declarations | 15 |
| `@keyframes` blocks | 1 |
| `setInterval` | 0 |
| `requestAnimationFrame` | 0 |
| `prefers-reduced-motion` guards | 0 |
| `localStorage` references | 3 |

**"Download skill" and "Example website" buttons.**

| Button | href | Target in working tree | In deployed commit |
|---|---|---|---|
| Download skill | `../skills/wabi-sabi/SKILL.md` | exists | yes |
| Example website | `../examples/wabi-sabi/index.html` | exists | yes |
| All styles | `../index.html` | exists | yes |

Live HTTP status not obtainable — see the egress limitation in Step 0.

**WCAG AA contrast.**

0 of 24 probed pairs fail; 1 could not be resolved automatically.

| Mode | Element | min | median | Needs | Verdict |
|---|---|---|---|---|---|
| light | CTA heading | — | — | — | UNRESOLVED — no glyph pixels isolated |


- **light / CTA heading** — no glyph pixels isolated. The glyph fill could not be neutralised, which means the visible letterform is not being painted by `color` or a `background-clip` fill: it is drawn by `text-shadow` and/or `-webkit-text-stroke`. Automated measurement does not apply; this pair needs a human judgement call.

---
## STEP 1a — Re-measurement of the ten previously-diagnosed pairs

**Headline: nine of the ten pages are now clean. Ethereal is the one that is not.**

Each row gives the ratio recorded in the earlier diagnosis, the ratio measured today, and the verdict.

| Page | Pair | Was | Now (min / median) | Needs | Verdict |
|---|---|---|---|---|---|
| Ethereal | `--faint` nav links | 3.22:1 | **4.40:1** / 4.40:1 | 4.5:1 | **FAIL** |
| Ethereal | `--faint` hero note | 3.22:1 | **4.48:1** / 4.67:1 | 4.5:1 | **FAIL** |
| Ethereal | `--faint` card copy | 3.22:1 | **4.68:1** / 4.74:1 | 4.5:1 | **PASS** |
| Ethereal | `--faint` icon labels | 3.22:1 | **3.69:1** / 3.73:1 | 4.5:1 | **FAIL** |
| Ethereal | `--faint` icon labels (dark) | 3.22:1 | **2.29:1** / 2.36:1 | 4.5:1 | **FAIL** |
| Cyberpunk | `.card .bar em` (dark) | 3.89:1 | **4.75:1** / 4.76:1 | 4.5:1 | **PASS** |
| Victorian | `.cta .cta-btn` | 4.35:1 | **4.79:1** / 4.79:1 | 4.5:1 | **PASS** |
| Y2K Aesthetic | `.btn` (Explore/CTA) | 3.68:1 | **5.88:1** / 5.95:1 | 3.0:1 | **PASS** |
| Y2K Aesthetic | `.icon` (card label chip) | 2.34:1 | **6.19:1** / 6.47:1 | 4.5:1 | **PASS** |
| Graffiti | `.nav ul a:hover` | 3.27:1 | **5.33:1** / 5.33:1 | 3.0:1 | **PASS** |
| Graffiti | `.cta .cta-btn` | 3.27:1 | **5.33:1** / 5.33:1 | 4.5:1 | **PASS** |
| Graffiti | `.cta .cta-btn:hover` | 3.95:1 | **4.98:1** / 4.98:1 | 4.5:1 | **PASS** |
| Bohemian | `.nav ul a:hover` | 3.09:1 | **4.62:1** / 4.80:1 | 4.5:1 | **PASS** |
| Anthropomorphic | `.btn` | 2.57:1 | **5.75:1** / 5.75:1 | 3.0:1 | **PASS** |
| Dark Mode UI | `.btn` (hero Explore CTA) | 2.99:1 | **5.00:1** / 5.00:1 | 4.5:1 | **PASS** |
| Surrealism | `.hero h1` (light) | 2.42:1 | **5.18:1** / 5.37:1 | 3.0:1 | **PASS** |
| Surrealism | CTA `#melt` heading (light) | 1.81:1 | **4.77:1** / 4.94:1 | 3.0:1 | **PASS** |
| Surrealism | `.icon` (light) | 1.64:1 | **5.15:1** / 5.15:1 | 4.5:1 | **PASS** |
| Conceptual Sketch | `.hero p` (`--soft`) | 3.93:1 | **4.78:1** / 4.92:1 | 4.5:1 | **PASS** |
| Conceptual Sketch | `.card .tag` (`--soft`) | 3.93:1 | **4.91:1** / 4.91:1 | 4.5:1 | **PASS** |
| Conceptual Sketch | `.dim b` (`--soft`) | 3.93:1 | **4.91:1** / 4.91:1 | 4.5:1 | **PASS** |
| Conceptual Sketch | `.note` (`--blue`) | 4.23:1 | **4.73:1** / 4.86:1 | 4.5:1 | **PASS** |
| Conceptual Sketch | `.note.r` (`--red`) | 4.23:1 | **4.73:1** / 4.86:1 | 4.5:1 | **PASS** |

### The one page still failing: Ethereal

`--faint` resolves to `rgb(114,106,149)` in light mode. It now clears 4.5:1 against the page ground 
(card copy 4.68:1) but **not** against the lighter aurora washes that sit under the nav and hero:

- **nav links** — `rgb(114,106,149)` on `rgb(241,238,253)`: **4.40:1** (median 4.40:1) vs 4.5:1 required — FAIL
- **hero note** — `rgb(114,106,149)` on `rgb(245,238,244)`: **4.48:1** (median 4.67:1) vs 4.5:1 required — FAIL
- **card copy** — `rgb(114,106,149)` on `rgb(245,248,252)`: **4.68:1** (median 4.74:1) vs 4.5:1 required — PASS
- **icon labels** — `rgb(114,106,149)` on `rgb(218,208,247)`: **3.69:1** (median 3.73:1) vs 4.5:1 required — FAIL
- **icon labels (dark)** — `rgb(179,169,209)` on `rgb(110,109,144)`: **2.29:1** (median 2.36:1) vs 4.5:1 required — FAIL

Two distinct problems are tangled together here, and they have different shapes:

1. **Nav links and hero note (4.40:1, 4.48:1)** — near misses, 0.10 and 0.02 short. The token 
   itself is very close; it fails only where an aurora veil lightens the ground beneath it.
2. **Icon labels (3.69:1 light, 2.29:1 dark)** — not a near miss. These sit on the coloured halo 
   behind each feature (`rgb(218,208,247)` light, `rgb(110,109,144)` dark), which is a much lighter 
   / mid-tone surface than the page ground. At 2.29:1 the dark-mode case is the worst confirmed 
   text-contrast pair found anywhere in this audit.

Worth noting: Ethereal's own Design Points already name this exact risk — *"an all soft-violet-grey-
on-near-white palette risks failing body-text contrast without ever looking obviously wrong, which 
is why every secondary-text colour has to be checked against its actual ground rather than assumed 
safe."* The page documents the trap and then falls into it on the two grounds that are not the page 
ground. **Not fixed here — reported only.**

Ethereal's light-mode `hero h1` is additionally **unresolvable by automated means**: it is 
gradient-filled via `background-clip:text` with a 34px drop-shadow, and no clean glyph mask can be 
extracted from it. Its dark-mode counterpart is unresolvable for the same reason. Both need eyes.

---

## STEP 2 — Brutalism deep verification

Verified against the approved spec for the revision shipped in commit `b0751a8` 
("Brutalism: bold display type + a restrained, load-bearing accent red"). All values below are 
**computed styles from a live render**, not stylesheet greps.

### Typography — Times New Roman removed from headings

**Confirmed.** Every heading and the dialog title now render in Archivo Black:

| Element | Computed `font-family` |
|---|---|
| `.hero h1` | `"Archivo Black", sans-serif` |
| `.cta h2` | `"Archivo Black", sans-serif` |
| `.component h2` | `"Archivo Black", sans-serif` |
| `.design-points h2` | `"Archivo Black", sans-serif` |
| `.features h3` | `"Archivo Black", sans-serif` |
| `.dialog h2` | `"Archivo Black", sans-serif` |
| `body` | `"Courier New", Courier, monospace` |
| `.hero p` | `"Courier New", Courier, monospace` |
| `.tag` (annotations) | `"Courier New", Courier, monospace` |
| `.blink` (status line) | `"Courier New", Courier, monospace` |
| `.btn` (bracket link) | `"Courier New", Courier, monospace` |
| `.dp dt` | `"Courier New", Courier, monospace` |
| `.logo` (wordmark) | `"Times New Roman", Times, serif` |
| `.signature` | `"Dancing Script", "Segoe Script", "Brush Script MT", cursive` |

Times New Roman survives in exactly **one** place: the `Atlas` wordmark (`.logo`), kept deliberately 
as a small serif mark distinct from both the display face and the monospace body. The page's own 
Typography field documents this as "the one deliberate exception". Archivo Black is self-hosted 
(`../assets/fonts/archivo-black/archivo-black-400.woff2` plus a `-ext` latin-extended cut), 
`font-display: swap`, split by `unicode-range`. No CDN.

### Accent red — exact hex and every location

Two reds, one per surface, both AA-verified:

| Token | Light mode | Dark mode | Role |
|---|---|---|---|
| `--th-accent` | `#cc2f1a` | `#ff5a3c` | accent as text on paper |
| `--th-accent-on-ink` | `#ff5a3c` | `#cc2f1a` | accent as text on the ink-coloured CTA panel |
| `--th-on-accent` | `#ffffff` | `#0a0a0a` | text placed on an accent fill |

The two themes hand each other the opposite red, because the CTA panel is painted with `--ink`, and 
`--ink` becomes cream once dark mode swaps it — so "on ink" is always whichever red was tuned for 
the surface `--ink` currently equals.

A live DOM sweep finds the accent applied to **26 elements**. It is load-bearing, not hover-only:

| Location | How the accent is applied |
|---|---|
| Nav links (`Work`, `About`, `Contact`) | `text-decoration-color`, 2px underline — text stays ink |
| Hero headline, the word "feels" (`span.accent`) | `color` |
| Feature table row labels (`Grid`, `Split`, `Pulse`) — `<th>` and `.icon` | `color` |
| CTA link `[ Get in touch ]` | `color` (via `--accent-on-ink`) |
| Status line `READY_` (`p.blink`) | `color` (via `--accent-on-ink`) |
| All 12 Design Points field labels (`.dp dt`) | `color` |
| Design Points palette swatches (`span.sw`) | `background` |
| `[ Explore ]` hover | `background` fill with `--on-accent` text |

So the red carries the feature-row labels, the field labels, the hero's one accent word, the status 
line and both calls to action — present in the resting state of the page, not confined to hover.

### Browser defaults removed

**Confirmed removed.** A grep of `styles/brutalism.html` for `0000ee`, `551a8b` and `c0c0c0` returns 
**no matches**. The default link blue, the visited purple and the grey system-chrome nav band are 
all gone. The nav now sits on the page's own paper colour (`--paper`, `#f2efe9` light / `#141414` 
dark) with its bottom border bumped to 2px so removing the band does not read as removing the 
separation.

### Nav rail and theme controls — present and functional

Both survive as bracketed text controls in the page's own idiom, driven and verified live:

| Control | Before | After click | Persisted |
|---|---|---|---|
| `#theme-toggle` | `theme: light` | `data-theme="dark"`, label `theme: dark`, `aria-pressed="true"`, body bg `rgb(20,20,20)` | `localStorage["atlas-theme"] = "dark"` |
| `#nav-toggle` | `nav: top` | `data-nav="side"`, label `nav: side`, `aria-pressed="true"`, `--rail: 210px`, `.nav` `position: fixed` | `localStorage["atlas-brutalism-nav"] = "side"` |

Neither was dropped, redesigned, or converted into a switch widget — they remain `[ nav: top ]` / 
`[ theme: light ]` bracketed text, matching `[ Explore ]`.

### Structural rules — all intact

| Rule | Measured result |
|---|---|
| Hard 1px black borders on every block | `nav` `1/1/**2**/1`, `header` `1/1/1/1`, `section.features` `1/1/1/1`, `section.cta` `1/1/1/1`, `section.component` `1/1/1/1`, `footer` `1/1/1/1`, `section.design-points` `1/1/1/1` — all `solid rgb(10,10,10)`. The nav's 2px bottom is the deliberate replacement for the removed grey band. |
| Zero border-radius | One element only: `a.skip-link` (4px) |
| Zero box-shadow | **None anywhere on the page** |
| Zero transitions | One only: `a.skip-link` (`top 0.15s`) |
| Zero CSS animations / `@keyframes` | **None anywhere** |
| Native `<dialog>` | Present, and a real `HTMLDialogElement` |
| Real `<table>` feature row | Present — 3 rows, 3 `<th scope="row">` |
| Bracket-link convention | `.btn`, `.cta .cta-btn`, `.ctl`, `.dp-skill`, `.dp-example`, `.dp-back`, `.dialog__close` — all render `::before "[ "` / `::after " ]"` |
| Structural tag annotations | 7 present: `<nav>`, `<header>`, `<section id="features">`, `<section id="cta">`, `<section id="component">`, `<footer>`, `<dialog>` |

The two `.skip-link` exceptions are the **shared sitewide skip-link component**, identical on all 30 
pages, invisible until keyboard-focused. It is not part of this page's visual language and is not a 
Brutalism-specific regression — but it is the literal answer to "zero radius, zero transitions", so 
it is recorded rather than waved away.

### Blinking cursor — mechanism untouched

Confirmed still a JS `setInterval` toggling `visibility` every 600ms, guarded by a live `matchMedia` 
query, with the cursor left solid when the preference is set:

```
var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
setInterval(function () {
  if (reduce && reduce.matches) { c.style.visibility = 'visible'; return; }
  c.style.visibility = c.style.visibility === 'hidden' ? 'visible' : 'hidden';
}, 600);
```

Observed live: `visibility` flipped `hidden` -> `visible` across a 700ms sample. Not converted to a 
CSS animation.

### Dialog behaviour

| Check | Result |
|---|---|
| Opens modally | `open: true`, matches `:modal` |
| Focus moves inside | yes — `#dialog-close` |
| Escape closes | yes |
| Focus returns to trigger | yes — `#dialog-open` |

### Halftone placeholder graphic — NOT PRESENT

**This is the one item where the page does not match what this audit was told to expect, and it 
needs a decision rather than a fix.**

The audit brief asks to "confirm a halftone-style placeholder graphic (not a real photograph) is 
present, and exactly where." It is not present. Measured on a live render:

- `<img>` elements: **0**
- `<svg>` elements: **0**
- `<canvas>` elements: **0**
- elements with a computed `background-image` other than `none`: **0**

The page is entirely text and 1px borders; the hero is text-only.

This is not drift. It is what the **build brief for this revision explicitly instructed**, in its 
CHANGE list: *"Do NOT add a real photograph in this pass. Leave the hero text-only, no placeholder 
graphic — that was mockup-only scaffolding."* The graphic appeared in the approved v2 mockup and was 
deliberately excluded from the shipped page on that instruction.

So the page matches its build brief and contradicts this audit brief. The two documents disagree; 
the page followed the one it was built from. **Which of the two is authoritative is a decision for 
you — see DECISIONS NEEDED.** Nothing was added.

### `skills/brutalism/SKILL.md` — unmodified

**Confirmed untouched**, as the revision brief required.

| Check | Result |
|---|---|
| Last commit touching `skills/brutalism/SKILL.md` | `4dcf58d`, 2026-08-30, "Add Brutalism skill file" |
| Commits touching `skills/brutalism/` since then | **none** |
| Files changed by the revision commit `b0751a8` | `styles/brutalism.html` only (148 insertions, 114 deletions) |

For comparison, the sibling Part D batch commits are all the same date and shape — 
`dee94fe` Minimalism, `88984a0` Maximalism, `abf418b` Swiss Design, `02bb02c` Surrealism, 
`89005e3` Victorian, `ceb47dd` Wabi Sabi, all 2026-08-30. Brutalism's skill file sits with its 
batch, untouched by the 2026-09-13 page revision. The file was not opened for editing during this 
audit.

### Brutalism contrast

All 13 probed pairs pass in **both** themes — the only page in the site-wide sweep with zero 
failures and zero unresolved pairs. Measured worst pairs:

| Mode | Element | min | median | Needs | Verdict |
|---|---|---|---|---|---|
| light | card label/icon | 4.59:1 | 4.59:1 | 4.5:1 | PASS |
| light | design-points label | 4.59:1 | 4.59:1 | 4.5:1 | PASS |
| dark | CTA button | 4.59:1 | 4.59:1 | 4.5:1 | PASS |
| light | card body copy | 4.64:1 | 4.64:1 | 4.5:1 | PASS |
| dark | card label/icon | 5.95:1 | 5.95:1 | 4.5:1 | PASS |
| dark | design-points label | 5.95:1 | 5.95:1 | 4.5:1 | PASS |
| light | CTA button | 6.39:1 | 6.39:1 | 4.5:1 | PASS |
| dark | card body copy | 6.55:1 | 6.55:1 | 4.5:1 | PASS |

---

## STEP 3 — Repo and file structure

### `skills/<slug>/SKILL.md` — complete

**All 29 present. None missing.** Verified both in the working tree and in the deployed commit 
(`git ls-tree -r origin/add-designs` returns exactly 29 matches for `skills/*/SKILL.md`).

### `examples/<slug>/` — complete

**All 29 complete with all 4 pages** (`index.html`, `work.html`, `about.html`, `contact.html`). 
None missing. The deployed commit contains 116 files matching `examples/*/{index,work,about,contact}.html` 
— exactly 29 x 4.

Directory contents vary slightly in a way that is **not** a missing-file problem: 21 examples ship 
a `script.js` alongside `style.css`, and 8 do not (`dark-mode-ui`, `minimalism`, `neo-classical`, 
`neumorphism`, `scrapbook`, `swiss-design`, `synthwave`, plus `pixel-art` which instead carries its 
own `fonts/` directory). Those 8 simply have nothing to script.

### Google Fonts — zero network requests sitewide

**Confirmed zero.** Across every `.html` and `.css` file in the repo:

- references to `fonts.googleapis.com`: **0**
- references to `fonts.gstatic.com`: **0**
- **any** `http://` or `https://` URL appearing in an HTML file other than the footer "Source" 
  link: **0**

Every typeface is self-hosted under `assets/fonts/` as `woff2`, declared with `font-display: swap` 
and split by `unicode-range` into latin and latin-extended cuts. 137 `.woff2` files total. The site 
makes no third-party network request of any kind at runtime.

One page, **Dark Mode UI**, declares no `@font-face` at all — it is built entirely on system font 
stacks, so it loads zero font files.

### Asset payload

| Path | Size | Contents |
|---|---|---|
| `assets/fonts/` | **3.8 MB** | 137 `.woff2` files |
| `assets/previews/` | **656 KB** | 29 homepage card screenshots |
| `assets/` total | **4.4 MB** | |
| Repo total (excluding `.git`) | **7.0 MB** | |

Fonts are 86% of the asset weight. Because each page declares only the faces it uses and every 
`@font-face` is `unicode-range`-split, no single page pulls anything close to the full 3.8 MB — but 
the figure is reported as the sitewide total, as asked.

The 29 preview screenshots on the homepage all carry `loading="lazy"`.

---

## Consolidated findings

Ordered by consequence. **Nothing in this list was fixed.**

### 1. 30 broken "Source" links — every page on the site

Every one of the 30 pages carries a footer link:

```html
<a href="https://github.com/Utkarsh7106/atlas">Source</a>
```

The repository is named **`atlas-ori`**, not `atlas`. `github.com/Utkarsh7106/atlas` does not 
resolve for this session (API returns 403 "not enabled for this session", which is an authorisation 
refusal rather than a definitive 404 — so it is possible the repo exists under that name and is 
merely out of scope here). Either way, **the link does not point at the repository that is actually 
serving this site**, and it is the only place in the codebase where a repo name is hardcoded.

This is the most likely single artifact of the rename churn. 30 occurrences, one per page.

### 2. Ethereal contrast failures — the only Step 1a page not cleared

Four failing pairs, detailed in Step 1a above. The dark-mode icon labels at **2.29:1** are the 
worst confirmed text-contrast pair in this audit. The nav links and hero note (4.40:1, 4.48:1) are 
near misses caused by the aurora veils lightening the ground under otherwise-passing text.

### 3. Contrast failures found now that were not previously flagged

Seven pairs across four pages. None was on the Step 1a list. All were individually re-verified.

| Page | Pair | Mode | min / median | Needs | Character |
|---|---|---|---|---|---|
| Synthwave | `.nav ul a` | light | **3.06** / 3.06 | 4.5:1 | real |
| Synthwave | `.hero .btn` (Explore) | light | **2.63** / 2.68 | 3.0:1 | real |
| Synthwave | `.cta h2` | light | **2.66** / 2.95 | 3.0:1 | real, near miss |
| Pixel Art | `.card p` | light | **3.12** / 3.12 | 4.5:1 | real |
| Pixel Art | `.card p` | dark | **3.56** / 3.56 | 4.5:1 | real |
| Neo-classical | `.icon` | light | **3.97** / 4.63 | 4.5:1 | real |
| Conceptual Sketch | `.icon` | light | **4.44** / 4.57 | 4.5:1 | marginal (0.06 short) |

**Synthwave is the page that needs attention here** — three failing pairs including its primary 
hero call to action at 2.63:1 against a 3:1 requirement. Its nav links at 3.06:1 against 4.5:1 are 
the largest shortfall of the three.

Pixel Art's card body copy fails in **both** themes at 3.12:1 and 3.56:1 — a flat, unambiguous 
miss with no measurement caveat attached: same colour, same ground, both themes.

Conceptual Sketch at 4.44:1 is 0.06 short of threshold and is listed for completeness rather than 
as a practical legibility problem.

### 3a. Four findings from an earlier pass of this audit that were WRONG

Recorded because they were nearly reported as fact, and because the same mistake is easy to repeat:

| Page | Pair | Falsely reported | Actually | Cause |
|---|---|---|---|---|
| Cybercore | `.hero p` | 1.74:1 FAIL | **8.33:1 PASS** | measured against its own `text-shadow` glow |
| Gothic | `.nav ul a` (light) | 4.03:1 FAIL | **14.25:1 PASS** | foreground taken from antialiased pixels |
| Gothic | `.nav ul a` (dark) | 3.98:1 FAIL | **15.44:1 PASS** | same |
| Graffiti | `.logo`, `.card h3` | 1.00-1.62:1 FAIL | **8.18:1, 4.93:1 PASS** | text measured against its own hard shadow |

Cybercore in particular was written up mid-audit as *"the largest single miss found anywhere"*. It 
is not a miss at all. Its hero copy is `rgb(28,77,44)` on a mint `rgb(217,243,227)` ground at 
8.33:1; the 1.74:1 figure was that same green measured against the 55%-opacity dark-green glow the 
text casts on itself.

### 4. Two undocumented content-parity overrides

`CONTRIBUTING.md` requires every deviation from the shared baseline to be justified in one sentence 
in a code comment **at the point of use**. Three pages deviate; only one complies.

| Page | Deviation | Override comment? |
|---|---|---|
| Cyberpunk | Logo is `Atlas<small>アトラス</small>` — katakana appended to the wordmark | **NO** |
| Bento Grid | Hero button is `Explore <span>→</span>` — arrow appended | **NO** |
| Conceptual Sketch | Extra margin note annotating the headline | yes, present and detailed |
| Anthropomorphic | Speech-bubble device | yes, present (2 comments) |

Both undocumented deviations are small and defensible on the merits — they are flagged for the 
missing justification comment the rule requires, not because the deviation itself looks wrong.

### 5. `.nojekyll` absent

Latent rather than live: nothing in the tree currently begins with an underscore, so Jekyll is not 
dropping anything today. Becomes a real breakage the first time anyone adds `_assets/` or similar.

### 6. Stale branch `claude/design-styles-showcase-96zcl5`

Still present locally and on the remote, last deployed 2026-08-31 (run 115), and does **not** 
contain the Brutalism revision. Anyone checking out that branch expecting the live site gets a 
month-old tree.

### 7. Brutalism has no halftone graphic

Matches its build brief, contradicts this audit brief. See Step 2 and DECISIONS NEEDED.

### 8. Pairs automated measurement could not resolve

Reported as unresolved rather than scored, because the visible letterform is painted by 
`text-shadow` and/or `-webkit-text-stroke` rather than by a fill that can be neutralised:

| Page | Element | Mode |
|---|---|---|
| y2k-aesthetic | `logo` | light |
| y2k-aesthetic | `hero h1` | light |
| y2k-aesthetic | `CTA heading` | light |
| y2k-aesthetic | `logo` | dark |
| y2k-aesthetic | `hero h1` | dark |
| y2k-aesthetic | `CTA heading` | dark |
| synthwave | `hero h1` | light |
| synthwave | `hero h1` | dark |
| ethereal | `hero h1` | light |
| wabi-sabi | `CTA heading` | light |
| minimalism | `CTA heading` | light |

These need eyes, not a script.

### Clean bill

Everything below was checked and found correct:

- **Content parity** holds on all 29 style pages for nav, headline, hero copy, three cards and CTA 
  (with the deviations listed above).
- **Design Points: 12/12 fields on all 29 pages**, including all four upgraded fields. No page is 
  missing any field.
- **Skip link and `<main>` landmark on all 30 pages.**
- **Theme toggle on 29 of 30** — Dark Mode UI has none by design (it is already the dark theme).
- **Nav rail toggle on all 29 style pages.**
- **Native `<dialog>` with `showModal()` on all 29 style pages.**
- **All 145 skill and example files present** in both the working tree and the deployed commit.
- **All 87 Design Points link targets resolve** (29 x skill + example + back).
- **Zero Google Fonts requests; zero external network requests of any kind.**
- **Nine of the ten Step 1a pages are fully cleared.**
---

## Decisions needed

These are the points where the audit stops, because resolving them is a judgement call rather than
a finding.

### 1. Brutalism's halftone graphic — which brief wins?

The audit brief says to confirm a halftone placeholder graphic is present. The revision's build brief
said, in as many words, not to add one: *"Do NOT add a real photograph in this pass. Leave the hero
text-only, no placeholder graphic — that was mockup-only scaffolding."* The shipped page follows the
build brief and has zero graphics of any kind.

Either the graphic was deferred and this audit's expectation is simply ahead of the page, or the
exclusion was meant to be permanent and the audit brief is carrying a stale expectation from the v2
mockup. **Nothing was added.** Say which, and it becomes a one-line task.

### 2. The `atlas` vs `atlas-ori` repo name

Thirty footer links point at `github.com/Utkarsh7106/atlas`. The live repo is `atlas-ori`. Two
different fixes follow from two different intentions:

- If the repo is *meant* to end up named `atlas` and the rename hasn't happened yet, the links are
  correct and premature — the rename is the task, and the live URL will move to
  `utkarsh7106.github.io/atlas/` when it does.
- If `atlas-ori` is the final name, all 30 links are wrong and need rewriting.

This audit cannot tell which from inside the session: the `atlas` name returns an authorisation
refusal, not a clean 404. You know which was intended.

### 3. Glow-and-halo type — where does the text end and the background begin?

Eleven pairs (finding 8) could not be measured at all, because the visible letterform is drawn by
`text-shadow` and/or `-webkit-text-stroke` rather than by a fill. Neutralise the fill and the letter
is still there, cast by its own shadow.

This audit's working rule is that shadow and stroke belong to the *text*, not the background, so they
are removed before the background is sampled. That rule is defensible but it is a choice, and it is
the choice that flipped Cybercore, Gothic and Graffiti from failing to passing. A house position on
how Atlas measures glowing type would settle those eleven unresolved pairs and make the rule explicit
rather than implicit in a script.

### 4. Ethereal — token fix or ground fix?

Ethereal's `--faint` failures split into two shapes that want different remedies: the nav and hero
misses (4.40 and 4.48 against 4.5) would clear with a small darkening of the token, but the
icon-label failures (3.69 light, 2.29 dark) are about the *halo* the labels sit on, not the token —
darkening `--faint` enough to clear the halo would likely overshoot everywhere else. Whether to move
the token, the halos, or both is a design decision on a page whose whole premise is low-contrast
softness.

---

## What this audit did not verify

Stated plainly so nothing here is read as a stronger assurance than it is.

- **No live HTTP status was obtained for any URL.** The egress proxy blocks `utkarsh7106.github.io`.
  Link targets were verified to exist in the working tree and in the deployed commit; that is not the
  same as the live server returning 200. This applies to every "Download skill" and "Example website"
  button on all 29 pages.
- **The homepage was not included in the contrast sweep.** It is reported as *not measured*, not as
  passing.
- **Eleven text pairs could not be measured automatically** (finding 8) and are reported unresolved.
- **Only the shared page chrome was probed for contrast** — nav, logo, hero, cards, CTA, footer note,
  Design Points body and labels, plus the Step 1a targets. Style-specific ornament outside those
  selectors was not swept.
- **Dark mode was measured only via each page's own `#theme-toggle`.** Dark Mode UI has no toggle, so
  only its single rendered state was measured.
- **Visual verification was sampled, not exhaustive** — 19 rendered crops plus individual re-checks of
  every flagged pair, not a full visual review of all 30 pages.
- **`skills/brutalism/SKILL.md` was not opened.** Its status was established from git history alone,
  as instructed.
- **Hover and focus states were measured only where Step 1a named them** (Graffiti, Bohemian). Other
  pages' hover and focus-visible states were not swept.
