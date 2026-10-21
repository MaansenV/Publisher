import sys, os
from PIL import Image
src, out, chunk, scale = sys.argv[1], sys.argv[2], int(sys.argv[3]), float(sys.argv[4])
os.makedirs(out, exist_ok=True)
im = Image.open(src)
w, h = im.size
base = os.path.splitext(os.path.basename(src))[0]
for i, y in enumerate(range(0, h, chunk)):
    t = im.crop((0, y, w, min(h, y + chunk)))
    t = t.resize((int(t.width * scale), int(t.height * scale)), Image.LANCZOS)
    t.save(os.path.join(out, '%s-%02d.png' % (base, i)))
print(base, (h + chunk - 1) // chunk)
