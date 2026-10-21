"""Generate one Play Mode design artboard per docs page from docs-src.

usage: python gen_docs.py <repo> <project-dir>
"""
import html, json, os, re, sys
from html.parser import HTMLParser

REPO, OUT = sys.argv[1], sys.argv[2]
SRC = os.path.join(REPO, 'docs-src')
HERE = os.path.dirname(os.path.abspath(__file__))
nav = json.load(open(os.path.join(SRC, 'nav.json'), encoding='utf-8'))

BLOBS = {
    'images/dungeon/Unity_p5iVVEUj5y.png': '/_blob/8b8e89f1d2665c02ca77e4d46fbf4f56',
    'images/dungeon/LRXJJEem0w.png': '/_blob/408ecac5f3fd64a534cabbb704d5efb7',
    'images/dungeon/Unity_HZVGaM9JGn.png': '/_blob/557ac3de935f4214d7bc8c02a716ee5e',
    'images/dungeon/Unity_V3loHYnweB.png': '/_blob/42bfe4ed1862c42573bd3a289b7aa634',
    'images/dungeon/Unity_EroYs8nVu9.png': '/_blob/a080877c9b1059a86adea7e9174cca82',
    'images/dungeon/Unity_vCB8swmKlu.png': '/_blob/d140307de1385890f98e8ede152aaf91',
    'images/FishNet/step1-scene-setup.png': '/_blob/31afa22894dac1235ebef3d4f3490b4c',
    'images/FishNet/step2-select-player.png': '/_blob/7c32ca0482c008312b9f01b7cefa1e54',
    'images/FishNet/step3-fishnet-components.png': '/_blob/071988a38fec629c718a6f1fee3cb3e5',
    'images/FishNet/step4-world-items.png': '/_blob/acfe6e52d51fe7a8292f45531d6ef58e',
    'images/FishNet/step5-validation.png': '/_blob/2142c8c1fb36081f1a7ee7e834567559',
    'images/QuickStart/Unity_0dJzXrSKBX.png': '/_blob/25320284534dcb3a2634d88037bfe95f',
    'images/QuickStart/Unity_zhE8XJutFj.png': '/_blob/4fbea2da9c1b491f36649d1dcbed75a1',
}

# Pages that already had an artboard keep its file name so existing links stay valid.
NAMED = {'index': 'DocsHub.dc.html', 'quick-start': 'Docs.dc.html', 'overview': 'DocsOverview.dc.html',
         'fp-troubleshooting': 'DocsTroubleshooting.dc.html', 'fp-changelog': 'DocsChangelog.dc.html',
         'dungeon-api': 'DocsApi.dc.html'}

ACCENT = {
    'fp': dict(c='#3A5BFF', dim='#17204A', soft='#10162E', light='#8DA2FF', on='#FFFFFF', key='/_blob/ff56cddc411ca4973d16f2e80ebf7355'),
    'dungeon': dict(c='#FF4F7B', dim='#3A1520', soft='#24101A', light='#FF7A9A', on='#0A0B0D', key='/_blob/c65c15a8775a829ea5aa16823e61a61b'),
}
CHANGE_KINDS = {'added': 'added', 'changed': 'changed', 'fixed': 'fixed', 'removed': 'removed'}


def meta_of(slug):
    s = open(os.path.join(SRC, 'pages', slug + '.html'), encoding='utf-8').read()
    m = re.match(r'\s*<!--meta\s*(\{.*?\})\s*-->', s, re.S)
    return json.loads(m.group(1)), s[m.end():]


groups = [g for g in nav['groups'] if g['id'] != 'hub']
pages, order = {}, []
for g in groups:
    g['list'] = []
    for p in g['pages']:
        if isinstance(p, str):
            meta, body = meta_of(p)
            pages[p] = dict(slug=p, group=g, meta=meta, body=body, file=NAMED.get(p, 'Docs-' + p + '.dc.html'))
            g['list'].append(p)
            order.append(p)
FILE = {s: p['file'] for s, p in pages.items()}
FILE['index'] = 'DocsHub.dc.html'


def esc(t):
    return html.escape(t, quote=False).replace('{', '&#123;').replace('}', '&#125;')


def map_href(h):
    if h.startswith(('http:', 'https:', 'mailto:', '#')):
        return h
    base, _, frag = h.partition('#')
    slug = base[:-5] if base.endswith('.html') else base
    if slug in FILE:
        return FILE[slug] + ('#' + frag if frag else '')
    if base.startswith('../'):
        return 'Main.dc.html'
    return h


def poster(m):
    vid = m.group(1)
    return ('<a class="vid" href="https://www.youtube.com/watch?v=%s" aria-label="Play the video on YouTube">'
            '<img src="https://i.ytimg.com/vi/%s/hqdefault.jpg" alt=""><span class="vid-play" aria-hidden="true">'
            '<svg width="28" height="28" viewBox="0 0 24 24" fill="#0A0B0D"><path d="M7 4l13 8-13 8z"></path></svg></span>'
            '<span class="vid-note">Opens YouTube</span></a>' % (vid, vid))


def wrap_releases(body):
    """Put each version (h2 id="v…") and what follows it into a timeline section."""
    parts = re.split(r'(?=<h2[ >])', body)
    out, first = [], True
    for part in parts:
        if re.match(r'<h2 id="v\d', part):
            out.append('<section class="rel%s">%s</section>' % (' rel-latest' if first else '', part.rstrip()))
            first = False
        else:
            out.append(part)
    return ''.join(out)


def level_filter(body):
    """Badges and a CSS-only filter for tables that have a Level column."""
    m = re.search(r'<table>\s*<thead><tr>(.*?)</tr></thead>(.*?)</table>', body, re.S)
    if not m:
        return body
    heads = re.findall(r'<th[^>]*>(.*?)</th>', m.group(1))
    if 'Level' not in heads:
        return body
    col = heads.index('Level')
    counts = {}

    def row(rm):
        cells = re.findall(r'<td>(.*?)</td>', rm.group(1), re.S)
        lvl = re.sub('<[^>]+>', '', cells[col]).strip()
        key = lvl.lower()
        counts[key] = counts.get(key, 0) + 1
        cells[col] = '<span class="lvl lvl-%s">%s</span>' % (key, lvl)
        return '<tr data-level="%s">%s</tr>' % (key, ''.join('<td>%s</td>' % c for c in cells))

    tbody = re.sub(r'<tr>(.*?)</tr>', row, m.group(2), flags=re.S)
    total = sum(counts.values())
    chips = ['<div class="lvl-filter" role="radiogroup" aria-label="Filter by level">',
             '<input type="radio" name="lvl" id="lvl-all" checked=""><label for="lvl-all">All · %d</label>' % total]
    for key in ('error', 'warning', 'info'):
        if key in counts:
            chips.append('<input type="radio" name="lvl" id="lvl-%s"><label for="lvl-%s">%s · %d</label>' % (key, key, key.title(), counts[key]))
    chips.append('</div>')
    table = '\n'.join(chips) + '\n<table class="lvl-table"><thead><tr>%s</tr></thead>%s</table>' % (m.group(1), tbody)
    return body[:m.start()] + table + body[m.end():]


class Prose(HTMLParser):
    VOID = {'img', 'br', 'hr', 'input', 'source', 'wbr'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.h2, self.stack = [], [], []
        self.cur_h2 = None
        self.h3_at = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'table':
            self.out.append('<div class="tbl">')
        if 'href' in a:
            a['href'] = map_href(a['href'])
        if tag == 'img':
            a['src'] = BLOBS.get(a.get('src', ''), a.get('src', ''))
        if tag == 'h2':
            if not a.get('id'):
                a['id'] = 's-%d' % len(self.h2)
            self.cur_h2 = [a['id'], []]
        if tag == 'h3':
            self.h3_at = len(self.out)
        if a.get('target') == '_blank':
            a.pop('target'); a.pop('rel', None)
        attr = ''.join(' %s="%s"' % (k, html.escape(v or '', quote=True).replace('{', '&#123;')) for k, v in a.items())
        self.out.append('<%s%s>' % (tag, attr))
        if tag not in self.VOID:
            self.stack.append('badge' if tag == 'span' and 'badge' in (a.get('class') or '') else tag)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if self.stack:
            self.stack.pop()
        if tag == 'h3' and self.h3_at is not None:
            text = re.sub('<[^>]+>', '', ''.join(self.out[self.h3_at + 1:])).strip().lower()
            if text in CHANGE_KINDS:
                self.out[self.h3_at] = self.out[self.h3_at].replace('<h3', '<h3 class="chg chg-%s"' % CHANGE_KINDS[text], 1)
            self.h3_at = None
        self.out.append('</%s>' % tag)
        if tag == 'table':
            self.out.append('</div>')
        if tag == 'h2' and self.cur_h2:
            self.h2.append((self.cur_h2[0], ' '.join(''.join(self.cur_h2[1]).split())))
            self.cur_h2 = None

    def handle_data(self, d):
        self.out.append(esc(d))
        if self.cur_h2 is not None and 'badge' not in self.stack:
            self.cur_h2[1].append(d)


def convert(body, slug):
    body = re.sub(r'<div class="video">\s*<iframe src="https://www\.youtube-nocookie\.com/embed/([\w-]+)"[^>]*></iframe>\s*</div>', poster, body)
    body = level_filter(body)
    p = Prose()
    p.feed(body)
    p.close()
    out = ''.join(p.out)
    if slug.endswith('changelog'):
        out = wrap_releases(out)
    return out, p.h2


def sidebar(active):
    o = ['<aside class="sidebar" aria-label="Documentation" style="flex: 0 0 280px; box-sizing: border-box; position: sticky; top: 64px; max-height: calc(100vh - 64px); overflow-y: auto; padding: 20px 14px 40px 20px; border-right: 1px solid #24272D; font-size: 15px; line-height: 1.4">',
         '<nav class="nav" aria-label="Documentation pages" style="display: flex; flex-direction: column; gap: 22px">',
         '<a href="DocsHub.dc.html" style="display: flex; align-items: center; gap: 8px; padding: 8px 10px; text-decoration: none; color: #C9CCD1; border: 1px solid #2E3137">',
         '<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 11l8-7 8 7v9H4z"></path></svg>Docs home</a>']
    for g in groups:
        ac = ACCENT[g['id']]
        o.append('<section style="display: flex; flex-direction: column">')
        o.append('<div style="display: flex; align-items: center; gap: 8px; padding: 0 10px 8px; border-bottom: 2px solid %s; margin-bottom: 6px">' % ac['c'])
        o.append('<span aria-hidden="true" style="width: 10px; height: 10px; background: %s; flex: 0 0 10px"></span>' % ac['c'])
        o.append('<span style="font-weight: 700; font-size: 15px; flex: 1 1 auto">%s</span>' % esc(g['title']))
        o.append('<span style="font-family: \'JetBrains Mono\', monospace; font-size: 12px; color: %s">v%s</span>' % (ac['light'], g['version']))
        o.append('</div>')
        for p in g['pages']:
            if isinstance(p, dict):
                o.append('<span style="padding: 12px 10px 4px; font-family: \'JetBrains Mono\', monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #8A8F97">%s</span>' % esc(p['label']))
                continue
            label = esc(pages[p]['meta']['navTitle'])
            if p == active:
                o.append('<a href="%s" class="on" aria-current="page" style="padding: 7px 10px; text-decoration: none; color: #FFFFFF; font-weight: 600; background: %s; box-shadow: inset 3px 0 0 %s">%s</a>' % (FILE[p], ac['dim'], ac['c'], label))
            else:
                o.append('<a href="%s" style="padding: 7px 10px; text-decoration: none; color: #C9CCD1">%s</a>' % (FILE[p], label))
        o.append('<a href="%s" style="padding: 7px 10px; text-decoration: none; color: %s; font-size: 14px">Asset Store page ↗</a>' % (g['store'], ac['light']))
        o.append('</section>')
    o.append('</nav>')
    o.append('</aside>')
    return '\n'.join(o)


def pager_card(slug, rel):
    if not slug:
        return '<span></span>'
    label = esc(pages[slug]['meta']['navTitle'])
    right = '' if rel == 'prev' else '; text-align: right'
    word = '← Previous' if rel == 'prev' else 'Next →'
    return ('<a href="%s" rel="%s" class="pn" style="display: flex; flex-direction: column; gap: 2px; padding: 16px 18px; border: 1px solid #3A3E46; text-decoration: none%s">'
            '<span style="font-family: \'JetBrains Mono\', monospace; font-size: 12px; color: #9BA0A8">%s</span><strong style="font-size: 19px">%s</strong></a>'
            % (FILE[slug], rel, right, word, label))


SHELL = open(os.path.join(HERE, 'doc_shell.html'), encoding='utf-8').read()
HEIGHTS = {}
try:
    HEIGHTS = json.load(open(os.path.join(HERE, 'measured_heights.json')))
except FileNotFoundError:
    pass


def build(slug):
    p = pages[slug]
    g, meta = p['group'], p['meta']
    ac = ACCENT[g['id']]
    body, h2 = convert(p['body'], slug)
    lst = g['list']
    i = lst.index(slug)
    prev = lst[i - 1] if i > 0 else None
    nxt = lst[i + 1] if i + 1 < len(lst) else None
    chips = ['<span style="border: 1px solid %s; color: %s; padding: 2px 8px">Documentation for v%s</span>' % (ac['c'], ac['light'], g['version'])]
    chips += ['<span style="border: 1px solid #3A3E46; padding: 2px 8px">%s</span>' % esc(c) for c in meta.get('chips', [])]
    toc = '\n'.join('<li><a href="#%s" style="display: block; padding: 5px 12px; text-decoration: none; color: %s">%s</a></li>'
                    % (hid, ('#F2F1EC; font-weight: 600; box-shadow: inset 2px 0 0 %s; margin-left: -1px' % ac['c']) if n == 0 else '#B9BDC4', esc(t))
                    for n, (hid, t) in enumerate(h2))
    hero = ''
    if slug == lst[0]:
        hero = ('<figure class="key"><img src="%s" alt="%s key art"><figcaption>%s %s for %s.</figcaption></figure>'
                % (ac['key'], esc(g['title']), esc(g['title']), g['version'], esc(' and '.join(g['facts']))))
    h = HEIGHTS.get(p['file'], 3000)
    vals = {
        'TITLE': esc(meta['title']), 'STORE': g['store'], 'SIDEBAR': sidebar(slug),
        'GROUP': esc(g['title']), 'GROUP_FILE': FILE[lst[0]], 'NAV': esc(meta['navTitle']),
        'KICKER': esc(meta.get('kicker', 'Guide')), 'H1': esc(meta['title']), 'CHIPS': '\n'.join(chips),
        'HERO': hero, 'BODY': body, 'PREV': pager_card(prev, 'prev'), 'NEXT': pager_card(nxt, 'next'),
        'TOC': toc, 'HEIGHT': str(h), 'KIND': 'changelog' if slug.endswith('changelog') else '',
        'AC': ac['c'], 'AC_DIM': ac['dim'], 'AC_SOFT': ac['soft'], 'AC_LIGHT': ac['light'], 'AC_ON': ac['on'],
    }
    out = SHELL
    for k, v in vals.items():
        out = out.replace('%%' + k + '%%', v)
    assert '%%' not in out, re.findall(r'%%\w+%%', out)
    open(os.path.join(OUT, p['file']), 'w', encoding='utf-8').write(out)
    return p['file'], h


made = {}
for slug in order:
    f, h = build(slug)
    made[slug] = (f, h, pages[slug]['group']['id'])
json.dump({'made': made, 'file': FILE, 'order': order,
           'titles': {s: pages[s]['meta']['navTitle'] for s in order},
           'groups': {s: pages[s]['group']['id'] for s in order}},
          open(os.path.join(HERE, 'gen_result.json'), 'w'), indent=1)
print(len(made), 'pages')
