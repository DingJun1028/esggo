// Reusable SSE reader for Node tests/verify scripts (no browser EventSource needed).
// Usage: const data = await readSSEOnce(url, p => p.data?.source === 'hi', { timeoutMs: 5000 });
// Aborts the fetch on first matching event so the socket closes and the calling process can exit.
import { TextDecoder } from 'node:util';

/**
 * @param {string} url
 * @param {(p:{event:string,data:any})=>boolean} predicate  match predicate
 * @param {{timeoutMs?:number}} [opts]
 * @returns {Promise<any|null>} the matched `data` object, or null on timeout/error
 */
export async function readSSEOnce(url, predicate, opts = {}) {
  const timeoutMs = opts.timeoutMs || 5000;
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  /** @type {any} */
  let res;
  let result = null;
  try {
    res = await fetch(url, { signal: ac.signal });
    if (!res.ok || !res.body) throw new Error('SSE fetch failed: ' + res.status);
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const blocks = buf.split('\n\n');
      buf = blocks.pop() || '';
      for (const block of blocks) {
        const lines = block.split('\n');
        let event = 'message', data = '';
        for (const ln of lines) {
          if (ln.startsWith('event:')) event = ln.slice(6).trim();
          else if (ln.startsWith('data:')) data += ln.slice(5).trim();
        }
        try {
          const p = { event, data: JSON.parse(data) };
          if (predicate(p)) { result = p.data; ac.abort(); }
        } catch { /* not JSON yet, or non-matching */ }
      }
      if (result) break;
    }
  } catch { /* aborted or network error -> return null */ }
  finally {
    clearTimeout(timer);
    try { if (res?.body) await res.body.cancel(); } catch {}
    try { if (typeof res?.body?.destroy === 'function') res.body.destroy(); } catch {}
  }
  return result;
}
