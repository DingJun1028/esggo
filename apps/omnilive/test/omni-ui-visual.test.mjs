/**
 * 以真實 Chrome (CDP) 解析 CSS cascade, 驗證 OmniUI token 落地後的「最終外觀」。
 *
 * 為什麼需要這支: grep 只能證明 token 有被引用, 不能證明 var() 真的有解析成值。
 * 例如 --omni-blur 若拼錯, CSS 會整條宣告失效, 元素退回無模糊 —— 肉眼可見但 grep 無感。
 * 這支用 getComputedStyle 取得瀏覽器實際計算值, 是「樣貌真的對了」的證據。
 *
 * 依賴: 系統既有 Chrome + Node 內建 WebSocket (Node >= 22), 不新增 npm 套件。
 * 若找不到 Chrome 則整組 skip —— 不得以假通過掩蓋無法驗證。
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn, execFileSync } from 'node:child_process';
import { readFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const HTML = readFileSync(join(here, '..', 'public', 'index.html'), 'utf8');

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));

let server, proc, ws, userDir, msgId = 0;
const pending = new Map();
let skipAll = false;

const send = (method, params = {}, sessionId) =>
  new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });

/**
 * 輪詢直到頁面「真正可用」為止, 而非睡固定毫秒數。
 *
 * 為什麼不能 setTimeout(1500): 完整套件下各 test 檔是獨立行程, 前一支檔案的
 * Chrome 還在 taskkill 收尾, CPU 競爭會讓 1500ms 不足以完成 HTML 解析。
 * 睡飽後就緒的話, 之後的 Runtime.evaluate 會讀到一個尚未建立元素的 document:
 *   - document.documentElement === null → getComputedStyle(null) 拋 TypeError
 *   - querySelector('#courseWin') === null → 誤報「元素不存在於 DOM」
 * 兩者都是環境時序造成的假失敗, 但會讓 CI 變成 flaky, 因此必須等真實條件。
 *
 * 判定條件刻意包含一個「每個樣式測試都會碰的元素」(.corner-btn) 與 #subtitles,
 * 確保 CSS 已套用、盒模型已可量測, 才進行外觀斷言。
 */
const waitForAppReady = async (timeoutMs = 30000) => {
  const deadline = Date.now() + timeoutMs;
  let lastErr = null;
  while (Date.now() < deadline) {
    try {
      const ok = await globalThis.__cdpEval(
        `document.readyState === 'complete'` +
        ` && !!document.querySelector('.corner-btn')` +
        ` && !!document.querySelector('#subtitles')`,
      );
      if (ok) return true;
    } catch (e) {
      // 導航期間 execution context 會被銷毀, 這是預期中的, 重試即可。
      lastErr = e;
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(
    `頁面未在 ${timeoutMs}ms 內就緒 (readyState/根元素未出現)` +
    (lastErr ? `; 最後一次錯誤: ${lastErr.message}` : ''),
  );
};

before(async () => {
  if (!chromePath || typeof WebSocket === 'undefined') {
    skipAll = true;
    return;
  }
  server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${server.address().port}/`;

  userDir = mkdtempSync(join(tmpdir(), 'omni-cdp-'));
  proc = spawn(chromePath, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--remote-debugging-port=0',
    `--user-data-dir=${userDir}`, 'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  // 從 stderr 抓 "DevTools listening on ws://..."
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = '';
    const t = setTimeout(() => reject(new Error('Chrome 啟動逾時')), 30000);
    proc.stderr.on('data', (d) => {
      buf += d.toString();
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) { clearTimeout(t); resolve(m[1]); }
    });
  });

  ws = new WebSocket(wsUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(m.error.message)) : resolve(m.result);
    }
  };

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  globalThis.__cdpSession = sessionId;
  const origSend = send;
  // session-aware send
  globalThis.__cdpEval = async (expr) => {
    const r = await new Promise((resolve, reject) => {
      const id = ++msgId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true }, sessionId }));
    });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description || ''));
    return r.result.value;
  };
  await globalThis.__cdpEval(`location.href = ${JSON.stringify(url)}; true`);
  await waitForAppReady();
  void origSend;
});

after(async () => {
  // Windows 上 proc.kill() 只結束父行程, Chrome 會留下孤兒行程讓 runner 卡住;
  // 必須用 taskkill /T /F 收掉整棵行程樹, 並強制關閉 keep-alive 連線。
  try { ws?.close(); } catch {}
  try { ws?.unref?.(); } catch {}
  try { server?.closeAllConnections?.(); } catch {}
  try { if (proc?.pid) execFileSync('taskkill', ['/PID', String(proc.pid), '/T', '/F'],
        { stdio: 'ignore', timeout: 15000 }); } catch {}
  try { proc?.kill('SIGKILL'); } catch {}
  try { if (server) await Promise.race([new Promise((r) => server.close(r)), new Promise((r) => setTimeout(r, 3000))]); } catch {}
  try { if (userDir) rmSync(userDir, { recursive: true, force: true, maxRetries: 3 }); } catch {}
});

const SKIP = () => {
  if (!chromePath) return '找不到 Chrome/Edge';
  if (typeof WebSocket === 'undefined') return '此 Node 無內建 WebSocket (需 >=22)';
  return false;
};

test('所有 OmniUI token 皆能解析出值 (無失效的 var())', { skip: SKIP() }, async () => {
  const tokens = await globalThis.__cdpEval(`(() => {
    const cs = getComputedStyle(document.documentElement);
    const out = {};
    for (const n of ['--omni-radius','--omni-blur','--omni-shadow','--omni-shadow-lift','--omni-fill','--line','--glass','--green'])
      out[n] = cs.getPropertyValue(n).trim();
    return out;
  })()`);
  for (const [k, v] of Object.entries(tokens)) {
    assert.ok(v && v.length > 0, `${k} 未解析出值`);
  }
  assert.equal(tokens['--omni-radius'], '12px');
  assert.equal(tokens['--omni-blur'], '20px');
  // 自訂屬性回傳的是「作者寫的原文」, 不會正規化成 rgba(201, 162, 75, 0.3),
  // 故以去除空白/前導零後比對, 避免誤判。
  const norm = (s) => s.replace(/\s+/g, '').replace(/\.0\)/g, ')').replace(/0\./g, '.');
  assert.equal(norm(tokens['--line']), 'rgba(201,162,75,.3)');
});

test('#courseWin 實際外觀符合 OmniUI 標準', { skip: SKIP() }, async () => {
  const st = await globalThis.__cdpEval(`(() => {
    const el = document.querySelector('#courseWin'); if (!el) return null;
    const cs = getComputedStyle(el);
    return { backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
             borderTopWidth: cs.borderTopWidth, borderTopStyle: cs.borderTopStyle,
             borderRadius: cs.borderRadius, boxShadow: cs.boxShadow };
  })()`);
  assert.ok(st, '#courseWin 不存在於 DOM');
  assert.match(st.backdropFilter, /blur\(20px\)/, `blur 未套用: ${st.backdropFilter}`);
  assert.equal(st.borderTopWidth, '1px', `邊框缺失: ${st.borderTopWidth}`);
  assert.equal(st.borderTopStyle, 'solid', `邊框非實線: ${st.borderTopStyle}`);
  assert.match(st.borderRadius, /12px/, `圓角應為 12px: ${st.borderRadius}`);
  assert.match(st.boxShadow, /rgba\(0, 0, 0, 0\.28\)/, `陰影應為 lift: ${st.boxShadow}`);
});

test('.corner-btn 實際外觀符合 OmniUI 標準', { skip: SKIP() }, async () => {
  const st = await globalThis.__cdpEval(`(() => {
    const el = document.querySelector('.corner-btn'); if (!el) return null;
    const cs = getComputedStyle(el);
    return { backdropFilter: cs.backdropFilter || cs.webkitBackdropFilter,
             borderRadius: cs.borderRadius, boxShadow: cs.boxShadow };
  })()`);
  assert.ok(st, '.corner-btn 不存在於 DOM');
  assert.match(st.backdropFilter, /blur\(20px\)/, `blur 未套用: ${st.backdropFilter}`);
  assert.match(st.borderRadius, /12px/, `圓角應為 12px: ${st.borderRadius}`);
  assert.match(st.boxShadow, /rgba\(0, 0, 0, 0\.2\)/, `陰影應為 standard: ${st.boxShadow}`);
});

test('#subtitles 與 #gripHandle 玻璃一體 (淡金邊 + 上下圓角相接)', { skip: SKIP() }, async () => {
  const st = await globalThis.__cdpEval(`(() => {
    const g = s => { const e = document.querySelector(s); if (!e) return null;
      const c = getComputedStyle(e);
      // 注意: 不可讀 c.border —— border-bottom:none 會讓 shorthand 無法序列化而回傳 ""。
      return { borderTopColor: c.borderTopColor, borderTopWidth: c.borderTopWidth,
               borderTopStyle: c.borderTopStyle, borderBottomStyle: c.borderBottomStyle,
               borderBottomColor: c.borderBottomColor, borderBottomWidth: c.borderBottomWidth,
               borderLeftWidth: c.borderLeftWidth, borderRightWidth: c.borderRightWidth,
               borderRadius: c.borderRadius }; };
    return { sub: g('#subtitles'), grip: g('#gripHandle') };
  })()`);
  assert.ok(st.sub && st.grip, '字幕區或把手不存在');
  assert.match(st.sub.borderRadius, /^12px 12px 0px 0px$/, `字幕上圓角: ${st.sub.borderRadius}`);
  assert.match(st.grip.borderRadius, /^0px 0px 12px 12px$/, `把手下圓角: ${st.grip.borderRadius}`);
  assert.equal(st.sub.borderBottomStyle, 'none', '字幕區底部應無邊, 才與控制條連成一體');
  // 字幕區: 三邊(上/左/右)有邊, 底部無邊 → 與下方把手接合
  assert.equal(st.sub.borderTopWidth, '1px', `字幕上邊寬: ${st.sub.borderTopWidth}`);
  assert.equal(st.sub.borderTopStyle, 'solid', '字幕上邊應為實線');
  assert.match(st.sub.borderTopColor, /201, 162, 75/, `字幕邊框應淡金: ${st.sub.borderTopColor}`);
  // 把手: 上邊無邊(承接字幕區), 左右+底部有邊 → 封住整體下緣
  assert.equal(st.grip.borderTopStyle, 'none', '把手上邊應無邊, 才與字幕區相接');
  assert.equal(st.grip.borderBottomWidth, '1px', `把手下邊寬: ${st.grip.borderBottomWidth}`);
  assert.equal(st.grip.borderBottomStyle, 'solid', '把手下邊應為實線');
  assert.match(st.grip.borderBottomColor, /201, 162, 75/, `把手邊框應淡金: ${st.grip.borderBottomColor}`);
  assert.equal(st.grip.borderLeftWidth, '1px', '把手左邊應有邊');
  assert.equal(st.grip.borderRightWidth, '1px', '把手右邊應有邊');
});

test('字幕視窗高度恆定: 注入 40 句後高度不暴增', { skip: SKIP() }, async () => {
  const res = await globalThis.__cdpEval(`(() => {
    const el = document.querySelector('#subtitles'); if (!el) return null;
    el.innerHTML = '<div class="sub-group"><div class="sub-line tgt">a</div></div>';
    const h1 = el.getBoundingClientRect().height;
    for (let i = 0; i < 40; i++)
      el.insertAdjacentHTML('beforeend',
        '<div class="sub-group"><div class="sub-line src">src '+i+'</div><div class="sub-line tgt">tgt '+i+'</div></div>');
    return { h1, hMany: el.getBoundingClientRect().height, groups: el.querySelectorAll('.sub-group').length };
  })()`);
  assert.ok(res, '#subtitles 不存在');
  assert.equal(res.groups, 41, '注入句數不符');
  assert.ok(res.hMany <= res.h1 * 12 + 4, `字幕層暴增: 1句=${res.h1}px → 41句=${res.hMany}px`);
});

void skipAll;
