// Reusable verification harness for esggo apps/universal-translator (FREE version, v1.2.0).
// Usage: node scripts/verify_server.mjs   (run from the universal-translator dir, or set APP_DIR)
// Spawns server.mjs in-process, runs SEQUENTIAL checks, exits non-zero on failure.
// Why in-process: terminal(background=true) kills node servers on this git-bash host
// (stdin is not a tty / no job control -> exit 1). A single foreground process that
// self-spawns avoids that. Sequential fetch (not concurrent) avoids racing the
// still-initializing server.
import { spawn } from 'node:child_process';
import { WebSocket } from 'ws';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const APP_DIR = process.env.APP_DIR || process.cwd();
const PORT = Number(process.env.VERIFY_PORT || 8802);
const env = { ...process.env, PORT: String(PORT) };
const srv = spawn('node', ['server.mjs'], { cwd: APP_DIR, env, stdio: ['ignore', 'pipe', 'pipe'] });
srv.stderr.on('data', (d) => process.stderr.write('[srv-err] ' + d));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(p) { const r = await fetch(`http://localhost:${PORT}${p}`); return { status: r.status, body: await r.text(), h: r.headers }; }
async function post(p, b) { const r = await fetch(`http://localhost:${PORT}${p}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }); return { status: r.status, body: await r.text(), h: r.headers }; }
let pass = 0, fail = 0;
const check = (n, c, e = '') => { if (c) { pass++; console.log(`  OK ${n} ${e}`); } else { fail++; console.log(`  FAIL ${n} ${e}`); } };

await sleep(1500);
console.log(`=== universal-translator verify (APP_DIR=${APP_DIR}) ===`);
try {
  const h = await get('/health'); check('health 200', h.status === 200);
  const hp = JSON.parse(h.body); check('version 1.2.0', hp.version === '1.2.0', hp.version);
  const ui = await get('/'); check('UI / 200', ui.status === 200 && ui.body.includes('即時翻譯'), `HTTP ${ui.status}`);
  const tr = await post('/translate', { text: 'Hello, world', from: 'en', to: 'zh' }); check('translate 200', tr.status === 200);
  const tp = JSON.parse(tr.body); check('translate result', tp.text && tp.text.length > 0, JSON.stringify(tp));
  check('X-OA-Engine header', tr.h.get('X-OA-Engine') != null, tr.h.get('X-OA-Engine'));
  const mt = await post('/translate', { text: 'Thank you', from: 'en', targets: ['zh', 'es', 'fr'] }); check('multi 200', mt.status === 200);
  const mtp = JSON.parse(mt.body); check('multi 3 langs', mtp.translations && Object.keys(mtp.translations).length === 3, JSON.stringify(Object.keys(mtp.translations || {})));
  await new Promise((resolve) => {
    const ws = new WebSocket(`ws://localhost:${PORT}/ws`);
    ws.on('open', () => ws.send(JSON.stringify({ text: 'Good morning', from: 'en', to: 'zh' })));
    ws.on('message', (m) => { const d = JSON.parse(m.toString()); check('WS live translate', d.text && d.text.length > 0, d.text); ws.close(); resolve(); });
    ws.on('error', (e) => { check('WS live translate', false, e.message); resolve(); });
    setTimeout(() => { check('WS live translate', false, 'timeout'); resolve(); }, 8000);
  });
} catch (e) { console.log('EXC ' + e.message); fail++; }
console.log(`RESULT ${pass}/${fail}`);
srv.kill('SIGTERM');
await sleep(150);
process.exit(fail ? 1 : 0);
