# Self-contained Node verification (when npm install hangs)

When a service depends on an external npm pkg (e.g. `ws`) that won't install over a slow
network, you can't start the real server to test it. Use a self-contained script that imports
ONLY node builtins + your already-present engine module, spins an `http` server on a throwaway
port, fetches itself, prints, then exits. This proves the HTTP routing + engine integration
without the missing dependency.

```js
// _verify_selfcontained.mjs  (delete after use)
import http from 'node:http';
import { translateDetailed, translateToMany } from './translate.mjs';

const PORT = 8799;
const srv = http.createServer(async (req, res) => {
  if (req.url === '/health') return res.end(JSON.stringify({ status: 'ok' }));
  if (req.url === '/t' && req.method === 'POST') {
    let b = ''; for await (const c of req) b += c;
    const p = JSON.parse(b);
    const r = Array.isArray(p.targets)
      ? await translateToMany(p.text, p.from, p.targets)
      : await translateDetailed(p.text, p.from, p.to);
    return res.end(JSON.stringify(r));
  }
  res.end('x');
});
srv.listen(PORT, async () => {
  const h = await (await fetch(`http://localhost:${PORT}/health`)).json();
  const s = await (await fetch(`http://localhost:${PORT}/t`, { method:'POST',
    headers:{'content-type':'application/json'},
    body: JSON.stringify({ text:'Hi', from:'en', to:'zh' }) })).json();
  console.log('HEALTH', JSON.stringify(h));
  console.log('SINGLE', JSON.stringify(s));
  srv.close(); process.exit(0);
});
```
Run: `node _verify_selfcontained.mjs`. Expect `HEALTH {"status":"ok"}`, `SINGLE {...}`.

Notes:
- `node -e "..."` fails with `stdin is not a tty` under git-bash for ESM dynamic import;
  always use a temp `.mjs` file instead.
- Use `C:/path/file.mjs` (native) for `node --check`; MSYS rewrites `/c/...` to `C:\c\...`.
- The WS channel in the real server wraps the SAME `translateDetailed`, so once REST is proven
  the only untested path is the socket upgrade — low risk, verify later on VPS where deps install.
