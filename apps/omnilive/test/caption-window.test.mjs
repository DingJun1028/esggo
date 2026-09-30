// test/caption-window.test.mjs
// 驗證「固定視窗滾動字幕」: 高度恆定 + 由左向右替換。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CaptionWindow,
  clampSlots,
  mergeText,
  MIN_SLOTS,
  MAX_SLOTS,
  DEFAULT_SLOTS,
} from '../lib/caption-window.mjs';

const t = (n) => 1700000000000 + n * 10000; // 每次推入間隔 10s > mergeMs, 確保不誤判 merge

test('clampSlots 限制在 1..3 之間 (需求: 看要不要增加 A3)', () => {
  assert.equal(clampSlots(0), MIN_SLOTS);
  assert.equal(clampSlots(-5), MIN_SLOTS);
  assert.equal(clampSlots(2), 2);
  assert.equal(clampSlots(3), MAX_SLOTS);
  assert.equal(clampSlots(99), MAX_SLOTS, '超過 3 一律收在 3');
  assert.equal(clampSlots(NaN), DEFAULT_SLOTS);
  assert.equal(clampSlots(undefined), DEFAULT_SLOTS);
});

test('mergeText 由左向右延伸, 且不重複貼上已存在的字', () => {
  assert.equal(mergeText('今天天氣', '很好'), '今天天氣 很好');
  assert.equal(mergeText('', '第一句'), '第一句');
  assert.equal(mergeText('第一句', ''), '第一句');
  // 伺服器重送累積全文時, 以新值為準
  assert.equal(mergeText('今天天氣', '今天天氣很好'), '今天天氣很好');
});

test('新句進 A1, 舊句被推到 A2 (位移而非累加)', () => {
  const w = new CaptionWindow();
  w.push({ id: 1, source: '第一句', target: 'first' }, t(0));
  w.push({ id: 2, source: '第二句', target: 'second' }, t(1));

  const rows = w.rows();
  assert.equal(rows.length, 2, '剛好兩列');
  assert.equal(rows[0].source, '第二句', 'A1 = 最新一句');
  assert.equal(rows[1].source, '第一句', 'A2 = 上一句');
});

test('持續推入 20 句, 列數恆定不增長 (這是本次修的核心回歸測試)', () => {
  const w = new CaptionWindow();
  for (let i = 0; i < 20; i++) {
    w.push({ id: i, source: `第${i}句`, target: `s${i}` }, t(i));
    assert.ok(w.rows().length <= w.slotCount, `第 ${i} 句後列數不可超過 slotCount`);
  }
  const rows = w.rows();
  assert.equal(rows.length, 2);
  assert.equal(rows[0].source, '第19句', 'A1 = 最後收到的');
  assert.equal(rows[1].source, '第18句', 'A2 = 倒數第二句');
});

test('舊版會無限增長的案例: 這裡明確斷言高度不隨句數變化', () => {
  const heights = [];
  for (const n of [1, 2, 5, 10, 50]) {
    const w = new CaptionWindow();
    for (let i = 0; i < n; i++) w.push({ id: i, source: `x${i}`, target: `y${i}` }, t(i));
    heights.push(w.rows().length);
  }
  assert.deepEqual(heights, [1, 2, 2, 2, 2], '列數只受 slotCount 約束, 與句數無關');
});

test('mergeWindow 內的增量併入作用中列, 不開新列', () => {
  const w = new CaptionWindow({ mergeMs: 2500 });
  const base = 1700000000000;
  w.push({ id: 1, source: '今天天氣', target: 'weather' }, base);
  const res = w.push({ id: 1, source: '很好', target: 'nice' }, base + 1000);

  assert.equal(res.merged, true);
  assert.equal(w.rows().length, 1, '增量不應開新列');
  assert.equal(w.rows()[0].source, '今天天氣 很好', '由左向右延伸');
  assert.equal(w.rows()[0].target, 'weather nice');
});

test('超出 mergeWindow 的下一句才開新列', () => {
  const w = new CaptionWindow({ mergeMs: 2500 });
  const base = 1700000000000;
  w.push({ id: 1, source: '第一句' }, base);
  w.push({ id: 1, source: '增量' }, base + 1000); // 併入
  const res = w.push({ id: 2, source: '第二句' }, base + 9000); // 9s > 2.5s → 新列

  assert.equal(res.merged, false);
  assert.equal(w.rows().length, 2);
  assert.equal(w.rows()[0].source, '第二句');
  assert.equal(w.rows()[1].source, '第一句 增量', '增量已併入上一列');
});

test('setSlotCount 放大時從 transcript 補回舊句, 不留空白', () => {
  const w = new CaptionWindow({ slotCount: 2 });
  for (let i = 0; i < 5; i++) w.push({ id: i, source: `第${i}句`, target: `t${i}` }, t(i));
  assert.equal(w.rows().length, 2);

  w.setSlotCount(3);
  const rows = w.rows();
  assert.equal(rows.length, 3, '放大後立刻補滿 3 列');
  assert.equal(rows[0].source, '第4句');
  assert.equal(rows[1].source, '第3句');
  assert.equal(rows[2].source, '第2句', '從 transcript 補回先前被截掉的句子');
});

test('setSlotCount 縮小時立即收合', () => {
  const w = new CaptionWindow({ slotCount: 3 });
  for (let i = 0; i < 5; i++) w.push({ id: i, source: `第${i}句` }, t(i));
  assert.equal(w.rows().length, 3);

  w.setSlotCount(1);
  assert.equal(w.rows().length, 1);
  assert.equal(w.rows()[0].source, '第4句', '保留最新一句');
});

test('transcript 不受視窗列數限制 (課程解說累加器仍可讀到完整紀錄)', () => {
  const w = new CaptionWindow({ slotCount: 2 });
  for (let i = 0; i < 5; i++) w.push({ id: i, source: `第${i}句`, speaker: i === 2 ? '小明' : '' }, t(i));

  const all = w.transcript();
  assert.match(all, /第0句/, '最早的句子仍在紀錄中');
  assert.match(all, /第4句/, '最新的句子也在');
  assert.match(all, /小明：第2句/, '說話者前綴保留');
  assert.equal(w.rows().length, 2, '但畫面仍只有 2 列');
});

test('reset 清空視窗與紀錄', () => {
  const w = new CaptionWindow();
  w.push({ id: 1, source: 'x' }, t(0));
  w.reset();
  assert.equal(w.rows().length, 0);
  assert.equal(w.transcript(), '');
});

test('push 接受缺漏欄位而不拋錯 (id/words/meta 可為 undefined)', () => {
  const w = new CaptionWindow();
  const res = w.push({ source: '只有原文' }, t(0));
  assert.equal(res.merged, false);
  assert.equal(w.rows()[0].source, '只有原文');
  assert.equal(w.rows()[0].target, '');
  assert.equal(w.rows()[0].words, null);
});

test('transcript 有上限, 不會無限記憶體增長', () => {
  const w = new CaptionWindow({ slotCount: 2 });
  for (let i = 0; i < 260; i++) w.push({ id: i, source: `第${i}句` }, t(i));
  const lines = w.transcript().split('\n');
  assert.equal(lines.length, 200, '上限 200 句');
  assert.match(lines[lines.length - 1], /第259句/);
});
