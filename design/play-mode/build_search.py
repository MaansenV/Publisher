import json, os, sys

src, tpl, out = sys.argv[1], sys.argv[2], sys.argv[3]
d = json.load(open(src, encoding='utf-8'))
pages = json.load(open(os.path.join(os.path.dirname(__file__), 'gen_result.json')))['file']
rows = [[i['g'], i['n'], i['h'], i['x'], pages.get(i['p'], 'Docs.dc.html'), i.get('a', '')] for i in d]
data = json.dumps(rows, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
html = open(tpl, encoding='utf-8').read()
assert html.count('__DATA__') == 1
open(out, 'w', encoding='utf-8').write(html.replace('__DATA__', data))
print('written', len(html) + len(data))
