# Arborist Practice Questions

Interactive practice activities for the PNW-ISA Certified Arborist Prep Course.
The site is built by GitHub Pages with Jekyll and shares its layout and styling
with the Canadian Urban Forest Census site.

## Files

- `_config.yml` — site settings (`baseurl` must match the repository name)
- `_layouts/default.html` — shared page template: hero banner, navigation, footer
- `_data/domains.yml` — the five domains and their lessons; the menu, home page and About page are built from this
- `_includes/nav.html` — navigation bar with a dropdown per domain
- `assets/js/nav.js` — opens the dropdowns on click and keyboard
- `about/index.html` — Objectives & Background and Project Team
- `_includes/share.html` — share buttons at the bottom of each page
- `assets/css/styles.css` — all styling
- `images/` — hero photo and link-preview image
- `index.html` — course homepage
- `soil-analysis/`, `tree-fertilization/`, `disorders/` — one folder per lesson,
  each with its `index.html`, `script.js`, and images

## Adding a lesson

1. Create a folder (e.g. `pruning/`) with an `index.html` and `script.js`.
2. Start `index.html` with front matter:

   ```
   ---
   layout: default
   title: Pruning
   tagline: Arboriculture Operations
   domain: operations
   description: "One sentence for search engines and link previews."
   scripts:
     - src: script.js
       defer: true
   ---
   ```

   Add `domain: soils` (or another id from `_data/domains.yml`) so the right menu is highlighted.
3. Put each activity in `<main>` as `<section class="activity">…</section>`.
4. List the lesson under its domain in `_data/domains.yml`. The menu and the
   homepage card update automatically.

## Publish with GitHub Pages

Settings → Pages → Deploy from a branch → `main` / `(root)`.
