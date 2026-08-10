// 終始矩陣 — 語言碼規範化 (lang-matrix)
// 消費者副本: 由 shared/lang-matrix.mjs 經 scripts/sync-lang-matrix.mjs 產生。
// 此處提供最小可用實作, 確保 universal-translator 啟動 (toCanonical / toEngineLang)。

/**
 * 將任意輸入語言碼規範化為內部標準碼
 * @param {string} lang
 * @returns {'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'auto' | string}
 */
export function toCanonical(lang) {
  if (!lang) return 'auto';
  const l = String(lang).toLowerCase().trim();
  // 中文族
  if (l === 'zh' || l === 'zh-tw' || l === 'zh_hant' || l === 'traditional chinese' || l === 'chinese-traditional') return 'zh-TW';
  if (l === 'zh-cn' || l === 'zh_hans' || l === 'simplified chinese' || l === 'chinese-simplified') return 'zh-CN';
  if (l.startsWith('zh')) return 'zh-TW'; // 預設繁中 (台灣場景)
  // 英文
  if (l === 'en' || l === 'english') return 'en';
  // 日文 / 韓文
  if (l === 'ja' || l === 'japanese' || l === '日本語') return 'ja';
  if (l === 'ko' || l === 'korean' || l === '한국어') return 'ko';
  // 自動偵測
  if (l === 'auto' || l === 'detect' || l === 'unknown') return 'auto';
  return l; // 未知語言原樣回傳
}

/**
 * 依引擎將規範碼轉為該引擎接受的語言碼
 * @param {string} engine  'ollama' | 'google-gtx' | 'libretranslate' | 'mymemory' | ...
 * @param {string} canonical  來自 toCanonical 的規範碼
 * @returns {string}
 */
export function toEngineLang(engine, canonical) {
  const c = toCanonical(canonical);
  const e = String(engine || '').toLowerCase();
  switch (e) {
    case 'ollama':
      // ollama 接受標準 BCP-47: zh-TW / zh-CN / en
      return c === 'zh-CN' ? 'zh-CN' : c === 'zh-TW' ? 'zh-TW' : c === 'ja' ? 'ja' : c === 'ko' ? 'ko' : c === 'auto' ? 'auto' : (c || 'en');
    case 'google-gtx':
      // Google Translate: zh-TW / zh-CN / en
      return c === 'zh-CN' ? 'zh-CN' : c === 'zh-TW' ? 'zh-TW' : c === 'ja' ? 'ja' : c === 'ko' ? 'ko' : c === 'auto' ? 'auto' : (c || 'en');
    case 'libretranslate':
      // LibreTranslate: zh / en (簡碼)
      return c === 'zh-TW' || c === 'zh-CN' ? 'zh' : c === 'ja' ? 'ja' : c === 'ko' ? 'ko' : c === 'auto' ? 'en' : (c || 'en');
    case 'mymemory':
      // MyMemory: zh-CN / en
      return c === 'zh-TW' || c === 'zh-CN' ? 'zh-CN' : c === 'ja' ? 'ja' : c === 'ko' ? 'ko' : c === 'auto' ? 'en' : (c || 'en');
    default:
      // 預設原樣
      return c;
  }
}

export default { toCanonical, toEngineLang };
