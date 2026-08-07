// ============================================================
// 萬能即時翻譯引擎 v2 — 可插拔 / 零依賴 / 最佳實踐化
// 引擎優先序: Google gtx(免費,零key,支援auto/zh-TW) → LibreTranslate(自建) → MyMemory(免費) → 原文兜底
// 強化: 平行翻譯、指數退避重試、逾時、LRU 快取、engine 標記(5T 可溯源)、postProcess 後處理(品質/精準度)
// 雙向 TS 終始矩陣: 領域型別契約見 ../../shared/types.ts (canonical) → types/generated/esggo-shared.d.ts (generated)
// @ts-check
/// <reference path="./types/generated/esggo-shared.d.ts" />
// ============================================================
import crypto from 'node:crypto';

const CACHE = new Map();
const CACHE_MAX = Number(process.env.TRANSLATE_CACHE_MAX || 1000);
const TIMEOUT_MS = Number(process.env.TRANSLATE_TIMEOUT_MS || 8000);
const RETRIES = Number(process.env.TRANSLATE_RETRIES || 2);

/**
 * @param {string} t
 * @param {string} from
 * @param {string} to
 */
const cacheKey = (t, from, to) => `${from}|${to}|${t}`;
/**
 * @template V
 * @param {Map<string, V>} cache
 * @param {string} k
 * @returns {V | undefined}
 */
function cacheGet(cache, k) { const v = cache.get(k); if (v !== undefined) { cache.delete(k); cache.set(k, v); } return v; }
/**
 * @template V
 * @param {Map<string, V>} cache
 * @param {string} k
 * @param {V} v
 */
function cacheSet(cache, k, v) { cache.set(k, v); if (cache.size > CACHE_MAX) { const oldest = cache.keys().next().value; if (oldest) cache.delete(oldest); } }

export const stats = { calls: 0, cacheHits: 0, errors: 0, byEngine: /** @type {Record<string, number>} */ (Object.create(null)) };

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * @template T
 * @param {() => Promise<T>} fn
 * @param {string} label
 * @returns {Promise<T>}
 */
async function withRetry(fn, label) {
  /** @type {unknown} */
  let lastErr;
  for (let i = 0; i <= RETRIES; i++) {
    try { return await fn(); }
    catch (/** @type {any} */ e) { lastErr = e; if (i < RETRIES) await sleep(200 * 2 ** i); }
  }
  throw new Error(`${label}: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`);
}

// --- 引擎 0: Google Translate 非官方 gtx endpoint (免費, 零 key, 支援 auto 偵測) ---
// 注: 非官方 endpoint, TOS 灰區, 但零付費/零私鑰, 符合「只用免費」硬約束。作為最穩定主鏈。
// Google 原生支援 auto 偵測與 zh-TW, 故此處不經 normalizeLang（直接送原始 from/to, zh-TW 也送 zh-TW）
/**
 * @param {string} text
 * @param {string} [from]
 * @param {string} [to]
 */
async function viaGoogleGtx(text, from, to) {
  const sl = from || 'auto';
  const tl = to || 'zh-CN';
  const u = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
  const r = await fetch(u, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error('gtx HTTP ' + r.status);
  const d = await r.json();
  /** @type {any[][]} */
  const segments = d[0] || [];
  const out = segments.map((/** @type {any[]} */ x) => x[0]).join('');
  if (!out) throw new Error('gtx empty');
  return out;
}

// --- 引擎 1: LibreTranslate (自建, env LIBRETRANSLATE_URL) ---
/**
 * @param {string} text
 * @param {string} [from]
 * @param {string} [to]
 */
async function viaLibre(text, from, to) {
  const base = process.env.LIBRETRANSLATE_URL;
  const sf = normalizeLang(from || 'en');
  const st = normalizeLang(to || 'zh-CN');
  /** @type {any} */
  const body = { q: text, source: sf, target: st, format: 'text' };
  if (process.env.LIBRETRANSLATE_KEY) body.api_key = process.env.LIBRETRANSLATE_KEY;
  const r = await fetch(/** @type {string} */ (base), {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body), signal: AbortSignal.timeout(TIMEOUT_MS)
  });
  if (!r.ok) throw new Error('libre HTTP ' + r.status);
  const d = await r.json();
  if (!d.translatedText) throw new Error('libre empty');
  return d.translatedText;
}

// --- 引擎 2: MyMemory (免費, 零 key) — 加 email 參數提升配額與品質 ---
// 註：MyMemory 不支援 auto 來源語言（會回 INVALID SOURCE），故 from 必須為具體語碼
/**
 * @param {string} text
 * @param {string} [from]
 * @param {string} [to]
 */
async function viaMyMemory(text, from, to) {
  const lp = `${normalizeLang(from || 'en')}|${normalizeLang(to || 'zh-CN')}`;
  // email 參數為 MyMemory 官方免費提升方案（仍免費），提升配額與回傳品質
  const email = process.env.MYMEMORY_EMAIL ? `&de=${encodeURIComponent(process.env.MYMEMORY_EMAIL)}` : '';
  const u = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(lp)}${email}`;
  const r = await fetch(u, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { 'User-Agent': 'OmniBlueprintHub/0.6' } });
  if (!r.ok) throw new Error('mymemory HTTP ' + r.status);
  const d = await r.json();
  if (Number(d.responseStatus) !== 200) throw new Error(d.responseDetails || 'mymemory fail');
  return postProcess(d.responseData.translatedText);
}

// --- 後處理：提升翻譯「品質感」與精準度（純免費，零外部依賴） ---
/** @type {Record<string, string>} */
const GLOSSARY = parseGlossaryEnv();
/** @returns {Record<string, string>} */
function parseGlossaryEnv() {
  const raw = process.env.GLOSSARY || '';
  /** @type {Record<string, string>} */
  const map = {};
  for (const line of raw.split('|')) {
    const i = line.indexOf('=');
    if (i > 0) { const k = line.slice(0, i).trim(), v = line.slice(i + 1).trim(); if (k) map[k] = v; }
  }
  return map;
}
/**
 * @param {string} text
 * @returns {string}
 */
function applyGlossary(text) {
  let t = text;
  for (const [k, v] of Object.entries(GLOSSARY)) {
    if (k) t = t.split(k).join(v); // 全域術語強制替換（跨語種一致）
  }
  return t;
}
/**
 * @param {string} text
 * @returns {string}
 */
function postProcess(text) {
  if (!text) return text;
  let t = text;
  // 1) 去除 MyMemory 常見亂碼標記
  t = t.replace(/\*/g, '').replace(/\[[^\]]*\]/g, '').trim();
  // 2) 合併多餘空白
  t = t.replace(/\s{2,}/g, ' ').trim();
  // 3) 中英混排時確保標點後有空格（提升可讀性）
  t = t.replace(/([，。！？；、])([a-zA-Z0-9])/g, '$1 $2');
  // 4) 術語表強制套用
  t = applyGlossary(t);
  return t;
}

// --- 語碼規範化（修復繁中語音翻譯）：MyMemory / LibreTranslate 不支援 zh-TW / auto ---
// MyMemory 實測: zh-TW → 回原文未翻 (失敗); zh-CN → 正常。auto → INVALID SOURCE。
// 故將 zh-TW→zh-CN、zh-Hant→zh-CN、auto→en（en 為最穩定假設來源，避免 INVALID SOURCE）。
function normalizeLang(/** @type {string} */ l) {
  if (!l) return 'en';
  const s = String(l).toLowerCase().trim();
  if (s === 'auto' || s === 'detect' || s === 'a') return 'en';
  if (s === 'zh-tw' || s === 'zh-hant' || s === 'zht' || s === 'chinese(traditional)') return 'zh-CN';
  if (s === 'zh' || s === 'zh-cn' || s === 'zh-hans' || s === 'zhs') return 'zh-CN';
  if (s === 'zh-hk') return 'zh-CN';
  return s;
}

/**
 * @returns {Array<[string, (text: string, from?: string, to?: string) => Promise<string>]>}
 */
function engineChain() {
  /** @type {Array<[string, (text: string, from?: string, to?: string) => Promise<string>]>} */
  const chain = [['google-gtx', viaGoogleGtx]]; // 最穩定免費主鏈 (零 key, 支援 auto/zh-TW)
  if (process.env.LIBRETRANSLATE_URL) chain.push(['libretranslate', viaLibre]);
  chain.push(['mymemory', viaMyMemory]); // 後備 (crowd 層品質不穩，作兜底前最後一搏)
  return chain;
}

/** @returns {Promise<import('./types/generated/esggo-shared.d.ts').ITranslateResult>} */
export async function translateDetailed(/** @type {string} */ text, /** @type {string} */ from, /** @type {string} */ to) {
  // 規範化來源/目標語碼（修復繁中 / auto 翻譯失敗）
  const nFrom = normalizeLang(from);
  const nTo = normalizeLang(to);
  if (!text || nFrom === nTo) return { text, engine: 'passthrough', cached: false };
  const k = cacheKey(text, nFrom, nTo);
  const hit = cacheGet(CACHE, k);
  if (hit) { stats.cacheHits++; return { ...hit, cached: true }; }

  stats.calls++;
  for (const [name, fn] of engineChain()) {
    try {
      const out = await withRetry(() => fn(text, from, to), name);
      const rec = { text: out, engine: name };
      stats.byEngine[name] = (stats.byEngine[name] || 0) + 1;
      cacheSet(CACHE, k, rec);
      return { ...rec, cached: false };
    } catch { /* 換下一引擎 */ }
  }
  stats.errors++;
  return { text, engine: 'fallback-origin', cached: false }; // 兜底：回原文，永不中斷轉播
}

export async function translateText(/** @type {string} */ text, /** @type {string} */ from, /** @type {string} */ to) {
  return (await translateDetailed(text, from, to)).text;
}

/**
 * 平行翻譯多語 (原序列 await → Promise.all，延遲從 N×RTT 降為 1×RTT)
 * @param {string} text
 * @param {string} from
 * @param {string[]} targets
 */
export async function translateToMany(text, from, targets) {
  // 規範化 targets（zh-TW→zh-CN 等），並對相同規範後語碼去重（保留原始展示名）
  /** @type {Map<string, string>} */
  const normMap = new Map();
  for (const t of targets) {
    const n = normalizeLang(t);
    if (!normMap.has(n)) normMap.set(n, t); // 首見的原始碼作為展示 key
  }
  const results = await Promise.all(
    [...normMap.keys()].map(async (n) => [normMap.get(n), await translateDetailed(text, from, n)])
  );
  /** @type {Record<string, string>} */
  const out = {};
  /** @type {Record<string, string>} */
  const engines = {};
  for (const pair of results) { const t = /** @type {string} */ (pair[0]); const r = /** @type {import('./types/generated/esggo-shared.d.ts').ITranslateResult} */ (pair[1]); out[t] = r.text; engines[t] = r.engine; }
  return { translations: out, engines };
}

export function hashOf(/** @type {string} */ s) { return crypto.createHash('sha256').update(s).digest('hex'); }
