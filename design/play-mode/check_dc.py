import glob, os, re, sys
from html.parser import HTMLParser

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}


class Check(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.errors, self.ids = [], [], []

    def handle_starttag(self, tag, attrs):
        for k, v in attrs:
            if k == 'id' and v and '{{' not in v:
                self.ids.append(v)
        if tag not in VOID:
            self.stack.append((tag, self.getpos()[0]))

    def handle_startendtag(self, tag, attrs):
        if tag not in VOID:
            self.errors.append(f'self-closed <{tag}/> line {self.getpos()[0]}')

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.stack or self.stack[-1][0] != tag:
            self.errors.append(f'</{tag}> line {self.getpos()[0]} closes {self.stack[-1] if self.stack else None}')
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    del self.stack[i:]
                    break
        else:
            self.stack.pop()


root = sys.argv[1]
files = sorted(glob.glob(os.path.join(root, '*.dc.html')))
targets = {os.path.basename(f) for f in files}
for f in files:
    s = open(f, encoding='utf-8').read()
    body = s.split('<script type="text/x-dc"')[0]
    c = Check()
    c.feed(body)
    probs = list(c.errors)
    probs += [f'unclosed <{t}> line {l}' for t, l in c.stack if t not in ('html', 'body')]
    dup = {i for i in c.ids if c.ids.count(i) > 1}
    if dup:
        probs.append(f'duplicate ids {sorted(dup)}')
    for h in re.findall(r'\{\{([^}]*)\}\}', body):
        if not re.fullmatch(r'[A-Za-z_][\w.]*', h.strip()):
            probs.append(f'expression hole {{{{{h}}}}}')
    for href in re.findall(r'href="([^"#{]+\.dc\.html)', body):
        if href not in targets:
            probs.append(f'missing link target {href}')
    for a in re.findall(r'href="#([\w-]+)"', body):
        if a not in c.ids:
            probs.append(f'missing anchor #{a}')
    print(os.path.basename(f), 'OK' if not probs else probs[:8])
