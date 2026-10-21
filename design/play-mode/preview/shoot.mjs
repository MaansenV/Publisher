// usage: node shoot.mjs <html-dir> <png-dir> <width> [page ...]
// Screenshots each preview page full height and reports layout problems.
import { spawn } from 'node:child_process';
import { readdirSync, writeFileSync, mkdirSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const [dir, outDir, widthArg, ...only] = process.argv.slice(2);
const width = Number(widthArg);
mkdirSync(outDir, { recursive: true });
const pages = (only.length ? only : readdirSync(dir).filter(f => f.endsWith('.html'))).map(f => f.endsWith('.html') ? f : f + '.html');

const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${port}`, '--hide-scrollbars', '--allow-file-access-from-files',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cdp-'))}`, 'about:blank'], { stdio: 'ignore' });

let ws, id = 0;
const waiting = new Map(), logs = [];
const send = (method, params = {}) => new Promise(res => { const i = ++id; waiting.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function connect() {
  for (let t = 0; t < 50; t++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      const pg = list.find(x => x.type === 'page');
      ws = new WebSocket(pg.webSocketDebuggerUrl);
      await new Promise(r => ws.addEventListener('open', r));
      ws.addEventListener('message', e => {
        const m = JSON.parse(e.data);
        if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m.result || m.error); waiting.delete(m.id); }
        if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + m.params.exceptionDetails.exception?.description?.split('\n')[0]);
        if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') logs.push('ERR ' + m.params.args.map(a => a.value).join(' '));
        if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/fonts\.g|ytimg|favicon/.test(m.params.entry.url || '')) logs.push('LOG ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
      });
      return;
    } catch { await sleep(200); }
  }
  throw new Error('no chrome');
}

const AUDIT = `(() => {
  const W = document.documentElement.clientWidth, out = [];
  const docW = document.documentElement.scrollWidth;
  if (docW > W + 1) out.push('page scrolls sideways: ' + docW + ' > ' + W);
  const seen = new Set();
  for (const el of document.querySelectorAll('#dc-root *')) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.position === 'absolute') continue;
    if (r.right > W + 1 && !el.closest('[style*="overflow"]')) {
      const k = el.tagName + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '') + ' "' + (el.textContent || '').trim().slice(0, 30) + '"';
      if (!seen.has(k)) { seen.add(k); out.push('overflows right by ' + Math.round(r.right - W) + 'px: ' + k); }
    }
    if ((el.tagName === 'SPAN' || el.tagName === 'A' || el.tagName === 'CODE' || el.tagName === 'STRONG' || el.tagName === 'P' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') && el.scrollWidth > el.clientWidth + 2 && cs.overflow !== 'visible' && cs.textOverflow !== 'ellipsis' && cs.display !== 'inline') {
      out.push('clipped text: ' + el.tagName + ' "' + el.textContent.trim().slice(0, 40) + '"');
    }
  }
  for (const img of document.images) if (!img.complete || !img.naturalWidth) out.push('image not loaded: ' + img.src.slice(-50));
  return out.slice(0, 25);
})()`;

await connect();
await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
const report = {};
for (const p of pages) {
  logs.length = 0;
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
  await send('Page.navigate', { url: 'file:///' + join(dir, p).replace(/\\/g, '/') + '#still' });
  await sleep(1500);
  const h = (await send('Runtime.evaluate', { expression: 'Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)', returnByValue: true })).result.value;
  const problems = (await send('Runtime.evaluate', { expression: AUDIT, returnByValue: true })).result.value;
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: Math.min(h, 16000), scale: 1 } });
  writeFileSync(join(outDir, p.replace('.html', `-${width}.png`)), Buffer.from(shot.data, 'base64'));
  report[p] = { height: h, problems, logs: [...logs] };
  console.log(p, h, problems.length + logs.length ? JSON.stringify({ problems, logs }) : 'clean');
}
writeFileSync(join(outDir, `report-${width}.json`), JSON.stringify(report, null, 1));
ws.close(); chrome.kill();
process.exit(0);
