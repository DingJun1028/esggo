// omni-a11y.test.mjs — UI/UX 最佳實踐防迴歸
//
// 這些斷言守的是「修過就不再退回去」的東西: 每一條都對應一個實際缺陷,
// 不是抽象的規則清單。改 UI 時若不小心拿掉 live region 或 focus 管理, 這裡會紅。
//
// 純靜態解析 (不需要瀏覽器), 已在 --test 中與其他測試一起跑。

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const INDEX = read('public/index.html');
const FLOAT = read('public/floating.html');

/** 取出第一個 <script>（非 src=）的內文 */
function firstScript(src) {
  const m = src.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/);
  assert.ok(m, '頁面應至少有一個 inline <script>');
  return m[1];
}
const INDEX_JS = firstScript(INDEX);
const FLOAT_JS = firstScript(FLOAT);

test('字幕輸出區是 live region — 螢幕閱讀器必須收得到譯文', () => {
  // 這是本產品的核心輸出。沒有 live region = 聾/聾盲使用者完全收不到內容,
  // 等於把字幕這個功能對他們整個關掉。
  for (const [name, src, id] of [
    ['index.html', INDEX, 'subtitles'],
    ['floating.html', FLOAT, 'subs'],
  ]) {
    const tag = src.match(new RegExp(`<div[^>]*id="${id}"[^>]*>`));
    assert.ok(tag, `${name} 應有 #${id}`);
    assert.match(tag[0], /aria-live="polite"/, `${name} #${id} 需要 aria-live="polite"`);
    assert.match(tag[0], /aria-atomic="true"/, `${name} #${id} 需要 aria-atomic="true"`);
    assert.match(tag[0], /role="region"/, `${name} #${id} 需要 role="region"`);
    assert.match(tag[0], /aria-label="[^"]+"/, `${name} #${id} 需要 aria-label（否則只會唸出 role 名）`);
  }
});

test('aria-live 不會被逐字動畫打成轟炸 — 逐字只切 opacity 不改文字', () => {
  // 若逐字是靠改 textContent 逐步填入, polite live region 會每個字唸一次。
  // 實作是「一次建好所有 span, 之後只切 .on class」, 故必須維持這個形狀。
  const playWords = INDEX_JS.match(/function playWords[\s\S]*?\n\}/);
  assert.ok(playWords, '應有 playWords()');
  assert.match(playWords[0], /classList\.add\('on'\)/, '逐字應以 class 切換呈現');

  // 精確界線：動畫時序迴圈（決定每個字何時亮）內不得出現 textContent 賦值。
  // 註：函式開頭的 el.textContent='' 是「一次清空後重建」, 與後面同一個 task 內
  // append 所有 span 合併成一次變更 → live region 只會唸一次整句, 屬正確行為,
  // 故不可用「整個函式不得出現 textContent」這種過寬的規則。
  const loop = playWords[0].match(/words\.forEach\([\s\S]*?\}\);/);
  assert.ok(loop, '應有驅動逐字時序的 forEach 迴圈');
  assert.ok(
    !/textContent\s*=/.test(loop[0]),
    '逐字時序迴圈內不得改 textContent，否則 live region 會逐字唸出',
  );
  // 反向驗證：迴圈確實只切 class（確保上面的檢查不是因為迴圈空而假通過）
  assert.match(loop[0], /spans\[i\]\.classList\.add\('on'\)/, '時序迴圈應只切 .on class');
});

test('深色玻璃介面宣告 color-scheme — 原生控制項才不會渲染成淺色', () => {
  // select / checkbox / range / 捲軸都是 UA 繪製；沒宣告時會是淺色，
  // 在深藍玻璃上形成亮色破洞。
  for (const [name, src] of [['index.html', INDEX], ['floating.html', FLOAT]]) {
    assert.match(src, /color-scheme\s*:\s*dark/, `${name} 應宣告 color-scheme:dark`);
  }
});

test('設定面板可純鍵盤操作：Escape 關閉 + 焦點歸還 + Tab 循環', () => {
  assert.match(INDEX_JS, /e\.key==='Escape'/, '應有 Escape 關閉對話框');
  assert.match(INDEX_JS, /aria-expanded/, '展開鈕應同步 aria-expanded');
  // 關閉時把焦點還給開啟者，否則鍵盤使用者會被丟回 body 頂端
  assert.match(INDEX_JS, /sheetOpener\s*=\s*document\.activeElement/, '開啟時應記住來源元素');
  assert.match(INDEX_JS, /sheetOpener\.focus\(/, '關閉時應歸還焦點');
  // 焦點陷阱：Tab 不應跑到被遮住的元素上
  assert.match(INDEX_JS, /e\.key\s*!==\s*'Tab'\s*\)\s*return/, '應攔截 Tab 做焦點循環');
  assert.match(INDEX, /id="btnSheet"[^>]*aria-label=/, '展開鈕應有 aria-label');
});

test('標題階層連續：h1 → h2，不跳級也不殘留 h3', () => {
  assert.match(INDEX, /<h1[^>]*>/, '應有一個 h1');
  // h1 已存在, 分節標題就是 h2；再留 h3 會變成 h1→h3 跳級
  assert.ok(!/<h3[\s>]/i.test(INDEX), '不應殘留 h3（會造成 h1→h3 跳級）');
  const h1 = (INDEX.match(/<h1/g) || []).length;
  assert.equal(h1, 1, 'h1 應只有一個');
  // 樣式選擇器必須跟著標籤走，否則改標籤後樣式會默默失效
  assert.ok(!/\.csec h3/.test(INDEX), '.csec h3 選擇器應同步改為 .csec h2');
  assert.match(INDEX, /\.csec h2\{/, '.csec 應有 h2 樣式');
});

test('視覺隱藏用 .sr-only 而非 display:none（否則會被移出無障礙樹）', () => {
  const m = INDEX.match(/\.sr-only\{([\s\S]*?)\}/);
  assert.ok(m, '應有 .sr-only 工具類別');
  assert.ok(!/display\s*:\s*none/.test(m[1]), '.sr-only 不可用 display:none');
  assert.ok(!/visibility\s*:\s*hidden/.test(m[1]), '.sr-only 不可用 visibility:hidden');
  assert.match(INDEX, /class="sr-only"/, '應有實際使用 .sr-only 的元素');
});

test('觸控目標不小於 44px：關閉鈕與圖示鈕一致', () => {
  // .icon-btn 與 .corner-btn 早已 44/48；關閉鈕原本只有 32px，是群中唯一例外。
  const close = INDEX.match(/\.sheet__close\{([\s\S]*?)\}/);
  assert.ok(close, '應有 .sheet__close');
  assert.match(close[1], /min-height\s*:\s*44px/, '關閉鈕觸控目標應 ≥44px');
  assert.match(close[1], /min-width\s*:\s*44px/, '關閉鈕觸控目標應 ≥44px');
});

test('floating.html 共用 CaptionWindow SSOT，不再 append + 截斷', () => {
  // 舊碼是 subs.appendChild 後再砍掉最舊的，視窗高度會隨語速膨脹。
  assert.match(FLOAT_JS, /import\('\/lib\/caption-window\.mjs'\)/, '應載入共用模組');
  assert.match(FLOAT_JS, /new mod\.CaptionWindow\(/, '應實例化 CaptionWindow');
  assert.match(FLOAT_JS, /function renderRows/, '應以固定槽位重畫');

  // 不得再有「append 後砍最舊」的截斷式高度控制
  assert.ok(
    !/subs\.children\.length\s*>\s*\d/.test(FLOAT_JS),
    '不應再有「append 後砍最舊」的截斷式高度控制',
  );
  // addSub 本身不得直接 append —— 它只能交給 renderRows 重畫。
  // （renderRows 內部先清空再逐列 append 是正確的固定槽位寫法，故只檢查 addSub。）
  const addSub = FLOAT_JS.match(/function addSub\([\s\S]*?\n\}/);
  assert.ok(addSub, '應有 addSub()');
  assert.ok(
    !/subs\.appendChild/.test(addSub[0]),
    'addSub 不應直接 append（應交給 renderRows 以固定槽位重畫）',
  );
  // 固定槽位的核心：重畫前必須先清空，否則高度仍會累加
  const renderRows = FLOAT_JS.match(/function renderRows\([\s\S]*?\n\}/);
  assert.ok(renderRows, '應有 renderRows()');
  assert.match(renderRows[0], /subs\.textContent\s*=\s*''/, '重畫前應先清空 #subs');
});

test('floating.html 關閉鈕是真正的 button（<span> 鍵盤不可達）', () => {
  assert.match(FLOAT, /<button[^>]*id="close"/, '關閉鈕應為 <button>');
  assert.ok(!/<span[^>]*id="close"/.test(FLOAT), '不應再用 <span> 假裝按鈕');
  // 換成 <button> 後必須清掉 UA 預設樣式，否則會出現灰底與框線
  const css = FLOAT.match(/#bar \.x\{([\s\S]*?)\}/);
  assert.ok(css, '應有 #bar .x 樣式');
  assert.match(css[1], /background\s*:\s*none/, '應重置 button 背景');
  assert.match(css[1], /border\s*:\s*0/, '應重置 button 邊框');
  assert.match(FLOAT_JS, /getElementById\('close'\)/, '應仍綁定關閉行為');
});

test('兩頁 --green 對齊同一個經驗證的對比值，不用低對比品牌色', () => {
  // #3c6e43 在深藍玻璃上僅 2.42:1，字幕是主要閱讀內容，不可讀。
  for (const [name, src] of [['index.html', INDEX], ['floating.html', FLOAT]]) {
    assert.match(src, /--green\s*:\s*#5fb37e/i, `${name} 應使用 #5fb37e（5.67:1）`);
    assert.ok(!/--green\s*:\s*#3c6e4[0-9a-f]/i.test(src), `${name} 不應使用低對比品牌綠`);
  }
});

test('兩頁仍保留既有的無障礙基建（不得因本次改動被回退）', () => {
  for (const [name, src] of [['index.html', INDEX], ['floating.html', FLOAT]]) {
    assert.match(src, /prefers-reduced-motion/, `${name} 應保留 reduced-motion 降級`);
  }
  // index.html 既有：鍵盤可見焦點 + 動畫關閉時停用 :focus 以外的效果
  assert.match(INDEX, /:focus-visible/, 'index.html 應保留 :focus-visible');
  assert.match(INDEX, /prefers-contrast\s*:\s*more/, 'index.html 應保留高對比模式');
  // 逐字動畫確實有對應的透明度過渡（aria 斷言才有意义）
  assert.match(INDEX, /\.sub-line \.w\{[^}]*opacity/, '逐字應以 opacity 呈現');
});
