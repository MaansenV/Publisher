// Builds the static documentation in od-site/docs from docs-src/ (Node 20+, stdlib only).
// Usage: node scripts/build-docs.mjs
// Exit code 1 on invalid input or broken local links.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, openSync, readSync, closeSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'docs-src');
const SITE = join(ROOT, 'od-site');
const OUT = join(SITE, 'docs');

const warnings = [];
const errors = [];
const warn = (msg) => { warnings.push(msg); console.warn(`warn  ${msg}`); };
const fail = (msg) => { errors.push(msg); console.error(`error ${msg}`); };

// ---------- helpers ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stripTags = (html) => html.replace(/<[^>]+>/g, ' ');
const decode = (s) => s
  .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&amp;/g, '&');
const plain = (html) => decode(stripTags(html)).replace(/\s+/g, ' ').trim();
const slugify = (text) => plain(text).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
const excerpt = (text, max = 220) => (text.length <= max ? text : `${text.slice(0, max).replace(/\s+\S*$/, '')}…`);

function readJson(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch (e) { fail(`${relative(ROOT, path)}: ${e.message}`); return null; }
}

// Reads pixel dimensions of PNG/JPEG files so <img> gets width/height (prevents layout shift).
function imageSize(path) {
  let fd;
  try {
    fd = openSync(path, 'r');
    const buf = Buffer.alloc(65536);
    const n = readSync(fd, buf, 0, buf.length, 0);
    if (buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < n - 9) {
        if (buf[i] !== 0xff) { i++; continue; }
        const marker = buf[i + 1];
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
        }
        i += 2 + len;
      }
    }
  } catch { /* unknown size is fine */ } finally { if (fd !== undefined) closeSync(fd); }
  return null;
}

const ICON = {
  external: '<svg class="i i-ext" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3h7v7M13 3 5 11" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  chevron: '<svg class="i i-chev" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
};

// ---------- load inputs ----------
const nav = readJson(join(SRC, 'nav.json'));
const layout = existsSync(join(SRC, 'layout.html')) ? readFileSync(join(SRC, 'layout.html'), 'utf8') : (fail('docs-src/layout.html missing'), '');
if (!nav || !Array.isArray(nav.groups) || errors.length) { console.error('Build aborted.'); process.exit(1); }
const site = nav.site ?? {};
const baseUrl = site.baseUrl ?? 'https://vedaloiv.wasmer.app/docs/';

// Parse fragments in nav order. Missing fragments are skipped with a warning.
const pages = new Map(); // slug -> page
const seenSlugs = new Set();
for (const group of nav.groups) {
  group.entries = [];
  for (const entry of group.pages ?? []) {
    if (entry && typeof entry === 'object') {
      if (entry.label) group.entries.push({ label: String(entry.label) });
      continue;
    }
    const slug = String(entry);
    if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) { fail(`nav.json: invalid slug "${slug}"`); continue; }
    if (seenSlugs.has(slug)) { fail(`nav.json: slug "${slug}" listed twice`); continue; }
    seenSlugs.add(slug);
    const file = join(SRC, 'pages', `${slug}.html`);
    if (!existsSync(file)) { warn(`page "${slug}" (group ${group.id}) has no fragment yet, skipped`); continue; }
    const raw = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const m = raw.match(/^\s*<!--meta\s*([\s\S]*?)-->/);
    if (!m) { fail(`pages/${slug}.html: missing <!--meta {...} --> header`); continue; }
    let meta;
    try { meta = JSON.parse(m[1]); } catch (e) { fail(`pages/${slug}.html: meta is not valid JSON (${e.message})`); continue; }
    if (!meta.title) fail(`pages/${slug}.html: meta.title is required`);
    if (!meta.description) warn(`pages/${slug}.html: meta.description is empty`);
    if (meta.group && meta.group !== group.id) warn(`pages/${slug}.html: meta.group "${meta.group}" differs from nav group "${group.id}" (nav wins)`);
    const page = { slug, group, meta, body: raw.slice(m.index + m[0].length).trim() };
    pages.set(slug, page);
    group.entries.push({ page });
  }
  group.pageList = group.entries.filter((e) => e.page).map((e) => e.page);
}
for (const f of readdirSync(join(SRC, 'pages')).filter((f) => f.endsWith('.html'))) {
  const slug = f.slice(0, -5);
  if (!seenSlugs.has(slug)) warn(`pages/${f} is not listed in nav.json, not built`);
}
if (errors.length) { console.error('Build aborted.'); process.exit(1); }

// ---------- body transforms ----------
function transformBody(page) {
  let html = page.body;
  const ids = new Set();
  const toc = [];

  // Collect ids that authors set on non-heading elements to detect clashes.
  for (const m of html.matchAll(/<(?!h[23]\b)[a-z][^>]*\sid="([^"]+)"/g)) ids.add(m[1]);

  html = html.replace(/<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/g, (all, level, attrs = '', inner) => {
    let id = (attrs.match(/\sid="([^"]+)"/) || [])[1];
    if (!id) {
      id = slugify(inner);
      let n = 2;
      const base = id;
      while (ids.has(id)) id = `${base}-${n++}`;
      attrs = `${attrs} id="${id}"`;
    } else if (ids.has(id)) {
      warn(`${page.slug}: duplicate id "${id}"`);
    }
    ids.add(id);
    toc.push({ level: Number(level), id, text: plain(inner), html: inner });
    return `<h${level}${attrs}>${inner}<a class="anchor" href="#${id}" aria-label="Link to this section">#</a></h${level}>`;
  });

  // Tables scroll inside a focusable wrapper (keyboard-scrollable on small screens).
  html = html.replace(/(<div class="table-wrap"[^>]*>\s*)?<table([\s\S]*?)<\/table>(\s*<\/div>)?/g, (all, open, inner) =>
    `<div class="table-wrap" tabindex="0" role="region" aria-label="Scrollable table"><table${inner}</table></div>`);

  // Images: lazy loading + intrinsic size; first image loads eagerly.
  let imgCount = 0;
  html = html.replace(/<img\s([^>]*?)\/?>/g, (all, attrs) => {
    const src = (attrs.match(/\ssrc="([^"]+)"|^src="([^"]+)"/) || []).slice(1).find(Boolean);
    if (!/\salt="/.test(` ${attrs}`)) warn(`${page.slug}: <img src="${src}"> has no alt text`);
    let extra = '';
    if (!/\bloading=/.test(attrs)) extra += imgCount === 0 ? ' fetchpriority="high"' : ' loading="lazy"';
    if (!/\bdecoding=/.test(attrs)) extra += ' decoding="async"';
    if (src && !/^[a-z]+:|^\/\//i.test(src) && !/\bwidth=/.test(attrs)) {
      const size = imageSize(resolve(OUT, src.split(/[?#]/)[0]));
      if (size) extra += ` width="${size.w}" height="${size.h}"`;
    }
    imgCount++;
    return `<img ${attrs.trim()}${extra}>`;
  });

  // External links open in a new tab and get an icon.
  html = html.replace(/<a\s([^>]*href="https?:\/\/[^"]+"[^>]*)>([\s\S]*?)<\/a>/g, (all, attrs, inner) => {
    let a = attrs.replace(/\s*target="[^"]*"/, '').replace(/\s*rel="[^"]*"/, '');
    return `<a ${a.trim()} target="_blank" rel="noopener">${inner}${inner.includes('i-ext') ? '' : ICON.external}<span class="sr-only"> (opens in a new tab)</span></a>`;
  });

  // Video embeds: responsive wrapper.
  html = html.replace(/<iframe\s(?![^>]*loading=)/g, '<iframe loading="lazy" ');

  return { html, toc, ids };
}

// ---------- generated pieces ----------
function sidebarHtml(current) {
  const out = [];
  for (const group of nav.groups) {
    if (group.id === 'hub') {
      for (const p of group.pageList) {
        out.push(`<a class="nav-home${p === current ? ' is-active' : ''}" href="${p.slug}.html"${p === current ? ' aria-current="page"' : ''}>Docs home</a>`);
      }
      continue;
    }
    if (!group.pageList.length) continue;
    const isCurrent = current.group === group;
    const listId = `nav-${group.id}`;
    const items = [];
    let pendingLabel = null;
    for (const e of group.entries) {
      if (e.label) { pendingLabel = e.label; continue; }
      if (pendingLabel) { items.push(`<li class="nav-label">${esc(pendingLabel)}</li>`); pendingLabel = null; }
      const p = e.page;
      const active = p === current;
      items.push(`<li><a href="${p.slug}.html"${active ? ' class="is-active" aria-current="page"' : ''}>${esc(p.meta.navTitle ?? p.meta.title)}</a></li>`);
    }
    out.push(`<section class="nav-group${isCurrent ? ' is-current' : ''}" data-group="${group.id}">
  <button class="nav-group-toggle" type="button" aria-expanded="true" aria-controls="${listId}">${ICON.chevron}<span class="nav-group-title">${esc(group.title)}</span>${group.version ? `<span class="nav-version">v${esc(group.version)}</span>` : ''}</button>
  <ul class="nav-list" id="${listId}">
    ${items.join('\n    ')}
    ${group.store ? `<li class="nav-store"><a href="${esc(group.store)}" target="_blank" rel="noopener">Asset Store page${ICON.external}<span class="sr-only"> (opens in a new tab)</span></a></li>` : ''}
  </ul>
</section>`);
  }
  return out.join('\n');
}

function breadcrumbHtml(page) {
  const crumbs = [];
  if (page.group.id === 'hub') {
    crumbs.push(`<li><span aria-current="page">Docs</span></li>`);
  } else {
    crumbs.push(`<li><a href="index.html">Docs</a></li>`);
    const first = page.group.pageList[0];
    crumbs.push(first && first !== page ? `<li><a href="${first.slug}.html">${esc(page.group.title)}</a></li>` : `<li><span>${esc(page.group.title)}</span></li>`);
    crumbs.push(`<li><span aria-current="page">${esc(page.meta.navTitle ?? page.meta.title)}</span></li>`);
  }
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${crumbs.join('')}</ol></nav>`;
}

function tocHtml(toc, cls) {
  if (toc.length < 2) return '';
  const items = toc.map((t) => `<li class="toc-l${t.level}"><a href="#${t.id}">${esc(t.text)}</a></li>`).join('\n');
  return `<ol class="${cls}">\n${items}\n</ol>`;
}

function pagerHtml(page) {
  const list = page.group.pageList;
  const i = list.indexOf(page);
  const prev = list[i - 1];
  const next = list[i + 1];
  if (!prev && !next) return '';
  const card = (p, dir) => p ? `<a class="pager-link pager-${dir}" href="${p.slug}.html" rel="${dir}"><span class="pager-dir">${dir === 'prev' ? 'Previous' : 'Next'}</span><strong>${esc(p.meta.navTitle ?? p.meta.title)}</strong></a>` : '<span></span>';
  return `<nav class="pager" aria-label="Previous and next page">${card(prev, 'prev')}${card(next, 'next')}</nav>`;
}

function assetCardsHtml() {
  const cards = [];
  for (const g of nav.groups) {
    if (g.id === 'hub' || !g.pageList.length) continue;
    const links = g.pageList.slice(0, 6).map((p) => `<li><a href="${p.slug}.html">${esc(p.meta.navTitle ?? p.meta.title)}</a></li>`).join('');
    const more = g.pageList.length > 6 ? `<li><a href="${g.pageList[0].slug}.html">All ${g.pageList.length} pages</a></li>` : '';
    cards.push(`<article class="asset-card" id="${esc(g.anchor ?? g.id)}">
  ${g.image ? `<a class="asset-card-media" href="${g.pageList[0].slug}.html" tabindex="-1" aria-hidden="true"><img src="${esc(g.image)}" alt=""></a>` : ''}
  <div class="asset-card-body">
    <p class="asset-card-meta">${[g.version ? `<span class="badge">v${esc(g.version)}</span>` : '', ...(g.facts ?? []).map((f) => `<span>${esc(f)}</span>`)].join('')}</p>
    <h3 class="asset-card-title"><a href="${g.pageList[0].slug}.html">${esc(g.title)}</a></h3>
    <p>${esc(g.summary ?? '')}</p>
    <ul class="asset-card-links">${links}${more}</ul>
    ${g.store ? `<a class="asset-card-store" href="${esc(g.store)}" target="_blank" rel="noopener">View on the Asset Store${ICON.external}<span class="sr-only"> (opens in a new tab)</span></a>` : ''}
  </div>
</article>`);
  }
  for (const u of nav.upcoming ?? []) {
    cards.push(`<article class="asset-card is-upcoming" id="${esc(u.anchor ?? slugify(u.title))}">
  <div class="asset-card-body">
    <p class="asset-card-meta"><span class="badge muted">${esc(u.status ?? 'In development')}</span></p>
    <h3 class="asset-card-title">${esc(u.title)}</h3>
    <p>${esc(u.summary ?? '')}</p>
  </div>
</article>`);
  }
  return `<div class="asset-cards">\n${cards.join('\n')}\n</div>`;
}

function footerHtml() {
  const stores = nav.groups.filter((g) => g.store).map((g) => `<li><a href="${esc(g.store)}" target="_blank" rel="noopener">${esc(g.title)}${ICON.external}<span class="sr-only"> (opens in a new tab)</span></a></li>`).join('');
  return `<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand"><a class="brand" href="${esc(site.landing ?? '../unity-asset-portfolio.html')}"><span class="brand-name">vedaloiv</span></a><p>Unity tools, documented for the people who use them.</p></div>
    <div class="footer-col"><p class="footer-h">Asset Store</p><ul>${stores}</ul></div>
    <div class="footer-col"><p class="footer-h">Support</p><ul><li><a href="mailto:${esc(site.supportEmail)}">${esc(site.supportEmail)}</a></li><li><a href="${esc(site.landing ?? '../unity-asset-portfolio.html')}">vedaloiv home</a></li><li><a href="index.html">All docs</a></li></ul></div>
  </div>
  <p class="footer-copy">© 2026 vedaloiv</p>
</footer>`;
}

// ---------- render pages ----------
const assetVersion = Date.now().toString(36);
const searchIndex = [];
const rendered = new Map(); // slug -> { html, ids }

for (const page of pages.values()) {
  const { meta, group } = page;
  let { html, toc, ids } = transformBody(page);
  if (html.includes('<!--asset-cards-->')) {
    html = html.replace('<!--asset-cards-->', assetCardsHtml());
    for (const g of nav.groups) if (g.anchor) ids.add(g.anchor);
    for (const u of nav.upcoming ?? []) ids.add(u.anchor ?? slugify(u.title));
  }

  const isHub = group.id === 'hub';
  const pageTitle = isHub ? `Documentation | ${site.name ?? 'vedaloiv'}` : `${meta.title} | ${group.title} docs`;
  const metaBits = [];
  if (group.version) metaBits.push(`<span>Documentation for v${esc(group.version)}</span>`);
  for (const c of meta.chips ?? []) if (!(group.version && c.replace(/^v/, '') === group.version)) metaBits.push(`<span>${esc(c)}</span>`);
  const kicker = meta.kicker ? `<p class="kicker">${esc(meta.kicker)}</p>` : '';
  const pageHeader = `<header class="doc-header">
  ${kicker}
  <h1>${esc(meta.title)}</h1>
  ${metaBits.length ? `<p class="doc-meta">${metaBits.join('')}</p>` : ''}
</header>`;
  const tocAside = tocHtml(toc, 'toc-list');
  const tocInline = tocAside ? `<details class="toc-inline"><summary>On this page</summary>${tocHtml(toc, 'toc-list')}</details>` : '';
  const store = group.store
    ? `<a class="top-store" href="${esc(group.store)}" target="_blank" rel="noopener"><span class="top-store-long">Asset Store</span><span class="sr-only"> page for ${esc(group.title)} (opens in a new tab)</span>${ICON.external}</a>`
    : '';

  const vars = {
    lang: 'en',
    slug: page.slug,
    group: group.id,
    pageTitle: esc(pageTitle),
    title: esc(meta.title),
    description: esc(meta.description ?? ''),
    canonical: esc(`${baseUrl}${page.slug}.html`),
    ogImage: esc(meta.ogImage ?? group.ogImage ?? site.ogImage ?? ''),
    siteName: esc(site.name ?? 'vedaloiv'),
    landing: esc(site.landing ?? '../unity-asset-portfolio.html'),
    assetVersion,
    storeLink: store,
    sidebar: sidebarHtml(page),
    breadcrumb: breadcrumbHtml(page),
    pageHeader,
    toc: tocAside ? `<p class="toc-title" id="toc-title">On this page</p>${tocAside}` : '',
    // The collapsible "On this page" (small screens) sits right after the lead paragraph.
    content: /^<p class="lead">[\s\S]*?<\/p>/.test(html)
      ? html.replace(/^<p class="lead">[\s\S]*?<\/p>/, (lead) => `${lead}\n${tocInline}`)
      : `${tocInline}\n${html}`,
    pager: pagerHtml(page),
    footer: footerHtml(),
  };
  const out = layout.replace(/\{\{(\w+)\}\}/g, (all, key) => {
    if (!(key in vars)) { warn(`layout.html: unknown placeholder {{${key}}}`); return ''; }
    return vars[key];
  });
  const allIds = new Set([...ids, ...[...out.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])]);
  rendered.set(page.slug, { html: out, ids: allIds });

  // Search index: one entry per page intro + one per heading section.
  const parts = html.split(/(?=<h[23][\s>])/);
  const intro = plain(parts[0].replace(/<div class="asset-cards">[\s\S]*$/, ''));
  searchIndex.push({ p: page.slug, t: meta.title, n: meta.navTitle ?? meta.title, g: group.id === 'hub' ? 'Docs' : (group.short ?? group.title), h: '', a: '', x: excerpt(intro || meta.description || '') });
  for (const part of parts.slice(1)) {
    const hm = part.match(/^<h[23][^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<a class="anchor"/);
    if (!hm) continue;
    const text = plain(part.replace(/^<h[23][\s\S]*?<\/h[23]>/, '').replace(/<pre[\s\S]*?<\/pre>/g, ' '));
    searchIndex.push({ p: page.slug, t: meta.title, n: meta.navTitle ?? meta.title, g: group.id === 'hub' ? 'Docs' : (group.short ?? group.title), h: plain(hm[2]), a: hm[1], x: excerpt(text) });
  }
}

// ---------- link validation ----------
const docsFiles = new Set(readdirSync(OUT).filter((f) => f.endsWith('.html')));
for (const [slug, { html }] of rendered) {
  for (const m of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    const url = decode(m[2]);
    if (!url) { fail(`${slug}.html: empty ${m[1]}`); continue; }
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) continue; // http:, https:, mailto:, data:, protocol-relative
    const [pathPart, hash] = url.split('#');
    const cleanPath = pathPart.split('?')[0];
    if (!cleanPath) { // same-page anchor
      if (hash && !rendered.get(slug).ids.has(hash)) fail(`${slug}.html: anchor "#${hash}" not found on the page`);
      continue;
    }
    const target = resolve(OUT, cleanPath);
    if (!target.startsWith(SITE + sep)) { fail(`${slug}.html: link "${url}" leaves od-site/`); continue; }
    const rel = relative(OUT, target);
    const targetSlug = !rel.includes(sep) && rel.endsWith('.html') ? rel.slice(0, -5) : null;
    if (targetSlug && rendered.has(targetSlug)) {
      if (hash && !rendered.get(targetSlug).ids.has(hash)) fail(`${slug}.html: anchor "${url}" not found in ${targetSlug}.html`);
      continue;
    }
    const isAsset = rel.startsWith(`assets${sep}`) && /docs\.(css|js)$|search-index\.json$/.test(rel);
    if (!isAsset && !existsSync(target)) fail(`${slug}.html: broken ${m[1]} "${url}"`);
    else if (hash && targetSlug) warn(`${slug}.html: cannot check anchor in non-generated page "${url}"`);
  }
}

// ---------- token sync ----------
// The landing page keeps its own inline :root; every custom property it shares with docs.css must hold the same value.
const rootVars = (css) => {
  const block = css.match(/:root\s*\{([\s\S]*?)\n\s*\}/)?.[1] ?? '';
  return new Map([...block.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
};
const docsVars = rootVars(readFileSync(join(SRC, 'assets', 'docs.css'), 'utf8'));
const landingVars = rootVars(readFileSync(join(SITE, 'unity-asset-portfolio.html'), 'utf8'));
if (!docsVars.size || !landingVars.size) fail('token sync: could not read the :root block of docs.css or unity-asset-portfolio.html');
for (const [name, value] of landingVars) {
  if (docsVars.has(name) && docsVars.get(name) !== value) {
    fail(`token sync: ${name} is "${value}" on the landing page but "${docsVars.get(name)}" in docs-src/assets/docs.css`);
  }
}
if (errors.length) { console.error(`\nBuild failed: ${errors.length} error(s). Nothing written.`); process.exit(1); }

// ---------- write output ----------
mkdirSync(join(OUT, 'assets'), { recursive: true });
for (const [slug, { html }] of rendered) writeFileSync(join(OUT, `${slug}.html`), html);
writeFileSync(join(OUT, 'assets', 'search-index.json'), JSON.stringify(searchIndex));
for (const f of ['docs.css', 'docs.js']) {
  const src = join(SRC, 'assets', f);
  if (existsSync(src)) writeFileSync(join(OUT, 'assets', f), readFileSync(src));
  else fail(`docs-src/assets/${f} missing`);
}
for (const f of docsFiles) {
  if (!rendered.has(f.slice(0, -5))) warn(`orphan page od-site/docs/${f} is not generated from docs-src (left untouched)`);
}
if (errors.length) process.exit(1);
// The landing page is also served as od-site/index.html; copy it so the two cannot drift.
writeFileSync(join(SITE, 'index.html'), readFileSync(join(SITE, 'unity-asset-portfolio.html')));
console.log(`\nBuilt ${rendered.size} page(s), ${searchIndex.length} search entries, ${warnings.length} warning(s).`);
