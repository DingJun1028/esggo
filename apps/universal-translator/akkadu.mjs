// ============================================================
// Akkadu-RTC 整合模組 — 即時語音口譯串流 (receiver / broadcaster)
// 對照 Akkadu API README: https://github.com/akkadu/akkadu-api
// ============================================================
const AKKADU_DEV = process.env.AKKADU_DEV_MODE === 'true' || process.env.AKKADU_DEV_MODE === '1';
const AKKADU_TOKEN = process.env.AKKADU_TOKEN || '';
const AKKADU_DEFAULT_ROOM = process.env.AKKADU_DEFAULT_ROOM || 'ejrd';

let Akkadu = null;
let loadError = null;

async function ensureSdk() {
  if (Akkadu !== null || loadError) return { Akkadu, loadError };
  if (!AKKADU_TOKEN) {
    loadError = 'AKKADU_TOKEN 未設定 — 口譯功能未啟用';
    return { Akkadu: null, loadError };
  }
  try {
    const mod = await import('@akkadu/akkadu-rtc');
    Akkadu = mod.default || mod.Akkadu || mod;
    if (!Akkadu) throw new Error('SDK 匯出結構非預期');
  } catch (e) {
    loadError = `Akkadu SDK 載入失敗: ${e.message}`;
  }
  return { Akkadu, loadError };
}

export function akkaduStatus() {
  if (loadError) return { enabled: false, reason: loadError };
  if (Akkadu) return { enabled: true, mode: AKKADU_DEV ? 'dev' : 'prod' };
  return { enabled: false, reason: AKKADU_TOKEN ? 'SDK 載入中' : '未設定 AKKADU_TOKEN' };
}

// 語音轉文字 + 翻譯串流 (簡化版)
export async function translateFromText(text, from, targets) {
  // 內部使用 translate.mjs
  const { translateDetailed, translateToMany } = await import('./translate.mjs');
  if (!text) return { text: '', translations: {} };
  if (Array.isArray(targets) && targets.length) {
    const r = await translateToMany(text, from, targets);
    return { original: text, translations: r.translations };
  }
  const rec = await translateDetailed(text, from, 'zh');
  return { original: text, text: rec.text, translations: { zh: rec.text } };
}