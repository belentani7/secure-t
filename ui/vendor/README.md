# Landing assets

`landing.css` is compiled from `ui/landing.input.css` and the classes in the
canonical `index.html`, using Tailwind CSS 3.4.17 (MIT).
`lucide.min.js` is Lucide 1.46.0 (ISC). Both upstream licenses are retained here.

Regenerate from the repository root with `sh scripts/build_landing_assets.sh`
after changing utility classes or upgrading these pinned tools. The script uses
a temporary tool directory; it does not change the React/Vite package manifest.
The generated files are checked in and included by the static site builder.

The landing uses local layout and icon assets. Optional Google Fonts retain
the existing system-font fallbacks; navigation and content do not require them.
