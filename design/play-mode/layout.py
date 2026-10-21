import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); PRJ = os.path.join(HERE, 'project')
rep = json.load(open(os.path.join(HERE, 'preview', 'png', 'report-1440.json'), encoding='utf-8'))
H = {k.replace('.html', '.dc.html'): v['height'] for k, v in rep.items()}
json.dump(H, open(os.path.join(HERE, 'measured_heights.json'), 'w'), indent=0)
# hand-built boards: preview height = measured height
for f in ('Main.dc.html', 'DocsHub.dc.html', 'System.dc.html', 'DocsSystem.dc.html'):
    p = os.path.join(PRJ, f); s = open(p, encoding='utf-8').read()
    s, n = re.subn(r'("\$preview":\{"width":1440,"height":)\d+', r'\g<1>%d' % H[f], s); assert n == 1, f
    open(p, 'w', encoding='utf-8').write(s)
cp = os.path.join(PRJ, 'canvas.json'); c = json.load(open(cp, encoding='utf-8')); B = c['boards']
for f, b in B.items():
    if b['w'] == 1440: b['h'] = H[f]
B['DocsMobile.dc.html'].update(h=844, is_interactive=True, title='Phone — docs guide (scrolls inside)')
bottom = lambda f: B[f]['y'] + B[f]['h']
B['System.dc.html']['y'] = bottom('DocsHub.dc.html') + 120
inv = c['notes']['inventory']; inv['y'] = 1000
yB = max(bottom('System.dc.html'), bottom('Docs.dc.html'), 1000 + 1100) + 320
c['notes']['types']['y'] = yB - 300
for f in ('DocsOverview', 'DocsChangelog', 'DocsTroubleshooting', 'DocsApi', 'DocsSystem'): B[f + '.dc.html']['y'] = yB
rowB = max(bottom(f) for f, b in B.items() if b['y'] == yB)
yC = max(rowB, bottom('Main.dc.html')) + 320
c['notes']['pages']['y'] = yC - 300
fp = [f for f, b in B.items() if b['y'] >= 6000 and f.startswith('Docs-') and not f.startswith('Docs-dungeon')]
dg = [f for f in B if f.startswith('Docs-dungeon')]
for f in fp: B[f]['y'] = yC
yD = max(bottom(f) for f in fp) + 400
for f in dg: B[f]['y'] = yD
inv['text'] = inv['text'].split('All 24 pages')[0] + ('All 24 pages exist as their own artboard and are generated from docs-src/pages with the real content, ids and screenshots: '
    'the five template boards above (quick start, overview, FP troubleshooting, FP changelog, Dungeon API) plus the 19 rows below. '
    'Prev/next stays inside one asset, labels match the live sidebar.\n\nSearch uses the live index (297 entries), opens the exact section and supports arrow keys, Enter and Esc.')
json.dump(c, open(cp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('yB', yB, 'yC', yC, 'yD', yD)
