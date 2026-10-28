---
name: vedaloiv
description: Publisher page and per-asset docs for vedaloiv's Unity tools, in a dark editor-like world with one yellow highlight.
colors:
  selection-yellow: "oklch(0.913 0.17 98.7)"
  gizmo-teal: "oklch(0.79 0.12 184.33)"
  gizmo-cyan: "oklch(0.86 0.12 202.63)"
  console-lime: "oklch(0.88 0.19 124.11)"
  warning-orange: "oklch(0.78 0.15 53.84)"
  tag-pink: "oklch(0.74 0.2 341.96)"
  viewport-black: "oklch(0.145 0 89.88)"
  viewport-sunken: "oklch(0.118 0 89.88)"
  panel: "oklch(0.185 0 89.88)"
  panel-2: "oklch(0.218 0 89.88)"
  panel-raised: "oklch(0.285 0 89.88)"
  ink-bright: "oklch(0.99 0.01 97.35)"
  ink-body: "oklch(0.88 0.008 95)"
  ink-muted: "oklch(0.7 0.01 89.88)"
  ink-faint: "oklch(0.62 0.01 89.88)"
  on-accent: "oklch(0.145 0 89.88)"
  grid-line: "oklch(0.99 0.01 97.35 / 0.11)"
  grid-line-strong: "oklch(0.99 0.01 97.35 / 0.2)"
typography:
  display:
    fontFamily: "Rubik, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.5rem, 1.4rem + 4.2vw, 4.4rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Rubik, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.2vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  doc-title:
    fontFamily: "Rubik, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.1rem, 1.5rem + 2.4vw, 3.15rem)"
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: "-0.032em"
  title:
    fontFamily: "Rubik, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.55rem, 1.2rem + 1.2vw, 2.1rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  doc-h2:
    fontFamily: "Rubik, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.72rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.022em"
  body:
    fontFamily: "Rubik, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "JetBrains Mono, SFMono-Regular, ui-monospace, Consolas, monospace"
    fontSize: "0.78rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  xs: "2px"
  sm: "6px"
  md: "10px"
  lg: "14px"
  pill: "999px"
spacing:
  gutter-mobile: "16px"
  gutter: "24px"
  header: "64px"
  section: "clamp(72px, 9vw, 120px)"
  container: "1200px"
  docs-shell: "1480px"
  measure: "72ch"
components:
  button-primary:
    backgroundColor: "{colors.selection-yellow}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-bright}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink-bright}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.gizmo-teal}"
    padding: "10px 6px"
  badge-released:
    backgroundColor: "{colors.selection-yellow}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
    height: "26px"
  badge-dev:
    backgroundColor: "transparent"
    textColor: "{colors.gizmo-teal}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
    height: "26px"
  product-card:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.lg}"
  input:
    backgroundColor: "{colors.viewport-sunken}"
    textColor: "{colors.ink-bright}"
    rounded: "{rounded.sm}"
    padding: "11px 13px"
    height: "48px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "44px"
  nav-link-hover:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink-bright}"
  kicker:
    backgroundColor: "{colors.selection-yellow}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
---

# Design System: vedaloiv

## Overview

**Creative North Star: "The Scene View"**

The site reads like the Unity editor at work: a dark viewport, a faint grid, and one highlight on whatever is selected. Visitors are Unity developers who spend their day in that window, so the publisher page and the docs feel like an extension of it rather than a marketing site laid over it. The landing page and the docs share one token family (the landing's inline `:root` mirrors `docs-src/assets/docs.css`), so a visitor crossing from catalog to setup guide never changes worlds.

Density is calm. Surfaces are near-black neutrals stepped by lightness, separated by hairline rules rather than shadows (only the docs search dialog casts one). Type is one family, Rubik, set heavy and tight for headings and open for reading; JetBrains Mono carries versions, statuses, menu paths and other machine facts. Selection yellow is the only loud colour and it always means "act here" or "you are here". The supporting gizmo hues (teal, cyan, lime, orange) behave like editor signals: links, code, success, warning.

Real product proof carries the page: Unity editor screenshots, an authored ray diagram for the in-development asset, and the scene-view grid behind the hero. Rejected worlds stay out: the espresso/coral poster look, the violet/Geist look, and the one-bit desktop gimmick.

**Key Characteristics:**
- Near-black neutral surfaces stepped by lightness, hairline rules, shadows only on modals.
- One selection-yellow accent reserved for action and state.
- Rubik for everything readable, JetBrains Mono for machine facts.
- Pill-shaped actions, gently rounded containers.
- Landing and docs share one token set.

## Colors

A neutral dark viewport with one warm highlight and a small set of editor signal hues.

### Primary
- **Selection Yellow** (`selection-yellow`): primary buttons, the contact submit, released badges, the docs kicker and version pill on the current asset, the active TOC link, active sidebar and nav markers, text selection, focus rings, the hero ray path and source dot. Text on it is always `on-accent`.

### Secondary
- **Gizmo Teal** (`gizmo-teal`): every inline link, quiet buttons, the in-development badge (dashed outline), the next roadmap step, the ray diagram's sound waves.
- **Gizmo Cyan** (`gizmo-cyan`): link hover, inline code in docs, the default (info) callout.

### Tertiary
- **Console Lime** (`console-lime`): tip callouts, the copied state of code-block copy buttons, contact success text.
- **Warning Orange** (`warning-orange`): warning callouts, invalid form fields and their error text, contact error text.
- **Tag Pink** (`tag-pink`, docs only): breaking-change badges in changelogs.

### Neutral
- **Viewport Black** (`viewport-black`): page ground for landing and docs.
- **Viewport Sunken** (`viewport-sunken`): alternating landing sections (roadmap, contact), footer, code blocks, form inputs, the Earshot diagram ground.
- **Panel** (`panel`), **Panel 2** (`panel-2`), **Panel Raised** (`panel-raised`): product cards and tables; hover fills and "what's new" strip; keyboard keys, disabled submit and the diagram wall. Each step is lighter, never shadowed.
- **Ink Bright** (`ink-bright`): headings, strong text, active nav text.
- **Ink Body** (`ink-body`): running copy.
- **Ink Muted** (`ink-muted`): secondary copy, metadata labels, idle nav links.
- **Ink Faint** (`ink-faint`, docs only): breadcrumbs, sidebar section labels, level-3 TOC links, code-language tags, page meta, footer copy. It clears 4.5:1 on sunken, ground, panel and panel 2 (4.78:1 at worst) but not on panel raised (3.94:1), so on raised surfaces such as a selected search result it switches to ink muted (5.37:1).
- **Grid Line** / **Grid Line Strong** (`grid-line`, `grid-line-strong`): hairline dividers and the hero grid; strong lines outline cards, ghost buttons and inputs.

### Named Rules
**The Selection Rule.** Selection yellow fills only three things: a primary action, a released state, or the visitor's current location. Never use it as decoration, illustration fill or section background.

**The Signal Rule.** Teal, cyan, lime and orange keep their editor meanings (link, code/info, success, warning). Never swap them for variety.

## Typography

**Display Font:** Rubik (with system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** Rubik (same stack)
**Label/Mono Font:** JetBrains Mono (with SFMono-Regular, ui-monospace, Consolas, monospace)

**Character:** One sturdy, rounded grotesque does all the talking, heavy and tightly tracked at the top, relaxed in paragraphs; the monospace is the editor's voice for anything a developer would copy or compare.

### Hierarchy
- **Display** (800, `clamp(2.5rem, 1.4rem + 4.2vw, 4.4rem)`, 1.02, −0.035em): landing hero headline only, max 13–15ch.
- **Doc title** (800, `clamp(2.1rem, 1.5rem + 2.4vw, 3.15rem)`, 1.06): docs page H1.
- **Headline** (700, `clamp(2rem, 1.4rem + 2.2vw, 3rem)`, 1.06, −0.03em): landing section headings, 12–16ch.
- **Title** (700, `clamp(1.55rem, 1.2rem + 1.2vw, 2.1rem)`, 1.12): product names on catalog cards.
- **Doc H2 / H3** (700 at 1.72rem / 600 at 1.32rem): docs sections; H2 carries a hairline rule above it.
- **Body** (400, 1.0625rem, 1.65 landing / 1.7 docs): running copy; docs measure is 72ch, landing paragraphs 46–60ch.
- **Label** (JetBrains Mono 500, 0.72–0.82rem): versions, badges, Inspector values, timeline dates, step numbers, keyboard keys. Inline code and menu paths in landing copy run at 0.86em of the surrounding text.
- **UI label** (Rubik 400, 0.78rem `fs-xs` or 0.88rem `fs-sm`, muted ink): 0.78rem for hero-fact labels and the store note under the actions; 0.88rem for Inspector row labels, nav links, form labels and the "what's new" line. Nothing on the landing goes below 0.72rem.

### Named Rules
**The Machine Fact Rule.** Anything a developer would type, copy or compare (versions, menu paths, code, keys, spec values) is set in JetBrains Mono. Prose is never set in mono.

**The Tight Top Rule.** Headings tighten tracking as they grow (−0.012em at H3 up to −0.035em at display) and always use `text-wrap: balance`.

## Layout

Landing: a centred container of `min(1200px, 100% − 2 × gutter)` with a 24px gutter (16px at ≤760px) and a 64px sticky header (60px on mobile). Sections breathe with `clamp(72px, 9vw, 120px)` vertical padding and alternate between viewport black and sunken grounds, separated by hairlines. Most sections use a two-column grid with `clamp(32px, 5vw, 72px)` gaps: hero copy beside a product mosaic, section head beside its intro, about copy beside a principle list, contact copy beside the form. Catalog cards split media and body (1.1fr / 1fr).

Docs: a 1480px shell with a 280px sticky sidebar, a content column at 72ch measure, and a 232px sticky "On this page" rail. At ≤1240px the rail folds into an inline disclosure; at ≤920px the sidebar becomes an off-canvas menu behind a menu button.

Breakpoints: landing 960px (everything stacks), 760px (mobile nav, 16px gutter), 420px (full-width actions; the three hero facts become ruled rows with the label left and the value right). Docs 1240px, 920px, 640px, 400px.

**The Scene Grid Rule.** The hairline grid is the only background texture: 56px behind the hero, masked to fade out, and 28px (14px at ≤960px) on the sunken ground of each catalog media column, where the product shot sits on it as the selected object. Do not add other patterns, gradients or noise.

## Elevation & Depth

The system is flat. Depth comes from tonal steps (sunken, ground, panel, panel 2, raised) and hairline borders. The only translucency is the sticky header and topbar: 86% ground with a 14px backdrop blur, plus the 82% blurred labels over mosaic tiles. Active states use an inset 3px yellow bar or a 2px yellow left border, not lift.

### Shadow Vocabulary
- **Modal** (`box-shadow: 0 30px 80px -20px oklch(0 0 0 / 0.7)`): the docs search dialog only, over a 72% near-black backdrop with a 3px blur.

**The Flat Viewport Rule.** Drop shadows belong to modal overlays only. Anything else that needs to stand forward steps its surface one tone lighter and gets a strong hairline.

## Shapes

Gentle, consistent rounding. Containers use 14px (`lg`: product cards, mosaic tiles, the contact form), inner panels and code blocks 10px (`md`), and small controls 6px (`sm`: nav links, inputs, search button, copy button). Every action and status is a full pill (999px): buttons, badges, nav CTA, kicker, version pills, "what's new" links. Borders are always 1px hairlines; the only heavier strokes are the 3px callout edge, the 2px roadmap spine and the 2px bottom edge of keyboard keys. The 2px radius (`xs`) is for editor marks only: the selection box and the feature bullets (7px squares with a muted 1px border, no fill). Roadmap nodes are 14px circles.

## Components

### Buttons
Pill-shaped, confident, and few per view.
- **Shape:** full pill (999px), 48px minimum height, 600 weight.
- **Primary:** selection yellow with `on-accent` text, `10px 20px` padding. Hover mixes in 15% white. One per product action group (Asset Store).
- **Ghost:** transparent with a strong hairline and bright ink; hover fills panel 2 and the border turns bright. Used for docs links beside the primary.
- **Quiet:** an underlined teal text link with button height; hover turns cyan and thickens the underline.
- **Focus:** 2px yellow outline, 3px offset (contact submit uses a bright-ink outline because its fill is already yellow).
- **Motion:** 160ms ease on background, border and colour only.

### Badges and chips
- **Released:** yellow pill, mono 0.74rem, 26px tall.
- **In development:** transparent pill with a dashed teal border and teal text.

### Cards / Containers
- **Product card:** panel ground, strong hairline, 14px radius, clipped. The media column is a scene view (sunken ground, 28px grid, 28px padding) holding one screenshot or the ray diagram in a 6px-radius frame inside a selection box. The body column holds status, name, summary, at most four plain-language feature bullets (technical term in parentheses), the Inspector, actions pinned to the bottom, and a muted store note pointing to ratings and the current price. Below sit the setup strip and a one-line panel-2 "what's new" sentence with a single changelog link. At ≤960px the columns stack: image, body, setup, what's new.
- **Selection box (signature):** a 1px box with 2px radius and 7px square handles on its four corners, drawn as a pseudo-element. Around catalog media it is always visible in strong hairline with muted handles and turns yellow while the card is hovered or holds focus. On mosaic tiles it appears only on hover and keyboard focus, inset 6px (4px with 5px handles at ≤420px). It marks selection state, never decoration.
- **Inspector (signature):** package facts as a Unity component, a native `<details open>`. Header row in panel 2 with a rotating foldout triangle and the component name ("Package", or "Planned requirements" before release); rows on sunken ground with a muted label column (38%, 84px min) and bright mono values, separated by hairlines. Released assets show Price, Unity, Pipeline and Download; version and release date live only in the status line. Unity versions read `6.5+ (6000.5)`.
- **Setup strip:** a three-step `<ol>` with mono step numbers in 28px hairline squares, a bright step title, one plain sentence, menu paths in cyan mono, and step screenshots as 16:9 thumbnails (6px radius, strong hairline, yellow border on hover). Three columns on desktop, one column (max 560px) at ≤960px. The heading row can hold a small ghost button (44px) for the walkthrough video.
- **Mosaic tile:** 16:10 image tile, strong hairline, 14px radius, blurred pill labels inset 16px at the bottom; hover and focus turn the border yellow and show the selection box.
- **Viewer:** one native `<dialog>` for screenshots and the walkthrough video, opened with `showModal()`. Panel ground, strong hairline, 14px radius, a caption bar with a 44px round close button, and a sunken stage. Images open as the same `<picture>` at full width; the youtube-nocookie iframe is created on click and removed on close. Esc, the close button and a backdrop click close it, and focus returns to the opener. Without JS the links open the JPG or the YouTube page. No shadow, an 88% sunken backdrop.
- **Docs callout:** panel ground tinted 7% with its signal hue, 3px left edge, 30% hue border. Variants: info (cyan), tip (lime), warn (orange). Markup is `<div class="callout …" role="note">`, never `<aside>`, so callouts do not add landmarks.

### Inputs / Fields
- **Style:** sunken ground, strong hairline, 6px radius, 48px minimum height (textarea 140px).
- **Hover:** border turns muted.
- **Focus:** yellow border plus a 2px yellow outline at 2px offset.
- **Error:** orange border with orange helper text below; success and error status text use lime and orange.
- **Disabled submit:** raised panel with bright ink and a wait cursor.

### Navigation
- **Landing header:** sticky, translucent, hairline bottom. Brand wordmark in Rubik 800. Links are muted 44px targets with 6px radius; hover fills panel 2 and brightens. The Asset Store CTA is an outlined pill whose border turns yellow on hover. At ≤760px links move into a drop-down panel behind a pill menu toggle.
- **Docs sidebar:** collapsible asset groups with a mono version pill (yellow on the current asset), indented page lists on a hairline spine, active page marked by a 2px yellow left border and a panel-2 fill. At ≤920px it opens off-canvas over a scrim; while open, everything except the sidebar and the menu button is `inert`, and Esc closes it and returns focus to the menu button.
- **Docs TOC:** hairline spine, muted links, active link in yellow.

### Docs prose (signature)
- **Inline code:** cyan mono on panel, hairline, 5px radius.
- **Menu path chip:** bright mono on panel 2 with a strong hairline, e.g. `Tools › FBSystem › Setup Wizard`.
- **Keyboard key:** raised panel, strong hairline, 2px bottom edge.
- **Code block:** sunken ground, 10px radius, mono 0.84rem, a faint language tag and a mono copy button that turns lime when copied.
- **Numbered steps:** counter-driven step list for setup guides.

### Earshot ray diagram (signature)
An authored SVG standing in for a missing screenshot: a raised-panel wall on the hairline grid, a faint dashed blocked ray, a yellow dashed path that bends around the wall, teal pulse rings from the source, and a bright listener ring. With motion allowed, the path travels and the rings pulse; with reduced motion it is static.

## Do's and Don'ts

### Do:
- **Do** keep landing and docs on the same token values; change `docs-src/assets/docs.css` and the landing `:root` together. `npm run docs:build` fails when a shared custom property differs.
- **Do** edit `od-site/unity-asset-portfolio.html` for landing changes; the build copies it over `od-site/index.html`.
- **Do** ship landing screenshots as `<picture>` with AVIF and JPEG `srcset` at 480, 800 and 1200px, with `sizes` matching the slot.
- **Do** reserve selection yellow for a primary action, a released state, or the current location.
- **Do** set versions, menu paths, keys, code and spec values in JetBrains Mono.
- **Do** separate surfaces with tonal steps and 1px hairlines.
- **Do** keep touch targets at 44px or more (buttons 48px, nav links 44px).
- **Do** respect `prefers-reduced-motion`: smooth scrolling and diagram animation switch off, and transitions collapse to 0.01ms.
- **Do** use real Unity screenshots as product proof, with alt text.
- **Do** keep landing anchors in English (`#about`, `#contact`); the inline script forwards the old `#ueber-mich` and `#kontakt` links.
- **Do** list the roadmap newest first.

### Don't:
- **Don't** add box shadows outside modal overlays, and no glows or gradient fills; the only gradient is the hero grid mask.
- **Don't** use yellow for decoration, illustration fills or section backgrounds.
- **Don't** reassign the signal hues (teal link, cyan code/info, lime success, orange warning).
- **Don't** put `ink-faint` text on `panel-raised`; use `ink-muted` there. Keep `ink-faint` to breadcrumbs, labels and other secondary hints.
- **Don't** reintroduce the rejected espresso/coral poster world, the violet/Geist look, or the one-bit desktop gimmick.
- **Don't** hand-edit `od-site/docs/`; style changes go through `docs-src/` and the build.
