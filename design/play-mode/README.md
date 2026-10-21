# Play Mode redesign

Design canvas for a new look of the landing page and docs. It is not part of the published site (Wasmer serves `od-site/` only).

Canvas: https://claude.ai/artifact/UnKumvqY2n6GMoGNPfHxvR

## Contents

- `project/` — the canvas: `canvas.json` (board layout and notes) and one `.dc.html` per artboard.
  - Hand-built: `Main`, `Mobile`, `DocsHub`, `DocsSearch`, `DocsMobileMenu`, `System`, `DocsSystem`.
  - Generated from `docs-src/pages`: all 24 docs pages (`Docs.dc.html`, `DocsOverview`, `DocsApi`, `DocsChangelog`, `DocsTroubleshooting`, `Docs-*.dc.html`).
  - Images use `/_blob/...` URLs, which only resolve inside the canvas.
- `gen_docs.py` + `doc_shell.html` — build the docs artboards from `docs-src`. Writes `gen_result.json` (slug → artboard file).
- `build_search.py` + `search_template.html` — build `DocsSearch.dc.html` from the live search index.
- `layout.py` — set board heights and positions in `canvas.json` from a 1440 px render report.
- `check_dc.py` — structure, link target, anchor and duplicate-id checks.
- `preview/` — local render checks in headless Chrome: `make_preview.py` (canvas files → plain HTML), `shoot.mjs` (screenshots plus overflow/clipping audit), `tile.py`, `interact.mjs` (search and filter clicks).

## Regenerate

Run from the repo root:

```sh
python design/play-mode/gen_docs.py . design/play-mode/project
python design/play-mode/build_search.py od-site/docs/assets/search-index.json design/play-mode/search_template.html design/play-mode/project/DocsSearch.dc.html
python design/play-mode/check_dc.py design/play-mode/project
```

`DocsMobile.dc.html` is `Docs.dc.html` with `"$preview":{"width":390,"height":844}`.
