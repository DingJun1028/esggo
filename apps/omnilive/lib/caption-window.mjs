// caption-window.mjs — 固定視窗滾動字幕 (fixed rolling caption window)
//
// 設計契約 (對應需求「字幕在同一個視窗中由左向右一直替換」):
//   1. 螢幕上的字幕列數是「固定」的: 永遠只有 slotCount 列 (預設 2, 可調 1..3)。
//      舊版每收到一句就 append 一個 .sub-group (每組 3 列, 上限 8 組 = 24 列),
//      導致字幕區無限往下增長。本模組以「位移」取代「累加」: 新句進 A1,
//      舊句被推到 A2, A2 之後的內容直接丟棄 → 視窗高度恆定。
//   2. 同一句的後續增量 (merge) 併入「目前作用中那一列」, 不開新列,
//      文字由左向右延伸替換。
//   3. 「視文字處理速度 看要不要增加 A3」: setSlotCount() 可執行時把列數
//      由 2 提到 3, 讓來源列不會在譯文還沒跟上時就被擠掉。
//   4. transcript() 保留完整逐句紀錄, 供課程解說累加器使用 —— 畫面只顯示
//      固定視窗, 但記憶體裡的紀錄不因顯示上限而截斷。
//
// 純邏輯, 不碰 DOM, 可於 node --test 直接驗證。

export const MIN_SLOTS = 1;
export const MAX_SLOTS = 3;
export const DEFAULT_SLOTS = 2;
export const DEFAULT_MERGE_MS = 2500;
const TRANSCRIPT_CAP = 200; // 完整紀錄上限, 避免無界限增長

export function clampSlots(n) {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return DEFAULT_SLOTS;
  if (v < MIN_SLOTS) return MIN_SLOTS;
  if (v > MAX_SLOTS) return MAX_SLOTS;
  return v;
}

/**
 * 由左向右延伸: 把 next 併到 prev 後面。
 * 若 next 已經完整包含 prev (伺服器重送累積全文), 以 next 為準, 避免重複貼字。
 */
export function mergeText(prev, next) {
  const a = String(prev || '').trim();
  const b = String(next || '').trim();
  if (!a) return b;
  if (!b) return a;
  if (b.startsWith(a)) return b;
  return `${a} ${b}`;
}

export class CaptionWindow {
  constructor(opts = {}) {
    this._slotCount = clampSlots(opts.slotCount ?? DEFAULT_SLOTS);
    this._mergeMs = Number.isFinite(opts.mergeMs) ? opts.mergeMs : DEFAULT_MERGE_MS;
    this._rows = []; // 最新的在最前面 (index 0 = A1/B1)
    this._transcript = [];
    this._lastAt = 0;
  }

  get slotCount() {
    return this._slotCount;
  }

  /**
   * 執行時調整列數 (需求提到的「看要不要增加 A3」)。
   * 放大 → 立刻從 transcript 補回被截掉的舊句, 使用者不會看到空白。
   * 縮小 → 立即收合, 不保留多餘列。
   */
  setSlotCount(n) {
    const next = clampSlots(n);
    if (next === this._slotCount) return this._slotCount;
    this._slotCount = next;
    if (next > this._rows.length) {
      const restored = this._transcript.slice(-next).reverse();
      this._rows = this._mergeRows(restored, this._rows);
    } else {
      this._rows.length = Math.min(this._rows.length, next);
    }
    return this._slotCount;
  }

  _mergeRows(newer, older) {
    const seen = new Set();
    const out = [];
    for (const r of [...newer, ...older]) {
      if (!r || seen.has(r.id)) continue;
      seen.add(r.id);
      out.push(r);
    }
    return out.slice(0, this._slotCount);
  }

  /**
   * 收一句新字幕。
   * @param {{id?:any,source?:string,target?:string,meta?:string,speaker?:string,ts?:number,words?:Array}} seg
   * @param {number} [now] 注入時間戳, 方便測試
   * @returns {{merged:boolean, rows:Array}} merged=當句是併入作用中列而非開新列
   */
  push(seg, now = Date.now()) {
    const ts = Number.isFinite(seg.ts) ? seg.ts : now;
    const source = String(seg.source || '');
    const target = String(seg.target || '');
    const active = this._rows[0];

    // 同一句的增量: 併入作用中列, 不開新列
    if (active && (now - this._lastAt) < this._mergeMs) {
      active.source = mergeText(active.source, source);
      active.target = mergeText(active.target, target);
      active.ts = ts;
      if (seg.words) active.words = seg.words;
      this._lastAt = now;
      return { merged: true, rows: this.rows() };
    }

    // 新句: 開新列, 其餘往下位移 (超出視窗的直接丟棄 → 高度恆定)
    const row = {
      id: seg.id,
      source,
      target,
      meta: seg.meta || '',
      speaker: seg.speaker || '',
      ts,
      words: seg.words || null,
    };
    this._rows.unshift(row);
    if (this._rows.length > this._slotCount) this._rows.length = this._slotCount;
    this._lastAt = now;
    this._transcript.push(row);
    if (this._transcript.length > TRANSCRIPT_CAP) this._transcript.shift();
    return { merged: false, rows: this.rows() };
  }

  /** 依顯示順序回傳 (index 0 = A1/B1, index 1 = A2/B2 …) */
  rows() {
    return this._rows.map((r) => ({ ...r }));
  }

  /** 完整逐句紀錄 (不受視窗列數限制), 供 courseText() 使用 */
  transcript() {
    return this._transcript
      .map((r) => {
        const t = r.speaker ? `${r.speaker}：` : '';
        return `${t}${r.source || r.target}`;
      })
      .join('\n');
  }

  reset() {
    this._rows = [];
    this._transcript = [];
    this._lastAt = 0;
  }
}
