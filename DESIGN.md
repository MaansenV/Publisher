# vedaloiv Design System

## Direction

**Character Select / Loadout Dossier**: an editorial asset index for a Unity publisher. The landing page treats the current package as an active selected record rather than a generic marketing hero. It borrows the supplied Ink Byte reference's white paper, heavy black headline, cobalt primary, vermilion state, acid-yellow marker, crisp rules, and compact product dossier.

The world is intentionally restrained in structure and direct in copy. No testimonials, invented catalog items, fake benchmarks, gameplay claims, mascot, game HUD, or decorative hero illustration are used. The catalog holds three entries: Easy FP Full Body Controller v1.6.0 and Easy Dungeon Generator v1.1.0 (both released), and Earshot (in development). The publisher name is `vedaloiv` on the site and on both Asset Store listings; the GitHub organization `MaansenV` is the only remaining "Maansen" string on the site.

A dark variant inverts the same grammar (ink-black ground, paper type, identical accent fills) rather than importing a generic dark SaaS look; it is specified for user selection through a theme toggle.

**Implementation status (2026-10-21).** This file describes the approved target, not the shipped CSS. `od-site/unity-asset-portfolio.html` (identical to `index.html`) and the pages in `od-site/docs/` each define an inline `:root` palette of near-black OKLCH surfaces with a yellow `--accent`, Rubik for display and body text, and JetBrains Mono for metadata. The Character Select tokens, fonts, and toggles below are not in od-site yet: no Bowlby One SC, Figtree, or DM Mono; no `html.dark` variant; no appearance toggle; no skip link; no dossier tablist (the catalog uses filter chips). Shipped breakpoints are 900px and 680px. Until od-site is re-themed to this spec, read the token and anatomy sections as target values.

## Tokens

Target values from the approved direction. They are not yet defined in od-site (see Implementation status).

- Paper: `#f4efe5`; soft paper: `#e6ddcc`; white panel: `#fffdf8`
- Ink: `#111318`; secondary ink: `#394252`; muted text: `#526071`
- Cobalt: `#1454e8`; deep cobalt: `#0b369f`
- Vermilion: `#ef402f`; acid yellow: `#f4d33f`; success green: `#087443`
- Borders are normally 2px ink and flip to paper in dark via the same token. Small radius is 4px; larger dossier corners use 10px only where the panel needs grouping.
- Hard offsets replace soft elevation: solid 4–12px offsets with no blur. Light theme offsets use ink/cobalt; dark theme offsets collapse to near-black `#05070a` (no colored glow blocks).
- Text on saturated fills is explicit, never token-driven: `#111318` on vermilion and yellow in both themes; `#fff` on cobalt in both themes.
- Dark variant (`html.dark`): paper `#15171d`, soft paper `#20242e`, ink `#f0ece1`, secondary ink `#c9cfdb`, muted `#9aa4b4`, cobalt text `#7ea0f8`, deep cobalt (labels) `#8fb0ff`, vermilion text `#ef402f`, success `#3ecf8e`, preview frame `#0a0c10`, docs code ground `#0a0c10`. Accent fills (cobalt `#1454e8`, vermilion `#ef402f`, yellow `#f4d33f`) are identical across themes.
- Text-level accent colors meet WCAG AA on their ground: vermilion text `#c93220` on paper (4.6:1), `#ef402f` on dark ground (4.6:1); cobalt text `#1454e8` on paper (5.3:1), `#7ea0f8` on dark ground (7.1:1).

Shipped tokens (today): the inline `:root` in `od-site/unity-asset-portfolio.html`, repeated in the docs pages.

- Surfaces: `--bg` `oklch(0.145 0 89.88)`, `--surface` `oklch(0.218 0 89.88)`, `--surface-raised` `oklch(0.285 0 89.88)`
- Text: `--fg` `oklch(0.99 0.01 97.35)`, `--muted` `oklch(0.6 0.01 89.88)`, `--on-accent` `oklch(0.145 0 89.88)`
- Borders: `--border` `oklch(0.99 0.01 97.35 / 0.16)`, `--border-dark` `oklch(0.145 0 89.88 / 0.18)`
- Accents: `--accent` `oklch(0.913 0.17 98.7)` (also `--focus`), plus `--lime`, `--pink`, `--purple`, `--teal`, `--orange`, `--cyan`
- Fonts: `--font-display` and `--font-body` in Rubik; `--font-mono` in JetBrains Mono

## Typography

- Display: Bowlby One SC, with Impact fallback. Used for the hero and section headlines.
- Body: Figtree, with system fallback. Used for explanatory and interface copy.
- Metadata: DM Mono, with a monospace fallback. Used for versions, labels, proof notes, and release state.
- The display face is reserved for short, high-signal headings; body copy remains readable at normal proportions.
- Metadata floor is 12px: mono labels and proof notes sit at 0.78–0.8rem; nothing functional renders below 0.75rem.
- Shipped: Rubik (display and body, with system fallback) and JetBrains Mono (metadata), loaded from Google Fonts in each page's `<head>`.

## Landing anatomy (target)

1. **Skip link and sticky navigation** — keyboard skip-to-content, vedaloiv mark, Assets, Contact, Docs, an appearance toggle (sun/moon), and a persistent Asset Store action that compacts but remains available on mobile. At ≤620px the Assets anchor hides to keep the bar single-row.
2. **Hero** — product-specific `Full-body / control / for Unity.` headline top-aligned with the dossier, concise description, canonical store/docs actions, and a publisher note (`On-site publisher: vedaloiv · v1.6.0`).
3. **Selected-asset catalog record** — `ACTIVE` release state, Easy FP Full Body Controller identity, one metadata line (`vedaloiv · v1.6.0 · URP`), the full contained Unity setup-wizard screenshot, capability tabs, compatibility tags, and canonical store/docs actions. The Asset Store action is cobalt everywhere on the page. Shipped: the former `ASSET CATALOG / 1 OF 1` label is gone; the catalog section reads "Three assets, two released." with a card per entry (Easy FP v1.6.0, Easy Dungeon Generator v1.1.0, and Earshot as an "In development" placeholder without links).
4. **Feature strip** — four factual cells for guided setup, procedural IK, FPCutter, and source-verified docs. Color blocks are structural markers: cobalt, vermilion, yellow, cobalt.
5. **Contact** — blue support section with labeled required fields, honeypot, loading/success/error feedback, and in-page AJAX submission with FormSubmit fallback action.
6. **Footer** — an ink end-cap (inverted to paper in dark) carrying the brand block (`vedaloiv`), footer navigation (Assets/Docs/Contact/Back to top), and a final Asset Store call to action.

## Responsive behavior

- Desktop uses a two-column hero and four-column feature strip.
- At 1060px the hero stacks while retaining a readable dossier width.
- At 800px the feature strip becomes two columns and the contact record stacks.
- At 620px navigation compacts while retaining the Asset Store action, actions become full-width, the dossier panel stacks, the feature strip becomes one column, and the contact CTA fills the available width.
- The portrait source image uses true `450x751` dimensions and `object-fit: contain` inside a bounded dark preview; its alt text identifies it as the Unity editor setup wizard.

## Interaction and accessibility

- The first focusable control is a visible-on-focus skip link to `#main-content`; all links and controls retain visible keyboard focus with a vermilion outline.
- Dossier controls use `role="tablist"`, `role="tab"`, roving `tabindex`, Arrow/Home/End keyboard navigation, `aria-selected`, `aria-controls`, `role="tabpanel"`, and `aria-live="polite"`.
- Decorative marks and arrows are hidden from assistive technology.
- External Asset Store links use `target="_blank"` with `rel="noopener"`.
- `prefers-reduced-motion: reduce` removes entrance animation, disables smooth scrolling, and collapses transition/animation duration.
- The theme toggle is a target requirement: a sun/moon control in the landing nav and the docs nav, persisted across routes and reloads. Both themes must be verified at 320–1440px. No toggle ships in od-site yet.
- Contact inputs have explicit labels, native types, maximum lengths, honeypot protection, and loading/success/error feedback.

## Content boundaries

The catalog states its real count ("Three assets, two released" as of 2026-10-21) and never implies more. Add a new asset only when its real source, version, compatibility, and documentation are available.

Do not reintroduce the rejected Espresso Warm Dark / Wünder brown-coral world, violet/Geist styling, one-bit desktop gimmicks, soft-glow gradients, generic SaaS hero copy, or floating sticker-card composition.
