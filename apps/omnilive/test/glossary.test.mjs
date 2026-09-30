// 品牌詞保護 (glossary mask/restore) 測試
// 對應 lib/translate.mjs maskGlossary() — Trustworthy 品牌一致性
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maskGlossary, translate, detectLang } from '../lib/translate.mjs';

test('maskGlossary: 命中 OmniLive 並可還原', () => {
  const g = maskGlossary('Hello from OmniLive today');
  assert.equal(g.masked.includes('OmniLive'), false, '原文品牌詞必須被遮蔽');
  assert.match(g.masked, /ZXQ\d+QXZ/, '必須產生佔位符');
  assert.equal(g.restore(g.masked), 'Hello from OmniLive today');
});

test('maskGlossary: 多次出現各自取得獨立佔位符並全部還原', () => {
  const g = maskGlossary('OmniLive and OmniLive and OmniLive');
  assert.equal(g.hits.length, 3, '三次出現 = 三個佔位符');
  assert.equal(g.restore(g.masked), 'OmniLive and OmniLive and OmniLive');
});

test('maskGlossary: 不誤傷字首/字尾相接的相似詞', () => {
  // OmniLiveX / XOmniLive 不該被視為品牌詞命中
  const g = maskGlossary('OmniLiveX and XOmniLive');
  assert.equal(g.masked, 'OmniLiveX and XOmniLive', '字母相接時不替換');
  assert.equal(g.hits.length, 0);
});

test('maskGlossary: 多個不同品牌詞各自保留原文大小寫', () => {
  const g = maskGlossary('OmniLive meets esggo and Hermes on Zoom');
  const back = g.restore(g.masked);
  assert.equal(back, 'OmniLive meets esggo and Hermes on Zoom', '大小寫必須逐字還原');
});

test('maskGlossary: 無品牌詞時原樣不動', () => {
  const src = '歡迎使用萬能即時語音擷取翻譯系統';
  const g = maskGlossary(src);
  assert.equal(g.masked, src);
  assert.equal(g.hits.length, 0);
});

test('maskGlossary: 佔位符不被後續 term 誤傷', () => {
  // 同時含 OmniLive 與 omnilive（小寫），確認第二次掃描不碰到 ZXQ0QXZ
  const g = maskGlossary('OmniLive vs omnilive');
  assert.equal(g.restore(g.masked), 'OmniLive vs omnilive');
});

test('translate: 品牌詞在輸出中被還原（離線 mock 引擎路徑）', async () => {
  // mock 引擎回傳原文+前綴，驗證 restore 仍正確
  const r = await translate('OmniLive demo', 'en', 'zh-TW', { mock: true });
  assert.ok(r.target.includes('OmniLive'), 'mock 路徑不影響品牌詞存在');
});

test('translate: 偵測語言不受 glossary 影響', () => {
  assert.equal(detectLang('歡迎使用萬能即時語音擷取翻譯系統'), 'zh-TW');
  assert.equal(detectLang('welcome to the live system'), 'en');
});
