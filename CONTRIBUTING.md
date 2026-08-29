# Contributing to Atlas

Conventions for anyone (human or model) adding or editing a style page.
Currently one rule is documented here: content parity, and when a style is
allowed to break it.

## The content-parity rule

By default, all 29 style pages carry **identical structure and content** —
the same nav (`Atlas` / `Work` / `About` / `Contact`), the same hero copy
(`Design is how it feels to use.` / `A study in visual language, one style
at a time.` / `Explore`), the same three feature cards (`Grid` / `Structure`
· `Split` / `Contrast` · `Pulse` / `Rhythm`, each with its fixed body line),
and the same footer CTA (`Start building.` / `Get in touch`). Only the
styling — CSS, layout, motion — changes page to page. This is what makes the
"same page, twenty-nine times" claim true, and what makes the Design Points
schema (see `README.md`) machine-comparable across every page.

**That default can be overridden — but only when a style's defining visual
or interactive device genuinely requires content that doesn't exist verbatim
on the other 28 pages.** When it's a genuine conflict between the two, the
style's identity wins over strict parity: Atlas exists to show what each
visual language actually looks like at full commitment, not to prove 29
pages can share a template. A page that files its unique devices down to
fit generic content isn't a stronger demonstration of the style — it's a
weaker one. The override is never silent, though: it must be justified in
one sentence, at the point it's used (a code comment on the deviating
markup/CSS, not a separate doc), naming what the device is and why the
shared content couldn't carry it as written. Reach for an override only when
the shared content truly can't carry the device as written — not whenever a
style could look slightly better with new copy.

Two existing pages, `conceptual-sketch.html` and `anthropomorphic.html`,
were built under a stricter reading of this rule than what's written above,
before it was corrected to the version documented here — both are flagged
as candidates worth reopening under the corrected rule (see the project's
task reports for specifics). This rule doesn't retroactively change either
page on its own; reopening either is a separate, deliberate decision.
