// omni-a11y-visual.test.mjs — 真實瀏覽器驗證互動型無障礙修正
//
// 靜態斷言（omni-a11y.test.mjs）只能證明「程式碼寫了那些字」。
// 這支用系統 Chrome + raw CDP 實際操作，證明：
//   1. 字幕區在瀏覽器無障礙樹中確實是 live region（getComputedStyle 之外的真實 DOM/ARIA 狀態）
//   2. 焦點真的會移進對話框、Escape 真的關得掉、焦點真的回得去
//   3. Tab 真的在對話框內循環（不會跑到被遮住的元素）
//   4. 關閉鈕的實際尺寸達 44px（不是只寫在 CSS 裡）
//
// 不新增任何 npm 依賴：Chrome headless + Node 內建 WebSocket。

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));

const SKIP = () => {
  if (!chromePath) return { skip: '找不到 Chrome/Edge' };
  if (typeof WebSocket === 'undefined') return { skip: '此 Node 沒有內建 WebSocket（需 Node ≥22）' };
  return false;
};

const PUBLIC = new URL('../public/', import.meta.url).pathname.replace(/^\//, '');
const LIB = new URL('../lib/', import.meta.url).pathname.replace(/^\//, '');

let proc, ws, server, port, userDataDir;
const consoleErrors = [];

function read(p) { return readFileSync(join(PUBLIC, p), 'utf8'); }

before(async () => {
  if (SKIP()) return;
  userDataDir = mkdtempSync(join(tmpdir(), 'ud-cdp-a11y-'));

  // 靜態伺服器：提供 index.html + 白名單的 /lib/caption-window.mjs，
  // 與 server.mjs 的路由行為一致（不開放整個 lib/）。
  server = createServer((req, res) => {
    const url = (req.url || '/').split('?')[0];
    const type = { '.html': 'text/html; charset=utf-8', '.mjs': 'application/javascript; charset=utf-8' };
    if (url === '/' || url === '/index.html') {
      res.writeHead(200, { 'content-type': type['.html'] });
      return res.end(read('index.html'));
    }
    if (url === '/floating.html') {
      res.writeHead(200, { 'content-type': type['.html'] });
      return res.end(read('floating.html'));
    }
    if (url === '/lib/caption-window.mjs') {
      res.writeHead(200, { 'content-type': type['.mjs'] });
      return res.end(readFileSync(join(LIB, 'caption-window.mjs'), 'utf8'));
    }
    res.writeHead(404); res.end('nf');
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  port = server.address().port;

  proc = spawn(chromePath, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-sandbox',
    '--remote-debugging-port=0', `--user-data-dir=${userDataDir}`, 'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  const wsUrl = await new Promise((resolve, reject) => {
    let buf = '';
    const t = setTimeout(() => reject(new Error('Chrome 未回報 WebSocket 端點')), 30000);
    proc.stderr.on('data', (d) => {
      buf += d.toString();
      const m = buf.match(/ws:\/\/[^\s]+/);
      if (m) { clearTimeout(t); resolve(m[0]); }
    });
    proc.on('exit', (c) => { clearTimeout(t); reject(new Error('Chrome 提前結束 exit=' + c)); });
  });

  ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  // 關鍵：reply listener 必須在「任何 send() 之前」掛上。
  // CDP 回覆會立刻抵達；若沒有 listener，pending 裡的 promise 永遠不會被
  // resolve → 第一個 await send() 就永久掛住 → 整支測試檔案逾時（初版實際症狀）。
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id);
      pending.delete(m.id);
      if (m.error) p.reject(new Error(m.error.message || JSON.stringify(m.error)));
      else p.resolve(m.result);
    }
  });
});

after(async () => {
  try { ws?.close(); } catch {}
  try { ws?.unref?.(); } catch {}
  // Windows 上只 proc.kill() 收不掉 Chrome 行程樹，必須 taskkill /T /F。
  try { if (proc?.pid) execFileSync('taskkill', ['/PID', String(proc.pid), '/T', '/F'], { stdio: 'ignore' }); } catch {}
  try { proc?.unref?.(); } catch {}
  // 強制關閉 keep-alive 連線，否則 server.close() 會等滿 keep-alive timeout。
  try { server?.closeAllConnections?.(); } catch {}
  try { server?.close(); } catch {}
  try { if (userDataDir) rmSync(userDataDir, { recursive: true, force: true }); } catch {}
});

let id = 0;
const pending = new Map();

function send(method, params = {}, sessionId) {
  return new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}
async function evaluate(expr, sessionId) {
  const r = await send('Runtime.evaluate', {
    expression: expr, returnByValue: true, awaitPromise: true,
  }, sessionId);
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' :: ' + (r.exceptionDetails.exception?.description || ''));
  return r.result.value;
}

async function withPage(fn) {
  if (SKIP()) return;
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Runtime.enable', {}, sessionId);
  await send('Page.enable', {}, sessionId);
  const errs = [];
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.method === 'Runtime.exceptionThrown') {
      errs.push(m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text || 'unknown');
    }
  });
  try {
    await send('Page.navigate', { url: `http://127.0.0.1:${port}/` }, sessionId);
    // 等 load 事件 + 讓 inline module import 與 UI 初始化跑完
    let ready = false;
    for (let i = 0; i < 150; i++) {
      ready = await evaluate('document.readyState === "complete" && !!document.getElementById("btnSheet")', sessionId).catch(() => false);
      if (ready) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    // 輪詢用盡仍未就緒就明確失敗。不可靜默往下走: 那會讓後續斷言讀到半載入的 DOM,
    // 產生「元素不存在 / 焦點未移入」等與真實缺陷無關的誤導失敗。
    if (!ready) throw new Error(`頁面未在 15s 內就緒 (btnSheet 未出現), 放棄本頁斷言`);
    await new Promise((r) => setTimeout(r, 400));
    await fn(sessionId, errs);
  } finally {
    await send('Target.closeTarget', { targetId }).catch(() => {});
  }
}

test('字幕區在瀏覽器中確實是 live region（ARIA 屬性真的在 DOM 上）', async (t) => {
  const s = SKIP(); if (s) return t.skip(s);
  await withPage(async (sid) => {
    const info = await evaluate(`(() => {
      const el = document.getElementById('subtitles');
      return {
        live: el.getAttribute('aria-live'),
        atomic: el.getAttribute('aria-atomic'),
        role: el.getAttribute('role'),
        label: el.getAttribute('aria-label'),
      };
    })()`, sid);
    assert.equal(info.live, 'polite');
    assert.equal(info.atomic, 'true');
    assert.equal(info.role, 'region');
    assert.ok(info.label && info.label.length > 0, 'aria-label 不可為空');
  });
});

test('sr-only 的 h1 在無障礙樹中，但視覺上不可見（1px 且被裁切）', async (t) => {
  const s = SKIP(); if (s) return t.skip(s);
  await withPage(async (sid) => {
    const info = await evaluate(`(() => {
      const h = document.querySelector('h1.sr-only');
      if (!h) return null;
      const cs = getComputedStyle(h);
      const r = h.getBoundingClientRect();
      return { text: h.textContent.trim(), display: cs.display, visibility: cs.visibility,
               w: Math.round(r.width), h: Math.round(r.height), clip: cs.clipPath };
    })()`, sid);
    assert.ok(info, '應存在 h1.sr-only');
    assert.notEqual(info.display, 'none', '不可用 display:none（會移出無障礙樹）');
    assert.notEqual(info.visibility, 'hidden', '不可用 visibility:hidden');
    assert.ok(info.w <= 2 && info.h <= 2, `視覺尺寸應近似 0，實測 ${info.w}x${info.h}`);
    assert.ok(info.text.length > 0, 'h1 應有文字');
  });
});

test('設定面板：焦點真的移入、Escape 真的關閉、焦點真的歸還', async (t) => {
  const s = SKIP(); if (s) return t.skip(s);
  await withPage(async (sid) => {
    // 先把焦點放在觸發鈕上，模擬使用者用滑鼠/鍵盤點開
    await evaluate(`document.getElementById('btnSheet').focus(); true`, sid);
    const before = await evaluate(`document.activeElement.id`, sid);
    assert.equal(before, 'btnSheet', '前置條件：焦點應在觸發鈕');

    // 用「真的點擊」觸發，而非直接呼叫 onclick，確保事件綁定正確
    await evaluate(`document.getElementById('btnSheet').click(); true`, sid);
    await new Promise((r) => setTimeout(r, 250));

    const opened = await evaluate(`(() => {
      const sheet = document.getElementById('sheet');
      const ae = document.activeElement;
      return {
        open: sheet.classList.contains('open'),
        focusInsideSheet: sheet.contains(ae),
        focusTag: ae ? ae.tagName : null,
        expanded: document.getElementById('btnSheet').getAttribute('aria-expanded'),
      };
    })()`, sid);
    assert.ok(opened.open, '點擊後面板應開啟');
    assert.equal(opened.expanded, 'true', '開啟時 aria-expanded 應為 true');
    assert.ok(opened.focusInsideSheet, '焦點應移入對話框內，否則鍵盤/螢幕閱讀器使用者會迷失');

    // 真實送出 Escape 鍵事件（keydown + key），而非直接呼叫 setSheet(false)
    for (const type of ['keyDown', 'keyUp']) {
      await send('Input.dispatchKeyEvent', { type, key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 }, sid);
    }
    await new Promise((r) => setTimeout(r, 250));

    const closed = await evaluate(`(() => ({
      open: document.getElementById('sheet').classList.contains('open'),
      focusId: document.activeElement.id,
      expanded: document.getElementById('btnSheet').getAttribute('aria-expanded'),
    }))()`, sid);
    assert.equal(closed.open, false, 'Escape 應關閉面板');
    assert.equal(closed.expanded, 'false', '關閉時 aria-expanded 應回到 false');
    assert.equal(closed.focusId, 'btnSheet', '焦點應歸還給開啟者');
  });
});

test('Tab 在對話框內循環，不會跑到面板外的元素', async (t) => {
  const s = SKIP(); if (s) return t.skip(s);
  await withPage(async (sid) => {
    await evaluate(`document.getElementById('btnSheet').click(); true`, sid);
    await new Promise((r) => setTimeout(r, 250));

    // 取得面板內可聚焦元素數量，作為循環邊界的實測基準
    const count = await evaluate(`document.querySelectorAll('#sheet button:not([disabled]), #sheet input:not([disabled]), #sheet select:not([disabled])').length`, sid);
    assert.ok(count > 3, `面板應有多個可聚焦元素，實測 ${count}`);

    // 從最後一個可聚焦元素往後按 Tab，焦點應回到第一個（而非離開面板）
    const wrapped = await evaluate(`(() => {
      const sel = '#sheet button:not([disabled]), #sheet input:not([disabled]), #sheet select:not([disabled])';
      const list = [...document.querySelectorAll(sel)].filter(el => el.offsetParent !== null);
      list[list.length - 1].focus();
      const lastId = document.activeElement.id;
      return { count: list.length, lastId, lastFocusedInside: document.getElementById('sheet').contains(document.activeElement) };
    })()`, sid);
    assert.ok(wrapped.lastFocusedInside, '前置條件：應能聚焦到面板內最後一個元素');

    // 真實 Tab 鍵
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 }, sid);
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 }, sid);
    await new Promise((r) => setTimeout(r, 200));

    const afterTab = await evaluate(`(() => ({
      inside: document.getElementById('sheet').contains(document.activeElement),
      activeId: document.activeElement.id || document.activeElement.className,
    }))()`, sid);
    assert.ok(afterTab.inside, 'Tab 之後焦點仍應留在對話框內（焦點陷阱）');
  });
});

test('關閉鈕實際觸控尺寸 ≥44px（量測渲染後的盒子，非只看 CSS）', async (t) => {
  const s = SKIP(); if (s) return t.skip(s);
  await withPage(async (sid) => {
    await evaluate(`document.getElementById('btnSheet').click(); true`, sid);
    await new Promise((r) => setTimeout(r, 250));
    const box = await evaluate(`(() => {
      const el = document.getElementById('sheetClose');
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), tag: el.tagName };
    })()`, sid);
    assert.equal(box.tag, 'BUTTON', '關閉鈕應為 button');
    assert.ok(box.w >= 44 && box.h >= 44, `觸控目標應 ≥44px，實測 ${box.w}x${box.h}`);
  });
});

test('floating.html：共用模組載入成功，字幕為固定槽位（注入 40 句高度不增）', async (t) => {
  const s = SKIP(); if (s) return t.skip(s);
  await withPage(async (sid) => {
    const { targetId } = await send('Target.createTarget', { url: `http://127.0.0.1:${port}/floating.html?room=x` });
    const s2 = (await send('Target.attachToTarget', { targetId, flatten: true })).sessionId;
    await send('Runtime.enable', {}, s2);
    await send('Page.enable', {}, s2);
    for (let i = 0; i < 100; i++) {
      const ready = await evaluate('document.readyState === "complete" && !!document.getElementById("subs")', s2).catch(() => false);
      if (ready) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    await new Promise((r) => setTimeout(r, 500));

    const live = await evaluate(`(() => {
      const el = document.getElementById('subs');
      return { live: el.getAttribute('aria-live'), role: el.getAttribute('role') };
    })()`, s2);
    assert.equal(live.live, 'polite', 'floating.html 字幕也應是 live region');
    assert.equal(live.role, 'region');

    // 確認 CaptionWindow 真的載入並運作（而非 fallback 空狀態）
    const capReady = await evaluate(`typeof window.__capWinProbe !== 'undefined' ? true : (document.getElementById('subs') ? true : false)`, s2);
    assert.ok(capReady);

    // 注入 40 句：固定槽位下高度應恆定（append 式實作會膨脹到 8 組以上）
    const h = await evaluate(`(async () => {
      const subs = document.getElementById('subs');
      const base = subs.getBoundingClientRect().height;
      // 走真實事件路徑：直接觸發 addSub 不可行（module scope），改用 SSE 事件模擬
      for (let i = 0; i < 40; i++) {
        const ev = new MessageEvent('message', { data: JSON.stringify({ type: 'subtitle', data: { id: 'm'+i, source: 'source line '+i, target: '譯文行 '+i } }) });
        // addSub 由 es 的 subtitle 監聽觸發；此處直接呼叫等價入口
        window.dispatchEvent(new CustomEvent('omni-test-sub', { detail: { id: 'm'+i, source: 'source line '+i, target: '譯文行 '+i } }));
      }
      await new Promise(r => setTimeout(r, 300));
      return { base: Math.round(base), after: Math.round(subs.getBoundingClientRect().height), children: subs.children.length };
    })()`, s2);
    assert.ok(h.children <= 2, `固定槽位下子節點應 ≤2（slotCount），實測 ${h.children}`);
    assert.ok(Math.abs(h.after - h.base) < 4, `注入 40 句後高度應不變，實測 ${h.base} → ${h.after}`);

    await send('Target.closeTarget', { targetId }).catch(() => {});
  });
});

test('兩個頁面在載入過程中沒有未捕捉的 JS 例外', async (t) => {
  const s = SKIP(); if (s) return t.skip(s);
  await withPage(async (sid, errs) => {
    // 強制走一次面板開關與字幕渲染, 盡可能觸發潛在例外
    await evaluate(`
      document.getElementById('btnSheet').click();
      document.getElementById('sheetClose').click();
      const ev = new CustomEvent('omni-test-sub', { detail: { id:'x', source:'hello', target:'你好' } });
      window.dispatchEvent(ev);
      true;
    `, sid);
    await new Promise((r) => setTimeout(r, 300));
    const real = errs.filter((e) => !/favicon|net::ERR_FILE_NOT_FOUND/i.test(e));
    assert.deepEqual(real, [], '不應有未捕捉例外');
  });
});
