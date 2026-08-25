# Atlas — codebase audit (read-only)

Factual report on what is actually shipped. Every claim below was read out of the
source files, not from any page's own "Design Points" prose. Contrast ratios are
computed arithmetic from the CSS values found; no pass/fail verdicts are given.

Audit date: 2026-08-25 · Branch: `claude/design-styles-showcase-96zcl5` · Commit `1490c4e`
**No files were modified. This report is the only file added.**

---

## 1. Repo inventory

### 1.1 File / folder structure

```
website-designs/
├── README.md                       77 lines
├── index.html                     355 lines
├── assets/
│   └── reset.css                   52 lines
└── styles/                         29 files, 8,951 lines total
    ├── anthropomorphic.html       370      ├── luxury-typography.html    303
    ├── bento-grid.html            315      ├── maximalism.html           319
    ├── bohemian.html              300      ├── minimalism.html           261
    ├── brutalism.html             262      ├── mixed-media.html          334
    ├── claymorphism.html          290      ├── neo-brutalism.html        285
    ├── conceptual-sketch.html     320      ├── neo-classical.html        265
    ├── cybercore.html             320      ├── neumorphism.html          268
    ├── cyberpunk.html             337      ├── pixel-art.html            338
    ├── dark-mode-ui.html          305      ├── scrapbook.html            326
    ├── editorial-design.html      312      ├── surrealism.html           334
    ├── ethereal.html              332      ├── swiss-design.html         300
    ├── glassmorphism.html         301      ├── synthwave.html            293
    ├── gothic.html                294      ├── victorian.html            290
    ├── graffiti.html              346      ├── wabi-sabi.html            310
                                            └── y2k-aesthetic.html        321
```

Total: **32 files, 9,435 lines.** No other directories exist.

### 1.2 Build step

**None.** There is no `package.json`, `node_modules`, lockfile, bundler config,
Makefile, or CI config anywhere in the repo (verified by `find` across the whole
tree excluding `.git`). All 31 HTML/CSS files are hand-written and load directly
from the filesystem. No `<script src=…>` to any local or remote JS file exists on
any page — all JavaScript is inline in a single `<script>` block per page.

### 1.3 Full contents of `assets/reset.css` (52 lines)

```css
 1  /* ============================================================
 2     reset.css — the ONLY shared stylesheet in this project.
 3     Deliberately minimal: it normalises the browser, it does not
 4     style anything. Every visual decision lives in the per-page
 5     <style> block so each style page is self-contained and can be
 6     read (by a human or an LLM) as a single complete artefact.
 7     ============================================================ */
 8
 9  *, *::before, *::after { box-sizing: border-box; }
10
11  html { -webkit-text-size-adjust: 100%; }
12
13  body,
14  h1, h2, h3, h4, h5, h6,
15  p, figure, blockquote, dl, dd, ol, ul {
16    margin: 0;
17    padding: 0;
18  }
19
20  /* Lists are unstyled by default; the Design Points panel re-enables
21     disc/decimal markers explicitly where they carry meaning. */
22  ul, ol { list-style: none; }
23
24  body {
25    min-height: 100vh;
26    text-rendering: optimizeSpeed;
27    line-height: 1.5;
28  }
29
30  a { text-decoration: none; color: inherit; }
31
32  img, picture, svg, video { max-width: 100%; display: block; }
33
34  input, button, textarea, select {
35    font: inherit;
36    color: inherit;
37    background: none;
38    border: none;
39  }
40
41  button { cursor: pointer; }
42
43  hr { border: none; }
44
45  @media (prefers-reduced-motion: reduce) {
46    *, *::before, *::after {
47      animation-duration: 0.01ms !important;
48      animation-iteration-count: 1 !important;
49      transition-duration: 0.01ms !important;
50      scroll-behavior: auto !important;
51    }
52  }
```

`reset.css` is linked by all 30 pages at line 8 of each file — `index.html:8`
(`href="assets/reset.css"`) and every `styles/*.html:8` (`href="../assets/reset.css"`).

### 1.4 Shared CSS / tokens / components across pages

There is **no shared stylesheet other than `reset.css`**, but there is **duplicated
CSS**:

**(a) The Design Points panel block is byte-identical across all 29 style pages.**
Verified by MD5 over the extracted block: one hash (`df7bb9a059`) for all 29 files,
31 lines each. It is copy-pasted into each page's own `<style>` block, not shared
via a file. Line ranges:

| file | lines | file | lines |
|---|---|---|---|
| anthropomorphic | 147–177 | luxury-typography | 107–137 |
| bento-grid | 126–156 | maximalism | 123–153 |
| bohemian | 123–153 | minimalism | 89–119 |
| brutalism | 83–113 | mixed-media | 141–171 |
| claymorphism | 116–146 | neo-brutalism | 106–136 |
| conceptual-sketch | 130–160 | neo-classical | 105–135 |
| cybercore | 120–150 | neumorphism | 100–130 |
| cyberpunk | 127–157 | pixel-art | 142–172 |
| dark-mode-ui | 119–149 | scrapbook | 129–159 |
| editorial-design | 119–149 | surrealism | 121–151 |
| ethereal | 123–153 | swiss-design | 119–149 |
| glassmorphism | 115–145 | synthwave | 130–160 |
| gothic | 121–151 | victorian | 114–144 |
| graffiti | 140–170 | wabi-sabi | 125–155 |
| | | y2k-aesthetic | 136–166 |

Sample (`editorial-design.html:122–149`):
```css
.dp-divider{height:0;border-top:1px dashed #a1a1aa;margin:0}
.design-points{position:relative;z-index:80;background:#f4f4f5;color:#18181b;padding:72px 24px 96px;
  border-top:6px solid #18181b;font-family:ui-sans-serif,system-ui,…}
.dp-row{display:grid;grid-template-columns:190px 1fr;gap:20px;padding:18px 0;border-top:1px solid #d4d4d8}
.sw{display:inline-block;width:13px;height:13px;border-radius:3px;
  border:1px solid rgba(0,0,0,.25);vertical-align:-2px;margin-right:8px;background:var(--c)}
```

**(b) Custom-property names are reused but values are not shared.** 131 distinct
`--name` tokens exist across the 29 pages. Most-reused names: `--ink` (15 pages),
`--paper` (7), `--muted` (6), `--yellow` (6), `--red` (6), `--cyan` (5), `--r` (4),
`--grey` (4), `--text` (4). Each page redefines them locally in its own `:root`
with different values — e.g. `--ink` is `#0a0a0a` in `minimalism.html:20`,
`#111111` in `swiss-design.html:21`, `#000000` in `brutalism.html:18`,
`#1f1c17` in `neo-classical.html:22`, `#2a1a10` in `victorian.html:25`.

**(c) Structural class names are shared across pages by convention only** (each
page styles them independently): `.dp-row`, `.dp-back`, `.dp-kicker`, `.dp`,
`.dp-inner`, `.dp-palette`, `.dp-divider`, `.design-points`, `.sw`, `.icon`,
`.card`, `.logo`, `.btn` appear on all 29; `.cta`, `.features`, `.hero`, `.nav`
on 28; `.wrap` on 24.

**(d) One shared inline-variable pattern:** swatches set `--c` inline in markup and
`.sw{background:var(--c)}` consumes it (all 29 pages, and `index.html:47`).

### 1.5 Font-loading strategy

All webfonts come from the **Google Fonts CDN** (`fonts.googleapis.com/css2`),
loaded as a render-blocking `<link rel="stylesheet">` at **line 11** of each file.
No `@font-face` rule exists anywhere in the repo — **nothing is self-hosted**.
Each page that loads fonts also has two `<link rel="preconnect">` at lines 9–10
(`fonts.googleapis.com` and `fonts.gstatic.com` with `crossorigin`).

| page | families requested (line 11) |
|---|---|
| index.html | Inter 400;500;600 |
| anthropomorphic | Fredoka 400;500;600;700 · Nunito 400;600;700 |
| bento-grid | Plus Jakarta Sans 400;500;600;700 |
| bohemian | Amatic SC 700 · Cardo 0,400;1,400 · Outfit 300;400;500 |
| claymorphism | Baloo 2 500;600;700 · Quicksand 500;600 |
| conceptual-sketch | Architects Daughter · Courier Prime 400;700 |
| cybercore | VT323 · JetBrains Mono 400;700 |
| cyberpunk | Rajdhani 400;600;700 · Share Tech Mono |
| editorial-design | Source Serif 4 (opsz 8..60) 400;600;700 + italic · Archivo 500;600;700 |
| ethereal | Italiana · Montserrat 200;300;400 |
| glassmorphism | Manrope 300;400;500;700 |
| gothic | UnifrakturMaguntia · EB Garamond 400;500 + italic · Cinzel 400 |
| graffiti | Bungee · Permanent Marker · Oswald 300;500;700 |
| luxury-typography | Bodoni Moda (opsz 6..96) 400;500 + italic · Jost 300;400;500 |
| maximalism | Archivo Black · Playfair Display italic 700;900 · Space Mono 400;700 |
| minimalism | Inter 300;400;500 |
| mixed-media | Bebas Neue · Libre Baskerville 700 + italic 400 · DM Sans 400;700 |
| neo-brutalism | Space Grotesk 500;700 |
| neo-classical | Cormorant Garamond 300;400;500;600 · Cinzel 400;600 |
| neumorphism | Poppins 400;500;600 |
| pixel-art | Press Start 2P · Silkscreen 400;700 |
| scrapbook | Caveat 500;700 · Special Elite |
| surrealism | Cormorant Garamond 300;500 + italic 300 · Inter 400;500 |
| swiss-design | Inter Tight 400;500;700 · IBM Plex Mono 400;500 |
| synthwave | Monoton · Orbitron 500;700;900 · Chakra Petch 400;600 |
| victorian | Abril Fatface · Playfair Display 500;700 + italic 500 · IM Fell English 0;1 |
| wabi-sabi | Shippori Mincho 400;500 · Karla 300;400 |
| y2k-aesthetic | Audiowide |

**Two pages load no webfont at all** and have no `preconnect` links:
- `styles/brutalism.html` — uses `"Times New Roman",Times,serif` (`:29`) and
  `"Courier New",Courier,monospace` (`:77`).
- `styles/dark-mode-ui.html` — uses `system-ui,-apple-system,"Segoe UI",Roboto,…`
  and `ui-monospace,SFMono-Regular,Menlo,Consolas,monospace`.

All requests use `&display=swap`.

### 1.6 `prefers-reduced-motion`

**Yes — exactly one occurrence in the entire repo**, in the shared reset:

`assets/reset.css:45–52`
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**No individual style page contains a `prefers-reduced-motion` query in its own
`<style>` block.** There is also **no `matchMedia` call and no reduced-motion
check in any JavaScript on any page** (grepped for `matchMedia`, `reducedMotion`,
`reduce)` across `index.html` and all 29 style pages — zero hits).

Consequence, stated as fact: JS-driven motion is unaffected by the reset, because
it does not go through CSS `animation`/`transition`. This includes at minimum
`ethereal.html:307–330` (Web Animations motes), `y2k-aesthetic.html:297–312`
(sparkle trail), `maximalism.html:296–312` (confetti), `graffiti.html:324–345`
(spray burst), `surrealism.html:301–311` (button flee), `victorian.html:279–286`
(`setTimeout` opacity flicker), `bento-grid.html:306–311` (inline height writes),
`cybercore.html:280–301` (decode + glitch class toggling).

---

## 2. Homepage — `index.html`

### 2.1 Title and H1

- `<title>` — `index.html:6`: `Atlas — 29 Design Styles`
- `<h1>` — `index.html:70`: `The same page, twenty-nine times.`

### 2.2 `<main>` landmark

**No.** `index.html` contains no `<main>` element and no `role="main"`. The
landmarks present are `<header class="top">` (`:68`), `<ul class="grid">` (`:83`),
and `<footer>` (`:347`), all inside a plain `<div class="wrap">` (`:66`).
Heading structure is one `<h1>` (`:70`) followed by 29 `<h2>` (one per card).

### 2.3 Card link structure

**One full-row `<a>` wraps the entire card**, including the "View style →" text.
There is no separately nested link. Actual markup for row 1 (`index.html:84–92`):

```html
84      <li class="card">
85        <a href="styles/minimalism.html">
86          <span class="num">01</span>
87          <span class="swatches" aria-hidden="true"><i style="--c:#ffffff"></i><i style="--c:#0a0a0a"></i><i style="--c:#737373"></i><i style="--c:#e5e5e5"></i><i style="--c:#fafafa"></i></span>
88          <h2>Minimalism</h2>
89          <p>Reduction to essentials — hairlines, one typeface, extreme whitespace.</p>
90          <span class="go" aria-hidden="true">View style &rarr;</span>
91        </a>
92      </li>
```

The `<h2>` is *inside* the anchor. `.go` is a `<span>`, `aria-hidden="true"`, and
is visually hidden until hover/focus — `index.html:51–55`:
```css
51  .go{margin-top:18px;font-size:12.5px;font-weight:500;color:var(--ink);opacity:0;
52    transform:translateX(-4px);transition:opacity .18s ease,transform .18s ease}
53  .card a:hover .go{opacity:1;transform:none}
54  .card a:focus-visible{outline:2px solid var(--ink);outline-offset:-2px}
55  .card a:focus-visible .go{opacity:1;transform:none}
```

### 2.4 Visual preview in list items

**Yes — colour swatches, not thumbnails.** Each card renders five 22×22px squares
from inline `--c` custom properties (markup shown above, line 87). CSS at
`index.html:46–48`:
```css
46  .swatches{display:flex;gap:4px;margin:16px 0 18px}
47  .swatches i{width:22px;height:22px;border-radius:4px;background:var(--c);
48    box-shadow:inset 0 0 0 1px rgba(0,0,0,.10)}
```
The `.swatches` span carries `aria-hidden="true"` on all 29 cards. There are no
`<img>` elements, no SVG, and no screenshot/thumbnail assets anywhere in the repo.

### 2.5 Categorisation / filtering / tagging

**None.** `index.html` contains **no `<script>` element at all**, and no
`data-*` attributes, no `addEventListener`, no `querySelector`, and no
filter/category/tag markup (grepped for `<script`, `filter`, `categor`, `tag`,
`data-`, `addEventListener`, `querySelector` — zero hits). The 29 cards are a flat
static `<ul>`, ordered `01`–`29` by hardcoded `.num` spans, with no grouping
markup between them.

---

## 3. Live colour values (from stylesheets)

Values are the CSS as written, with the token resolved. "Ratio" is computed
arithmetic (WCAG relative-luminance formula) and is given **only where the
background is an opaque solid**; rows on gradients/alpha are flagged.

### Minimalism — `styles/minimalism.html`
Tokens `:18–25`. Page background `--paper:#ffffff` (`body`, `:28`).

| element | selector : line | colour | on background | ratio |
|---|---|---|---|---|
| body / h1 / h3 / .logo | `body` `:29` (`--ink`) | `#0a0a0a` | `#ffffff` body `:28` | 19.80 |
| nav links | `.nav ul a` `:41` | `#737373` | `#ffffff` | 4.74 |
| hero subheading | `.hero p` `:56` | `#737373` | `#ffffff` | 4.74 |
| card body | `.card p` `:73` | `#737373` | `#ffffff` | 4.74 |
| card icon label | `.icon` `:71` | `#737373` | `#ffffff` | 4.74 |
| button (rest) | `.btn` `:63` | `#0a0a0a` | `#ffffff` (own bg) | 19.80 |
| button (hover) | `.btn:hover` `:66` | `#ffffff` | `#0a0a0a` | 19.80 |

`.logo` sets no colour of its own (`:37`); it inherits `#0a0a0a` from `body`.

### Swiss Design — `styles/swiss-design.html`
Tokens `:19–27`. Page background `--paper:#ffffff` (`:30`).

| element | selector : line | colour | on background | ratio |
|---|---|---|---|---|
| body / h1 / h2 / h3 / .logo | `body` `:31` | `#111111` | `#ffffff` | 18.88 |
| deck body | `.hero .deck p` `:66` | `#111111` | `#ffffff` | 18.88 |
| deck kicker | `.hero .deck span` `:67` | `#e2231a` | `#ffffff` | 4.68 |
| card numeral | `.card .num` `:86` | `#e2231a` | `#ffffff` | 4.68 |
| card icon label | `.icon` `:87` | `#8a8a8a` | `#ffffff` | 3.45 |
| meta line | `.meta` `:81` | `#8a8a8a` | `#ffffff` | 3.45 |
| grid hint | `.hint` `:105` | `#8a8a8a` | `#ffffff` | 3.45 |
| hint `<b>` | `.hint b` `:106` | `#e2231a` | `#ffffff` | 4.68 |
| primary button | `.btn` `:74` | `#ffffff` | `#e2231a` `:74` | 4.68 |
| CTA button | `.cta button` `:94` | `#ffffff` | `#111111` `:94` | 18.88 |

Nav links set no colour (`:50`); they inherit `#111111`. `.nav a:hover` `:52` → `#e2231a`.

### Brutalism — `styles/brutalism.html`
Tokens `:16–23`. Page background `--paper:#ffffff` (`:26`). No webfont.

| element | selector : line | colour | on background | ratio |
|---|---|---|---|---|
| body / h1 / h2 / h3 / td | `body` `:27` | `#000000` | `#ffffff` | 21.00 |
| logo | `.logo` `:41` | `#000000` | `#c0c0c0` (`.nav` `:39`) | 11.54 |
| nav links | `.nav ul a` `:46` | `#0000ee` | `#c0c0c0` | 5.17 |
| nav links, visited | `.nav ul a:visited` `:47` | `#551a8b` | `#c0c0c0` | 6.05 |
| Explore link-button | `.btn` `:53` | `#0000ee` | `#ffffff` | 9.40 |
| CTA link-button | `.cta button` `:71` | `#0000ee` | `#ffffff` | 9.40 |
| table header icon | `.icon` `:66` inside `th` `:63` | `#000000` | `#c0c0c0` | 11.54 |
| blinking cursor | `.blink` `:80` | `#ff0000` | `#ffffff` | 4.00 |
| tag annotations | `.tag` `:77–78` | `#000000` | `#ffffff` (own bg) | 21.00 |
| hover state (all) | `:48`, `:57`, `:74` | `#ffffff` | `#ff0000` | 4.00 |

### Neo-classical — `styles/neo-classical.html`
Tokens `:19–26`. Background is layered: radial `#fbf9f4` wash + 102° grain over
`--marble:#f4f1ea` (`:29–32`). Ratios below use the `#f4f1ea` base.

| element | selector : line | colour | on background | ratio |
|---|---|---|---|---|
| body / h1 / h2 / h3 / logo | `body` `:33`, `.logo` `:44` | `#1f1c17` | `#f4f1ea` (+gradient) | 15.05 |
| nav links | `.nav ul a` `:47` | `#6b6250` | `#f4f1ea` (+gradient) | 5.34 |
| hero subheading | `.hero p` `:66` | `#6b6250` | `#f4f1ea` (+gradient) | 5.34 |
| card body | `.card p` `:84` | `#6b6250` | `#f4f1ea` (+gradient) | 5.34 |
| card icon label | `.icon` `:80` | `#a8894f` | `#f4f1ea` (+gradient) | 2.93 |
| card title first letter | `.card h3::first-letter` `:83` | `#a8894f` | `#f4f1ea` (+gradient) | 2.93 |
| Explore button | `.btn` `:69–70` | `#1f1c17` | transparent → page | 15.05 |
| CTA button | `.cta button` `:94–95` | `#f4f1ea` | `#1f1c17` | 15.05 |

`.cta` `:89` adds `linear-gradient(180deg, transparent, rgba(200,190,165,.28))`
over the page background, so text in that band sits on a darker composite than
`#f4f1ea`.

### Neumorphism — `styles/neumorphism.html`
Tokens `:19–27`. Every surface is the same colour: `--surface:#e0e5ec` on `body`
`:30`, `.out` `:40`, `.in` `:46`.

| element | selector : line | colour | on background | ratio |
|---|---|---|---|---|
| body / h1 / h3 / h2 | `body` `:31`, `.hero h1` `:67`, `.card h3` `:85`, `.cta h2` `:90` | `#4a5568` | `#e0e5ec` | 5.94 |
| logo | `.logo` `:57` | `#4a5568` | `#e0e5ec` | 5.94 |
| nav links | `.nav ul a` `:59` | `#8494ab` | `#e0e5ec` | 2.44 |
| hero subheading | `.hero p` `:69` | `#8494ab` | `#e0e5ec` | 2.44 |
| card body | `.card p` `:86` | `#8494ab` | `#e0e5ec` | 2.44 |
| card icon label | `.icon` `:83` | `#8494ab` | `#e0e5ec` | 2.44 |
| Explore button | `.btn` `:72` | `#6d5dfc` | `#e0e5ec` | 3.59 |
| CTA button | `.cta button` `:93` | `#6d5dfc` | `#e0e5ec` | 3.59 |

### Bento Grid — `styles/bento-grid.html`
Tokens `:18–28`. Page `--ground:#edeef2` (`:31`); tiles `--tile:#ffffff` (`:49`).

| element | selector : line | colour | on background | ratio |
|---|---|---|---|---|
| body / logo / h1 / h3 | `body` `:32` | `#101014` | `#ffffff` tile `:49` | 18.98 |
| nav links | `.t-nav ul a` `:84` | `#6e7079` | `#ffffff` | 4.93 |
| hero subheading | `.t-hero p` `:89` | `#6e7079` | `#ffffff` | 4.93 |
| card body | `.t-card p` `:106` | `#6e7079` | `#ffffff` | 4.93 |
| stat label | `.t-stat .lbl` `:116` | `#6e7079` | `#ffffff` | 4.93 |
| card icon chip | `.icon` `:104` | `#4f46e5` | `#dfe3ff` (own bg) | 4.96 |
| Explore button | `.btn` `:91` | `#ffffff` | `#4f46e5` | 6.29 |
| dark-tile caption | `.tile.dark` `:68` | `#ffffff` | `#101014` | 18.98 |
| CTA heading | `.tile.accent` `:70` | `#ffffff` | `#4f46e5` | 6.29 |
| CTA button | `.t-cta button` `:109` | `#101014` | `#ffffff` | 18.98 |

### Luxury Typography — `styles/luxury-typography.html`
Tokens `:19–25`. Page `--ivory:#f7f4ef` (`:28`).

| element | selector : line | colour | on background | ratio |
|---|---|---|---|---|
| body / h1 words / h3 / logo | `body` `:29`, `.logo` `:45` | `#12100e` | `#f7f4ef` | 17.30 |
| tracked capitals | `.caps` `:39` | `#8b857c` | `#f7f4ef` | 3.33 |
| nav links | `.nav ul a` `:48` | `#8b857c` | `#f7f4ef` | 3.33 |
| deck body | `.hero .deck p` `:68` | `#8b857c` | `#f7f4ef` | 3.33 |
| card body | `.card p` `:83` | `#8b857c` | `#f7f4ef` | 3.33 |
| card icon label | `.icon` `:81` | `#8b857c` | `#f7f4ef` | 3.33 |
| italic word in h1 | `.hero h1 em` `:63` | `#b09a72` | `#f7f4ef` | 2.48 |
| roman numeral | `.card .num` `:78` | `#b09a72` | `#f7f4ef` | 2.48 |
| Explore button | `.btn` `:71` | `#12100e` | `#f7f4ef` | 17.30 |
| CTA block text | `.cta` `:87` | `#f7f4ef` | `#12100e` | 17.30 |
| CTA kicker | `.cta .caps` `:92` | `rgba(247,244,239,.5)` | `#12100e` | — (alpha) |
| CTA button | `.cta button` `:96` | `#f7f4ef` | `#12100e` | 17.30 |

### Bohemian — `styles/bohemian.html`
Tokens `:19–27`. Body background: two thread gradients + ochre radial over
`--sand:#f3e7d8` (`:30–36`). Hero/cards add a translucent white layer.

| element | selector : line | colour | on background | ratio |
|---|---|---|---|---|
| body / h1 / card body | `body` `:36`, `.hero h1` `:69`, `.card p` `:107` | `#4a3627` | `#f3e7d8` base | 9.32 |
| logo | `.logo` `:54` | `#9c4f2f` | `#f3e7d8` base | 4.82 |
| nav links | `.nav ul a` `:56` | `#4a3627` | `#f3e7d8` base | 9.32 |
| hero subheading | `.hero p` `:72` | `#9c4f2f` | `rgba(255,250,242,.55)` over page (`.hero` `:62`) | — (alpha) |
| "how" in h1 | `.hero h1 em` `:70` | `#c56b4a` | same as above | — (alpha) |
| card title | `.card h3` `:106` | `#9c4f2f` | `rgba(255,250,242,.6)` (`.card` `:95`) | — (alpha) |
| card icon label | `.icon` `:105` | `#7a7f52` | same as above | — (alpha) |
| Explore button | `.btn` `:79` | `#f3e7d8` | `#9c4f2f` | 4.82 |
| CTA heading + text | `.cta` `:114`, `.cta h2` `:115` | `#f3e7d8` | `#c56b4a` + 45° ochre stripe (`:111`) | 3.09 (base) |
| CTA button | `.cta button` `:117` | `#9c4f2f` | `#f3e7d8` | 4.82 |

### Victorian — `styles/victorian.html`
Tokens `:19–26`. Body: 3 radial damask lattices + 45° weave over `--cream:#f3e7cf`
(`:29–37`). `.frame` `:47` overlays `rgba(243,231,207,.86)`.

| element | selector : line | colour | on background | ratio |
|---|---|---|---|---|
| logo | `.logo` `:60` | `#f3e7cf` | `#5d1f2b` (`.nav` `:58`) | 10.11 |
| establishment line | `.est` `:63` | `#c39a4b` | `#5d1f2b` | 4.74 |
| nav links | `.nav ul a` `:67` | `#f3e7cf` | `#5d1f2b` | 10.11 |
| nav separators | `.nav ul li + li::before` `:65` | `#c39a4b` | `#5d1f2b` | 4.74 |
| kicker | `.kicker` `:73` | `#8d6c2c` | `rgba(243,231,207,.86)` (`.frame` `:47`) | 3.97 (base) |
| hero h1 | `.hero h1` `:77` | `#5d1f2b` | same | 10.11 (base) |
| "feels" | `.hero h1 em` `:78` | `#24402f` | same | 9.27 (base) |
| hero subheading / body | `body` `:37`, `.hero p` `:80` | `#2a1a10` | same | 13.67 (base) |
| fleurons | `.fleuron` `:81`, `.frame::before/after` `:52` | `#c39a4b` / `#8d6c2c` | same | 2.13 / 3.97 |
| card icon label | `.icon` `:94` | `#8d6c2c` | same | 3.97 (base) |
| card title | `.card h3` `:95` | `#5d1f2b` | same | 10.11 (base) |
| drop cap | `.card p::first-letter` `:98` | `#24402f` | same | 9.27 (base) |
| Explore button | `.btn` `:84–85` | `#f3e7cf` | `#24402f` | 9.27 |
| CTA heading | `.cta h2` `:103` | `#f3e7cf` | `#24402f` (`.cta` `:101`) | 9.27 |
| CTA button | `.cta button` `:105–106` | `#24402f` | `#c39a4b` | 4.35 |

Note: `.lamp` elements (`:110`, markup `:165`, `:190`) have their opacity driven
between 0.55 and 1.0 by JS, so the fleuron ratios above are upper bounds.

### Cybercore — `styles/cybercore.html`
Tokens `:19–26`. Page `--void:#000000` (`:29`); panels `--panel:#050a06` (`:53`).

| element | selector : line | colour | on background | ratio |
|---|---|---|---|---|
| body / logo / h1 / h3 / h2 | `body` `:30`, `.logo` `:60`, `.hero h1` `:75`, `.card h3` `:105`, `.cta h2` `:112` | `#00ff41` | `#050a06` | 14.61 |
| nav links | `.nav ul a` `:67` | `#00ff41` | `#050a06` | 14.61 |
| hero subheading | `.hero p` `:86` | `#b6ffcb` | `#050a06` | 17.25 |
| card body | `.card p` `:106` | `#b6ffcb` | `#050a06` | 17.25 |
| box tag label | `.box::before` `:55` | `#00ff41` | `#000000` | 15.38 |
| card icon label | `.icon` `:101` | `#0a3d17` | `#050a06` | **1.61** |
| hex dump | `.card .hex` `:107` | `#0a3d17` | `#050a06` | **1.61** |
| ASCII frames | `.ascii` `:51` | `#0a3d17` | `#000000` | **1.69** |
| logo prefix `root@` | `.logo::before` `:63` | `#0a3d17` | `#050a06` | **1.61** |
| nav bracket/pipe glyphs | `:65`, `:68`, `:69` | `#0a3d17` | `#050a06` | **1.61** |
| hero prompt `$` | `.hero p::before` `:87` | `#0a3d17` | `#050a06` | **1.61** |
| Explore button | `.btn` `:93` | `#000000` | `#00ff41` | 15.38 |
| CTA button | `.cta button` `:114` | `#00ff41` | transparent → `#050a06` | 14.61 |

Additionally `body` carries `text-shadow:0 0 6px rgba(0,255,65,.55)` (`:36`) and a
`.crt` scanline overlay at `z-index:60` (`:39–40`) plus `.roll` at `z-index:61`
(`:41–43`), both of which sit over all text and are not included in these ratios.

### Wabi Sabi — `styles/wabi-sabi.html`
Tokens `:19–27`. Body: two radial washes + two grain gradients over
`--plaster:#e9e3d7` (`:30–36`).

| element | selector : line | colour | on background | ratio |
|---|---|---|---|---|
| body / h1 / h3 / h2 / logo | `body` `:36`, `.logo` `:50` | `#33302a` | `#e9e3d7` base | 10.29 |
| nav links | `.nav ul a` `:52` | `#6f6a60` | `#e9e3d7` base | 4.21 |
| hero subheading | `.hero p` `:67` | `#6f6a60` | `#e9e3d7` base | 4.21 |
| card body | `.card p` `:104` | `#6f6a60` | `#e9e3d7` base | 4.21 |
| card icon label | `.icon` `:100` | `#bda98f` | `#e9e3d7` base | **1.78** |
| CTA mark 結 | `.cta .mark` `:109` | `#bda98f` | `#e9e3d7` base | **1.78** |
| Explore button | `.btn` `:69–70` | `#33302a` | transparent → page | 10.29 |
| CTA button | `.cta button` `:113` | `#f2ede2` | `#33302a` | 11.26 |

---

## 4. Body-text colour check — Claymorphism, Pixel Art, Y2K, Graffiti, Synthwave

**All five explicitly set a body text colour and an explicit card-paragraph
colour. None falls back to a UA default.** Findings:

### Claymorphism — `styles/claymorphism.html`
- `body` `:39` → `color:var(--text)` = **`#3d3563`** (token `:37`)
- `.hero p` `:86` → `color:var(--muted)` = **`#7a72a6`** (token `:38`)
- `.card p` `:103` → `color:var(--text)` = **`#3d3563`**, plus `opacity:.78`
- Card backgrounds are the `.clay-pink` / `.clay-yellow` / `.clay-mint` classes
  (`:57`, `:59`, `:61`), i.e. `#ff8fab`, `#ffd166`, `#7ee0c9`.
- Computed at runtime: `body` `rgb(61,53,99)`, `.hero p` `rgb(122,114,166)`,
  `.card p` `rgb(61,53,99)` on `rgb(255,143,171)`.

### Pixel Art — `styles/pixel-art.html`
- `body` `:38` → `color:var(--white)` = **`#f4f4f4`** (token `:34`)
- `.hero p` `:82` → `color:var(--cyan)` = **`#41a6f6`** (token `:33`)
- `.card p` `:114` → `color:var(--slate)` = **`#566c86`** (token `:32`), on
  `.panel` background `--void:#1a1c2c` (`:44`)
- `.press` `:133` → `#566c86`
- Computed: `body` `rgb(244,244,244)`, `.hero p` `rgb(65,166,246)`,
  `.card p` `rgb(86,108,134)` on `rgb(26,28,44)`.

### Y2K Aesthetic — `styles/y2k-aesthetic.html`
- `body` `:36` → `color:var(--ink)` = **`#1d2436`** (token `:28`)
- `.hero p` `:81` → **`#2b3550`** (literal hex, not a token)
- `.card p` `:114` → **`#2b3550`** (literal hex)
- `.card h3` `:112` → **`#1d2436`**
- Note for contrast work: `.card` has **no `background-color`** — its surface comes
  from the `.plastic` class's `linear-gradient` (`:44–46`), so `getComputedStyle`
  reports `backgroundColor: rgba(0,0,0,0)`. Gradient stops are
  `rgba(255,255,255,.96)` → `rgba(233,241,252,.9)` → `rgba(206,220,240,.92)`.
- Three headings render with **`color:transparent`** and `background-clip:text`
  (`.logo` `:64`, `.hero h1` `:79`, `.cta h2` `:120`) — their visible colour is the
  gradient, not a colour value.

### Graffiti — `styles/graffiti.html`
- `body` `:40` → `color:var(--chalk)` = **`#f2f2ef`** (token `:32`)
- `.hero p` `:84` → `color:var(--chalk)` = **`#f2f2ef`**, on its own
  `background:rgba(12,12,14,.66)` (`:84`)
- `.card p` `:114` → **`#d9d9d4`** (literal hex), on `.card`
  `background:rgba(12,12,14,.55)` (`:105`) over the concrete gradient body
- Computed: `body` `rgb(242,242,239)`, `.hero p` `rgb(242,242,239)` on
  `rgba(12,12,14,0.66)`, `.card p` `rgb(217,217,212)` on `rgba(12,12,14,0.55)`.

### Synthwave — `styles/synthwave.html`
- `body` `:32` → **`#f4ecff`** (literal hex, not a token)
- `.hero p` `:89` → **`#ffe9f7`**, on `background:rgba(12,5,26,.55)` (`:90`)
- `.card p` `:114` → **`#e3d5ff`**, on `.card` `background:rgba(14,6,32,.6)` (`:105`)
- `.hero h1` `:84` is **`color:transparent`** with `background-clip:text`
- Computed: `body` `rgb(244,236,255)`, `.hero p` `rgb(255,233,247)` on
  `rgba(12,5,26,0.55)`, `.card p` `rgb(227,213,255)` on `rgba(14,6,32,0.6)`.

Both Graffiti and Synthwave composite their text over **semi-transparent panels on
top of a gradient/fixed background**, so no single opaque hex describes the
effective background.

---

## 5. Specific bug checks

### 5.1 Editorial Design — duplicate string + progress bar

**"A study in visual language, one style at a time." appears twice in the DOM.**

1. `styles/editorial-design.html:176` — the hero standfirst (the shared subheading):
```html
175      <div class="standfirst">
176        <p>A study in visual language, one style at a time.</p>
177      </div>
```
2. `styles/editorial-design.html:202` — reused verbatim as the pull quote:
```html
201    <aside class="pull">
202      <p>A study in visual language, one style at a time.</p>
203    </aside>
```
`.pull p::before/::after` (`:92–93`) add `“` / `”`.

Scroll-progress JS, `styles/editorial-design.html:297–310`:
```js
297  <script>
298    /* Reading progress: the only motion a magazine page earns. */
299    (function () {
300      var bar = document.getElementById('progress');
301      function update() {
302        var max = document.documentElement.scrollHeight - window.innerHeight;
303        var p = max > 0 ? window.scrollY / max : 0;
304        bar.style.width = (p * 100).toFixed(2) + '%';
305      }
306      update();
307      window.addEventListener('scroll', update, { passive: true });
308      window.addEventListener('resize', update);
309    })();
310  </script>
```
`document.documentElement.scrollHeight` includes the `<section class="design-points">`
block (`:220–295`), so the denominator spans the documentation section as well as
the styled demo. Bar CSS: `#progress{position:fixed;top:0;left:0;height:3px;width:0;background:var(--red);z-index:90}` (`:38`).

### 5.2 Bento Grid — nav span, bar animation

**Nav has an explicit span rule.** `styles/bento-grid.html:74`:
```css
74  .t-nav{grid-column:span 6;flex-direction:row;align-items:center;justify-content:space-between;padding:18px 26px}
```
(and `:120` `.t-nav,.t-hero,.t-mark,.t-cta{grid-column:span 2}` under `max-width:820px`).
Applied at `:163` `<nav class="tile t-nav">`. Grid container `.bento` `:38–44` is
`repeat(6,1fr)` with `grid-auto-rows:minmax(112px,auto)`.

**The stat-tile bars animate `height`, not `transform`.**

CSS `styles/bento-grid.html:113–114`:
```css
113  .t-stat .bars{display:flex;align-items:flex-end;gap:6px;height:78px;margin-bottom:6px}
114  .t-stat .bars i{flex:1;background:var(--tint);border-radius:5px;transition:height .5s cubic-bezier(.2,.8,.3,1)}
```
Markup `:207` sets inline percentage heights:
```html
207  <div class="bars"><i style="height:24%"></i><i style="height:52%"></i><i style="height:38%"></i><i style="height:74%"></i><i style="height:46%"></i><i style="height:90%"></i></div>
```
JS `:306–311` reads the inline height, zeroes it, and restores it on a timer:
```js
306      var bars = document.querySelectorAll('.t-stat .bars i');
307      bars.forEach(function (b, i) {
308        var h = b.style.height;
309        b.style.height = '0%';
310        setTimeout(function () { b.style.height = h; }, 180 + i * 60);
311      });
```

### 5.3 Y2K — `mix-blend-mode`

**One occurrence, value `overlay`**, on `.card::after` (the holographic foil layer):

`styles/y2k-aesthetic.html:102–107`
```css
102  .card::after{ /* iridescent foil sweep */
103    content:"";position:absolute;inset:0;pointer-events:none;opacity:.62;mix-blend-mode:overlay;
104    background:conic-gradient(from 0deg, rgba(255,122,198,.55), rgba(200,162,255,.5), rgba(122,224,255,.5),
105       rgba(255,244,150,.5), rgba(255,122,198,.55));
106    transition:transform .6s ease,opacity .4s ease}
107  .card:hover::after{transform:rotate(38deg) scale(1.5);opacity:.72}
```
No other `mix-blend-mode` declaration exists on the page. Card text is lifted above
the overlay with `position:relative;z-index:1` on `.icon` (`:111`), `.card h3`
(`:113`) and `.card p` (`:114`).

### 5.4 Pixel Art & Graffiti — `<em>` around "how"

**Both wrap "how" in `<em>` and both explicitly cancel the italic.**

Pixel Art — markup `styles/pixel-art.html:190`:
```html
190        <h1>Design is <em>how</em> it feels to use.</h1>
```
CSS `styles/pixel-art.html:81`:
```css
81  .hero h1 em{font-style:normal;color:var(--yellow);text-shadow:var(--px) var(--px) 0 var(--red)}
```

Graffiti — markup `styles/graffiti.html:188`:
```html
188      <h1 class="spray">Design is <em>how</em> it feels to use.</h1>
```
CSS `styles/graffiti.html:74`:
```css
74  .hero h1 em{font-style:normal;color:var(--yellow);text-shadow:9px 11px 0 rgba(0,0,0,.55),0 0 40px rgba(255,212,0,.4)}
```
So on both pages the `<em>` renders upright, differentiated by colour only, while
retaining emphasis semantics for assistive tech. The only other `font-style` in
either file is inside the shared Design Points block (`pixel-art:148`,
`graffiti:146`).

For completeness, all pages that wrap a word in inline markup inside the H1:
`bohemian:173` `<em>how</em>`, `cyberpunk:179` `<span>how it feels</span>`,
`glassmorphism:169` `<b>feels</b>`, `graffiti:188` `<em>how</em>`,
`luxury-typography:156` `<em>feels</em>`, `maximalism:173` `<em>how</em>`,
`neo-classical:153` `<em>feels</em>`, `pixel-art:190` `<em>how</em>`,
`surrealism:173` `<span class="small">how</span>` + `<span class="big">feels</span>`,
`victorian:164` `<em>feels</em>`.

### 5.5 Surrealism — flee-from-cursor

Full JS, `styles/surrealism.html:300–311`:
```js
300      var btn = document.getElementById('btn');
301      window.addEventListener('pointermove', function (e) {
302        var r = btn.getBoundingClientRect();
303        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
304        var dist = Math.hypot(e.clientX - cx, e.clientY - cy);
305        if (dist < 130) {
306          var a = Math.atan2(cy - e.clientY, cx - e.clientX);
307          btn.style.transform = 'translate(' + Math.cos(a) * 90 + 'px,' + Math.sin(a) * 60 + 'px)';
308        } else if (dist > 240) {
309          btn.style.transform = 'translate(0,0)';
310        }
311      });
```

- **Boundary clamp: none.** The offset is computed purely from the angle to the
  pointer (max ±90px X, ±60px Y from the element's static position). There is no
  viewport, container, or `Math.min/max` clamp anywhere in the handler.
- **Touch handling: no `touchstart`/`touchmove`/`touchend` listeners exist on the
  page** (grepped `touch` — the only match is the literal text "Get in touch" at
  `:200`). The single listener is `pointermove` on `window`, which fires for touch
  pointers.
- The element is an anchor, not a button — `:176` `<a href="#" class="btn" id="btn">Explore</a>`.
  Transition: `.btn` `:79` `transition:transform .9s cubic-bezier(.16,1,.3,1)`.
- **Cursor CSS:** `body{…cursor:crosshair}` at `styles/surrealism.html:38`. There is
  **no `cursor` rule for `a`, `.btn`, or any clickable element** on the page, so the
  Explore anchor and all nav links inherit `crosshair`. `<button>` elements do get
  `cursor:pointer` — but from `assets/reset.css:41`, not from this page — so the
  "Get in touch" button and the "Explore" anchor render different cursors.

### 5.6 Scrapbook — drag implementation

**`touch-action` is set, to `none`.** `styles/scrapbook.html:98`:
```css
98  .card{padding:26px 22px 30px;cursor:grab;touch-action:none;transition:box-shadow .2s ease}
…
103  .card:active{cursor:grabbing}
```
Applied to the three feature cards, which also carry a `data-drag` attribute
(`:188`, `:194`, `:200`).

JS `styles/scrapbook.html:298–323`:
```js
298    /* Cards are objects on a board: drag them, and they never land straight. */
299    (function () {
300      document.querySelectorAll('[data-drag]').forEach(function (card) {
301        var dx = 0, dy = 0, sx = 0, sy = 0, dragging = false;
302        var base = (Math.random() * 4 - 2).toFixed(2);
303        card.style.transform = 'rotate(' + base + 'deg)';
304
305        card.addEventListener('pointerdown', function (e) {
306          dragging = true;
307          sx = e.clientX - dx; sy = e.clientY - dy;
308          card.style.zIndex = 20;
309          card.setPointerCapture(e.pointerId);
310        });
311        card.addEventListener('pointermove', function (e) {
312          if (!dragging) return;
313          dx = e.clientX - sx; dy = e.clientY - sy;
314          card.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + base + 'deg) scale(1.03)';
315        });
316        card.addEventListener('pointerup', function () {
317          dragging = false;
318          base = (Math.random() * 5 - 2.5).toFixed(2);
319          card.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + base + 'deg)';
320          card.style.zIndex = 5;
321        });
322      });
323    })();
```
No `pointercancel` or `lostpointercapture` handler is registered. There is no
keyboard alternative and the cards are `<article>` elements with no `tabindex`.

### 5.7 Neumorphism — Explore click handler

`styles/neumorphism.html:257–266`:
```js
257    /* One idea, made interactive: press the page in, press it back out. */
258    (function () {
259      var btn = document.getElementById('explore');
260      btn.addEventListener('click', function (e) {
261        e.preventDefault();
262        document.body.classList.toggle('pressed');
263        btn.classList.toggle('on');
264      });
265    })();
266  </script>
```
Target markup `:149` `<a href="#" class="btn" id="explore">Explore</a>`.
The classes it toggles: `body.pressed .card` `:51`, `body.pressed .hero` `:52`,
`.btn:active,.btn.on` `:76`. The anchor has no `role`, no `aria-pressed`, and
`href="#"`; the handler calls `preventDefault()` unconditionally.

### 5.8 Neo-Brutalism — counter and press state

**The count is hardcoded, not derived.** `styles/neo-brutalism.html:271–282`:
```js
271    /* Count the badge up to 29 — one for each style in the set. */
272    (function () {
273      var el = document.getElementById('count');
274      var target = 29, start = null;
275      function step(ts) {
276        if (!start) start = ts;
277        var p = Math.min((ts - start) / 900, 1);
278        el.textContent = String(Math.round(p * target)).padStart(2, '0');
279        if (p < 1) requestAnimationFrame(step);
280      }
281      requestAnimationFrame(step);
282    })();
```
`var target = 29` is a literal at `:274`. There is no array, no `length`, and no
DOM query that could derive it. The element is `:162`
`<p class="count" id="count">00</p>`.

Press/`:active` CSS:
```css
55  .nav ul a:hover{background:var(--mint)}
56  .nav ul a:active{transform:translate(3px,3px);box-shadow:0 0 0 var(--ink)}
67  .btn:hover{transform:translate(-2px,-2px);box-shadow:9px 9px 0 var(--ink)}
68  .btn:active{transform:translate(6px,6px);box-shadow:0 0 0 var(--ink)}
85  .card:hover{transform:translate(-2px,-2px);box-shadow:9px 9px 0 var(--ink)}
99  .cta button:active{transform:translate(6px,6px);box-shadow:0 0 0 var(--ink)}
```
Asymmetries as written: `.card` (`:81–85`) has a `:hover` rule but **no `:active`**;
`.cta button` (`:95–99`) has an `:active` rule but **no `:hover`**. No `:focus` or
`:focus-visible` rule exists anywhere in the file.

### 5.9 Claymorphism — fixed attachment and card titles

**`background-attachment: fixed` is used once**, on `body` —
`styles/claymorphism.html:38`, inside the `body` rule at `:33–43`:
```css
34    background:
35      radial-gradient(1000px 600px at 12% -5%, var(--ground2) 0%, transparent 60%),
36      radial-gradient(900px 700px at 92% 8%, #d9f5ee 0%, transparent 55%),
37      linear-gradient(165deg, var(--ground1) 0%, #efe9ff 55%, var(--ground2) 100%);
38    background-attachment:fixed;
```
The three `.blob` elements are separately `position:fixed` (`:65`).

Card title CSS and available width:
```css
45  .wrap{max-width:1040px;margin:0 auto;padding:34px 0 80px;position:relative;z-index:1}
94  .features{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;margin-top:44px}
95  .card{padding:38px 28px 40px;text-align:center;border-radius:40px;
96    transition:transform .32s cubic-bezier(.34,1.56,.64,1)}
102 .card h3{font-family:"Baloo 2",cursive;font-size:26px;font-weight:700;margin-bottom:6px}
```
Measured at a 1280px viewport: card outer width **326.7px**, horizontal padding
28px + 28px, so **content width 270.7px**. Rendered `h3` box is 270.7px; the title
glyph runs are 111.6px ("Structure"), 101.4px ("Contrast"), 91.3px ("Rhythm") — all
**single-line, no wrap** at 26px. Below `max-width:820px` the grid collapses to one
column (`:114`).

### 5.10 Ethereal — button hover and hero gradient

**`text-indent` changes on hover but is NOT in the `transition` list**, on both
buttons — so `letter-spacing` animates over 1.2s while `text-indent` snaps.

`styles/ethereal.html:80–85` (hero button):
```css
80  .btn{display:inline-block;margin-top:58px;font-size:11px;font-weight:300;letter-spacing:.4em;
81    text-indent:.4em;text-transform:uppercase;color:var(--ink);padding:16px 4px;
82    border-bottom:1px solid rgba(143,136,171,.4);background:transparent;
83    transition:letter-spacing 1.2s cubic-bezier(.16,1,.3,1),border-color 1.2s ease,text-shadow 1.2s ease}
84  .btn:hover{letter-spacing:.56em;text-indent:.56em;border-color:var(--glow);
85    text-shadow:0 0 22px rgba(201,184,245,1)}
```
`styles/ethereal.html:110–115` (CTA button) — same pattern:
```css
110  .cta button{margin-top:44px;font-family:"Montserrat",sans-serif;font-size:11px;font-weight:300;
111    letter-spacing:.4em;text-indent:.4em;text-transform:uppercase;color:var(--ink);
112    padding:16px 4px;border-bottom:1px solid rgba(143,136,171,.4);
113    transition:letter-spacing 1.2s cubic-bezier(.16,1,.3,1),border-color 1.2s ease,text-shadow 1.2s ease}
114  .cta button:hover{letter-spacing:.56em;text-indent:.56em;border-color:var(--glow);
115    text-shadow:0 0 22px rgba(201,184,245,1)}
```
The transition list names three properties: `letter-spacing`, `border-color`,
`text-shadow`. `text-indent` is absent from both.

**Hero headline gradient — 4 stops**, `styles/ethereal.html:73`:
```css
73  background:linear-gradient(104deg,#6d5fa8 0%,#a98bd6 32%,#e79ec2 58%,#7fc3cf 100%);
74  -webkit-background-clip:text;background-clip:text;color:transparent;
```
| stop | colour | position |
|---|---|---|
| 1 | `#6d5fa8` | 0% |
| 2 | `#a98bd6` | 32% |
| 3 | `#e79ec2` | 58% |
| 4 | `#7fc3cf` | 100% |

Angle `104deg`. `color:transparent` at `:74`, so there is no fallback colour if
`background-clip:text` is unsupported.

### 5.11 Mixed Media — misregistration hover

**It transforms a decorative overlay element only (`.wash`), never a text node.**

JS `styles/mixed-media.html:311–322`:
```js
311    /* Misregistration on hover; re-paste the ransom note on click. */
312    (function () {
313      document.querySelectorAll('.card').forEach(function (card) {
314        var plate = card.querySelector('.wash');
315        if (!plate) return;
316        card.addEventListener('pointerenter', function () {
317          var x = (Math.random() * 12 - 6).toFixed(1);
318          var y = (Math.random() * 12 - 6).toFixed(1);
319          plate.style.transform = 'translate(' + x + 'px,' + y + 'px)';
320        });
321        card.addEventListener('pointerleave', function () { plate.style.transform = 'none'; });
322      });
```
`.wash` is an empty `<span aria-hidden="true">` (markup `:203`, `:211`, `:219`).
Its CSS carries **no `transition`**, so the offset applies instantly:
```css
111  .card:nth-child(1) .wash{position:absolute;inset:auto -20% -30% -20%;height:120px;background:var(--riso-yellow);
112    border-radius:50%;opacity:.75}
113  .card:nth-child(2) .wash{position:absolute;inset:-30% -20% auto -20%;height:130px;background:var(--riso-blue);…}
115  .card:nth-child(3) .wash{position:absolute;inset:auto -30% -40% 30%;height:150px;background:var(--riso-pink);…}
```
Card text sits above it via `position:relative;z-index:2` on `.icon` (`:117`),
`.card h3` (`:120`) and `.card p` (`:122`). The only other JS transform on this page
targets `.hero h1 .w` word spans on **click**, not hover (`:324–330`).

### 5.12 Conceptual Sketch — dimension lines and overflow

`.dim` is absolutely positioned and deliberately hangs 26px below its parent's box:

`styles/conceptual-sketch.html:92–98`:
```css
92  .dim{position:absolute;left:34px;right:34px;bottom:-26px;height:1px;background:var(--soft);
93    pointer-events:none}
94  .dim::before,.dim::after{content:"";position:absolute;top:-4px;width:1px;height:9px;background:var(--soft)}
95  .dim::before{left:0}
96  .dim::after{right:0}
97  .dim b{position:absolute;left:50%;transform:translate(-50%,-52%);background:var(--paper);padding:0 8px;
98    font-family:"Courier Prime",monospace;font-size:11px;font-weight:400;color:var(--soft)}
```
Markup `:185`: `<span class="dim" aria-hidden="true"><b class="mono">1080 × auto</b></span>`,
inside `<header class="hero drawn">`. Its containing block is `.drawn`, which is
`position:relative` (`:47`) — see `:43–48`.

**There is no `overflow` declaration anywhere in `conceptual-sketch.html`** — grep
for `overflow` returns zero hits in the file, including on `body` (`:29–39`) and
`.wrap` (`:40`). So nothing clips `.dim`, `.note` (`:90`, also absolute, at
`right:8%`/`left:6%` inline offsets), or `.card .tag` (`:103`, `top:-11px`). Below
860px `.note` is hidden (`:127`); `.dim` is not.

### 5.13 Victorian — flicker timer

`styles/victorian.html:277–288`:
```js
277    /* Gaslight: the gilt ornaments burn rather than print. */
278    (function () {
279      document.querySelectorAll('.lamp').forEach(function (el) {
280        (function flicker() {
281          var deep = Math.random() < 0.18;
282          el.style.opacity = deep ? (0.55 + Math.random() * 0.12).toFixed(2)
283                                  : (0.88 + Math.random() * 0.12).toFixed(2);
284          setTimeout(flicker, 90 + Math.random() * 330);
285        })();
286      });
287    })();
```
- **Interval: `90 + Math.random() * 330` → minimum 90 ms, maximum 420 ms.**
- Opacity: 18% of ticks land in **0.55–0.67**; the other 82% in **0.88–1.00**.
- It is a `setTimeout` recursion with **no termination condition** and no
  `document.hidden` / visibility check — it runs for the lifetime of the page.
- There is **no `@keyframes` for the flicker**; only `.lamp{transition:opacity .12s linear}`
  at `:110` smooths each step.
- Targets: two elements, `:165` (`❦ ❖ ❦`) and `:190` (`❧`), both `aria-hidden="true"`.

Because this is a JS style write, the `prefers-reduced-motion` block in
`reset.css:45` does not suppress it (it only shortens CSS transition duration to
0.01ms, which makes each opacity step instantaneous rather than stopping it).

### 5.14 Cybercore — body-wide opacity keyframe

**Yes, it exists.** `styles/cybercore.html:45–46`:
```css
45  body{animation:mains 6.5s steps(1) infinite}
46  @keyframes mains{0%,96%{opacity:1}97%{opacity:.86}98%{opacity:1}99%{opacity:.92}}
```
This animates `opacity` on `<body>` itself, infinitely, at `steps(1)`. Context
(`:38–46`):
```css
38  /* CRT: scanlines, a rolling band, and mains flicker. */
39  .crt{position:fixed;inset:0;z-index:60;pointer-events:none;
40    background:repeating-linear-gradient(0deg, rgba(0,0,0,.45) 0 1px, transparent 1px 3px)}
41  .roll{position:fixed;left:0;right:0;height:130px;z-index:61;pointer-events:none;
42    background:linear-gradient(180deg, transparent, rgba(0,255,65,.055), transparent);
43    animation:roll 7s linear infinite}
44  @keyframes roll{from{top:-140px}to{top:100%}}
```
Other infinite CSS animations on the page: `.roll` (`:43`, 7s) and `.cursor`
(`:89`, `blink 1s steps(1) infinite`). Note that `body` carrying a non-`none`
`animation` creates a containing block for `position:fixed` descendants.

### 5.15 Swiss Design — `G` keydown listener

Full listener, `styles/swiss-design.html:285–298`:
```js
285    /* Grid overlay: G toggles it; it also flashes once on load so the
286       system announces itself before the user touches anything. */
287    (function () {
288      var overlay = document.getElementById('overlay');
289      var hint = document.querySelector('.hint');
290      function toggle() { overlay.classList.toggle('on'); }
291      document.addEventListener('keydown', function (e) {
292        if (e.key === 'g' || e.key === 'G') toggle();
293      });
294      hint.addEventListener('click', toggle);
295      overlay.classList.add('on');
296      setTimeout(function () { overlay.classList.remove('on'); }, 1100);
297    })();
298  </script>
```
As written:
- Listener is on `document`, with no check of `e.target` (no input/textarea/
  contenteditable guard). The page contains no form fields.
- No modifier check — `Ctrl+G`, `Meta+G`, `Alt+G` also fire the toggle.
- No `e.preventDefault()` and no `repeat` guard (holding the key auto-repeats the toggle).
- The click affordance `.hint` is a `<p>` (`:204` `<p class="hint">Press <b>G</b> for grid</p>`),
  not a `<button>` — it has no `tabindex`, no `role`, and no key handler of its own.
- Overlay CSS `:100–104`; it is `position:fixed; inset:0; pointer-events:none; z-index:50`.

---

## 6. Notes on method

- Colour pairs in §3 were cross-checked against `getComputedStyle` in headless
  Chromium at a 1280×900 viewport with the page's real webfonts loaded, then traced
  back to the declaring selector and line in source. Where a background is a
  gradient or has alpha, that is stated and no ratio is given.
- Claymorphism card widths in §5.9 were measured from live geometry
  (`getBoundingClientRect` plus a `Range` over the heading text), not calculated.
- Every "not present" claim was established by grepping the whole file or the whole
  repo, not by inspection of a sample.
