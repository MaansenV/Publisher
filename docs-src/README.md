# Docs source

The documentation at `od-site/docs/` is generated from this folder. Wasmer serves `od-site/` as-is, so the generated HTML is committed. Never edit `od-site/docs/*.html` or `od-site/docs/assets/*` by hand; your changes would be overwritten by the next build.

```
docs-src/
  nav.json          groups, page order, versions, store links, hub cards
  layout.html       page template ({{placeholders}} filled by the build)
  pages/<slug>.html  one content fragment per page
  assets/docs.css   shared stylesheet (copied to od-site/docs/assets/)
  assets/docs.js    search, mobile nav, TOC scrollspy, copy buttons, lightbox
  COMPONENTS.md     the HTML components a fragment may use
scripts/build-docs.mjs
```

## Build

```
npm run docs:build        # or: node scripts/build-docs.mjs
npm run site:local        # preview at http://localhost:4173/docs/
```

Node 20+, no dependencies. The build:

- wraps each fragment in `layout.html` and writes `od-site/docs/<slug>.html`;
- generates sidebar, breadcrumb, "On this page", prev/next, title, meta description, canonical and OG tags;
- adds missing heading ids, wraps tables, sizes images, marks external links;
- writes one search index, `od-site/docs/assets/search-index.json`;
- fails (exit 1, nothing written) on a broken local `href`/`src` or a missing `#anchor` on any docs page;
- warns about pages listed in `nav.json` without a fragment (skipped), fragments not listed in `nav.json`, duplicate ids, and orphan `.html` files in `od-site/docs/`. It never deletes files.

## Add a page

1. Add the slug to the right group in `nav.json` (order = sidebar and prev/next order). `{"label":"Guides"}` entries are sidebar section labels; a label with no built pages after it is hidden.
2. Create `pages/<slug>.html` with the meta block and body; see `COMPONENTS.md`.
3. Run the build and fix every error. Check the page at 360px width.

Existing filenames (`overview.html`, `quick-start.html`, `interfaces.html`, `fishnet.html`, `purrnet.html`, `dungeon-*.html`, `index.html`) are linked from the Asset Store: never rename them or remove their heading ids.

## Writing conventions

- English, written for buyers who use the asset in their own project. Address the reader as "you", use plain verbs and sentence-case headings.
- Verify every type, member, menu path, default value and version against the shipped package before you write it. Do not guess and do not add features that do not exist.
- No provenance noise: no "verified against…", "read from Assets/…", source-file columns or internal project paths. State the fact; the version line under the title is added automatically.
- Menu paths use `<span class="menu">Tools › FBSystem › Setup Wizard</span>`; keys use `<kbd>`.
- Every screenshot needs alt text and a caption. Put images in `od-site/docs/images/<area>/`.
- Keep one topic per page; link to other pages instead of repeating them.
