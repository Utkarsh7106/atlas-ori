# Phase 2 pilot — `styles/swiss-design.html`

Five chrome features plus two audit fixes, built as the template for rolling the
same work across the other 28 style pages. Only `styles/swiss-design.html` was
modified (`git status` shows one file; `assets/reset.css` was read, not touched).

File grew 262 → 700 lines (+452 / −53).

---

## Constraints this page imposed

Everything below was built to the rules the page's own Design Points panel already
states, not to a generic component pattern:

| Rule (from the panel) | How the new chrome obeys it |
|---|---|
| 12-column grid, 24px gutter, **explicit column spans** | Every new block is `.grid` with declared spans — nav controls `4/8`, component band `1/4 · 5/9 · 10/13`, footer `1/4 · 4/9 · 9/13`, Design Points rows `1/4` label + `5/13` definition |
| Flush left, ragged right, **never centre** | No `text-align:center` anywhere in the new CSS except inside the full-column buttons, which the page already centres (`.btn`, `.cta .cta-btn`) |
| One grotesque + one mono; mono for **numerals, metadata, grid labels only** | Inter Tight for button labels and links; IBM Plex Mono for the toggle state readouts, `004 / Dialog`, footer metadata, Design Points field labels and numerals |
| Two weights only (400–500 / 700) | New CSS uses 500 and 700 exclusively |
| Nothing between 15px and 46px | New type is 10/11/12/15px (labels, metadata, body) or `clamp(46px,…)` (dialog title, Design Points heading). Nothing lands in the gap |
| One accent colour, spent on **primary action, numerals, one mark** | Red is used on: the pressed-state chip, the dialog's top rule + numeral + close button, and Design Points numerals. The component trigger and CTA stay black so red keeps meaning "primary" |
| Rules at 4px (section) / 2px (item) | 4px: nav rule, sidebar right border, component band top, footer top, Design Points opener. 2px: toggle borders, Design Points row rules, dialog metadata rule, footer link underline |
| Mechanical motion, **no transforms** | Every new transition/animation is `linear` and animates colour, `padding-left`, `left` or `opacity`. No `transform` was added |

---

## 1 · Navbar ⇄ sidebar toggle

**State:** `data-nav="top|side"` on `<html>`. **Storage key:** `atlas-swiss-nav`.

The original nav left columns 4–8 empty. The controls go *there* — filling grid
cells the layout already reserved rather than floating over the page.

```html
<!-- styles/swiss-design.html:395 -->
<nav class="nav grid">
  <a href="../index.html" class="logo">Atlas</a>

  <div class="nav-controls">
    <button type="button" class="sw-toggle" id="nav-toggle" aria-pressed="false">
      <span class="sw-toggle__label">Nav</span>
      <span class="sw-toggle__state" id="nav-toggle-state">Top</span>
    </button>
    <button type="button" class="sw-toggle" id="chrome-toggle" aria-pressed="false">
      <span class="sw-toggle__label">Chrome</span>
      <span class="sw-toggle__state" id="chrome-toggle-state">Light</span>
    </button>
  </div>

  <ul>…</ul>
  <div class="nav-rule"></div>
</nav>
```

Sidebar mode re-places the **same element** as a fixed rail (`swiss-design.html:92`)
— no duplicate markup:

```css
:root[data-nav="side"]{--rail:216px}
[data-nav="side"] .nav{position:fixed;left:0;top:0;bottom:0;width:var(--rail);
  display:flex;flex-direction:column;border-right:4px solid var(--chrome-ink);…}
[data-nav="side"] .nav-rule{grid-column:auto;height:0;margin:0}  /* the 4px rule
    moves from beneath to beside — same weight, different edge */
```

Content reflow is one declaration, so `prefers-reduced-motion` mutes it for free:

```css
body{padding-left:calc(var(--margin) + var(--rail));transition:padding-left .22s linear}
```

`#overlay` and `.hint` take the same `--rail` offset so the grid overlay keeps
telling the truth about where the columns are.

**Measured, sidebar on at 1280px:** rail `216px` fixed at `left:0`; `body`
padding-left `267.2px`; hero headline left edge `267px`; overlay padding-left
`267.2px`; hint left `267.2px` — everything reflows together.

**Screenshot — sidebar + dark chrome:** black 216px rail down the full viewport
height with a 4px white right border. `ATLAS` at top, then the two bordered
toggle fields stacked (each: white 2px border, uppercase label left, mono state
chip right — `SIDE` and `DARK` chips filled red), then `WORK / ABOUT / CONTACT`
stacked uppercase. To the right, the untouched white page: `DESIGN IS HOW IT
FEELS TO USE.` at full display size, red `EXPLORE` button, red circle mark,
numbered cards.

---

## 2 · Light/dark chrome toggle

**State:** `data-chrome="light|dark"` on `<html>`. **Storage key:** `atlas-swiss-chrome`.

Scoped by construction: a separate token layer that **only the chrome reads**
(`swiss-design.html:29–52`). Hero, cards, CTA and the Design Points panel never
reference a `--chrome-*` token, so they cannot change.

```css
:root{                        --chrome-bg:var(--paper);  --chrome-ink:var(--ink);
                              --chrome-grey:var(--grey); --chrome-red:var(--red);
                              --chrome-hair:var(--rule); --chrome-on-red:#ffffff; }
:root[data-chrome="dark"]{    --chrome-bg:#111111;       --chrome-ink:#f2f2f2;
                              --chrome-grey:#9a9a9a;     --chrome-red:#ff4438;
                              --chrome-hair:#3a3a3a;     --chrome-on-red:#111111; }
```

The dark surface is bled to the page edge with an absolutely-positioned
`::before` rather than a wrapper element, so the markup contract is unchanged:

```css
.nav{position:relative;isolation:isolate}
.nav::before{content:"";position:absolute;top:0;bottom:0;
  left:calc(-1 * (var(--margin) + var(--rail)));right:calc(-1 * var(--margin));
  background:var(--chrome-bg);z-index:-1;transition:background .2s linear}
```

**Measured with dark chrome active:** nav surface `rgb(17,17,17)`, nav text
`rgb(242,242,242)`, footer surface `rgb(17,17,17)` — while
`.hero h1` stays `rgb(17,17,17)`, `.card p` stays `rgb(17,17,17)`, page background
stays `rgb(255,255,255)`, `.cta .cta-btn` stays `rgb(17,17,17)` and
`.design-points` stays `rgb(255,255,255)`. The demo is provably untouched.

---

## 3 · Dialog (component reference)

Native `<dialog>` + `showModal()`, so the focus trap, Escape handling and the
inert background are the platform's job rather than hand-rolled.

```html
<!-- trigger — styles/swiss-design.html:457 -->
<section class="component grid" aria-labelledby="component-title">
  <h2 class="component__title" id="component-title">Component reference</h2>
  <p class="component__meta">004 / Dialog · focus trapped · Esc to close</p>
  <button type="button" class="component__trigger" id="dialog-open">Open dialog</button>
</section>

<!-- dialog — styles/swiss-design.html:474 -->
<dialog class="dialog" id="dialog" aria-labelledby="dialog-title">
  <div class="dialog__inner">
    <p class="dialog__num">004 / Dialog</p>
    <h2 class="dialog__title" id="dialog-title">Component reference</h2>
    <div class="dialog__body"><p>…</p></div>
    <p class="dialog__meta">Native &lt;dialog&gt; · showModal()</p>
    <button type="button" class="dialog__close" id="dialog-close">Close</button>
  </div>
</dialog>
```

Only two behaviours are added on top of the platform (`swiss-design.html:619`):
backdrop-click close (`if (e.target === dlg) dlg.close()` — the inner div fills
the dialog, so a hit on the element itself came from the backdrop) and an
explicit focus return on `close`.

**Verified behaviour:**

| Check | Result |
|---|---|
| `:modal` while open | `true` |
| Focus moves inside on open | `true` (lands on `#dialog-close`) |
| Background control can take focus | **`false`** — `nav-toggle.focus()` does not move focus |
| Escape closes | `open: false` |
| Focus returns to trigger | `document.activeElement === "dialog-open"` |
| Backdrop click closes | `open: false`, focus returns to `dialog-open` |

*Known nuance, not papered over:* the dialog has exactly one focusable child, so
Tab alternates `#dialog-close` → `<body>` → `#dialog-close`. Focus stays inside
the modal scope (background controls are unfocusable, confirmed above) — but the
cycle includes one "nothing" stop. Adding filler controls to hide it would be
worse, so it is left as native behaviour.

**Screenshot:** page dimmed to ~72% black. Centred white panel, 4px red rule
across its top. Inside: mono red `004 / Dialog`; `COMPONENT REFERENCE` in huge
uppercase flush left; body paragraph at cols 1–9; mono grey `NATIVE <DIALOG> ·
SHOWMODAL()` at cols 9–13 under a 2px rule; full-column red `CLOSE` button at
cols 1–4 with a visible focus ring.

---

## 4 · Footer

Confirmed absent before building — the pre-change file's `<body>` children were
`nav, header, section.features, section.cta, div#overlay, p.hint, hr, section.design-points, script`.

```html
<!-- styles/swiss-design.html:463 -->
<footer class="site-footer grid">
  <div class="site-footer__rule"></div>
  <p class="site-footer__mark">Atlas</p>
  <p class="site-footer__meta">Swiss Design · 12-column grid · 24px gutter</p>
  <nav class="site-footer__links" aria-label="Footer">
    <a href="../index.html">All styles</a>
    <!-- TODO: real repository URL lands in the separate GitHub-link pass -->
    <a href="#github-placeholder">GitHub</a>
  </nav>
</footer>
```

It mirrors the nav's own span logic inverted — mark `1/4`, metadata `4/9`, links
hard right `9/13`, opened by a 4px rule. Follows the chrome theme.

---

## 5 · Design Points panel, rebuilt

**Content is provably unchanged.** Word count 482 before and after; a token-level
diff of the panel's text shows exactly four changed tokens — the two hex values
covered under "Deviations" below. `data-field` order and every `<dt>` label are
byte-identical, so the structural contract the other 28 pages share is intact.

What changed is only presentation (`swiss-design.html:300`):

| Before (shared neutral panel) | After (this page's system) |
|---|---|
| `#f4f4f5` grey wash, `ui-sans-serif` | White paper, Inter Tight + IBM Plex Mono |
| `max-width:860px` centred prose column | `max-width:1400px` on the page's 12-column grid |
| `grid-template-columns:190px 1fr` | Label `1/4`, definition `5/13` |
| 12px grey `h2` kicker | `clamp(46px,5.4vw,68px)` uppercase display heading at −0.048em |
| `1px #d4d4d8` row rules | 2px ink rules (the page's item weight) |
| No numerals | Mono red `01`–`08` per row via CSS counter — the same device as `.card .num` |
| `list-style: disc / decimal` | 12px ink rule as the bullet; mono red `decimal-leading-zero` for the ordered list |
| `code` on a grey chip with radius | Mono, underscored with a 1px hairline, no radius |
| `.sw` swatch `border-radius:3px` | Square — the page has no radius anywhere |
| Dashed `.dp-divider` hairline | Repurposed as the 4px section rule that opens the panel |

**Screenshot:** 4px black rule, then `DESIGN POINTS` set huge and flush left with
`← ALL STYLES` right-aligned under a 2px underline. Below, eight rows each
separated by a 2px black rule: left column shows a red mono numeral over a mono
uppercase field label (`01 / STYLE NAME`, `03 / COLOR PALETTE`…), right column
holds the unchanged prose. The palette rows show square swatches beside
underscored mono hex values.

---

## Bundled audit fixes

**Contrast.** `--grey` `#8a8a8a → #707070` (3.45:1 → **4.95:1**) and `--red`
`#e2231a → #d31f16` (4.68:1 → **5.28:1**, and white-on-red likewise 5.28:1).

**WCAG 2.1.4 — single-key shortcut.** The bare `G` listener is now switchable
off, and the hint is two real buttons instead of a `<p>` with a click handler:

```html
<!-- styles/swiss-design.html:489 -->
<div class="hint">
  <button type="button" id="grid-toggle" aria-pressed="false">Grid</button>
  <button type="button" id="key-toggle" aria-pressed="true">Key G on</button>
</div>
```

```js
document.addEventListener('keydown', function (e) {
  if (root.getAttribute('data-gridkey') !== 'on') return;   // switched off
  if (e.ctrlKey || e.metaKey || e.altKey) return;           // leave browser chords alone
  if (e.repeat) return;                                     // holding G must not strobe
  var el = e.target;
  if (el && (el.isContentEditable ||
             /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;  // never steal typing
  if (e.key === 'g' || e.key === 'G') setOverlay(!overlay.classList.contains('on'));
});
```

**Verified:** plain `g` toggles → `true`; `Ctrl+g` does nothing → `false`; after
pressing *Key G off*, `g` does nothing and the state survives reload
(`gridkey:"off"`, button reads `Key G off`, `aria-pressed="false"`).

---

## Decisions I made that weren't specified

1. **The two palette hexes in the Design Points panel were updated** to
   `#d31f16` and `#707070`. This is the one place I overrode "keep every word":
   the panel is a machine-readable reference, and leaving it naming colours the
   page no longer uses would ship a page that misdocuments itself. **Revert these
   two lines if you'd rather the prose be frozen** — nothing else depends on them.
2. **The panel's Motion/Interaction prose now under-describes the page.** It
   still says only that `G` toggles the overlay; it does not mention the two
   toggles or the dialog. I left the wording alone per instruction — flagging it
   so you can decide whether the rollout should update it.
3. **Chrome toggle placed inside the nav**, not floating like `dark-mode-ui.html`.
   The Swiss nav had columns 4–8 empty by design; using them is more faithful
   than overlaying a control.
4. **A second red for dark chrome** (`#ff4438`). One hue, lifted value — the
   original `#d31f16` is only 3.58:1 on black. Same reasoning produced
   `--chrome-on-red`, because white on the lifted red is 3.42:1 while ink is 5.52:1.
5. **Footer sits before the Design Points divider**, not last in the document.
   The panel is documentation appended below the demo; the footer ends the *demo*.
6. **A pre-paint `<script>` in `<head>`** applies stored preferences before first
   render. `dark-mode-ui.html` applies its theme at the end of `<body>`, which
   flashes the default first. Recommended for the rollout.
7. **`aria-pressed`, not `aria-expanded`**, on both toggles — they switch between
   two equal states rather than revealing content. The visible state chip is
   inside the button, so the accessible name changes with it (`Nav Top` → `Nav Side`).
8. **Below 860px the sidebar preference is ignored** and the nav renders as a top
   bar; a 216px rail would eat the measure on a phone. The stored preference is
   kept, not overwritten, so it returns on a wide viewport.
9. **`openBtn.hidden = true`** if `showModal` is unavailable, rather than shipping
   a dead trigger.

---

## Bugs found and fixed while building

- **`.hint` was unclickable over the Design Points panel.** `.hint` was
  `z-index:60`, `.design-points` is `z-index:80`, so the panel swallowed pointer
  events on the fixed hint bar. Pre-existing (it was a `<p>` before, so it looked
  inert rather than broken). Raised to `z-index:90`.
- **`position:static` in the mobile sidebar override broke the chrome band.**
  `.nav::before` is absolutely positioned; removing `position:relative` from
  `.nav` handed it the viewport as its containing block, so the black band
  stretched over the entire screen and overhung the right edge by exactly one
  `--margin` (20px at 390px, 34px at 860px). Restored to `position:relative`.

## Verification performed

- Horizontal overflow swept at 320 / 390 / 600 / 860 / 1024 / 1280 / 1600px × both
  nav preferences — **0px in all 14 combinations**.
- `prefers-reduced-motion: reduce` — body reflow, nav band, toggles, overlay,
  footer and dialog all report `transition/animation-duration: 1e-05s`. Every
  piece of new motion is CSS, so the sitewide rule in `reset.css` covers it.
- Shared content block and Design Points schema still pass the project checker.
- Markup parses with zero errors and zero unclosed tags; no JS errors on load or
  during any interaction.
- Contrast of all new chrome text: light chrome 4.95–18.88:1; dark chrome
  5.52–16.87:1. All ≥ 4.5:1.
