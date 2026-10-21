# Docs components

Page fragments in `docs-src/pages/` are plain semantic HTML. Use **only** the components below; the shared stylesheet (`docs-src/assets/docs.css`) and script (`docs-src/assets/docs.js`) style them and add behaviour. No inline `style` attributes, no `<script>`, no extra classes.

Every fragment starts with a meta block:

```html
<!--meta
{"title":"Quick Start","navTitle":"Quick Start","description":"One sentence for <meta> and search.","group":"fp","kicker":"Getting started","chips":["URP","Unity 6.5+"]}
-->
```

| Key | Required | Purpose |
| --- | --- | --- |
| `title` | yes | `<h1>`, `<title>`, search results. |
| `description` | yes | `<meta name="description">`, OG tags. One sentence. |
| `group` | yes | `hub`, `fp` or `dungeon`; must match the group in `nav.json`. |
| `navTitle` | no | Short label for sidebar, breadcrumb and prev/next (defaults to `title`). |
| `kicker` | no | Small yellow pill above the title, e.g. `Guide`, `Reference`. |
| `chips` | no | Short facts shown in the meta line under the title (e.g. `URP`). The version line "Documentation for vX" is added automatically. |

Headings: start the body with `p.lead`, then `h2` sections and `h3` subsections. Do not write an `h1` (the layout adds it). Give every `h2`/`h3` a stable `id`; the build generates one from the text if missing and warns on duplicates. Ids are public URLs: never rename an id that other pages or the Asset Store link to.

---

## Lead paragraph

One or two sentences under the title.

```html
<p class="lead">Set up a first-person full-body character in a few minutes.</p>
```

## Headings

```html
<h2 id="requirements">Requirements</h2>
<h3 id="unity-version">Unity version</h3>
```

## Callouts

`note` (cyan, neutral information), `tip` (lime, shortcut or recommendation), `warn` (orange, breaking or risky). The title is optional.

```html
<aside class="callout note">
  <p>Names are the C# names; Inspector labels are shown where they differ.</p>
</aside>

<aside class="callout tip">
  <strong class="callout-title">Faster start</strong>
  <p>Drag the demo player prefab into your scene and press Play.</p>
</aside>

<aside class="callout warn">
  <strong class="callout-title">Breaking change in 1.6</strong>
  <p>Foot settings reset to their defaults. Note your values before you update.</p>
</aside>
```

## Numbered steps

For real sequences only. A step may contain paragraphs, figures, code and tables.

```html
<ol class="steps">
  <li>Open <span class="menu">Tools › FBSystem › Setup Wizard</span>.</li>
  <li>
    <p>Assign your Humanoid model.</p>
    <figure>
      <img src="images/QuickStart/Unity_0dJzXrSKBX.png" alt="Setup Wizard step 2: Assign Model">
      <figcaption>Step 2: Assign Model.</figcaption>
    </figure>
  </li>
  <li>Click <strong>Finish Setup</strong>.</li>
</ol>
```

Unordered lists (`<ul>`) are plain bullets.

## Figures

Every screenshot is a `figure` with descriptive `alt` text and a `figcaption`. Clicking opens a lightbox (added by JS). The build adds `width`/`height`, lazy loading and `decoding="async"`. Paths are relative to `od-site/docs/` (images live in `od-site/docs/images/`).

```html
<figure>
  <img src="images/dungeon/LRXJJEem0w.png" alt="DungeonGen tools menu with Room Designer and Template Designer entries">
  <figcaption>The DungeonGen editor tools in the Unity Tools menu.</figcaption>
</figure>
```

## Video

Responsive 16:9 embed. Use `youtube-nocookie.com` and add a fallback link in the next paragraph.

```html
<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/_X0HWXqQ3_k" title="FBSystem Quick Start walkthrough" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
<p><a href="https://www.youtube.com/watch?v=_X0HWXqQ3_k">Open the walkthrough on YouTube</a></p>
```

## Tables

Write a plain table with `<thead>` and `scope="col"`. The build wraps it in a horizontally scrollable `.table-wrap`; do not add the wrapper yourself.

```html
<table>
  <thead><tr><th scope="col">Symptom</th><th scope="col">Fix</th></tr></thead>
  <tbody>
    <tr><td>Pink materials</td><td>The project must use URP.</td></tr>
  </tbody>
</table>
```

## Code blocks

`lang-csharp` or `lang-text` on the `code` element. Escape `<`, `>` and `&`. A language label and a Copy button are added by JS.

```html
<pre><code class="lang-csharp">var player = GetComponent&lt;PlayerController&gt;();
player.Locomotion.Jumped += () =&gt; Debug.Log("jumped");</code></pre>
```

Inline code: `<code>PlayerController</code>` for type, member, file and asset names.

## Keyboard keys

One `kbd` per key; join combinations with `+`.

```html
Press <kbd>F1</kbd> to toggle the guide, <kbd>Ctrl</kbd>+<kbd>S</kbd> to save.
```

## Menu paths

Unity menu and Inspector paths, separated by ` › ` (U+203A with spaces).

```html
<span class="menu">Tools › FBSystem › Setup Wizard</span>
<span class="menu">Assets › Create › DungeonGen › Room Design</span>
```

## Link cards

Prominent links to the next pages or to the store. `strong` is the title, `span` the one-line description. External links get an icon and open in a new tab automatically.

```html
<div class="cards">
  <a class="card" href="quick-start.html"><strong>Quick Start</strong><span>Import, run the wizard, press Play.</span></a>
  <a class="card" href="interfaces.html"><strong>Interfaces</strong><span>The runtime API and event catalog.</span></a>
</div>
```

## Badges

Short status markers inline in text, headings or table cells. `.breaking` marks breaking changes.

```html
<h3 id="v1-6-0">1.6.0 <span class="badge">Latest</span></h3>
<p><span class="badge breaking">Breaking</span> <code>PlayerFootGlue</code> is now <code>PlayerFootPlanting</code>.</p>
```

## Property lists

For Inspector fields and public members. Each `dt` holds the name (first `code`), then optional `span.type` and `span.default`; the `dd` is the description.

```html
<dl class="props">
  <dt><code>walkSpeed</code> <span class="type">float</span> <span class="default">default 3</span></dt>
  <dd>Walking speed in units per second.</dd>
  <dt><code>groundLayers</code> <span class="type">LayerMask</span> <span class="default">default ~0</span></dt>
  <dd>Layers that count as ground.</dd>
</dl>
```

Use a table instead when you need to compare many members at a glance.

## Collapsible details

For long optional material (full lists, edge cases).

```html
<details>
  <summary>All renamed members in 1.6</summary>
  <ul>
    <li><code>GlueMode</code> → <code>PlantMode</code></li>
  </ul>
</details>
```

## Links

- Other docs pages: relative, e.g. `quick-start.html#upgrading`. The build fails if the page or anchor does not exist.
- External links: full `https://` URL; `target`/`rel` and the icon are added by the build.
- Never link to a page that is listed in `nav.json` but has no fragment yet.
