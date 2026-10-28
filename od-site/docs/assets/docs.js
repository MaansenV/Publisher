// vedaloiv docs: shared behaviour. Source: docs-src/assets/docs.js (copied by scripts/build-docs.mjs).
(() => {
  'use strict';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const store = {
    get(key) { try { return window.localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch { /* storage unavailable */ } },
  };
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  $$('[data-shortcut]').forEach((el) => { el.textContent = isMac ? '⌘ K' : 'Ctrl K'; });

  // ---------- Mobile navigation ----------
  const menuBtn = $('.menu-btn');
  const sidebar = $('#sidebar');
  const scrim = $('.scrim');
  const mobileQuery = window.matchMedia('(max-width: 920px)');
  // Everything outside the open sidebar except the menu button, so Tab cannot leave the panel.
  const behindNav = $$('.skip-link, .topbar .brand, .topnav, .topbar-actions, #content, .toc, .site-footer');
  function setNav(open, { focus = true } = {}) {
    document.body.classList.toggle('nav-open', open);
    menuBtn?.setAttribute('aria-expanded', String(open));
    if (scrim) scrim.hidden = !open;
    behindNav.forEach((el) => { el.inert = open; });
    if (open && focus) (sidebar.querySelector('[aria-current="page"]') || sidebar.querySelector('a, button'))?.focus({ preventScroll: true });
    if (!open && focus) menuBtn?.focus({ preventScroll: true });
  }
  menuBtn?.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
  scrim?.addEventListener('click', () => setNav(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) setNav(false);
  });
  mobileQuery.addEventListener?.('change', () => setNav(false, { focus: false }));
  sidebar?.addEventListener('click', (e) => { if (e.target.closest('a') && mobileQuery.matches) setNav(false, { focus: false }); });

  // ---------- Collapsible sidebar groups (remembered) ----------
  $$('.nav-group').forEach((group) => {
    const btn = $('.nav-group-toggle', group);
    const key = `vedaloiv-docs:nav:${group.dataset.group}`;
    const saved = store.get(key);
    if (saved === 'closed' && !group.classList.contains('is-current')) btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      store.set(key, open ? 'open' : 'closed');
    });
  });
  // Keep the active link visible inside a long sidebar.
  const activeLink = $('.nav-list a.is-active');
  if (activeLink && sidebar && !mobileQuery.matches) {
    const top = activeLink.offsetTop - sidebar.clientHeight / 2;
    if (top > 0) sidebar.scrollTop = top;
  }

  // ---------- TOC scrollspy ----------
  const tocLinks = $$('.toc .toc-list a');
  const headings = tocLinks.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1)))).filter(Boolean);
  if (headings.length && 'IntersectionObserver' in window) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 80;
      let current = headings[0];
      for (const h of headings) { if (h.getBoundingClientRect().top - offset - 8 <= 0) current = h; else break; }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = headings[headings.length - 1];
      tocLinks.forEach((a) => {
        const on = a.hash === `#${current.id}`;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }
  // Close the inline TOC after picking a section.
  $$('.toc-inline a').forEach((a) => a.addEventListener('click', () => { a.closest('details').open = false; }));

  // ---------- Copy buttons on code blocks ----------
  $$('.prose pre').forEach((pre) => {
    const code = $('code', pre);
    const wrap = document.createElement('div');
    wrap.className = 'code-block';
    pre.replaceWith(wrap);
    wrap.appendChild(pre);
    const lang = code && (code.className.match(/lang-([\w-]+)/) || [])[1];
    if (lang) {
      const label = document.createElement('span');
      label.className = 'code-lang';
      label.textContent = { csharp: 'C#', text: 'Text', json: 'JSON', shell: 'Shell' }[lang] || lang;
      wrap.appendChild(label);
    }
    if (!navigator.clipboard) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText((code || pre).innerText.replace(/\n$/, ''));
        btn.textContent = 'Copied';
        btn.classList.add('is-copied');
      } catch {
        btn.textContent = 'Press Ctrl+C';
      }
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('is-copied'); }, 1600);
    });
    wrap.appendChild(btn);
  });

  // ---------- Lightbox for figures ----------
  const lightbox = $('.lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    const lbImg = $('img', lightbox);
    const lbCap = $('.lightbox-caption', lightbox);
    let opener = null;
    $$('.prose figure img').forEach((img) => {
      if (img.closest('a')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'zoom-btn';
      btn.setAttribute('aria-label', `Enlarge image: ${img.alt || 'figure'}`);
      img.replaceWith(btn);
      btn.appendChild(img);
      img.classList.add('is-zoomable');
      btn.addEventListener('click', () => {
        opener = btn;
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt;
        const cap = img.closest('figure').querySelector('figcaption');
        lbCap.textContent = cap ? cap.textContent : '';
        lightbox.showModal();
      });
    });
    const closeLb = () => lightbox.close();
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox || e.target === lbImg || e.target.closest('[data-close-lightbox]')) closeLb(); });
    lightbox.addEventListener('close', () => { lbImg.removeAttribute('src'); opener?.focus({ preventScroll: true }); });
  }

  // ---------- Search ----------
  const dialog = $('.search-dialog');
  const input = $('.search-input');
  const list = $('.search-results');
  const status = $('.search-status');
  let index = null;
  let loading = null;
  let results = [];
  let active = -1;

  const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
  const escHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function highlight(text, terms) {
    let html = escHtml(text);
    for (const t of terms) {
      if (t.length < 2) continue;
      html = html.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
    }
    return html;
  }
  function loadIndex() {
    if (index) return Promise.resolve(index);
    if (!loading) {
      loading = fetch('assets/search-index.json')
        .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then((data) => {
          index = data.map((e) => ({ ...e, nt: norm(e.t), nh: norm(e.h), nx: norm(e.x), ng: norm(e.g) }));
          return index;
        })
        .catch(() => { loading = null; status.textContent = 'Search is unavailable right now. Use the sidebar to browse.'; return []; });
    }
    return loading;
  }
  function search(q) {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length || !index) return [];
    const scored = [];
    for (const e of index) {
      let score = 0;
      let all = true;
      for (const t of terms) {
        let s = 0;
        if (e.nh.includes(t)) s += e.nh.startsWith(t) ? 12 : 8;
        if (e.nt.includes(t)) s += e.nt.startsWith(t) ? 9 : 6;
        if (e.ng.includes(t)) s += 2;
        if (e.nx.includes(t)) s += 2;
        if (!s) { all = false; break; }
        score += s;
      }
      if (all) scored.push({ e, score: score + (e.a ? 0 : 1) });
    }
    return scored.sort((a, b) => b.score - a.score).slice(0, 12).map((s) => s.e);
  }
  function render(q) {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    results = search(q);
    active = results.length ? 0 : -1;
    list.innerHTML = results.map((r, i) => `<li role="none"><a role="option" id="sr-${i}" href="${r.p}.html${r.a ? `#${r.a}` : ''}" aria-selected="${i === 0}">
      <span class="sr-path">${escHtml(r.g)} › ${escHtml(r.n || r.t)}</span>
      <span class="sr-title">${highlight(r.h || r.t, terms)}</span>
      ${r.x ? `<span class="sr-text">${highlight(r.x, terms)}</span>` : ''}</a></li>`).join('');
    input.setAttribute('aria-expanded', String(results.length > 0));
    input.setAttribute('aria-activedescendant', results.length ? 'sr-0' : '');
    status.textContent = q.trim() ? (results.length ? `${results.length} result${results.length === 1 ? '' : 's'}. Use ↑ ↓ and Enter.` : `No results for “${q.trim()}”. Try a class name, menu item, or shorter term.`) : '';
  }
  function move(delta) {
    if (!results.length) return;
    const items = $$('a[role="option"]', list);
    items[active]?.setAttribute('aria-selected', 'false');
    active = (active + delta + items.length) % items.length;
    items[active].setAttribute('aria-selected', 'true');
    items[active].scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', items[active].id);
  }
  let searchOpener = null;
  function openSearch() {
    if (!dialog || dialog.open) return;
    searchOpener = document.activeElement;
    if (mobileQuery.matches) setNav(false, { focus: false });
    dialog.showModal();
    input.select();
    loadIndex().then(() => { if (input.value) render(input.value); });
  }
  if (dialog) {
    $$('.search-btn').forEach((b) => b.addEventListener('click', openSearch));
    input.addEventListener('input', () => { loadIndex().then(() => render(input.value)); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        const a = $$('a[role="option"]', list)[active];
        if (a) { dialog.close(); window.location.href = a.href; }
      }
    });
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog || e.target.closest('[data-close-search]')) dialog.close();
      if (e.target.closest('a[role="option"]')) dialog.close();
    });
    dialog.addEventListener('close', () => searchOpener?.focus?.({ preventScroll: true }));
    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); openSearch(); }
      else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); openSearch(); }
    });
  }
})();
