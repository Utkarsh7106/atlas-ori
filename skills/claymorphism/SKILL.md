---
name: claymorphism
description: >-
  Use whenever the user wants a Claymorphist website, landing page,
  portfolio, or UI component — trigger on "claymorphism," "clay UI,"
  "3D clay," "Spline-style," or synonyms like "inflated pastel,"
  "moulded plastic," "puffy shapes." Also trigger on a look
  description even when unnamed: bright pastel shapes (a different
  color from the background, unlike neumorphism) with very large
  border-radii, a soft inset white highlight at the top and darker
  inset tint at the bottom, a big soft drop shadow tinted the object's
  own color so it looks like it's glowing onto the ground, rounded
  bouncy typefaces, and buttons that visibly squash on press. "Make it
  look like soft 3D clay shapes," "puffy pastel cards that glow," or
  "like a friendly Duolingo-ish UI" should trigger this without the
  word "claymorphic." Distinct from Neumorphism (one surface color
  everywhere, low contrast, no bright pastels) — claymorphism is
  loudly colorful and its objects differ from the background. Apply
  even without those exact words.
---

# Claymorphism

Everything looks moulded from soft plasticine: fat radii, a bright inner
top highlight, a darker inner bottom, and a big soft *colored* drop
shadow beneath. Unlike neumorphism, the objects are a different color
from the ground and the palette is loudly pastel. This emerged
2021–2022 from 3D clay-render illustration trends (Blender, Spline) and
was named in a Michal Malewicz essay as the friendly successor to
neumorphism.

## Core Rules

1. Build every object from one three-part shadow recipe: an inset white highlight at the top, an inset darker tint at the bottom, and a large soft drop shadow tinted with the object's own color.
2. Use radii of roughly 30–48px, scaling up with element size, and oversize padding so shapes read as inflated rather than merely filled.
3. Give objects colors that differ from the ground — bright pastels on a soft gradient background — which is exactly what separates clay from neumorphism.
4. Pick rounded-terminal typefaces (Baloo, Quicksand, Nunito) and keep the composition centered.
5. Animate with spring/overshoot easing and let elements visibly deform on press — squash and stretch, never a linear fade.

## Reference Implementation Details

**Color tokens**: a multi-stop soft gradient ground (e.g. lavender
`#dcd6ff` base, with pink `#ffe3f1` and mint `#d9f5ee` radial washes
blended in); 3–4 fixed saturated pastel "clay" colors that do NOT shift
between light/dark themes — e.g. purple `#6d55e0` (primary), pink
`#ff8fab`, yellow `#ffd166`, mint `#7ee0c9` — plus a neutral white clay
body for panels that aren't a colored card. A deep violet-grey ink
(`#3d3563`) for text on pale clay. **Fixed vs. themed matters here**: the
pigments are the whole identity and must stay loud in both themes, but
the ground, neutral clay body, and ink should invert for a dark variant.

**The shadow recipe, rebuilt (not just recolored) for dark mode**: on a
pale ground, a cast shadow is how an object separates from the surface
below it. On a dark ground, a shadow of the same color measures far too
close in luminance to read at all — so the cast shadow becomes a
*colored glow* instead (additive rather than subtractive), which is
literally consistent with clay's stated technique of shadows existing
"so each object appears to glow onto the ground." The inset highlight
drops most of its alpha (a bright highlight at high opacity on a dark
body reads as a strip light, not a lit face), and a neutral (non-pastel)
clay body needs a subtle rim/outline it didn't need on a light ground,
since its fill alone no longer separates cleanly from a dark surface.

**Type**: one rounded display face (Baloo 2 or similar) for headings and
buttons at weight 700, paired with a rounded body face (Quicksand or
similar) at 500–600 for everything else — both chosen so the letterforms
echo the moulded shapes. Hero around `clamp(34px,5.4vw,62px)` at 1.08
line-height; card titles ~26px; body 15–17px; icon labels 11px
uppercase. Never track type tightly — clay type stays open and friendly.

**Layout**: a centered column (~1040px) of symmetrical, center-aligned
blocks with generous vertical rhythm (26–44px) and card gaps (~30px).
Padding is deliberately oversized (38–66px) so each shape reads as
inflated rather than just filled.

**Signature mechanics**:
- The three-part clay shadow as one reusable recipe, e.g. `inset 0 10px 16px <highlight>, inset 0 -12px 18px <shade>, 0 26px 40px -16px <tinted-cast>` — the drop shadow's color always matches (or derives from) the object's own fill, never a neutral grey.
- Very large, size-scaled radii — nothing should read as a rectangle.
- Soft blurred pastel "blob" shapes drifting slowly in the background, reusing the same pigment hues as light sources rather than clay objects.
- Circular inset "wells" for icons, using the same three-part recipe at a smaller scale.
- A "pressed into the bar" variant of the recipe for toggled/active controls: run the highlight and shade ends backward (shade on top, highlight on bottom) and turn the cast shadow inward, since a pressed object throws no shadow onto the ground it's set into.
- A press/squash interaction: on pointerdown (not `click` — click resolves only after a touch gesture has already ended, which is too late to show the deformation), scale the element non-uniformly (e.g. `scaleX(1.06) scaleY(0.9)`) and translate it down slightly, held for a minimum duration (~170ms) so even a fast tap shows the squash before springing back.

## Common Mistakes to Avoid

The most common failure is applying neumorphism's monochrome logic to
clay's inflated radii — using one surface color everywhere with rounder
corners. The actual differentiator is that clay objects use colors that
visibly differ from the ground: bright pastels on a soft gradient. One
hue everywhere produces neumorphism with rounder corners, not
claymorphism.

## Accessibility Notes

Because drop shadows are tinted to each object's own hue rather than a
neutral grey, each new pastel color introduces its own contrast surface
to check — verify text-on-card contrast per color, not once for the
whole palette. Also, the squash-on-press interaction needs its
pointerdown-driven minimum-hold logic (not just a CSS transition on
`:active`) to actually appear on touch devices — a mouse-only
implementation can look complete while being invisible on the device
most users will actually tap it with.

## When Not To Use This Style

Avoid this style for serious or professional B2B tooling. The bouncy
overshoot easing and inflated, toy-like forms read as playful in a way
that undercuts perceived trustworthiness for high-stakes or
data-critical tasks.
