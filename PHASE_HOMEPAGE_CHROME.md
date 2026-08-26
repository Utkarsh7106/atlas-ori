# Homepage chrome — `index.html`

A top bar and a new footer for the contents page, plus full-page light/dark.
One file changed: `index.html` (+153 / −16). Nothing in `styles/` and nothing
in `assets/` was touched. Line numbers below refer to the revised file.

The homepage stays deliberately neutral — it is a contents page, not a
thirtieth style — so none of this borrows from the 29 pages. The one
exception is stated in §4, and it is deliberate.

---

## 1. Top bar

Two elements, nothing else (`index.html:170–176`):

```html
<div class="site-nav">
  <span class="wordmark">Atlas</span>
  <button type="button" class="theme-toggle" id="theme-toggle" aria-pressed="false">…</button>
</div>
```

- **Wordmark** — plain `<span>`, not a link. This page *is* the destination
  the 29 style-page logos point at, so linking it here would be a self-link.
- **Theme toggle** — a real `<button>` carrying `aria-pressed`, styled as a
  small track-and-knob switch.

**Not a `<nav>` and not a second `<header>`.** It holds no links, so a `nav`
landmark would be a lie; and `header.top` is already this page's `banner`
landmark, so a second `<header>` as a sibling would create a duplicate.
Verified: the page still exposes exactly **one** banner.

The toggle's accessible name is the fixed string **"Dark mode"** — it does not
change with state, because state is what `aria-pressed` is for. A label that
flips between "Light"/"Dark" is ambiguous read aloud (is it the current mode
or the one you'll get?). Sighted users read state from the knob position.

`header.top`'s top padding was reduced from `clamp(64px,12vh,120px)` to
`clamp(44px,8vh,88px)` (`:76`) to absorb the bar's own height, so the hero
sits about where it did before.

---

## 2. Light / dark

Same technique as `styles/swiss-design.html`: the page's existing colour
declarations are left alone, and `[data-theme="dark"]` redefines the tokens
they already resolve through (`:19–43`).

| token | light | dark |
|---|---|---|
| `--paper` | `#ffffff` | `#111114` |
| `--ink` | `#111114` | `#f2f2f4` |
| `--muted` | `#6b6b73` | `#9a9aa4` |
| `--rule` | `#e6e6ea` | `#2f2f37` |
| `--tint` | `#f7f7f9` | `#1a1a20` |
| `--swatch-ring` | `rgba(0,0,0,.10)` | `rgba(255,255,255,.16)` |
| `--control-edge` | `#8a8a92` | `#6c6c74` |

**No existing colour rule was edited.** Every `var(--ink)` / `var(--muted)` /
`var(--rule)` on the page already pointed at the theme without knowing it.

Two tokens are new rather than re-pointed:

- **`--swatch-ring`** — the 145 palette swatches carried a hard-coded
  `rgba(0,0,0,.10)` inset ring (`:95`). On a dark ground that ring vanishes,
  and the near-black swatches (Minimalism `#0a0a0a`, Brutalism `#000000`,
  Cybercore `#000000`, Cyberpunk `#07070c`) would dissolve into the page. The
  ring now flips to a light one in dark mode.
- **`--control-edge`** — see §5.

`color-scheme` is set alongside each palette so the scrollbar and any UA
widgets follow the page rather than the OS.

**Persistence.** The key is **`atlas-swiss-theme`** — `styles/swiss-design.html`'s
existing key, reused verbatim (`:158`, `:474`), with the same `'light'`/`'dark'`
values. Toggling on the homepage and navigating to Swiss Design now carries the
preference across, and vice versa; verified end to end.

> ⚠️ **The key name is page-scoped and should be renamed.** `atlas-swiss-theme`
> was named when the toggle existed only on Swiss Design. It is now the shared
> sitewide key and the name no longer describes it. Renaming it to
> `atlas-theme` is a coordinated edit across every page that reads it —
> otherwise the preference silently splits in two — so it belongs in the pass
> that adds the toggle to the remaining pages, not here. Matching the existing
> key was also the only option that kept this diff to `index.html` alone.

A pre-paint `<head>` script (`:145–164`) applies the stored value before first
paint, so a dark-mode user never sees a white flash. Storage is behind
try/catch in both the reader and the writer: private mode, quota or blocked
cookies fall through to the light default rather than throwing.

---

## 3. Footer — what was removed

The old footer was deleted whole. Removed text, verbatim:

> Hand-written HTML, CSS and vanilla JavaScript. The only shared stylesheet is
> `assets/reset.css`; every other rule lives in its own page.

and the link:

> `Source on GitHub` → `https://github.com/Utkarsh7106/website-designs`

**Two things to decide about, rather than lose:**

1. **The repo URL is now nowhere in the project.** A grep across every `.html`
   and `.md` in the repo found `github.com/Utkarsh7106/website-designs` at
   `index.html:353` and **nowhere else**. The new footer's GitHub link points
   at the profile, as specified, so nothing on the site now links to the source.
   If a source link should survive, the natural homes are the hero `.meta` row
   or `README.md`, which already documents the project's structure and is
   the most natural home for a source link — it currently carries no URL at
   all.
2. **The "hand-written, one shared stylesheet" sentence** was the only place
   the project's central constraint was stated to a reader. The same claim
   survives as a code comment in `assets/reset.css:1–7`, which readers of the
   rendered page never see. The hero `.meta` row already carries
   *29 styles / 0 frameworks / 0 build steps / One `<style>` block per page*,
   which covers most of it — the part that is now unstated is
   *"the only shared stylesheet is `assets/reset.css`"*.

Neither was re-homed, because doing so would have meant changing content the
brief didn't ask me to change.

---

## 4. New footer

Three zones on `grid-template-columns:1fr auto 1fr` (`:108–110`), so the centre
is centred against **the page**, not against whatever the two side links happen
to measure.

| zone | content | target |
|---|---|---|
| left | Contact me | `href="#"`, `<!-- TODO: LinkedIn link -->` |
| centre | Built with care | `href="#"`, `<!-- TODO: portfolio link -->` |
| right | GitHub | `https://github.com/Utkarsh7106` — the **profile** |

Below 560px the three zones stack and centre; three items will not fit across
280px of content (`:135–143`).

**The signature mark** (`:120–133`) is the one thing here copied from a style
page. Treatment taken verbatim from `styles/swiss-design.html:262–269` —
Dancing Script 700, 26px, `line-height:1.2`, `letter-spacing:0`,
`text-transform:none`, the transparent→ink bottom border on hover, the same
`.18s linear` transition. Dancing Script 700 was added to the existing Google
Fonts link (`:11`).

One deliberate difference: the focus ring uses `--ink` rather than Swiss's
`--red`, because this page has no accent token and every other focus ring here
is ink. Placement differs too (centred here, bottom-right there) — that is
layout, which each page's footer decides.

Everything else about it is untouched on purpose. It sits outside Inter the
same way it sits outside the grotesque on Swiss Design, and the comment above
the rule says so.

---

## 5. One defect found during verification

The automated contrast sweep passes on text, so it missed this; the non-text
check caught it.

In its **off** state the switch's track border was `--rule` — **1.24:1**
against the page. WCAG 1.4.11 asks 3:1 of the visual boundary that identifies a
control. The knob was fine (4.94:1 against the track), but the track's extent —
the thing that says "there is another position" — was effectively invisible, so
the control read as a lone dot.

`--rule` is right for dividing content and too faint to bound a control, so
rather than darkening every hairline on the page I added **`--control-edge`**,
the same idea held above 3:1: `#8a8a92` light (**3.43:1**), `#6c6c74` dark
(**3.62:1**). Hover moved to `--ink` so the hover state stays distinct.

The same token replaced `--rule` on the footer link underlines, where it fixes
a smaller version of the same problem: at 1.24:1 the underline was invisible
and the links read as plain text with no affordance.

---

## Verification

| check | result |
|---|---|
| Horizontal overflow | **0px** at 320 / 390 / 600 / 860 / 1024 / 1280 / 1600px × light + dark (14 combinations) |
| Contrast, text | 103 elements × 2 themes, **0 failing**. Min **5.28:1** light, **6.76:1** dark |
| Contrast, hover states | not covered by the resting sweep (`.go` is `opacity:0` at rest) — checked separately: min **4.94:1** light, **6.21:1** dark on the `--tint` hover ground |
| Contrast, non-text | switch edge **3.43:1** off / 16.86:1 on; footer underline 3.43:1 light, 3.62:1 dark |
| Keyboard | first `Tab` lands on the toggle; **Enter** and **Space** both operate it |
| `aria-pressed` | `false` in light, `true` in dark, correct after every transition and after reload |
| Accessible name | `"Dark mode"`, stable across states |
| Persistence | survives reload; carries to `styles/swiss-design.html` (reads `dark`, shows `Dark`) |
| `prefers-reduced-motion` | all **12** transitions report `1e-05s` |
| Grid regression | 29 cards intact; columns still 1 / 1 / 2 / 2 / 3 / 4 / 4 across the seven widths, identical to before |
| Markup | parses clean — zero errors, zero unclosed tags |
| Console | zero page errors |
| Scope | `git diff` — **1 file changed**, `index.html` only |

All new motion is CSS transition rather than a JS style write, so the sitewide
`prefers-reduced-motion` block in `assets/reset.css:45–52` mutes it with no
per-page handling.
