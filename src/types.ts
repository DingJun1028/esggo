/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IComponentCore<T> {
  readonly uuid: string;      // 萬能永憶主體唯一識別碼
  readonly version: string;   // 語義化版本控制 (e.g., '1.0.0')
  readonly timestamp: number; // 刻印時間戳
  evidence: {
    originCause: string;
    processTrace: string[];
    finalEffect: string;
  };
  lifecycle_events: Array<any>; // ⽣命週期 Hook (Trackable)
  data: T; // 數據本體
  isFrozen: boolean; // 物件凍結狀態 (Object.freeze)
}
