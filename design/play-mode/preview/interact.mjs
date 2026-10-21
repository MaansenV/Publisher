// Drives the search dialog and the troubleshooting filter in headless Chrome.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const dir = process.argv[2];
const port = 9900 + Math.floor(Math.random() * 90);
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`,
  '--allow-file-access-from-files', `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cdp-'))}`, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ws, id = 0; const wait = new Map();
for (let t = 0; t < 50 && !ws; t++) {
  try {
    const pg = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(x => x.type === 'page');
    ws = new WebSocket(pg.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
  } catch { ws = null; await sleep(200); }
}
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m.result); wait.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.value;
const url = f => 'file:///' + join(dir, f).replace(/\\/g, '/');
const key = async (k, code) => { await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: code }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: code }); };

await send('Page.enable');
await send('Page.navigate', { url: url('DocsSearch.html') }); await sleep(1200);
const state = () => ev(`({count: document.querySelector('[aria-live]').textContent, first: document.querySelector('.res')?.textContent.replace(/\\s+/g,' ').trim().slice(0,70), href: document.querySelector('.res.on')?.getAttribute('href'), active: document.getElementById('q').getAttribute('aria-activedescendant'), focus: document.activeElement.id})`);
console.log('initial', await state());
await ev(`document.getElementById('q').focus()`);
await ev(`(()=>{const q=document.getElementById('q'); q.select();})()`);
await send('Input.insertText', { text: 'foot planting' }); await sleep(300);
console.log('typed foot planting', await state());
await key('ArrowDown', 40); await key('ArrowDown', 40); await sleep(200);
console.log('after 2x down', await state());
await send('Input.insertText', { text: 'zzz' }); await sleep(200);
console.log('no match', await ev(`({count: document.querySelector('[aria-live]').textContent, empty: !!document.body.textContent.match(/No match/)})`));
await ev(`(()=>{const q=document.getElementById('q'); q.focus(); q.select();})()`);
await send('Input.insertText', { text: 'pink' }); await sleep(200);
console.log('one word', await state());
await key('Escape', 27); await sleep(800);
console.log('after Esc url:', (await ev('location.href')).split('/').pop());

await send('Page.navigate', { url: url('DocsTroubleshooting.html') }); await sleep(1200);
const rows = () => ev(`[...document.querySelectorAll('tr[data-level]')].filter(r=>getComputedStyle(r).display!=='none').length`);
console.log('troubleshooting rows visible (all):', await rows());
for (const lvl of ['error', 'warning', 'info', 'all']) {
  await ev(`document.querySelector('label[for=lvl-${lvl}]').click()`); await sleep(150);
  console.log(' filter', lvl, '->', await rows());
}
ws.close(); chrome.kill(); process.exit(0);
