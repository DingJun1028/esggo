// In-process HTTP smoke test for universal-translator.
// WHY: the background launcher (`terminal(background=true)`) kills long-lived node servers
// in this sandbox (exit 1, "stdin is not a tty"), so you cannot start the server in one
// call and curl it in another. Importing server.mjs auto-starts its listener inside the
// SAME node process, then we fetch localhost, then exit. No shell `&` needed.
//
// Usage:  node scripts/smoke-http-inprocess.mjs
// (run from repo root or apps/universal-translator — it imports ./server.mjs)

process.env.PORT = process.env.PORT || '8799';
await import('./server.mjs');
await new Promise(r => setTimeout(r, 1500)); // let the listener bind

async function get(path) {
  try {
    const r = await fetch('http://127.0.0.1:' + process.env.PORT + path);
    const t = await r.text();
    return `[${r.status}] ${t.slice(0, 400)}`;
  } catch (e) { return 'ERR ' + e.message; }
}

console.log('--- /health ---');
console.log(await get('/health'));
console.log('--- /gemini-live-3-5/status ---');
console.log(await get('/gemini-live-3-5/status'));
process.exit(0);
