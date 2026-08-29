# Atlas — Visual Languages

A static, dependency-free site that renders **identical content** in 29 distinct visual
languages, one per page. It exists to do two things:

1. Demonstrate build range across genuinely different visual languages.
2. Work as an **LLM-readable design reference** — each page ends with a `Design Points`
   section complete enough that another model can rebuild the style on an unrelated site
   from that one page alone.

## Structure

```
index.html                 neutral contents page, 29 cards with real palette swatches
assets/reset.css           the ONLY shared stylesheet (normalisation only, no styling)
styles/<style-name>.html   one self-contained page per style
```

Every style page carries its own `<style>` block and its own vanilla JS. No frameworks,
no build step, no bundler, no dependencies. Open `index.html` in a browser.

## The shared content block

Identical, verbatim, on all 29 pages — only the styling changes:

- **Nav** — logo `Atlas`, links `Work` / `About` / `Contact`
- **Hero** — `Design is how it feels to use.` / `A study in visual language, one style at a time.` / `Explore`
- **Cards** — `Grid` · `Structure` · "Every element has a reason to be where it is."
  · `Split` · `Contrast` · "Tension between elements creates meaning."
  · `Pulse` · `Rhythm` · "Repetition and spacing set the pace."
- **Footer CTA** — `Start building.` / `Get in touch`

Page order is fixed: nav → hero → feature cards → footer CTA → divider → Design Points.

## Design Points schema

Every page uses the same machine-parsable structure — a `<dl class="dp">` whose rows are
`<div class="dp-row" data-field="...">` in this exact order:

| `data-field` | Contains |
|---|---|
| `style-name` | The style's name |
| `era-origin` | One line of provenance |
| `color-palette` | 4–6 entries, each `#hex — role` |
| `typography` | Families, weight rules, sizing logic |
| `layout-logic` | Grid/spacing system and alignment rules |
| `signature-techniques` | 3–5 concrete visual devices |
| `motion-interaction` | The page's actual JS/hover/transition behaviour |
| `common-mistake` | The most likely way an imitation of this style gets it shallow or wrong |
| `production-caveat` | A real engineering/maintenance cost of shipping this style, not just building a demo of it |
| `accessibility-risk` | A concern genuinely specific to this style's technique — contrast, motion, affordance or focus |
| `when-not-to-use` | A context or product type this style is a poor fit for |
| `replication-rules` | Exactly 5 numbered rules for rebuilding the style |

To extract every style's palette programmatically:

```js
[...document.querySelectorAll('[data-field="color-palette"] .dp-palette li')]
  .map(li => li.textContent.trim());
```

The Design Points panel is intentionally **identical in appearance on all 29 pages**
(neutral light panel, same markup). It is documentation, not part of the styled demo, so
the visual separation reads unambiguously on dark and loud pages alike.

## The 29 styles

Minimalism · Maximalism · Swiss Design · Brutalism · Surrealism · Neo-Brutalism ·
Neo-classical · Neumorphism · Scrapbook · Glassmorphism · Claymorphism · Bento Grid ·
Pixel Art · Conceptual Sketch · Luxury Typography · Editorial Design · Y2K Aesthetic ·
Ethereal · Bohemian · Dark Mode UI · Cyberpunk · Anthropomorphic · Victorian · Cybercore ·
Synthwave · Graffiti · Gothic · Mixed Media · Wabi Sabi

## Notes

- Google Fonts are linked per page; every stack has a real fallback, so the pages degrade
  sensibly offline.
- One page (Neo-classical) ships no JavaScript at all, and says so in its Motion field
  rather than inventing an effect.
- Icon placeholders are fixed as `Grid` / `Split` / `Pulse` across all pages so the
  "identical content" claim is verifiable.
