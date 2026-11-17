# Template source and attribution

This homepage adapts the **Minimal Light** academic homepage theme by Yaoyao Liu:

- Project: https://github.com/yaoyao-liu/minimal-light
- Reference revision: `dd114c3fef2d97adc1c6b6d46901e0d96ab83a7c`
- Upstream license: **CC0 1.0 Universal**, preserved in
  [licenses/minimal-light-CC0.txt](licenses/minimal-light-CC0.txt).
- Source files consulted: `_layouts/homepage.html`,
  `_sass/minimal-light-no-dark-mode.scss`, and `assets/css/font_sans_serif.css`.

The adaptation uses the theme's centered profile, round portrait, 960px
two-column layout (232px profile and 650px content), white background, blue
headings, sans-serif typography, and stacked mobile layout. The Jekyll layout
has been translated into React components in `src/main.jsx`; adapted styles
are maintained in `src/style.css`.

Project-specific changes include numbered sections, in-page navigation with
active-section highlighting, a keyboard skip link, accessible contrast,
short-screen sidebar scrolling, and the author's existing content and images.
The original theme's example identities, social accounts, analytics, external
fonts, and icon CDN dependencies are not included.

Minimal Light itself credits `pages-themes/minimal`, `orderedlist/minimal`,
and `al-folio`. This adaptation uses the Minimal Light files listed above;
their upstream license is retained without relicensing other project assets.
