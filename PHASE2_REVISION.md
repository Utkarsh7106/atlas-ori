# Phase 2 Revision — `styles/swiss-design.html`

Four fixes from live user testing, applied before the Phase 2 pattern gets
copied to five more pages. One file changed: `styles/swiss-design.html`
(+161 / −124). Line numbers below refer to the revised file.

---

## 1. Nav composition

**Problem.** In Phase 2 the two toggles sat in columns 4–8 — the middle of the
header — because that span was empty, not because the controls belonged there.
Rendered, that reads as three floating masses with two gaps, and the middle
mass (utility chrome) carried the same visual weight as the primary nav.

**Fix.** The header is now **two masses and one deliberate void.**

| | before | after |
|---|---|---|
| logo | `1/4` | `1/5`, row 1 |
| nav links | `8/13` | `7/13`, row 1, flush right |
| controls | `4/8`, row 1 | `7/13`, **row 2**, flush right |

Both the links and the controls now hang off the same right edge (column 7
start, column 13 end), stacked. Columns 5–7 are empty on purpose — that is
Swiss asymmetry, a void between two anchored masses, not a hole where
something should be. `row-gap:12px` and `align-items:baseline` keep the two
rows optically tied; the 4px section rule moved to row 3 so it closes both.

**Hierarchy.** The controls were demoted so they no longer compete with
Work/About/Contact (`styles/swiss-design.html:133–147`):

- label type dropped 11px → **9px**, `.16em` tracking, uppercase — it now
  reads as grid metadata, which is the role the Design Points reserve for mono
- the two buttons became **one hairline-bordered cluster** with a 1px divider
  between them (`.nav-controls`, `:99–102`), so they're a single object
- state values stay ink, flipping to red only when a toggle is `aria-pressed`
  — the accent is still spent on exactly one thing at a time

Both buttons remain real `<button>`s with `aria-pressed`; the sidebar toggle
also carries `aria-expanded`. In sidebar mode the cluster restacks vertically
and stretches to the rail width (`:120–124`).

---

## 2. Light/dark — now full page

**Problem.** Phase 2 themed the chrome only (nav band, footer band). Hero,
cards and the Design Points panel stayed white in dark mode.

**Fix.** No second token system. The page's original palette variables are now
**aliases onto the `--chrome-*` tokens** (`:25–38`):

```css
--paper: var(--chrome-bg);
--ink:   var(--chrome-ink);
--red:   var(--chrome-red);
--grey:  var(--chrome-grey);
--rule:  var(--chrome-hair);
```

Custom properties resolve lazily, so redefining the six `--chrome-*` values
under `:root[data-theme="dark"]` (`:48–56`) re-resolves every alias. **Zero
existing colour declarations were edited** — every `var(--ink)` on the page
already pointed at the theme without knowing it. Dark mode is six values.

The two now-dead chrome bands (`.nav::before`, `.site-footer::before`) were
removed: with the whole page theming, a band painting `--chrome-bg` over
`--paper` is a no-op. The fixed sidebar rail keeps its `background:var(--paper)`
because it genuinely overlays scrolling content.

`data-chrome` → `data-theme` throughout (attribute, storage key
`atlas-swiss-theme`, `applyChrome`→`applyTheme`, button id, visible label
`Chrome`→`Theme`), since it is no longer chrome-scoped. The pre-paint `<head>`
script still applies the stored theme before first paint, so there is no flash.

**Contrast audit — 78 text elements, both themes, all pass.**

| token | light | on | ratio | dark | on | ratio |
|---|---|---|---|---|---|---|
| ink | `#111111` | `#ffffff` | 18.88 | `#f2f2f2` | `#111111` | 16.87 |
| red | `#d31f16` | `#ffffff` | 5.28 | `#ff4438` | `#111111` | 5.52 |
| grey | `#707070` | `#ffffff` | 4.95 | `#9a9a9a` | `#111111` | 6.71 |
| on-red | `#ffffff` | `#d31f16` | 5.28 | `#111111` | `#ff4438` | 5.52 |

Lowest measured: **4.95:1** light (`.sw-toggle__label`, `.meta`, `.icon`),
**5.52:1** dark (`.deck span`, `.btn`, `.card .num`, `.dialog__num`). Both
clear 4.5:1 for normal text.

Two carry-overs from the Phase 2 audit fixes: `#e2231a`→`#d31f16` (4.68→5.28)
and `#8a8a8a`→`#707070` (3.45→4.95). Dark mode needed `--chrome-on-red`
(`:30`, `:55`) because white on the lifted `#ff4438` is only 3.42:1 — ink on
red is 5.52:1, so the button text inverts with the theme.

---

## 3. Footer vertical alignment

**Problem.** Footer content sat near the top of its band with visible dead
space below it.

**Cause.** The grid's default `align-items:stretch` made each footer item fill
the row height, so the 11px metadata and 12px links hung from the top of a row
whose height was set by the 20px mark.

**Fix** (`:243–251`): `align-items:center` puts all three on a common optical
centre; explicit `grid-row` assignments (rule → 1, content → 2, signature → 3)
replace implicit placement; `row-gap:0` and padding `44px`→`40px` remove the
slack. Horizontal layout is untouched — mark `1/4`, metadata `4/9`, links
`9/13`, exactly as before.

---

## 4. Signature mark

`Built with care` in **Dancing Script 700, 26px**, bottom-right of the footer
(`:262–269`), linked with `href="#"` under a `<!-- TODO: replace with
portfolio link -->`.

This is the one element on the page that **deliberately does not follow the
Design Points.** Swiss Design owns the grotesque and the mono; a script face at
26px with zero tracking and normal case violates the two-weight, two-family,
nothing-between-15-and-46px rules on purpose — it is a hand signing the work,
not part of the work. A comment above the rule says so, so the next person
doesn't "fix" it:

```
/* Deliberately NOT part of this page's type system. Swiss Design owns the
   grotesque and the mono; this is a hand, and it is the same hand on all
   29 pages. Do not restyle it per page. */
```

It inherits only `--ink`/`--red` so it stays legible and focus-visible in both
themes (16.87:1 dark, 18.88:1 light). **Copy this rule verbatim to the other
28 pages — do not adapt it to each page's palette or type system.** Dancing
Script 700 was added to the existing Google Fonts link, with
`Segoe Script`/`Brush Script MT`/`cursive` as the fallback stack.

---

## Verification

| check | result |
|---|---|
| Horizontal overflow | **0px** across 28 combinations (7 breakpoints × top/side nav × light/dark) |
| `prefers-reduced-motion` | all 11 new/changed transitions report `1e-05s` — body, nav rule, control cluster, toggle, toggle state, overlay, hint, footer rule, signature, dialog animation, sidebar transition |
| Contrast | 78 elements × 2 themes, **all pass**; min 4.95:1 light / 5.52:1 dark |
| Behaviour | sidebar toggle, theme toggle, persistence across reload, `<dialog>` focus trap + Escape + focus return, `g` grid overlay — all pass, **zero page errors** |
| Markup | parses clean, zero unclosed tags |
| Scope | `git diff` — **1 file changed**, `styles/swiss-design.html` only |

All new motion is CSS transition, never a JS style write, so the sitewide
`prefers-reduced-motion` block in `assets/reset.css:45–52` mutes it without
per-page handling.
