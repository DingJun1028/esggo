// verify_routes.mjs — in-process route + API check for universal-translator
// Run from apps/universal-translator: `node scripts/verify_routes.mjs`
// Starts server.mjs in-process (no SSH/background issues), hits every static
// route + POST /translate, asserts HTTP status and presence of key UX strings.
import { spawn } from 'node:child_process';

const PORT = Number(process.env.PORT || 8810);
const env = { ...process.env, PORT: String(PORT) };
const srv = spawn('node', ['server.mjs'], { env, stdio: ['ignore', 'pipe', 'pipe'] });

let fail = 0;
await new Promise(r => setTimeout(r, 1500));

const checks = [
  ['/', 200, ['即時翻譯', '連線即時流']],
  ['/studio.html', 200, ['開始收音', '清除', 'themeBtn']],
  ['/stream.html', 200, ['收合', 'restoreTab', 'room']],
  ['/broadcaster.html', 200, ['講者端']],
  ['/receiver.html', 200, ['聽眾端']],
  ['/health', 200, ['version']],
  ['/translate', 404, null], // GET should 404 (POST-only)
];

for (const [p, w, strs] of checks) {
  const r = await fetch(`http://localhost:${PORT}${p}`);
  const t = await r.text();
  const miss = strs ? strs.filter(s => !t.includes(s)) : [];
  const ok = r.status === w && miss.length === 0;
  if (!ok) fail++;
  console.log(`${ok ? '✓' : '✗'} ${p} -> ${r.status} missing=[${miss.join(',')}]`);
}

try {
  const r = await fetch(`http://localhost:${PORT}/translate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Hello', from: 'en', to: 'zh' })
  });
  const d = await r.json();
  const ok = r.status === 200 && d.engine === 'mymemory';
  if (!ok) fail++;
  console.log(`${ok ? '✓' : '✗'} POST /translate -> ${JSON.stringify(d)}`);
} catch (e) { fail++; console.log('✗ POST /translate -> ' + e.message); }

srv.kill('SIGTERM');
await new Promise(r => setTimeout(r, 300));
console.log(`\nRESULT ${fail === 0 ? 'ALL PASS' : fail + ' FAILED'}`);
process.exit(fail ? 1 : 0);
