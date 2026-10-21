# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The site has two layers of "user," and the compliance layer leads.

- **The Unity Asset Store (compliance requirement).** Unity requires every publisher to maintain a public page. This site is that page for vedaloiv; it must exist, be public, branded, and kept current for every listed asset. This is the primary reason the site exists. [User-confirmed: "Asset Store compliance first."]
- **Unity game developers (human visitors).** Developers who arrive via an Asset Store listing or direct link — either evaluating an asset before buying, or owning it and needing to get it running. [INFERENCE — derived from the asset category; the human audience was not separately confirmed.]

## Product Purpose

Provide the required public publisher presence for the Unity Asset Store, and host per-asset documentation that helps owners get started. Success = a valid, current, branded publisher page with accessible onboarding docs for each listed asset. The publisher page is the essential deliverable; per-asset docs serve it.

## Positioning

**Beginner-friendly tooling.** Each vedaloiv asset lowers the floor: guided setup (wizards), sensible defaults, and minimal required code. Documentation leads with non-experts — quick starts and plain-language explanations come first, before any deep reference. This is the through-line every future vedaloiv asset should share. [User-confirmed.]

## Operating Context

- **Asset Store publisher requirement.** Unity Asset Store publishers must keep a public page. This site satisfies that for vedaloiv.
- **Hosting.** Wasmer Edge, app `vedaloiv`, at https://vedaloiv.wasmer.app/. Wasmer's GitHub autobuild deploys every push to `main`. The repo-root `Staticfile` (`root: od-site`) makes Wasmer serve `od-site/` as-is, so everything in `od-site/` is public; that is why the OD design source lives at repo root as `od-design.md`. The former GitHub Pages workflow and its `/Publisher/` base path are gone; no path prefix is load-bearing. [Confirmed from the repo, 2026-10-21.]
- **Doc authoring method.** Asset docs are written by reading the shipped Unity package source directly, then maintained as hand-written static HTML pages under `od-site/docs/`. Docs are pinned to and verified against a specific package version (the Easy FP docs state "Verified against v1.6.0"). The Unity source projects live outside this repo (read-only reference).
- **Contact route.** FormSubmit.co form forwarding to the publisher email (`karakask2004@gmail.com`); the form's `_next` returns to https://vedaloiv.wasmer.app/unity-asset-portfolio.html. [Confirmed from the landing contact form.]
- **Doc architecture.** Each asset is independent; docs are isolated per asset by design. There is no shared cross-asset wiki — the shared surface is the publisher landing page. The sidebar, footer, and search-index JSON are duplicated in every docs page and must stay identical. [User-confirmed: "Diverse tools across Unity, docs fully isolated per asset."]

## Capabilities and Constraints

- **Current catalog: 3 entries, 2 released.** Easy FP Full Body Controller v1.6.0 (released 2026-10-09, URP, Unity 6000.5+; Asset Store listing: https://assetstore.unity.com/packages/tools/game-toolkits/easy-fp-full-body-controller-357454), Easy Dungeon Generator v1.1.0 (released 2026-10-08, Built-in/URP/HDRP; Asset Store listing: https://assetstore.unity.com/packages/tools/level-design/easy-dungeon-generator-401094), and Earshot – Ray Traced Sound Occlusion, Reverb & Pathing (in development, no links).
- **Site is a hand-maintained static HTML site** in `od-site/`, with no VitePress or other framework. The landing is `unity-asset-portfolio.html`; `index.html` is a byte-identical copy. Each page carries its own inline `<style>`. The site was originally exported from an Open Design project via `scripts/sync-od.mjs`. [Confirmed from the codebase, 2026-10-21.]
- **Roadmap.** More tools across Unity are planned; categories are not yet fixed. [Open decision.]
- **Docs stay per-asset silos** by design — diverse catalog, little overlap between assets. [User-confirmed.]
- **Appearance/language.** Single language (English). The approved direction is the Character Select / Loadout Dossier pop-art world; `DESIGN.md` holds its tokens and rules. The shipped CSS does not implement that direction yet (see the status note in `DESIGN.md`). [Direction user-approved 2026-07-31.]

## Brand Commitments

- **Publisher name:** `vedaloiv`, on the site and on both Asset Store listings (the Asset Store rename is done). The only remaining "Maansen" string on the site is the GitHub organization link (`MaansenV`). The old Pages URL (`maansenv.github.io/Publisher/`) is retired. **Developer handle:** `vedaloiv`. Contact email: `karakask2004@gmail.com`. [Rebrand user-confirmed 2026-07-30; Asset Store rename done as of 2026-10-21.]
- **Visual world.** The previous Espresso Warm Dark / Wünder-style pop-art attempt was rejected after repeated user feedback that it felt flat, brown, and visually accidental. The replacement is **Character Select / Loadout Dossier**: paper-white, ink-black, cobalt, vermilion, and acid-yellow; game-interface selection states; printed technical-dossier framing; real product proof first. Do not reintroduce the previous espresso/coral poster treatment, violet/Geist world, or one-bit desktop gimmick.
- **Landing structure:** introduction (who vedaloiv is, what it makes) + asset catalog (one clean card per published asset: name, blurb, tags, Asset-Store + docs links) + contact section. Per-asset docs are static pages under `od-site/docs/`: Easy FP (overview, quick-start, interfaces, fishnet, purrnet) and Dungeon (dungeon-generator, dungeon-quick-start, dungeon-api). [User-specified structure 2026-07-30.]

## Evidence on Hand

- **Easy FP Full Body Controller**: a real, live, commercial (paid) Asset Store listing (URL above) targeting Unity 6000.5.0+ (Unity 6.5). Runtime API is render-pipeline-agnostic; demo scene and FPCutter shader require URP. Current release v1.6.0 (2026-10-09, €36.79, 194.7 MB). The landing card and the docs callouts show v1.6.0. A v1.7 update is listed on the landing as upcoming, with no details yet. [Listing facts confirmed against the landing asset card, 2026-10-21; verify against the live listing for current numbers.]
- **Easy Dungeon Generator**: a real, live, commercial (paid) Asset Store listing (URL above). Release v1.1.0 (2026-10-08, €33.11, 1.1 MB; Built-in, URP, HDRP). Docs are the `dungeon-*` pages under `od-site/docs/`. [Listing facts confirmed against the landing asset card, 2026-10-21; verify against the live listing for current numbers.]
- A YouTube quick-start walkthrough credited to **aloiV** is embedded in the Easy FP overview (`od-site/docs/overview.html`). [Attribution kept as found; not assumed to be the same handle as `vedaloiv`.]
- **Earshot – Ray Traced Sound Occlusion, Reverb & Pathing** — in development. The landing shows it as "In development" with a "Screenshot coming soon" placeholder and no price or store/docs links; the roadmap block lists it as not yet released. [Open.]
- **Future assets** — no further names, listings, prices, or details exist yet beyond Earshot and the Easy FP v1.7 roadmap entry. [Open.]
- **Absences future work must not fabricate:** no testimonials, customer logos, case studies, press, benchmarks, or third-party endorsements exist. Do not invent them.

## Product Principles

1. **Compliance is the floor.** The publisher page must exist, be public, and stay current for every listed asset — that requirement is why this site exists.
2. **Lower the floor.** Every asset leads with guided setup and plain-language docs so non-experts succeed first; deep reference comes after, never before.
3. **One asset, one doc island.** Each asset's docs are self-contained. The shared surface is the publisher page, not a cross-asset wiki.
4. **Truth over marketing.** Docs are verified against the real shipped package; never fabricate testimonials, customers, or claims that have no evidence.
