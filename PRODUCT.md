# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The site has two layers of "user," and the compliance layer leads.

- **The Unity Asset Store (compliance requirement).** Unity requires every publisher to maintain a public page. This site is that page for Maansen; it must exist, be public, branded, and kept current for every listed asset. This is the primary reason the site exists. [User-confirmed: "Asset Store compliance first."]
- **Unity game developers (human visitors).** Developers who arrive via an Asset Store listing or direct link — either evaluating an asset before buying, or owning it and needing to get it running. [INFERENCE — derived from the asset category; the human audience was not separately confirmed.]

## Product Purpose

Provide the required public publisher presence for the Unity Asset Store, and host per-asset documentation that helps owners get started. Success = a valid, current, branded publisher page with accessible onboarding docs for each listed asset. The publisher page is the essential deliverable; per-asset docs serve it.

## Positioning

**Beginner-friendly tooling.** Each Maansen asset lowers the floor: guided setup (wizards), sensible defaults, and minimal required code. Documentation leads with non-experts — quick starts and plain-language explanations come first, before any deep reference. This is the through-line every future Maansen asset should share. [User-confirmed.]

## Operating Context

- **Asset Store publisher requirement.** Unity Asset Store publishers must keep a public page. This site satisfies that for Maansen.
- **Hosting.** GitHub Pages at https://maansenv.github.io/Publisher/. The sub-path base `/Publisher/` is load-bearing — it is baked into every internal link and asset path; changing it breaks the whole site. [Confirmed from `docs/.vitepress/config.ts`.]
- **Doc authoring method.** Asset docs are written by reading the shipped Unity package source directly, then producing VitePress markdown under a per-asset folder. Docs are pinned to and verified against a specific package version (e.g. FBSystem docs verified against v1.1.0). The Unity source projects live outside this repo (read-only reference).
- **Contact route.** FormSubmit.co form forwarding to the publisher email (`dinlinwin@gmail.com`). [Confirmed from the landing contact form.]
- **Doc architecture.** Each asset is independent; docs are isolated per asset by design. There is no shared cross-asset wiki — the shared surface is the publisher landing page. [User-confirmed: "Diverse tools across Unity, docs fully isolated per asset."]

## Capabilities and Constraints

- **Current catalog: 1 asset** — Easy FP Full Body Controller (v1.1.0 per the asset docs). Asset Store listing: https://assetstore.unity.com/packages/tools/game-toolkits/easy-fp-full-body-controller-357454
- **Site is a VitePress full-site build** with a custom marketing landing (`layout: landing` + custom `Layout.vue` rendering `<Content/>` full-bleed) and standard VitePress documentation surfaces (sidebar, search, outline). [Confirmed from the codebase.]
- **Roadmap.** More tools across Unity are planned; categories are not yet fixed. [Open decision.]
- **Docs stay per-asset silos** by design — diverse catalog, little overlap between assets. [User-confirmed.]
- **Appearance/language.** Single language (English). The landing and docs share the approved Character Select / Loadout Dossier pop-art world; exact tokens and component rules live in the regenerated `DESIGN.md`. [Direction user-approved 2026-07-31.]

## Brand Commitments

- **Publisher brand (on-site):** `vedaloiv` — the redesign rebrands the visible publisher name from "Maansen" to "vedaloiv" across the site (nav, hero, dossier, footer, docs). **External entities still read "Maansen" until renamed outside this repo:** the Asset Store listing, the GitHub organization (`MaansenV`), and the Pages URL (`maansenv.github.io/Publisher/`); the load-bearing sub-path base `/Publisher/` is unaffected. **Developer handle:** `vedaloiv`. Contact email: `dinlinwin@gmail.com`. [Rebrand user-confirmed 2026-07-30; external Asset Store/GitHub rename pending.]
- **Visual world.** The previous Espresso Warm Dark / Wünder-style pop-art attempt was rejected after repeated user feedback that it felt flat, brown, and visually accidental. The replacement is **Character Select / Loadout Dossier**: paper-white, ink-black, cobalt, vermilion, and acid-yellow; game-interface selection states; printed technical-dossier framing; real product proof first. Do not reintroduce the previous espresso/coral poster treatment, violet/Geist world, or one-bit desktop gimmick.
- **Landing structure:** introduction (who vedaloiv is, what it makes) + asset catalog (one clean card per published asset: name, blurb, tags, Asset-Store + docs links) + contact section. Per-asset docs live on subpages (existing under `easy-fp-full-body-controller/`, re-themed via `custom.css`, not rebuilt for a visual change). [User-specified structure 2026-07-30.]

## Evidence on Hand

- **Easy FP Full Body Controller** — a real, live, commercial (paid) Asset Store listing (URL above) targeting Unity 6000.5.0+ (Unity 6.5) / URP-only. Docs are verified against the v1.1.0 package source, and the landing page now displays v1.1.0. Exact listing price, package size, and release dates are mirrored from the Asset Store into the repo docs — verify against the live listing for current numbers. [All listing facts sourced from inspected repo content: `docs/index.md` and `docs/easy-fp-full-body-controller/index.md`, not memory.]
- A YouTube quick-start walkthrough credited to **aloiV** is embedded in the asset overview. [Attribution kept as found; not assumed to be the same handle as `vedaloiv`.]
- **Future assets** — no listings, names, prices, or details exist yet. [Open.]
- **Absences future work must not fabricate:** no testimonials, customer logos, case studies, press, benchmarks, or third-party endorsements exist. Do not invent them.

## Product Principles

1. **Compliance is the floor.** The publisher page must exist, be public, and stay current for every listed asset — that requirement is why this site exists.
2. **Lower the floor.** Every asset leads with guided setup and plain-language docs so non-experts succeed first; deep reference comes after, never before.
3. **One asset, one doc island.** Each asset's docs are self-contained. The shared surface is the publisher page, not a cross-asset wiki.
4. **Truth over marketing.** Docs are verified against the real shipped package; never fabricate testimonials, customers, or claims that have no evidence.
