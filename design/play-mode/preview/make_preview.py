"""Turn .dc.html artboards into plain HTML pages for local screenshots.

usage: python make_preview.py <project-dir> <repo> <out-dir>
"""
import glob, os, re, sys

proj, repo, out = sys.argv[1:4]
os.makedirs(out, exist_ok=True)

blobs = {
    'ff56cddc411ca4973d16f2e80ebf7355': 'od-site/assets/web/fp-overview.jpg',
    'c65c15a8775a829ea5aa16823e61a61b': 'od-site/assets/web/dungen-main.jpg',
    '8b8e89f1d2665c02ca77e4d46fbf4f56': 'od-site/docs/images/dungeon/Unity_p5iVVEUj5y.png',
    '408ecac5f3fd64a534cabbb704d5efb7': 'od-site/docs/images/dungeon/LRXJJEem0w.png',
    '557ac3de935f4214d7bc8c02a716ee5e': 'od-site/docs/images/dungeon/Unity_HZVGaM9JGn.png',
    '42bfe4ed1862c42573bd3a289b7aa634': 'od-site/docs/images/dungeon/Unity_V3loHYnweB.png',
    'a080877c9b1059a86adea7e9174cca82': 'od-site/docs/images/dungeon/Unity_EroYs8nVu9.png',
    'd140307de1385890f98e8ede152aaf91': 'od-site/docs/images/dungeon/Unity_vCB8swmKlu.png',
    '31afa22894dac1235ebef3d4f3490b4c': 'od-site/docs/images/FishNet/step1-scene-setup.png',
    '7c32ca0482c008312b9f01b7cefa1e54': 'od-site/docs/images/FishNet/step2-select-player.png',
    '071988a38fec629c718a6f1fee3cb3e5': 'od-site/docs/images/FishNet/step3-fishnet-components.png',
    'acfe6e52d51fe7a8292f45531d6ef58e': 'od-site/docs/images/FishNet/step4-world-items.png',
    '2142c8c1fb36081f1a7ee7e834567559': 'od-site/docs/images/FishNet/step5-validation.png',
    '25320284534dcb3a2634d88037bfe95f': 'od-site/docs/images/QuickStart/Unity_0dJzXrSKBX.png',
    '4fbea2da9c1b491f36649d1dcbed75a1': 'od-site/docs/images/QuickStart/Unity_zhE8XJutFj.png',
}

BASE = '<script>class DCLogic { constructor(props) { this.props = props; } setState(o) { this.state = Object.assign({}, this.state, o); window.__render(); } }</script>'
RUNTIME = r'''
<script>
(function () {
  function look(scope, path) {
    return path.trim().split('.').reduce(function (v, k) { return v == null ? undefined : v[k]; }, scope);
  }
  var EV = { onclick: 'click', oninput: 'input', onkeydown: 'keydown', onmouseenter: 'mouseenter' };
  function fill(str, scope) {
    return str.replace(/\{\{([^}]+)\}\}/g, function (_, p) { var v = look(scope, p); return v == null ? '' : String(v); });
  }
  function render(node, scope, parent) {
    if (node.nodeType === 3) { parent.appendChild(document.createTextNode(fill(node.nodeValue, scope))); return; }
    if (node.nodeType !== 1) return;
    var tag = node.tagName.toLowerCase();
    if (tag === 'sc-for') {
      var list = look(scope, node.getAttribute('list').replace(/[{}]/g, '')) || [];
      var as = node.getAttribute('as');
      list.forEach(function (item) {
        var s = Object.create(scope); s[as] = item;
        node.childNodes.forEach(function (c) { render(c, s, parent); });
      });
      return;
    }
    if (tag === 'sc-if') {
      if (look(scope, node.getAttribute('value').replace(/[{}]/g, ''))) node.childNodes.forEach(function (c) { render(c, scope, parent); });
      return;
    }
    var el = document.createElementNS(node.namespaceURI, node.localName);
    Array.prototype.forEach.call(node.attributes, function (a) {
      var n = a.name.toLowerCase();
      if (EV[n]) { var fn = look(scope, a.value.replace(/[{}]/g, '')); if (fn) el.addEventListener(EV[n], fn); return; }
      el.setAttribute(a.name, fill(a.value, scope));
      if (n === 'value') el.value = fill(a.value, scope);
    });
    var src = tag === 'template' ? node.content : node;
    src.childNodes.forEach(function (c) { render(c, scope, el); });
    parent.appendChild(el);
  }
  var tpl = document.getElementById('dc-template');
  var props = JSON.parse(document.getElementById('dc-props').textContent);
  var p = {}; Object.keys(props).forEach(function (k) { if (k[0] !== '$') p[k] = props[k]['default']; });
  if (location.hash.indexOf('still') >= 0) p.motion = false;
  var comp = new Component(p);
  window.__comp = comp;
  window.__render = function () {
    var root = document.getElementById('dc-root');
    var focusId = document.activeElement && document.activeElement.id;
    root.innerHTML = '';
    var vals = comp.renderVals();
    tpl.content.childNodes.forEach(function (c) { render(c, vals, root); });
    if (focusId && document.getElementById(focusId)) document.getElementById(focusId).focus();
  };
  window.__render();
})();
</script>
'''

for f in sorted(glob.glob(os.path.join(proj, '*.dc.html'))):
    s = open(f, encoding='utf-8').read()
    helmet = re.search(r'<helmet>(.*?)</helmet>', s, re.S).group(1)
    body = re.search(r'</helmet>(.*?)</x-dc>', s, re.S).group(1)
    m = re.search(r"<script type=\"text/x-dc\" data-dc-script data-props='(.*?)'>(.*?)</script>", s, re.S)
    props, code = m.group(1), m.group(2)
    for bid, path in blobs.items():
        body = body.replace('/_blob/' + bid, 'file:///' + os.path.join(repo, path).replace('\\', '/'))
    body = re.sub(r'href="([\w-]+)\.dc\.html', r'href="\1.html', body)
    page = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width, initial-scale=1">' + helmet + '</head><body>'
            '<template id="dc-template">' + body + '</template><div id="dc-root"></div>'
            '<script type="application/json" id="dc-props">' + props + '</script>'
            + BASE +'<script>' + code + '</script>'
            + RUNTIME + '</body></html>')
    name = os.path.basename(f).replace('.dc.html', '.html')
    open(os.path.join(out, name), 'w', encoding='utf-8').write(page)
    print(name, props[-40:])
