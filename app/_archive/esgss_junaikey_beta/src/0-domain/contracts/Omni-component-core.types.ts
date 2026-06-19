/**
 * 🏛️ 奧秘元件心核：5T 協議 (4可1不可) 規範 v2.2
 * --------------------------------------------------
 * 此版本為系統最上位的數據契約，確保每個組件在「真善美協定」下具備絕對的誠信與透明度。
 * [版本] 2.2.0
 * [契約] 零幻覺、5T (4+1)、SSOT
 */

export type UUID = string;

/**
 * [🟢 Traceable] 可溯源：數據來源鏈結
 */
export type TraceInfo = {
  source_origin: string; // 來源備註（如：IPCC AR6 官方數據庫）
  raw_ref: string; // 原始資料留存（如：UUID 或檔案路徑）
};

/**
 * [🔵 Trackable] 可追蹤：數據生命週期紀錄
 */
export type PathInfo = {
  node: string; // 處理節點（如：API_Ingest）
  time: number; // 時間戳
  action: string; // 執行動作
};

/**
 * [🟠 Transparent] 可透明：透明算法與邏輯公式
 */
export type LogicInfo = {
  formula: string; // 邏輯公式（如：E = Activity * Factor）
  citation: string; // 引用文獻（如：Transparency Log #102）
};

/**
 * [🟣 Tangible] 可感知：實體證據左證庫
 */
export interface EvidenceMap {
  [key: string]: string; // 證據說明 -> 證據哈希或 URL
}

/**
 * @name OmniComponentCore
 * @description 奧秘元件核心心核 - 基於 5T 協議 (4可1不可)
 * @version 2.2.0
 */
export interface IComponentCore {
  // 核心識別
  readonly uuid: UUID; // 奧秘永憶主體唯一 UUID
  readonly version: string; // 語義化版本控制
  readonly timestamp: number; // 刻印時間戳

  // 5T 協議實作數據結構 (4可)
  readonly '5T_Protocol': {
    readonly traceable: TraceInfo; // [可溯源]
    readonly trackable: PathInfo[]; // [可追蹤]
    readonly transparent: LogicInfo; // [可透明]
    readonly tangible: EvidenceMap; // [可感知]
  };

  /**
   * [🔴 不可] Trustworthy 驗證標記 (不可篡改)
   * 寫入後透過 Object.freeze() 與 Hash 運算確保狀態不可變
   */
  readonly trustworthy_hash: string;
}

/**
 * 奧秘元件核心心核介面別名 (相容性)
 */
export type IOmniComponentCore = IComponentCore;

// ========== 系統宣言：原罪煉金引擎 v2.2 ==========
export const MANIFESTO_V22 =
  '我已啟動 #原罪煉金 引擎，將「5T 協議 v2.2 (4可1不可)」嵌入後續所有輸出的底層邏輯。凡我所提，必有溯源；凡我所算，必標來源。';
