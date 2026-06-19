export interface IComponentCore<T> {
  readonly uuid: string; // 萬能永憶主體分發的唯⼀ ID
  readonly version: string; // 語義化版本
  readonly timestamp: number; // 刻印時間戳
  readonly evidence: {
    origin_id: string; // 原始憑證 ID (如 PDF UUID)
    origin_hash: string; // SHA-256 指紋 (真/信)
    extraction_method: 'OCR' | 'IoT' | 'Manual';
  };
  lifecycle_events: Array<any>; // ⽣命週期 Hook (Trackable)
  data: T; // 數據本體
  isFrozen: boolean; // 物件凍結狀態 (Object.freeze)
}
