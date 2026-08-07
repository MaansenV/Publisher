// Sync the "site" files of the Open Design project into od-site/.
// OD is the source of truth; this mirrors the generated HTML + referenced
// assets 1:1 (relative structure must stay intact), strips OD metadata,
// applies the em/en-dash mojibake fix, and verifies all local links resolve.
// Usage: node scripts/sync-od.mjs
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const SRC = resolve(process.env.OD_PROJECT_DIR ?? 'C:/Users/dinli/AppData/Roaming/Open Design/namespaces/release-stable-win/data/projects/9ae8a47c-d007-49e3-9f40-1502d5bba280');
const DST = resolve('od-site');

// Subtrees that make up the site (every path the pages reference).
const TREE = ['.', 'docs', 'assets/web', 'docs/images'];

function filesIn(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter(d => d.isFile())
    .map(d => join(d.parentPath ?? dir, d.name))
    .map(p => relative(dir, p));
}

// --- 1. copy html + design.md + referenced asset subtrees ---
let copied = 0, skipped = 0, newFiles = 0;
for (const sub of TREE) {
  const from = join(SRC, sub);
  if (!existsSync(from)) { console.warn(`WARN: Quelle fehlt: ${sub}`); continue; }
  mkdirSync(join(DST, sub), { recursive: true });
  for (const rel of filesIn(from)) {
    if (sub === '.' && !rel.endsWith('.html') && rel !== 'design.md') { skipped++; continue; } // nur Entry-HTMLs + design.md
    if (rel.includes('.file-versions') || rel.endsWith('.artifact.json') || rel.endsWith('.analysis.json')) { skipped++; continue; }
    const srcFile = join(from, rel);
    const dstFile = join(DST, sub, rel);
    if (!existsSync(dstFile)) { newFiles++; console.log(`NEU: ${sub}/${rel}`); }
    cpSync(srcFile, dstFile);
    copied++;
  }
}

// --- 2. mojibake fix (â€”/â€“ etc. -> em/en dash) ---
function fixDashes(p) {
  let s = readFileSync(p, 'utf8');
  const n = (s.match(/â€/g) || []).length;
  if (n) { s = s.replaceAll('â€”', '\u2014').replaceAll('â€“', '\u2013'); writeFileSync(p, s, 'utf8'); console.log(`DASH-FIX: ${relative(DST, p)} (${n} Stellen)`); }
}
const htmlFiles = filesIn(DST).filter(r => r.endsWith('.html'));
for (const rel of htmlFiles) fixDashes(join(DST, rel));

// --- 3. verify every local href/src in the HTML resolves ---
const bad = [];
for (const rel of htmlFiles) {
  const file = join(DST, rel);
  const base = dirname(file);
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/(?:src|href)="([^"#]+\.(?:html|png|jpg|jpeg|gif|webp|svg|css|js))"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:)/.test(href)) continue;
    const target = resolve(base, href);
    if (!existsSync(target)) bad.push(`${rel} -> ${href}`);
  }
}
console.log(`\nKopiert: ${copied}, uebersprungen: ${skipped}, neu: ${newFiles}`);
console.log(bad.length ? `KAPUTTE LINKS:\n${bad.join('\n')}` : 'Link-Check: alle lokalen Referenzen vorhanden');
process.exit(bad.length ? 1 : 0);